const APP_CONFIG = {
  COMPANY_NAME: "VANGUARD FREIGHT LOGISTICS",
  CURRENCY: "R",
  USE_REMOTE_API: true,
  API_BASE_URL: "/.netlify/functions/api",
  DEFAULT_RATE_PER_KM: 14.5,
  GAS_COST_POLICY: "optional"
};

let state = {
  currentUser: null,
  activePortal: "driver",
  showOwnerKpis: localStorage.getItem("truckit_show_kpis") !== "false",
  companyName: APP_CONFIG.COMPANY_NAME,
  selectedPlate: null,
  inspectedOwnerPlate: null,
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
    if (!res.ok) return { _error: data.error || `HTTP ${res.status}` };
    return data;
  } catch (err) {
    return { _error: "Cannot reach backend API. Verify local server is running." };
  }
}

async function refreshStateFromDB() {
  const remoteData = await syncRemote("/state");
  if (remoteData && !remoteData._error) {
    state.trucks = Array.isArray(remoteData.trucks) ? remoteData.trucks : [];
    state.drivers = Array.isArray(remoteData.drivers) ? remoteData.drivers : [];
    state.trips = Array.isArray(remoteData.trips) ? remoteData.trips : [];
    if (!state.inspectedOwnerPlate && state.trucks.length) {
      state.inspectedOwnerPlate = state.trucks[0].plate;
    }
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  updateCompanyLabels();
  bindEvents();
  const savedUser = localStorage.getItem("truckit_user");
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      await activateSession(state.currentUser);
    } catch {
      localStorage.removeItem("truckit_user");
    }
  }
});

function updateCompanyLabels() {
  document.getElementById("login-company-name").textContent = state.companyName;
  document.getElementById("header-company-name").textContent = state.companyName;
  document.getElementById("print-company-title").textContent = state.companyName;
  document.querySelectorAll(".curr-label").forEach(el => (el.textContent = APP_CONFIG.CURRENCY));
}

async function activateSession(user) {
  state.currentUser = user;
  localStorage.setItem("truckit_user", JSON.stringify(user));
  await refreshStateFromDB();

  document.getElementById("auth-view").classList.add("hidden");
  document.getElementById("top-bar").classList.remove("hidden");

  const isOwnerUser = user.role === "owner";
  state.activePortal = isOwnerUser ? "owner" : "driver";
  document.getElementById("user-badge").textContent = `${user.fullName} • ${isOwnerUser ? "OWNER" : "DRIVER"}`;

  // Drivers NEVER see the portal switcher or any Owner controls
  document.getElementById("switch-portal-btn").classList.toggle("hidden", !isOwnerUser);
  syncPortalVisibility();
}

function syncPortalVisibility() {
  if (!state.currentUser) return;
  const isOwnerUser = state.currentUser.role === "owner";
  // Enforce strict role guard: drivers can never view owner portal
  if (!isOwnerUser) state.activePortal = "driver";

  const viewingOwner = isOwnerUser && state.activePortal === "owner";
  document.getElementById("driver-view").classList.toggle("hidden", viewingOwner);
  document.getElementById("owner-view").classList.toggle("hidden", !viewingOwner);
  document.getElementById("owner-nav").classList.toggle("hidden", !viewingOwner);
  document.getElementById("edit-company-btn").classList.toggle("hidden", !viewingOwner);
  document.getElementById("tokens-btn").classList.toggle("hidden", !viewingOwner);
  document.getElementById("undo-btn").classList.toggle("hidden", !viewingOwner);
  document.getElementById("print-pdf-btn").classList.toggle("hidden", !viewingOwner);

  if (isOwnerUser) {
    document.getElementById("switch-portal-btn").textContent = viewingOwner ? "Driver View" : "Owner View";
  }
  renderAll();
}

