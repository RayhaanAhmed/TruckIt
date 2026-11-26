const mysql = require("mysql2/promise");
const crypto = require("crypto");

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: (process.env.DB_HOST === "127.0.0.1" || process.env.DB_HOST === "localhost") ? undefined : { rejectUnauthorized: false },
  connectionLimit: 1
});

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, stored) {
  const [salt, key] = String(stored || "").split(":");
  if (!salt || !key) return false;
  const hashBuffer = crypto.scryptSync(password, salt, 64);
  const keyBuffer = Buffer.from(key, "hex");
  return keyBuffer.length === hashBuffer.length && crypto.timingSafeEqual(keyBuffer, hashBuffer);
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS"
  };
  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers };

  const path = event.path.replace(/^\/(\.netlify\/functions\/)?api/, "");
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    // LOGIN
    if (event.httpMethod === "POST" && path === "/auth/login") {
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const [rows] = await pool.query("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1", [email]);
      const user = rows[0];
      if (!user || !verifyPassword(password, user.password_hash)) {
        return { statusCode: 401, headers, body: JSON.stringify({ error: "Invalid email or password." }) };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          user: { id: user.id, fullName: user.full_name, email: user.email, role: user.role, driverId: user.driver_id }
        })
      };
    }

    // TOKEN-RESTRICTED REGISTRATION
    if (event.httpMethod === "POST" && path === "/auth/register") {
      const fullName = String(body.fullName || "").trim();
      const email = String(body.email || "").trim().toLowerCase();
      const password = String(body.password || "");
      const role = body.role === "owner" ? "owner" : "driver";
      const token = String(body.token || "").trim();

      if (!fullName || !email || password.length < 6) {
        return { statusCode: 400, headers, body: JSON.stringify({ error: "Name, email, and a password (6+ chars) are required." }) };
      }

      const expectedToken = role === "owner"
        ? (process.env.OWNER_INVITE_TOKEN || "BOSS-2026")
        : (process.env.DRIVER_INVITE_TOKEN || "DRV-2026");

      if (token !== expectedToken) {
        return { statusCode: 403, headers, body: JSON.stringify({ error: `Invalid ${role === "owner" ? "Owner" : "Driver"} Authorization Token.` }) };
      }

      const [existing] = await pool.query("SELECT id FROM users WHERE LOWER(email) = ?", [email]);
      if (existing.length) {
        return { statusCode: 409, headers, body: JSON.stringify({ error: "An account with this email already exists." }) };
      }

      let driverId = null;
      if (role === "driver") {
        driverId = "d_" + Date.now();
        await pool.query(
          "INSERT INTO drivers (id, name, code, salary) VALUES (?, ?, ?, ?)",
          [driverId, fullName, "Code 14 (EC)", 26000]
        );
      }

      const userId = "u_" + Date.now();
      await pool.query(
        "INSERT INTO users (id, full_name, email, password_hash, role, driver_id) VALUES (?, ?, ?, ?, ?, ?)",
        [userId, fullName, email, hashPassword(password), role, driverId]
      );

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({
          user: { id: userId, fullName, email, role, driverId }
        })
      };
    }

    // GET ACTIVE INVITE TOKENS (FOR OWNER PORTAL)
    if (event.httpMethod === "GET" && path === "/auth/tokens") {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          driverToken: process.env.DRIVER_INVITE_TOKEN || "DRV-2026",
          ownerToken: process.env.OWNER_INVITE_TOKEN || "BOSS-2026"
        })
      };
    }

    // FLEET STATE
    if (event.httpMethod === "GET" && path === "/state") {
      const [trucks] = await pool.query("SELECT id, plate, brand, model, engine, year, status, active_trip_id AS activeTripId FROM trucks ORDER BY created_at ASC");
      const [drivers] = await pool.query("SELECT id, name, code, CAST(salary AS DOUBLE) AS salary FROM drivers ORDER BY created_at ASC");
      const [trips] = await pool.query("SELECT id, DATE_FORMAT(trip_date, '%Y-%m-%d') AS date, plate, driver_id AS driverId, customer, pickup, dropoff, km, CAST(revenue AS DOUBLE) AS revenue, CAST(fuel_cost AS DOUBLE) AS fuelCost, CAST(extra_cost AS DOUBLE) AS extraCost, status FROM trips ORDER BY trip_date DESC, created_at DESC");
      return { statusCode: 200, headers, body: JSON.stringify({ trucks, drivers, trips }) };
    }

    if (event.httpMethod === "POST" && path === "/trucks") {
      await pool.query("INSERT INTO trucks (id, plate, brand, model, engine, year, status) VALUES (?, ?, ?, ?, ?, ?, ?)", [body.id, body.plate, body.brand, body.model || "", body.engine || "", body.year || "", body.status || "AT DEPOT"]);
      return { statusCode: 201, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "PUT" && path.startsWith("/trucks/") && path.endsWith("/status")) {
      const plate = decodeURIComponent(path.split("/")[2]);
      await pool.query("UPDATE trucks SET status = ?, active_trip_id = ? WHERE plate = ?", [body.status, body.activeTripId || null, plate]);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "POST" && path === "/drivers") {
      await pool.query("INSERT INTO drivers (id, name, code, salary) VALUES (?, ?, ?, ?)", [body.id, body.name, body.code || "Code 14 (EC)", Number(body.salary || 0)]);
      return { statusCode: 201, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "PUT" && path.startsWith("/drivers/")) {
      await pool.query("UPDATE drivers SET salary = ? WHERE id = ?", [Number(body.salary || 0), path.split("/")[2]]);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "POST" && path === "/trips") {
      await pool.query("INSERT INTO trips (id, trip_date, plate, driver_id, customer, pickup, dropoff, km, revenue, fuel_cost, extra_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [body.id, body.date, body.plate, body.driverId || "", body.customer || "", body.pickup, body.dropoff, Number(body.km || 0), Number(body.revenue || 0), Number(body.fuelCost || 0), Number(body.extraCost || 0), body.status]);
      await pool.query("UPDATE trucks SET status = 'IN TRANSIT', active_trip_id = ? WHERE plate = ?", [body.id, body.plate]);
      return { statusCode: 201, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "PUT" && path.startsWith("/trips/")) {
      const tripId = path.split("/")[2];
      await pool.query("UPDATE trips SET customer=?, pickup=?, dropoff=?, km=?, revenue=?, fuel_cost=?, extra_cost=?, status=? WHERE id=?", [body.customer || "", body.pickup, body.dropoff, Number(body.km || 0), Number(body.revenue || 0), Number(body.fuelCost || 0), Number(body.extraCost || 0), body.status, tripId]);
      if (body.status === "DELIVERED") await pool.query("UPDATE trucks SET status = 'DELIVERED' WHERE plate = ?", [body.plate]);
      if (body.status === "COMPLETED") await pool.query("UPDATE trucks SET status = 'AT DEPOT', active_trip_id = NULL WHERE plate = ?", [body.plate]);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    if (event.httpMethod === "DELETE" && path.startsWith("/trips/")) {
      await pool.query("DELETE FROM trips WHERE id = ?", [path.split("/")[2]]);
      return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
    }

    return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
  } catch (err) {
    console.error("API Error:", err);
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
