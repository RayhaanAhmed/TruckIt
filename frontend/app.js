const APP_CONFIG = {
  COMPANY_NAME: "VANGUARD FREIGHT LOGISTICS",
  CURRENCY: "R",
  USE_REMOTE_API: true,
  API_BASE_URL: "/.netlify/functions/api",
  DEFAULT_RATE_PER_KM: 14.5,
  GAS_COST_POLICY: "optional",
  ROUTES: [
    { pickup: "Johannesburg Central Depot", dropoff: "Durban Harbour Terminal", km: 570, revenue: 18500 },
    { pickup: "Pretoria Rosslyn Hub", dropoff: "Polokwane Distribution", km: 265, revenue: 9400 },
    { pickup: "Mokopane Logistics Yard", dropoff: "Johannesburg City Deep", km: 295, revenue: 10800 },
    { pickup: "Cape Town Bellville Depot", dropoff: "Gqeberha Port Yard", km: 750, revenue: 23500 },
    { pickup: "Bloemfontein Freight Park", dropoff: "Johannesburg Central Depot", km: 400, revenue: 13200 }
  ]
};

let state = {
  role: null,
  companyName: APP_CONFIG.COMPANY_NAME,
  selectedPlate: null,
  activeBlueprintBrand: "Scania",
  activeOwnerTab: "fleet",
  timeframe: "month",
  costMode: "actual_plus_km",
  ratePerKm: APP_CONFIG.DEFAULT_RATE_PER_KM,
  fuelPolicy: APP_CONFIG.GAS_COST_POLICY,
  alerts: [],
  trucks: [],
  drivers: [],
  trips: []
};

const undoStack = [];
function pushUndoSnapshot() {
  undoStack.push(JSON.stringify({
    trucks: state.trucks, drivers: state.drivers, trips: state.trips,
    costMode: state.costMode, ratePerKm: state.ratePerKm, fuelPolicy: state.fuelPolicy
  }));
  if (undoStack.length > 30) undoStack.shift();
  document.getElementById("undo-btn").disabled = undoStack.length === 0;
}

function performUndo() {
  if (!undoStack.length) return;
  Object.assign(state, JSON.parse(undoStack.pop()));
  document.getElementById("undo-btn").disabled = undoStack.length === 0;
  renderAll();
}

async function syncRemote(endpoint, method = "GET", payload = null) {
  if (!APP_CONFIG.USE_REMOTE_API) return null;
  try {
    const res = await fetch(`${APP_CONFIG.API_BASE_URL}${endpoint}`, {
      method,
      headers: { "Content-Type": "application/json" },
      body: payload ? JSON.stringify(payload) : null
    });
    const data = await res.json();
    if (!res.ok) {
      alert("Database Error: " + (data.error || res.status));
      return null;
    }
    return data;
  } catch (err) {
    alert("Cannot reach backend API. Make sure netlify dev is running locally or cloud DB env vars are set on Netlify.");
    return null;
  }
}

async function refreshStateFromDB() {
  const remoteData = await syncRemote("/state");
  if (remoteData) {
    state.trucks = Array.isArray(remoteData.trucks) ? remoteData.trucks : [];
    state.drivers = Array.isArray(remoteData.drivers) ? remoteData.drivers : [];
    state.trips = Array.isArray(remoteData.trips) ? remoteData.trips : [];
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  await refreshStateFromDB();
  updateCompanyLabels();
  bindEvents();
});

function updateCompanyLabels() {
  document.getElementById("login-company-name").textContent = state.companyName;
  document.getElementById("header-company-name").textContent = state.companyName;
  document.getElementById("print-company-title").textContent = state.companyName;
  document.querySelectorAll(".curr-label").forEach(el => (el.textContent = APP_CONFIG.CURRENCY));
}

async function enterPortal(role) {
  state.role = role;
  await refreshStateFromDB();
  document.getElementById("login-view").classList.add("hidden");
  document.getElementById("top-bar").classList.remove("hidden");
  const isOwner = role === "owner";
  document.getElementById("driver-view").classList.toggle("hidden", isOwner);
  document.getElementById("owner-view").classList.toggle("hidden", !isOwner);
  document.getElementById("owner-nav").classList.toggle("hidden", !isOwner);
  document.getElementById("undo-btn").classList.toggle("hidden", !isOwner);
  document.getElementById("print-pdf-btn").classList.toggle("hidden", !isOwner);
  renderAll();
}

function renderAll() {
  if (state.role === "driver") renderDriverPortal();
  if (state.role === "owner") renderOwnerPortal();
}

