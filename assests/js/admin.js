(function(){
  // Tabs
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      tabs.forEach(b=>b.classList.remove("active"));
      panels.forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  // Data load (from localStorage first, fallback to SB_DATA)
  const fleet = window.SB_DATA.fleet.slice();
  const inventory = window.SB_DATA.inventory.slice();

  (function(){
  // Tabs
  const tabs = document.querySelectorAll(".tab");
  const panels = document.querySelectorAll(".tab-panel");
  tabs.forEach(btn=>{
    btn.addEventListener("click", ()=>{
      tabs.forEach(b=>b.classList.remove("active"));
      panels.forEach(p=>p.classList.remove("active"));
      btn.classList.add("active");
      document.getElementById(btn.dataset.tab).classList.add("active");
    });
  });

  const fRoot = document.getElementById("fleetTable");
  const iRoot = document.getElementById("invTable");
  const sRoot = document.getElementById("shipmentsTable");
  const lastSync = document.getElementById("lastSync");

  // --- RENDER HELPERS ---
  function renderShipments(){
    const shipments = loadLocal("sb_shipments", window.SB_DATA.shipments.slice());
    const rows = shipments.map(s=>`
      <tr>
        <td>${s.id}</td>
        <td>${s.product}</td>
        <td>${s.category}</td>
        <td>${s.weight} kg</td>
        <td>${s.container}</td>
        <td>${s.from} → ${s.to}</td>
        <td>${s.distanceKm.toLocaleString("tr-TR")} km</td>
        <td>${fmt(s.price)}</td>
        <td>${badge(s.status)}</td>
      </tr>
    `).join("");
    sRoot.innerHTML = `
      <table>
        <thead>
          <tr><th>ID</th><th>Product</th><th>Cat.</th><th>Weight</th><th>Cont.</th><th>Route</th><th>Dist.</th><th>Price</th><th>Status</th></tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    if(lastSync){
      const t = new Date();
      lastSync.textContent = `Last sync: ${t.toLocaleTimeString("tr-TR")}`;
    }
  }

  function renderFleet(){
    const fleet = window.SB_DATA.fleet.slice();
    const fRows = fleet.map(f=>`
      <tr>
        <td>${f.id}</td>
        <td>${f.name}</td>
        <td>${f.type}</td>
        <td>${fmt(f.costPerKm)}/km</td>
        <td>${f.crew}</td>
        <td>${fmt(f.maintenance)}/day</td>
      </tr>
    `).join("");
    fRoot.innerHTML = `
      <table>
        <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Cost/km</th><th>Crew</th><th>Maint.</th></tr></thead>
        <tbody>${fRows}</tbody>
      </table>
    `;
  }

  function renderInventory(){
    const inventory = window.SB_DATA.inventory.slice();
    const iRows = inventory.map(it=>{
      const low = it.quantity < it.min;
      return `
        <tr>
          <td>${it.category}</td>
          <td>${it.quantity.toLocaleString("tr-TR")}</td>
          <td>${it.min.toLocaleString("tr-TR")}</td>
          <td>${low ? `<span class="badge pending">Low ⚠️</span>` : `<span class="badge ready">OK</span>`}</td>
        </tr>
      `;
    }).join("");
    iRoot.innerHTML = `
      <table>
        <thead><tr><th>Category</th><th>Quantity</th><th>Min</th><th>Status</th></tr></thead>
        <tbody>${iRows}</tbody>
      </table>
    `;
  }

  // Initial renders
  renderShipments();
  renderFleet();
  renderInventory();

  // Financials (yerinde bırakıyoruz)
  const shipmentsForFin = loadLocal("sb_shipments", window.SB_DATA.shipments.slice());
  const revenue = shipmentsForFin.reduce((a,s)=>a+s.price,0);
  const expenses = Math.round(revenue * 0.55);
  const tax = Math.round((revenue - expenses) * window.SB_DATA.taxRate);
  document.getElementById("revVal").textContent = fmt(revenue);
  document.getElementById("expVal").textContent = fmt(expenses);
  document.getElementById("taxVal").textContent = fmt(tax);

  // Optimize placeholder
  document.getElementById("optimizeBtn").addEventListener("click", ()=>{
    document.getElementById("optimizeResult").textContent =
      "Planned: First-Fit Decreasing on current shipments by weight.";
  });

  // Reload button
  const reloadBtn = document.getElementById("reloadBtn");
  if(reloadBtn){
    reloadBtn.addEventListener("click", renderShipments);
  }

  // Live sync via storage events (çalışması için iki sayfa aynı origin'de olmalı)
  window.addEventListener("storage", (e)=>{
    if(e.key === "sb_shipments"){
      renderShipments();
    }
  });

  function badge(st){
    const map = {Pending:"pending", "Ready":"ready", "In Transit":"transit", "Delivered":"delivered"};
    return `<span class="badge ${map[st]||"pending"}">${st}</span>`;
  }
})();


  // Fleet table
  const fRoot = document.getElementById("fleetTable");
  const fRows = fleet.map(f=>`
    <tr>
      <td>${f.id}</td>
      <td>${f.name}</td>
      <td>${f.type}</td>
      <td>${fmt(f.costPerKm)}/km</td>
      <td>${f.crew}</td>
      <td>${fmt(f.maintenance)}/day</td>
    </tr>
  `).join("");
  fRoot.innerHTML = `
    <table>
      <thead><tr><th>ID</th><th>Name</th><th>Type</th><th>Cost/km</th><th>Crew</th><th>Maint.</th></tr></thead>
      <tbody>${fRows}</tbody>
    </table>
  `;

  // Inventory table + low stock badge
  const iRoot = document.getElementById("invTable");
  const iRows = inventory.map(it=>{
    const low = it.quantity < it.min;
    return `
      <tr>
        <td>${it.category}</td>
        <td>${it.quantity.toLocaleString("tr-TR")}</td>
        <td>${it.min.toLocaleString("tr-TR")}</td>
        <td>${low ? `<span class="badge pending">Low ⚠️</span>` : `<span class="badge ready">OK</span>`}</td>
      </tr>
    `;
  }).join("");
  iRoot.innerHTML = `
    <table>
      <thead><tr><th>Category</th><th>Quantity</th><th>Min</th><th>Status</th></tr></thead>
      <tbody>${iRows}</tbody>
    </table>
  `;

  // Financials (very rough placeholders)
  const revenue = shipments.reduce((a,s)=>a+s.price,0);
  const expenses = Math.round(revenue * 0.55); // placeholder ratio
  const tax = Math.round((revenue - expenses) * window.SB_DATA.taxRate);
  document.getElementById("revVal").textContent = fmt(revenue);
  document.getElementById("expVal").textContent = fmt(expenses);
  document.getElementById("taxVal").textContent = fmt(tax);

  // Optimization placeholder
  document.getElementById("optimizeBtn").addEventListener("click", ()=>{
    // Just a stub text for now; FFD will come in Adım 5.
    document.getElementById("optimizeResult").textContent =
      "Planned: First-Fit Decreasing on current shipments by weight.";
  });

  function badge(st){
    const map = {Pending:"pending", "Ready":"ready", "In Transit":"transit", "Delivered":"delivered"};
    return `<span class="badge ${map[st]||"pending"}">${st}</span>`;
  }
})();
