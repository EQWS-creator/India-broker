const stocks = [
  {symbol:"RELIANCE", name:"Reliance Industries", price:2924.35, change:1.42},
  {symbol:"TCS", name:"Tata Consultancy Services", price:4118.20, change:0.84},
  {symbol:"HDFCBANK", name:"HDFC Bank", price:1786.60, change:-0.31},
  {symbol:"INFY", name:"Infosys", price:1842.75, change:1.17},
  {symbol:"ICICIBANK", name:"ICICI Bank", price:1422.30, change:0.58},
  {symbol:"ITC", name:"ITC Limited", price:473.10, change:-0.22}
];

let holdings = [
  {symbol:"RELIANCE", name:"Reliance Industries", qty:20, avg:2760},
  {symbol:"TCS", name:"Tata Consultancy Services", qty:10, avg:3950},
  {symbol:"INFY", name:"Infosys", qty:25, avg:1710}
];

const money = n => "₹" + Math.round(n).toLocaleString("en-IN");
const stockList = document.getElementById("stockList");
const holdingList = document.getElementById("holdingList");
const activityList = document.getElementById("activityList");
const modal = document.getElementById("tradeModal");
let selectedStock = null;

function renderStocks(filter=""){
  const f = filter.toLowerCase();
  const rows = stocks.filter(s => (s.symbol+" "+s.name).toLowerCase().includes(f));
  stockList.innerHTML = rows.map(s => `
    <div class="table-row">
      <div class="company"><div class="company-logo">${s.symbol.slice(0,2)}</div><div><b>${s.symbol}</b><small>${s.name}</small></div></div>
      <b>${money(s.price)}</b>
      <span class="${s.change >= 0 ? "positive":"negative"}">${s.change >= 0 ? "+":""}${s.change.toFixed(2)}%</span>
      <button class="trade-btn" onclick="openTrade('${s.symbol}')">Buy</button>
    </div>`).join("") || `<div class="holding-empty">No matching stocks.</div>`;
}

function renderHoldings(){
  if(!holdings.length){ holdingList.innerHTML = `<div class="holding-empty">No demo holdings yet.</div>`; return; }
  holdingList.innerHTML = holdings.map(h => {
    const s = stocks.find(x=>x.symbol===h.symbol);
    const value = s ? s.price*h.qty : h.avg*h.qty;
    return `<div class="table-row">
      <div class="company"><div class="company-logo">${h.symbol.slice(0,2)}</div><div><b>${h.symbol}</b><small>${h.name}</small></div></div>
      <span>${h.qty}</span><span>${money(h.avg)}</span><b>${money(value)}</b>
    </div>`;
  }).join("");
}

function addActivity(title, detail, amount){
  const item = document.createElement("div");
  item.className = "activity-item";
  item.innerHTML = `<div><b>${title}</b><small>${detail} • Just now</small></div><b>${amount}</b>`;
  activityList.prepend(item);
}

function openTrade(symbol){
  selectedStock = stocks.find(s=>s.symbol===symbol);
  if(!selectedStock) return;
  document.getElementById("modalTitle").textContent = `Buy ${selectedStock.symbol}`;
  document.getElementById("modalPrice").textContent = `${selectedStock.name} • ${money(selectedStock.price)} per share`;
  document.getElementById("qtyInput").value = 1;
  updateTotal();
  modal.classList.remove("hidden");
}
function updateTotal(){
  if(selectedStock) document.getElementById("orderTotal").textContent = money(selectedStock.price * Number(document.getElementById("qtyInput").value || 0));
}
document.getElementById("qtyInput").addEventListener("input", updateTotal);
document.getElementById("closeModal").onclick = ()=>modal.classList.add("hidden");
modal.addEventListener("click", e=>{if(e.target===modal) modal.classList.add("hidden")});
document.getElementById("confirmTrade").onclick = ()=>{
  if(!selectedStock) return;
  const qty = Math.max(1, Number(document.getElementById("qtyInput").value)||1);
  const existing = holdings.find(h=>h.symbol===selectedStock.symbol);
  if(existing){
    existing.avg = ((existing.avg*existing.qty)+(selectedStock.price*qty))/(existing.qty+qty);
    existing.qty += qty;
  }else holdings.push({symbol:selectedStock.symbol,name:selectedStock.name,qty,avg:selectedStock.price});
  renderHoldings();
  addActivity(`Bought ${qty} ${selectedStock.symbol}`, "Demo market order", "-"+money(selectedStock.price*qty));
  modal.classList.add("hidden");
};

document.getElementById("stockSearch").addEventListener("input", e=>renderStocks(e.target.value));
document.getElementById("addHoldingBtn").onclick = ()=>openTrade("RELIANCE");
document.getElementById("openAccountBtn").onclick = ()=>document.getElementById("portfolio").scrollIntoView({behavior:"smooth"});
document.getElementById("ctaBtn").onclick = ()=>document.getElementById("markets").scrollIntoView({behavior:"smooth"});
document.getElementById("loginBtn").onclick = ()=>alert("Demo login: connect this button to your real authentication system before using it in production.");
document.getElementById("menuBtn").onclick = ()=>document.getElementById("nav").classList.toggle("open");

renderStocks();
renderHoldings();
addActivity("Portfolio opened", "Demo account", "₹0");
addActivity("Funds available", "Demo balance", "₹1,25,000");