function signOut() {
  state.currentUser = null;
  state.selectedPlate = null;
  localStorage.removeItem("truckit_user");
  document.getElementById("top-bar").classList.add("hidden");
  document.getElementById("driver-view").classList.add("hidden");
  document.getElementById("owner-view").classList.add("hidden");
  document.getElementById("auth-view").classList.remove("hidden");
}

function renderAll() {
  if (!state.currentUser) return;
  if (state.activePortal === "driver") renderDriverPortal();
  if (state.activePortal === "owner" && state.currentUser.role === "owner") renderOwnerPortal();
}

function renderDriverPortal() {
  const plateGrid = document.getElementById("driver-plate-grid");
  plateGrid.innerHTML = state.trucks.length
    ? state.trucks.map(t => `<button class="plate-btn ${state.selectedPlate === t.plate ? "selected" : ""}" data-plate="${t.plate}">${t.plate}</button>`).join("")
    : `<span class="muted-text">No vehicles registered in database yet.</span>`;

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
    btnStart.classList.remove("hidden");
    btnDone.classList.remove("hidden");
    btnReturn.classList.add("hidden");
    btnStart.disabled = false;
    btnDone.disabled = true;
  } else if (status === "IN TRANSIT") {
    btnStart.classList.remove("hidden");
    btnDone.classList.remove("hidden");
    btnReturn.classList.add("hidden");
    btnStart.disabled = true;
    btnDone.disabled = false;
  } else {
    btnStart.classList.add("hidden");
    btnDone.classList.add("hidden");
    btnReturn.classList.remove("hidden");
    btnReturn.disabled = false;
  }
}

function renderOwnerPortal() {
  renderAlerts();
  syncKpiVisibility();
  renderKPIs();
  const inspectedTruck = state.trucks.find(t => t.plate === state.inspectedOwnerPlate) || state.trucks[0] || null;
  renderBlueprint("owner", inspectedTruck ? inspectedTruck.brand : "Scania", inspectedTruck);
  renderFleetTable();
  renderDriversSection();
  renderTripsTable();
  renderFinanceSection();
}

function syncKpiVisibility() {
  const kpiEl = document.getElementById("owner-kpi-strip");
  const toggleBtn = document.getElementById("toggle-kpi-btn");
  kpiEl.classList.toggle("hidden", !state.showOwnerKpis);
  toggleBtn.textContent = state.showOwnerKpis ? "Hide KPI Summary" : "Show KPI Summary";
}

window.inspectFleetTruck = plate => {
  state.inspectedOwnerPlate = plate;
  const truck = state.trucks.find(t => t.plate === plate);
  renderBlueprint("owner", truck ? truck.brand : "Scania", truck);
  renderFleetTable();
};

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
  const profit = Math.round(revenue - calculateTotalCosts(trips));
  const profitClass = profit >= 0 ? "amt-profit" : "amt-cost";

  document.getElementById("owner-kpi-strip").innerHTML = `
    <div class="kpi-box"><span>Active Fleet</span><strong>${state.trucks.length}</strong></div>
    <div class="kpi-box"><span>Loads</span><strong>${trips.length}</strong></div>
    <div class="kpi-box"><span>Distance</span><strong>${totalKm.toLocaleString()} km</strong></div>
    <div class="kpi-box"><span>Revenue</span><strong class="amt-rev">${APP_CONFIG.CURRENCY}${revenue.toLocaleString()}</strong></div>
    <div class="kpi-box"><span>Net Profit</span><strong class="${profitClass}">${APP_CONFIG.CURRENCY}${profit.toLocaleString()}</strong></div>
  `;
}

function renderBlueprint(prefix, brand, customTruck = null) {
  const bps = window.TRUCK_BLUEPRINTS || {};
  const key = Object.keys(bps).find(k => k.toLowerCase() === String(brand || "").trim().toLowerCase()) || "Scania";
  const bp = bps[key];
  if (!bp) return;
  document.getElementById(`${prefix}-spec-sheet`).innerHTML = `
    <strong>${customTruck ? `${customTruck.plate} — ${key.toUpperCase()} ${customTruck.model || ""}` : bp.specs.title}</strong>
    ENGINE: ${customTruck?.engine || bp.specs.engine}<br/>CONFIG: ${bp.specs.axle}<br/>RATING: ${bp.specs.gvm}<br/>WHEELBASE: ${bp.specs.wheelbase}
  `;
  document.getElementById(`${prefix}-blueprint-canvas`).innerHTML = bp.svg;
}