function renderDriverPortal() {
  const plateGrid = document.getElementById("driver-plate-grid");
  plateGrid.innerHTML = state.trucks.length
    ? state.trucks.map(t => `<button class="plate-btn ${state.selectedPlate === t.plate ? "selected" : ""}" data-plate="${t.plate}">${t.plate}</button>`).join("")
    : `<span class="muted-text">No trucks in database yet. Add a truck in Owner &amp; Management first.</span>`;

  const stage = document.getElementById("driver-active-stage");
  const resetBtn = document.getElementById("driver-reset-plate-btn");
  const truck = state.trucks.find(t => t.plate === state.selectedPlate);

  if (!truck) {
    stage.classList.add("hidden");
    resetBtn.classList.add("hidden");
    return;
  }

  stage.classList.remove("hidden");
  resetBtn.classList.remove("hidden");
  renderBlueprint("driver", truck.brand, truck);

  document.getElementById("driver-selected-plate").textContent = truck.plate;
  document.getElementById("driver-selected-meta").textContent = [truck.brand, truck.model, truck.year].filter(Boolean).join(" • ");
  document.getElementById("driver-trip-status").textContent = truck.status || "AT DEPOT";

  const btnStart = document.getElementById("btn-start-load");
  const btnDone = document.getElementById("btn-load-done");
  const btnReturn = document.getElementById("btn-return-trip");
  const status = (truck.status || "AT DEPOT").toUpperCase();

  if (status === "AT DEPOT") {
    btnStart.classList.remove("hidden"); btnDone.classList.remove("hidden"); btnReturn.classList.add("hidden");
    btnStart.disabled = false; btnDone.disabled = true;
  } else if (status === "IN TRANSIT") {
    btnStart.classList.remove("hidden"); btnDone.classList.remove("hidden"); btnReturn.classList.add("hidden");
    btnStart.disabled = true; btnDone.disabled = false;
  } else {
    btnStart.classList.add("hidden"); btnDone.classList.add("hidden"); btnReturn.classList.remove("hidden");
    btnReturn.disabled = false;
  }
}

function renderOwnerPortal() {
  renderAlerts();
  renderKPIs();
  renderBlueprintTabs();
  renderBlueprint("owner", state.activeBlueprintBrand);
  renderFleetTable();
  renderDriversSection();
  renderTripsTable();
  renderFinanceSection();
}

function renderAlerts() {
  document.getElementById("owner-alerts-bar").innerHTML = state.alerts.map((msg, idx) => `
    <div class="alert-item"><span>${msg}</span><button class="btn-outline" onclick="dismissAlert(${idx})">Acknowledge</button></div>
  `).join("");
}
window.dismissAlert = idx => { state.alerts.splice(idx, 1); renderAlerts(); };

function getFilteredTrips() {
  if (state.timeframe === "all") return state.trips;
  const days = state.timeframe === "week" ? 7 : 31;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return state.trips.filter(tr => new Date(tr.date) >= cutoff);
}

function calculateTotalCosts(trips) {
  const fuelAndExtra = trips.reduce((s, t) => s + Number(t.fuelCost || 0) + Number(t.extraCost || 0), 0);
  const totalKm = trips.reduce((s, t) => s + Number(t.km || 0), 0);
  const totalSalaries = state.drivers.reduce((s, d) => s + Number(d.salary || 0), 0);
  if (state.costMode === "flat_km") return totalKm * state.ratePerKm;
  if (state.costMode === "actual_plus_salaries") return fuelAndExtra + totalSalaries;
  return fuelAndExtra + totalKm * state.ratePerKm;
}

function renderKPIs() {
  const trips = getFilteredTrips();
  const totalKm = trips.reduce((s, t) => s + Number(t.km || 0), 0);
  const revenue = trips.reduce((s, t) => s + Number(t.revenue || 0), 0);
  const profit = revenue - calculateTotalCosts(trips);
  document.getElementById("owner-kpi-strip").innerHTML = `
    <div class="kpi-box"><span>Active Fleet</span><strong>${state.trucks.length}</strong></div>
    <div class="kpi-box"><span>Loads</span><strong>${trips.length}</strong></div>
    <div class="kpi-box"><span>Total Distance</span><strong>${totalKm.toLocaleString()} km</strong></div>
    <div class="kpi-box"><span>Revenue</span><strong>${APP_CONFIG.CURRENCY}${revenue.toLocaleString()}</strong></div>
    <div class="kpi-box"><span>Net Profit</span><strong>${APP_CONFIG.CURRENCY}${Math.round(profit).toLocaleString()}</strong></div>
  `;
}

