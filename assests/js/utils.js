const fmt = (n) => `₺${Number(n).toLocaleString("tr-TR",{maximumFractionDigits:0})}`;

function estimateDistanceFromMugla(cityInput){
  const dict = window.SB_DATA.distancesFromMuglaKm;
  if(!cityInput) return 1500;
  // try exact
  if(dict[cityInput]) return dict[cityInput];
  // try case-insensitive contains
  const key = Object.keys(dict).find(k => k.toLowerCase() === cityInput.toLowerCase());
  if(key) return dict[key];
  // default fallback
  return 1500;
}

function uuid(prefix="ORD"){
  const rnd = Math.random().toString(36).slice(2,7).toUpperCase();
  const ts  = Date.now().toString().slice(-4);
  return `${prefix}-${rnd}${ts}`;
}

function saveLocal(name, data){
  try{ localStorage.setItem(name, JSON.stringify(data)); }catch(e){}
}
function loadLocal(name, fallback){
  try{
    const s = localStorage.getItem(name);
    return s ? JSON.parse(s) : fallback;
  }catch(e){ return fallback; }
}