function renderFleetTable() {
  const trips = getFilteredTrips();
  const tbody = document.getElementById("fleet-table-body");
  if (!state.trucks.length) {
    tbody.innerHTML = `<tr><td colspan="8" class="muted-text">No vehicles registered yet.</td></tr>`;
    return;
  }
  tbody.innerHTML = state.trucks.map(t => {
    const tTrips = trips.filter(tr => tr.plate === t.plate);
    const km = tTrips.reduce((s, tr) => s + Number(tr.km || 0), 0);
    const rev = tTrips.reduce((s, tr) => s + Number(tr.revenue || 0), 0);
    const isSelected = state.inspectedOwnerPlate === t.plate;
    return `<tr class="${isSelected ? "active-row" : ""}" onclick="inspectFleetTruck('${t.plate}')">
      <td style="font-family:var(--font-display);letter-spacing:0.06em">${t.plate}</td>
      <td>${t.brand}</td>
      <td>${[t.model, t.engine].filter(Boolean).join(" / ") || "—"}</td>
      <td>${t.year || "—"}</td>
      <td><span class="status-pill">${t.status}</span></td>
      <td>${tTrips.length}</td>
      <td>${km.toLocaleString()} km</td>
      <td class="amt-rev">${APP_CONFIG.CURRENCY}${rev.toLocaleString()}</td>
    </tr>`;
  }).join("");
}