function renderBlueprintTabs() {
  const bps = window.TRUCK_BLUEPRINTS || {};
  document.getElementById("blueprint-brand-tabs").innerHTML = Object.keys(bps).map(brand => `
    <button class="nav-tab ${state.activeBlueprintBrand === brand ? "active" : ""}" onclick="selectBlueprintBrand('${brand}')">${brand}</button>
  `).join("");
}
window.selectBlueprintBrand = brand => { state.activeBlueprintBrand = brand; renderBlueprintTabs(); renderBlueprint("owner", brand); };

function renderBlueprint(prefix, brand, customTruck = null) {
  const bps = window.TRUCK_BLUEPRINTS || {};
  const key = Object.keys(bps).find(k => k.toLowerCase() === String(brand || "").trim().toLowerCase()) || "Scania";
  const bp = bps[key];
  if (!bp) return;
  document.getElementById(`${prefix}-spec-sheet`).innerHTML = `
    <strong>${customTruck ? `${key.toUpperCase()} ${customTruck.model || ""}` : bp.specs.title}</strong>
    ENGINE: ${customTruck?.engine || bp.specs.engine}<br/>CONFIG: ${bp.specs.axle}<br/>RATING: ${bp.specs.gvm}<br/>WHEELBASE: ${bp.specs.wheelbase}
  `;
  document.getElementById(`${prefix}-blueprint-canvas`).innerHTML = bp.svg;
}

function renderFleetTable() {
  const trips = getFilteredTrips();
  const tbody = document.getElementById("fleet-table-body");
  if (!state.trucks.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="muted-text">No trucks in database yet. Click "+ Add Truck" above.</td></tr>`;
    return;
  }
  tbody.innerHTML = state.trucks.map(t => {
    const tTrips = trips.filter(tr => tr.plate === t.plate);
    const km = tTrips.reduce((s, tr) => s + Number(tr.km || 0), 0);
    const rev = tTrips.reduce((s, tr) => s + Number(tr.revenue || 0), 0);
    return `<tr>
      <td style="font-family:var(--font-mono);font-weight:600">${t.plate}</td>
      <td>${t.brand}</td>
      <td>${[t.model, t.engine].filter(Boolean).join(" / ") || "—"}</td>
      <td>${t.year || "—"}</td>
      <td><span class="status-pill">${t.status}</span></td>
      <td>${tTrips.length}</td>
      <td>${km.toLocaleString()} km</td>
      <td>${APP_CONFIG.CURRENCY}${rev.toLocaleString()}</td>
    </tr>`;
  }).join("");
}

function renderDriversSection() {
  const trips = getFilteredTrips();
  const tbody = document.getElementById("drivers-table-body");
  if (!state.drivers.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="muted-text">No drivers in database yet. Click "+ Add Driver" above.</td></tr>`;
    renderSvgLineChart("drivers-line-chart", [], []);
    return;
  }
  const rows = state.drivers.map(d => {
    const dTrips = trips.filter(tr => tr.driverId === d.id);
    return {
      ...d,
      loads: dTrips.length,
      km: dTrips.reduce((s, tr) => s + Number(tr.km || 0), 0),
      rev: dTrips.reduce((s, tr) => s + Number(tr.revenue || 0), 0)
    };
  });
  tbody.innerHTML = rows.map(d => `<tr>
    <td><strong>${d.name}</strong></td><td>${d.code}</td><td>${d.loads}</td>
    <td>${d.km.toLocaleString()} km</td><td>${APP_CONFIG.CURRENCY}${d.rev.toLocaleString()}</td>
    <td><input class="salary-input" type="number" value="${d.salary}" onchange="updateDriverSalary('${d.id}', this.value)" /></td>
  </tr>`).join("");
  renderSvgLineChart("drivers-line-chart", rows.map(r => r.name.split(" ")[0]), [
    { label: "Revenue", color: "#56b6f7", values: rows.map(r => r.rev) },
    { label: "Distance (km)", color: "#34d399", values: rows.map(r => r.km * 20) }
  ]);
}

window.updateDriverSalary = async (driverId, newSalary) => {
  pushUndoSnapshot();
  const driver = state.drivers.find(d => d.id === driverId);
  if (driver) driver.salary = Number(newSalary || 0);
  await syncRemote(`/drivers/${driverId}`, "PUT", { salary: driver.salary });
  renderOwnerPortal();
};

