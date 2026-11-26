const mysql = require("mysql2/promise");

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: process.env.DB_HOST === "127.0.0.1" ? undefined : { rejectUnauthorized: false },
    connectionLimit: 1
});

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
        if (event.httpMethod === "GET" && path === "/state") {
            const [trucks] = await pool.query(
                "SELECT id, plate, brand, model, engine, year, status, active_trip_id AS activeTripId FROM trucks ORDER BY created_at ASC"
            );
            const [drivers] = await pool.query(
                "SELECT id, name, code, CAST(salary AS DOUBLE) AS salary FROM drivers ORDER BY created_at ASC"
            );
            const [trips] = await pool.query(
                "SELECT id, DATE_FORMAT(trip_date, '%Y-%m-%d') AS date, plate, driver_id AS driverId, customer, pickup, dropoff, km, CAST(revenue AS DOUBLE) AS revenue, CAST(fuel_cost AS DOUBLE) AS fuelCost, CAST(extra_cost AS DOUBLE) AS extraCost, status FROM trips ORDER BY trip_date DESC, created_at DESC"
            );
            return { statusCode: 200, headers, body: JSON.stringify({ trucks, drivers, trips }) };
        }

        if (event.httpMethod === "POST" && path === "/trucks") {
            await pool.query(
                "INSERT INTO trucks (id, plate, brand, model, engine, year, status) VALUES (?, ?, ?, ?, ?, ?, ?)",
                [body.id, body.plate, body.brand, body.model || "", body.engine || "", body.year || "", body.status || "AT DEPOT"]
            );
            return { statusCode: 201, headers, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === "PUT" && path.startsWith("/trucks/") && path.endsWith("/status")) {
            const plate = decodeURIComponent(path.split("/")[2]);
            await pool.query(
                "UPDATE trucks SET status = ?, active_trip_id = ? WHERE plate = ?",
                [body.status, body.activeTripId || null, plate]
            );
            return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === "POST" && path === "/drivers") {
            await pool.query(
                "INSERT INTO drivers (id, name, code, salary) VALUES (?, ?, ?, ?)",
                [body.id, body.name, body.code || "Code 14 (EC)", Number(body.salary || 0)]
            );
            return { statusCode: 201, headers, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === "PUT" && path.startsWith("/drivers/")) {
            const driverId = path.split("/")[2];
            await pool.query("UPDATE drivers SET salary = ? WHERE id = ?", [Number(body.salary || 0), driverId]);
            return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === "POST" && path === "/trips") {
            await pool.query(
                "INSERT INTO trips (id, trip_date, plate, driver_id, customer, pickup, dropoff, km, revenue, fuel_cost, extra_cost, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                [body.id, body.date, body.plate, body.driverId || "", body.customer || "", body.pickup, body.dropoff, Number(body.km || 0), Number(body.revenue || 0), Number(body.fuelCost || 0), Number(body.extraCost || 0), body.status]
            );
            await pool.query("UPDATE trucks SET status = 'IN TRANSIT', active_trip_id = ? WHERE plate = ?", [body.id, body.plate]);
            return { statusCode: 201, headers, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === "PUT" && path.startsWith("/trips/")) {
            const tripId = path.split("/")[2];
            await pool.query(
                "UPDATE trips SET customer=?, pickup=?, dropoff=?, km=?, revenue=?, fuel_cost=?, extra_cost=?, status=? WHERE id=?",
                [body.customer || "", body.pickup, body.dropoff, Number(body.km || 0), Number(body.revenue || 0), Number(body.fuelCost || 0), Number(body.extraCost || 0), body.status, tripId]
            );
            if (body.status === "DELIVERED") {
                await pool.query("UPDATE trucks SET status = 'DELIVERED' WHERE plate = ?", [body.plate]);
            } else if (body.status === "COMPLETED") {
                await pool.query("UPDATE trucks SET status = 'AT DEPOT', active_trip_id = NULL WHERE plate = ?", [body.plate]);
            }
            return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
        }

        if (event.httpMethod === "DELETE" && path.startsWith("/trips/")) {
            const tripId = path.split("/")[2];
            await pool.query("DELETE FROM trips WHERE id = ?", [tripId]);
            return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: "Not found" }) };
    } catch (err) {
        console.error("API Error:", err);
        return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
};