function renderDriversSection() {
  const trips = getFilteredTrips();
  const tbody = document.getElementById("drivers-table-body");
  if (!state.drivers.length) {
    tbody.innerHTML = `<tr><td colspan="6" class="muted-text">No drivers registered yet.</td></tr>`;
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
    <td>${d.name}</td>
    <td>${d.code}</td>
    <td>${d.loads}</td>
    <td>${d.km.toLocaleString()} km</td>
    <td class="amt-rev">${APP_CONFIG.CURRENCY}${d.rev.toLocaleString()}</td>
    <td><input class="salary-input" type="number" value="${d.salary}" onchange="updateDriverSalary('${d.id}', this.value)" /></td>
  </tr>`).join("");
  renderSvgLineChart("drivers-line-chart", rows.map(r => r.name.split(" ")[0]), [
    { label: "Revenue", color: "#34d399", dash: "", values: rows.map(r => r.rev) },
    { label: "Distance Index", color: "#fbbf24", dash: "4 3", values: rows.map(r => r.km * 25) }
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
    tbody.innerHTML = `<tr><td colspan="10" class="muted-text">No trips recorded in selected period.</td></tr>`;
    return;
  }
  tbody.innerHTML = trips.slice(0, 120).map(tr => {
    const driver = state.drivers.find(d => d.id === tr.driverId);
    return `<tr onclick="openEditTripModal('${tr.id}')">
      <td style="font-family:var(--font-mono);font-size:12px">${tr.date}</td>
      <td style="font-family:var(--font-display);letter-spacing:0.06em">${tr.plate}</td>
      <td>${driver ? driver.name : "Unassigned"}</td>
      <td>${tr.customer || "—"}</td>
      <td>${tr.pickup} → ${tr.dropoff}</td>
      <td>${tr.km} km</td>
      <td class="amt-rev">${APP_CONFIG.CURRENCY}${Number(tr.revenue).toLocaleString()}</td>
      <td class="amt-cost">${APP_CONFIG.CURRENCY}${Number(tr.fuelCost).toLocaleString()}</td>
      <td class="amt-cost">${APP_CONFIG.CURRENCY}${Number(tr.extraCost).toLocaleString()}</td>
      <td><span class="status-pill">${tr.status}</span></td>
    </tr>`;
  }).join("");
}

function renderFinanceSection() {
  document.getElementById("cost-mode-select").value = state.costMode;
  document.getElementById("rate-per-km-input").value = state.ratePerKm;
  document.getElementById("fuel-policy-select").value = state.fuelPolicy;

  const byDate = {};
  for (const t of getFilteredTrips()) {
    if (!byDate[t.date]) byDate[t.date] = { rev: 0, cost: 0 };
    byDate[t.date].rev += Number(t.revenue || 0);
    byDate[t.date].cost += Number(t.fuelCost || 0) + Number(t.extraCost || 0) + Number(t.km || 0) * state.ratePerKm;
  }
  const dates = Object.keys(byDate).sort().slice(-30);
  const labels = dates.map(d => d.slice(5));
  const revSeries = dates.map(d => byDate[d].rev);
  const costSeries = dates.map(d => Math.round(byDate[d].cost));
  const profitSeries = dates.map(d => Math.max(0, Math.round(byDate[d].rev - byDate[d].cost)));

  renderSvgLineChart("finance-line-chart", labels, [
    { label: "Revenue", color: "#34d399", dash: "", values: revSeries },
    { label: "Net Profit", color: "#fbbf24", dash: "", values: profitSeries },
    { label: "Operating Cost", color: "#f87171", dash: "4 3", values: costSeries }
  ]);
}

function renderSvgLineChart(containerId, labels, series) {
  const el = document.getElementById(containerId);
  if (!labels.length) { el.innerHTML = `<span class="muted-text">No records in selected period.</span>`; return; }
  const w = 860, h = 190, pad = 34;
  const maxVal = Math.max(1, ...series.flatMap(s => s.values));
  const linesSvg = series.map(s => {
    const pts = s.values.map((v, i) => `${pad + (i * (w - pad * 2)) / Math.max(1, labels.length - 1)},${h - pad - ((v / maxVal) * (h - pad * 2))}`).join(" ");
    return `<polyline fill="none" stroke="${s.color}" stroke-width="1.8" stroke-dasharray="${s.dash || ""}" points="${pts}" />`;
  }).join("");
  const step = Math.max(1, Math.ceil(labels.length / 10));
  const xLabels = labels.map((lbl, i) => (i % step === 0)
    ? `<text x="${pad + (i * (w - pad * 2)) / Math.max(1, labels.length - 1)}" y="${h - 10}" fill="#9ea2ac" font-family="monospace" font-size="9" text-anchor="middle">${lbl}</text>`
    : ""
  ).join("");
  const legend = series.map(s => `<span style="color:${s.color};margin-right:20px;font-family:var(--font-display);font-size:12px;letter-spacing:0.08em;text-transform:uppercase;">— ${s.label}</span>`).join("");
  el.innerHTML = `<div style="margin-bottom:10px;">${legend}</div><svg viewBox="0 0 ${w} ${h}" style="width:100%;height:185px;"><line x1="${pad}" y1="${h - pad}" x2="${w - pad}" y2="${h - pad}" stroke="#2c2f36" />${linesSvg}${xLabels}</svg>`;
}

function bindEvents() {
  document.getElementById("tab-btn-login").onclick = () => {
    document.getElementById("tab-btn-login").classList.add("active");
    document.getElementById("tab-btn-register").classList.remove("active");
    document.getElementById("form-login").classList.remove("hidden");
    document.getElementById("form-register").classList.add("hidden");
  };
  document.getElementById("tab-btn-register").onclick = () => {
    document.getElementById("tab-btn-register").classList.add("active");
    document.getElementById("tab-btn-login").classList.remove("active");
    document.getElementById("form-register").classList.remove("hidden");
    document.getElementById("form-login").classList.add("hidden");
  };

  document.getElementById("form-login").onsubmit = async e => {
    e.preventDefault();
    const errEl = document.getElementById("login-error");
    errEl.classList.add("hidden");
    const res = await syncRemote("/auth/login", "POST", {
      email: document.getElementById("login-email").value.trim(),
      password: document.getElementById("login-password").value
    });
    if (!res || res._error) {
      errEl.textContent = res?._error || "Login failed.";
      errEl.classList.remove("hidden");
      return;
    }
    e.target.reset();
    await activateSession(res.user);
  };

  document.getElementById("form-register").onsubmit = async e => {
    e.preventDefault();
    const errEl = document.getElementById("register-error");
    errEl.classList.add("hidden");
    const res = await syncRemote("/auth/register", "POST", {
      fullName: document.getElementById("reg-name").value.trim(),
      email: document.getElementById("reg-email").value.trim(),
      password: document.getElementById("reg-password").value,
      role: document.getElementById("reg-role").value,
      token: document.getElementById("reg-token").value.trim()
    });
    if (!res || res._error) {
      errEl.textContent = res?._error || "Registration failed.";
      errEl.classList.remove("hidden");
      return;
    }
    e.target.reset();
    await activateSession(res.user);
  };

  // Owner-only Portal Switcher (Owner <-> Driver View)
  document.getElementById("switch-portal-btn").onclick = () => {
    if (state.currentUser?.role !== "owner") return;
    state.activePortal = state.activePortal === "owner" ? "driver" : "owner";
    syncPortalVisibility();
  };

  // Admin KPI Hide/Show Toggle
  document.getElementById("toggle-kpi-btn").onclick = () => {
    state.showOwnerKpis = !state.showOwnerKpis;
    localStorage.setItem("truckit_show_kpis", String(state.showOwnerKpis));
    syncKpiVisibility();
  };

  document.getElementById("tokens-btn").onclick = async () => {
    const res = await syncRemote("/auth/tokens");
    if (res && !res._error) {
      document.getElementById("display-driver-token").value = res.driverToken;
      document.getElementById("display-owner-token").value = res.ownerToken;
      openModal("modal-tokens");
    }
  };

  document.getElementById("logout-btn").onclick = signOut;

  document.getElementById("edit-company-btn").onclick = () => {
    const name = prompt("Enter Company Name:", state.companyName);
    if (name && name.trim()) { state.companyName = name.trim().toUpperCase(); updateCompanyLabels(); }
  };
  document.getElementById("undo-btn").onclick = performUndo;
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && state.currentUser?.role === "owner") {
      e.preventDefault();
      performUndo();
    }
  });
  document.getElementById("print-pdf-btn").onclick = () => {
    document.getElementById("print-section-title").textContent = state.activeOwnerTab.toUpperCase() + " SUMMARY";
    window.print();
  };

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

  // Manual Start Load (Driver never enters revenue; defaults to 0)
  document.getElementById("btn-start-load").onclick = () => {
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck || (truck.status && truck.status !== "AT DEPOT")) return;
    const driverSelect = document.getElementById("start-driver-select");
    driverSelect.innerHTML = state.drivers.length
      ? state.drivers.map(d => `<option value="${d.id}" ${state.currentUser?.driverId === d.id ? "selected" : ""}>${d.name}</option>`).join("")
      : `<option value="">Unassigned Driver</option>`;
    document.getElementById("form-start-load").reset();
    if (state.currentUser?.driverId) driverSelect.value = state.currentUser.driverId;
    openModal("modal-start-load");
  };

  document.getElementById("form-start-load").onsubmit = async e => {
    e.preventDefault();
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck) return;
    const tripId = "tr_" + Date.now();
    const newTrip = {
      id: tripId,
      date: new Date().toISOString().slice(0, 10),
      plate: truck.plate,
      driverId: document.getElementById("start-driver-select").value || "",
      customer: document.getElementById("start-customer-input").value.trim(),
      pickup: document.getElementById("start-pickup-input").value.trim(),
      dropoff: document.getElementById("start-dropoff-input").value.trim(),
      km: Number(document.getElementById("start-km-input").value || 0),
      revenue: 0,
      fuelCost: 0,
      extraCost: 0,
      status: "IN TRANSIT"
    };
    const res = await syncRemote("/trips", "POST", newTrip);
    if (res && !res._error) {
      state.trips.unshift(newTrip);
      truck.status = "IN TRANSIT";
      truck.activeTripId = tripId;
    }
    closeAllModals();
    renderDriverPortal();
  };

  // Load Is Done
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
      trip.fuelCost = fuelVal;
      trip.status = "DELIVERED";
      await syncRemote(`/trips/${trip.id}`, "PUT", trip);
    } else {
      await syncRemote(`/trucks/${encodeURIComponent(truck.plate)}/status`, "PUT", { status: "DELIVERED", activeTripId: truck.activeTripId || null });
    }
    truck.status = "DELIVERED";
    state.alerts.unshift(`DELIVERY CONFIRMED: ${truck.plate} arrived at ${trip?.dropoff || "destination"}.`);
    closeAllModals();
    renderDriverPortal();
  };

  // Manual Return Trip (Driver never enters revenue; defaults to 0)
  document.getElementById("btn-return-trip").onclick = () => {
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck || truck.status !== "DELIVERED") return;
    const activeTrip = state.trips.find(tr => tr.id === truck.activeTripId) || state.trips.find(tr => tr.plate === truck.plate && tr.status === "DELIVERED");
    document.getElementById("form-return-trip").reset();
    document.getElementById("return-pickup-input").value = activeTrip ? activeTrip.dropoff : "";
    document.getElementById("return-dropoff-input").value = activeTrip ? activeTrip.pickup : "";
    document.getElementById("return-fuel-wrapper").classList.toggle("hidden", state.fuelPolicy === "disabled");
    openModal("modal-return-trip");
  };

  document.getElementById("form-return-trip").onsubmit = async e => {
    e.preventDefault();
    const truck = state.trucks.find(t => t.plate === state.selectedPlate);
    if (!truck) return;

    const outboundTrip = state.trips.find(tr => tr.id === truck.activeTripId) || state.trips.find(tr => tr.plate === truck.plate && tr.status === "DELIVERED");
    if (outboundTrip) {
      outboundTrip.status = "COMPLETED";
      await syncRemote(`/trips/${outboundTrip.id}`, "PUT", outboundTrip);
    }

    const returnTrip = {
      id: "ret_" + Date.now(),
      date: new Date().toISOString().slice(0, 10),
      plate: truck.plate,
      driverId: outboundTrip ? outboundTrip.driverId : (state.currentUser?.driverId || ""),
      customer: outboundTrip?.customer ? `${outboundTrip.customer} (Return)` : "Return Leg",
      pickup: document.getElementById("return-pickup-input").value.trim(),
      dropoff: document.getElementById("return-dropoff-input").value.trim(),
      km: Number(document.getElementById("return-km-input").value || 0),
      revenue: 0,
      fuelCost: Number(document.getElementById("return-fuel-input").value || 0),
      extraCost: 0,
      status: "COMPLETED"
    };

    const res = await syncRemote("/trips", "POST", returnTrip);
    if (res && !res._error) {
      await syncRemote(`/trips/${returnTrip.id}`, "PUT", returnTrip);
      state.trips.unshift(returnTrip);
    }
    truck.status = "AT DEPOT";
    truck.activeTripId = null;
    closeAllModals();
    renderDriverPortal();
  };

  // Owner Modals
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
    if (res && !res._error) {
      state.trucks.push(newTruck);
      state.inspectedOwnerPlate = newTruck.plate;
    }
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
    if (res && !res._error) state.trips = state.trips.filter(t => t.id !== id);
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
    if (res && !res._error) state.drivers.push(newDriver);
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
