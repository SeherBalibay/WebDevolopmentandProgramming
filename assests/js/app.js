(function(){
  const state = {
    shipments: loadLocal("sb_shipments", window.SB_DATA.shipments.slice())
  };

  const form = document.getElementById("shipmentForm");
  const resultCard = document.getElementById("resultCard");
  const trackBtn = document.getElementById("trackBtn");
  const trackId = document.getElementById("trackId");
  const trackCard = document.getElementById("trackCard");

  form.addEventListener("submit", (e)=>{
    e.preventDefault();
    const fd = new FormData(form);
    const product   = fd.get("product").trim();
    const category  = fd.get("category");
    const weight    = Math.max(1, Number(fd.get("weight")));
    const container = fd.get("container");
    const city      = fd.get("city");
    const country   = fd.get("country");


    // basic validations vs capacity
    const cap = window.SB_DATA.containerCapacityKg[container];
    if(weight > cap){
      resultCard.className = "card";
      resultCard.innerHTML = `<strong>Capacity exceeded:</strong> ${container} max ${cap} kg.`;
      return;
    }

    const distanceKm = estimateDistanceFromMugla(city || "") || 1500;
    const rate = window.SB_DATA.containerRates[container];
    const price = distanceKm * rate;

    const id = uuid();
    const ORIGIN = "Muğla, Türkiye";
    const cityLower = (city || "").trim().toLowerCase();
    const countryLower = (country || "").trim().toLowerCase();
    if (cityLower === "muğla" || (cityLower === "muğla" && countryLower.includes("türkiye"))) {
  resultCard.className = "card";
  resultCard.innerHTML = `<strong>Invalid destination:</strong> Muğla, Türkiye şirket merkezidir; varış olarak seçilemez.`;
  return;
}

const shipment = {
  id, product, category, weight, container,
  from: ORIGIN,
  to: `${city}, ${country}`,
  distanceKm, price, status: "Pending"
};

    

    state.shipments.unshift(shipment);
    saveLocal("sb_shipments", state.shipments);

    resultCard.className = "card";
    resultCard.innerHTML = `
      <h3>Order Created</h3>
      <p><strong>Order ID:</strong> ${shipment.id}</p>
      <p><strong>Route:</strong> Muğla → ${city}, ${country}</p>
      <p><strong>Distance:</strong> ${distanceKm.toLocaleString("tr-TR")} km</p>
      <p><strong>Container:</strong> ${container} (rate ${fmt(rate)}/km)</p>
      <p><strong>Estimated Price:</strong> ${fmt(price)}</p>
      <p class="muted">Status: Pending</p>
    `;
    // auto-scroll to result
    document.getElementById("result").scrollIntoView({behavior:"smooth"});
  });

  trackBtn.addEventListener("click", ()=>{
    const id = trackId.value.trim();
    const found = state.shipments.find(s => s.id.toLowerCase() === id.toLowerCase());
    trackCard.className = "card";
    if(!found){
      trackCard.innerHTML = `No shipment found for <strong>${id || "—"}</strong>.`;
      return;
    }
    const badge = (st)=>{
      const map = {Pending:"pending", "Ready":"ready", "In Transit":"transit", "Delivered":"delivered"};
      return `<span class="badge ${map[st]||"pending"}">${st}</span>`;
    };
    trackCard.innerHTML = `
      <h3>${found.product}</h3>
      <p><strong>Order ID:</strong> ${found.id}</p>
      <p><strong>To:</strong> ${found.to}</p>
      <p><strong>Distance:</strong> ${found.distanceKm.toLocaleString("tr-TR")} km</p>
      <p><strong>Price:</strong> ${fmt(found.price)}</p>
      <p><strong>Status:</strong> ${badge(found.status)}</p>
    `;
  });
})();
