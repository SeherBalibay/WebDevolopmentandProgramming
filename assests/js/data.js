// Global config & mock data (keeps admin and app in sync)
window.SB_DATA = {
  taxRate: 0.20,
  containerRates: { Small: 5, Medium: 8, Large: 12 }, // ₺ per km
  containerCapacityKg: { Small: 2000, Medium: 5000, Large: 10000 },
  // A tiny city distance map from Muğla (approx). Replace with Maps API later.
  distancesFromMuglaKm: {
  Berlin: 3000, Paris: 2750, Rome: 1900, Madrid: 3500, Vienna: 2100, Athens: 650,
  Sofia: 900, Bucharest: 1350, Prague: 2250, Budapest: 1900, Belgrade: 1400,
  Amsterdam: 3200, Zurich: 2400, Munich: 2300
  },

  fleet: [
    { id:"S1", name:"BlueSea", type:"Ship", costPerKm: 14, crew: 12, maintenance: 400 },
    { id:"S2", name:"OceanStar", type:"Ship", costPerKm: 16, crew: 15, maintenance: 520 },
    { id:"T1", name:"RoadKing", type:"Truck", costPerKm: 6, crew: 2, maintenance: 120 }
  ],
  inventory: [
    { category:"Fresh", quantity:4500, min:2000 },
    { category:"Frozen", quantity:1200, min:1000 },
    { category:"Organic", quantity:8000, min:2500 }
  ],
  // demo shipments (status flow: Pending → Ready → In Transit → Delivered)
  shipments: [
    { id:"A-1001", product:"Fresh Blueberries", category:"Fresh", weight:2000, container:"Medium",
      from:"Muğla, Türkiye", to:"Berlin, Germany", distanceKm:3000, price:3000*8, status:"Pending" },
    { id:"B-1002", product:"Frozen Shrimps", category:"Frozen", weight:500, container:"Small",
      from:"Muğla, Türkiye", to:"Athens, Greece", distanceKm:650, price:650*5, status:"Ready" },
    { id:"C-1003", product:"Organic Olive Oil", category:"Organic", weight:200, container:"Small",
      from:"Muğla, Türkiye", to:"Rome, Italy", distanceKm:1900, price:1900*5, status:"In Transit" }
  ]
};