function renderTripsTable() {
  const trips = getFilteredTrips();
  const tbody = document.getElementById("trips-table-body");
  if (!trips.length) {
    tbody.innerHTML = `<tr><td colspan="10" class="muted-text">No trips recorded in database yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = trips.map(tr => {
    const driver = state.drivers.find(d => d.id === tr.driverId);
    return `<tr onclick="openEditTripModal('${tr.id}')">
      <td>${tr.date}</td><td style="font-family:var(--font-mono)">${tr.plate}</td>
      <td>${driver ? driver.name : "Unassigned"}</td><td>${tr.customer || "—"}</td>
      <td>${tr.pickup} → ${tr.dropoff}</td><td>${tr.km} km</td>
      <td>${APP_CONFIG.CURRENCY}${Number(tr.revenue).toLocaleString()}</td>
      <td>${APP_CONFIG.CURRENCY}${Number(tr.fuelCost).toLocaleString()}</td>
      <td>${APP_CONFIG.CURRENCY}${Number(tr.extraCost).toLocaleString()}</td>
      <td><span class="status-pill">${tr.status}</span></td>
    </tr>`;
  }).join("");
}

function renderFinanceSection() {
  document.getElementById("cost-mode-select").value = state.costMode;
  document.getElementById("rate-per-km-input").value = state.ratePerKm;
  document.getElementById("fuel-policy-select").value = state.fuelPolicy;
  const trips = getFilteredTrips().slice().reverse();
  const labels = trips.map(t => t.date.slice(5));
  const revSeries = trips.map(t => Number(t.revenue));
  const costSeries = trips.map(t => Number(t.fuelCost) + Number(t.extraCost) + Number(t.km) * state.ratePerKm);
  const profitSeries = revSeries.map((r, i) => Math.max(0, r - costSeries[i]));
  renderSvgLineChart("finance-line-chart", labels, [
    { label: "Revenue", color: "#56b6f7", values: revSeries },
    { label: "Total Costs", color: "#f87171", values: costSeries },
    { label: "Net Profit", color: "#34d399", values: profitSeries }
  ]);
}

function renderSvgLineChart(containerId, labels, series) {
  const el = document.getElementById(containerId);
  if (!labels.length) { el.innerHTML = `<span class="muted-text">No records in selected timeframe.</span>`; return; }
  const w = 860, h = 190, pad = 34;
  const maxVal = Math.max(1, ...series.flatMap(s => s.values));
  const linesSvg = series.map(s => {
    const pts = s.values.map((v, i) => `${pad + (i * (w - pad * 2)) / Math.max(1, labels.length - 1)},${h - pad - ((v / maxVal) * (h - pad * 2))}`).join(" ");
    return `<polyline fill="none" stroke="${s.color}" stroke-width="2" points="${pts}" />`;
  }).join("");
  const xLabels = labels.map((lbl, i) => `<text x="${pad + (i * (w - pad * 2)) / Math.max(1, labels.length - 1)}" y="${h - 10}" fill="#8b92a0" font-size="10" text-anchor="middle">${lbl}</text>`).join("");
  const legend = series.map(s => `<span style="color:${s.color};margin-right:16px;font-size:12px;">■ ${s.label}</span>`).join("");
  el.innerHTML = `<div style="margin-bottom:8px;">${legend}</div><svg viewBox="0 0 ${w} ${h}" style="width:100%;height:185px;"><line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#1f232b" />${linesSvg}${xLabels}</svg>`;
}

function bindEvents() {
  document.getElementById("login-driver-btn").onclick = () => enterPortal("driver");
  document.getElementById("login-owner-btn").onclick = () => enterPortal("owner");
  document.getElementById("logout-btn").onclick = () => {
    state.role = null;
    document.getElementById("top-bar").classList.add("hidden");
    document.getElementById("driver-view").classList.add("hidden");
    document.getElementById("owner-view").classList.add("hidden");
    document.getElementById("login-view").classList.remove("hidden");
  };
  document.getElementById("edit-company-btn").onclick = () => {
    const name = prompt("Enter Contracted Company Name:", state.companyName);
    if (name && name.trim()) { state.companyName = name.trim().toUpperCase(); updateCompanyLabels(); }
  };
  document.getElementById("undo-btn").onclick = performUndo;
  document.addEventListener("keydown", e => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && state.role === "owner") { e.preventDefault(); performUndo(); } });
  document.getElementById("print-pdf-btn").onclick = () => { document.getElementById("print-section-title").textContent = state.activeOwnerTab.toUpperCase() + " SUMMARY"; window.print(); };

  document.querySelectorAll("#owner-nav .nav-tab").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll("#owner-nav .nav-tab").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.activeOwnerTab = btn.dataset.tab;
      document.querySelectorAll(".owner-tab").forEach(sec => sec.classList.add("hidden"));
      document.getElementById(`tab-${btn.dataset.tab}`).classList.remove("hidden");
    };
  });

  document.getElementById("driver-plate-grid").onclick = e => {
    const btn = e.target.closest(".plate-btn");
    if (!btn) return;
    state.selectedPlate = btn.dataset.plate;
    renderDriverPortal();
  };
  document.getElementById("driver-reset-plate-btn").onclick = () => { state.selectedPlate = null; renderDriverPortal(); };

  document.getElementById("btn-start-load").onclick = () => {
    const driverSelect = document.getElementById("start-driver-select");
    driverSelect.required = false;
    driverSelect.innerHTML = state.drivers.length
      ? state.drivers.map(d => `<option value="${d.id}">${d.name}</option>`).join("")
      : `<option value="">Default / Unassigned Driver</option>`;
    document.getElementById("start-pickup-select").innerHTML = APP_CONFIG.ROUTES.map((r, i) => `<option value="${i}">${r.pickup}</option>`).join("");
    document.getElementById("start-dropoff-select").innerHTML = APP_CONFIG.ROUTES.map((r, i) => `<option value="${i}">${r.dropoff}</option>`).join("");
    openModal("modal-start-load");
  };

  document.getElementById("form-start-load").onsubmit = async e => {
    e.preventDefault();
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck) return;
    const route = APP_CONFIG.ROUTES[Number(document.getElementById("start-dropoff-select").value)];
    const pickupRoute = APP_CONFIG.ROUTES[Number(document.getElementById("start-pickup-select").value)];
    const tripId = "tr_" + Date.now();
    const newTrip = {
      id: tripId, date: new Date().toISOString().slice(0, 10), plate: truck.plate,
      driverId: document.getElementById("start-driver-select").value || "", customer: "",
      pickup: pickupRoute.pickup, dropoff: route.dropoff, km: route.km, revenue: route.revenue,
      fuelCost: 0, extraCost: 0, status: "IN TRANSIT"
    };
    const res = await syncRemote("/trips", "POST", newTrip);
    if (res) { state.trips.unshift(newTrip); truck.status = "IN TRANSIT"; truck.activeTripId = tripId; }
    closeAllModals();
    renderDriverPortal();
  };

  document.getElementById("btn-load-done").onclick = () => {
    const fuelWrap = document.getElementById("fuel-input-wrapper");
    const fuelInput = document.getElementById("done-fuel-input");
    fuelWrap.classList.toggle("hidden", state.fuelPolicy === "disabled");
    fuelInput.required = state.fuelPolicy === "required";
    fuelInput.value = "";
    openModal("modal-load-done");
  };

  document.getElementById("form-load-done").onsubmit = async e => {
    e.preventDefault();
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck) return;
    const fuelVal = Number(document.getElementById("done-fuel-input").value || 0);
    const trip = state.trips.find(tr => tr.id === truck.activeTripId) || state.trips.find(tr => tr.plate === truck.plate && tr.status === "IN TRANSIT");
    if (trip) {
      trip.fuelCost = fuelVal; trip.status = "DELIVERED";
      await syncRemote(`/trips/${trip.id}`, "PUT", trip);
    } else {
      await syncRemote(`/trucks/${encodeURIComponent(truck.plate)}/status`, "PUT", { status: "DELIVERED", activeTripId: null });
    }
    truck.status = "DELIVERED";
    state.alerts.unshift(`DELIVERY CONFIRMED: ${truck.plate} arrived at ${trip?.dropoff || "destination"}.`);
    closeAllModals();
    renderDriverPortal();
  };

  document.getElementById("btn-return-trip").onclick = async () => {
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck) return;
    const trip = state.trips.find(tr => tr.id === truck.activeTripId) || state.trips.find(tr => tr.plate === truck.plate && tr.status === "DELIVERED");
    if (trip) {
      trip.status = "COMPLETED";
      await syncRemote(`/trips/${trip.id}`, "PUT", trip);
    } else {
      await syncRemote(`/trucks/${encodeURIComponent(truck.plate)}/status`, "PUT", { status: "AT DEPOT", activeTripId: null });
    }
    truck.status = "AT DEPOT"; truck.activeTripId = null;
    renderDriverPortal();
  };

  document.getElementById("open-add-truck-btn").onclick = () => openModal("modal-add-truck");
  document.getElementById("form-add-truck").onsubmit = async e => {
    e.preventDefault();
    pushUndoSnapshot();
    const newTruck = {
      id: "t_" + Date.now(), plate: document.getElementById("truck-plate-input").value.trim().toUpperCase(),
      brand: document.getElementById("truck-brand-input").value, model: document.getElementById("truck-model-input").value.trim(),
      engine: document.getElementById("truck-engine-input").value.trim(), year: document.getElementById("truck-year-input").value.trim(),
      status: "AT DEPOT", activeTripId: null
    };
    const res = await syncRemote("/trucks", "POST", newTruck);
    if (res) state.trucks.push(newTruck);
    e.target.reset(); closeAllModals(); renderOwnerPortal();
  };

  window.openEditTripModal = tripId => {
    const tr = state.trips.find(t => t.id === tripId);
    if (!tr) return;
    document.getElementById("edit-trip-id").value = tr.id;
    document.getElementById("edit-trip-customer").value = tr.customer || "";
    document.getElementById("edit-trip-pickup").value = tr.pickup;
    document.getElementById("edit-trip-dropoff").value = tr.dropoff;
    document.getElementById("edit-trip-km").value = tr.km;
    document.getElementById("edit-trip-rev").value = tr.revenue;
    document.getElementById("edit-trip-fuel").value = tr.fuelCost;
    document.getElementById("edit-trip-extra").value = tr.extraCost;
    openModal("modal-edit-trip");
  };

  document.getElementById("form-edit-trip").onsubmit = async e => {
    e.preventDefault();
    pushUndoSnapshot();
    const id = document.getElementById("edit-trip-id").value;
    const tr = state.trips.find(t => t.id === id);
    if (tr) {
      tr.customer = document.getElementById("edit-trip-customer").value.trim();
      tr.pickup = document.getElementById("edit-trip-pickup").value.trim();
      tr.dropoff = document.getElementById("edit-trip-dropoff").value.trim();
      tr.km = Number(document.getElementById("edit-trip-km").value);
      tr.revenue = Number(document.getElementById("edit-trip-rev").value);
      tr.fuelCost = Number(document.getElementById("edit-trip-fuel").value);
      tr.extraCost = Number(document.getElementById("edit-trip-extra").value);
      await syncRemote(`/trips/${id}`, "PUT", tr);
    }
    closeAllModals(); renderOwnerPortal();
  };

  document.getElementById("delete-trip-btn").onclick = async () => {
    pushUndoSnapshot();
    const id = document.getElementById("edit-trip-id").value;
    const res = await syncRemote(`/trips/${id}`, "DELETE");
    if (res) state.trips = state.trips.filter(t => t.id !== id);
    closeAllModals(); renderOwnerPortal();
  };

  document.getElementById("open-add-driver-btn").onclick = () => openModal("modal-add-driver");
  document.getElementById("form-add-driver").onsubmit = async e => {
    e.preventDefault();
    pushUndoSnapshot();
    const newDriver = {
      id: "d_" + Date.now(), name: document.getElementById("driver-name-input").value.trim(),
      code: document.getElementById("driver-code-input").value.trim(), salary: Number(document.getElementById("driver-salary-input").value)
    };
    const res = await syncRemote("/drivers", "POST", newDriver);
    if (res) state.drivers.push(newDriver);
    e.target.reset(); closeAllModals(); renderOwnerPortal();
  };

  document.getElementById("timeframe-select").onchange = e => { state.timeframe = e.target.value; renderOwnerPortal(); };
  document.getElementById("cost-mode-select").onchange = e => { pushUndoSnapshot(); state.costMode = e.target.value; renderOwnerPortal(); };
  document.getElementById("rate-per-km-input").onchange = e => { pushUndoSnapshot(); state.ratePerKm = Number(e.target.value || 0); renderOwnerPortal(); };
  document.getElementById("fuel-policy-select").onchange = e => { pushUndoSnapshot(); state.fuelPolicy = e.target.value; };
  document.querySelectorAll("[data-close-modal]").forEach(btn => { btn.onclick = closeAllModals; });
}

function openModal(id) { document.getElementById(id).classList.remove("hidden"); }
function closeAllModals() { document.querySelectorAll(".modal-backdrop").forEach(m => m.classList.add("hidden")); }
