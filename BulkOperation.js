const devices = [
  "STM_09025001",
  "STM_09025002",
  "STM_09025003",
  "STM_09025004",
  "STM_09025006",
  "STM_09025007",
  "STM_09025008",
  "STM_09025009",
  "STM_09025013",
  "STM_09055003",
  "STM_09055005",
  "STM_09055006",
  "STM_09055007",
  "STM_09055008",
  "STM_09055009",
  "STM_09055011",
  "STM_09055012",
  "STM_09056001",
  "STM_09056002",
  "STM_09056004",
  "STM_09056005",
  "STM_09056006",
  "STM_09056007",
  "STM_09056008",
  "STM_09056009",
  "STM_09056011",
  "STM_09056013",
  "STM_09056015",
  "STM_09056017",
  "STM_09056022",
  "STM_09056027",
  "STM_09056030",
  "STM_09056031",
  "STM_09056033",
  "STM_09056034",
  "STM_09056035",
  "STM_09056036",
  "STM_09056037",
  "STM_09056038",
  "STM_09056039",
  "STM_09056040",
  "STM_09056041",
  "STM_09056042",
  "STM_09056044",
  "STM_09056047",
  "STM_09056048",
  "STM_09056049",
  "STM_09056050",
  "STM_09056051",
  "STM_09056052",
  "STM_09056058",
  "STM_09056059",
  "STM_09056060",
  "STM_09056062",
  "STM_09056063",
  "STM_09056064",
  "STM_09056065",
  "STM_09056066",
  "STM_09056068",
  "STM_09056069",
  "STM_09056079",
  "STM_09056086",
  "STM_09056087",
  "STM_09056092",
  "STM_09056094",
  "STM_09056095",
  "STM_09056098",
  "STM_09056099",
  "STM_09056102",
  "STM_09056103",
  "STM_09056104",
  "STM_09056105",
  "STM_09056106",
  "STM_09056107",
  "STM_09056113",
  "STM_09056114",
  "STM_09056116",
  "STM_09056120",
  "STM_09056121",
  "STM_09056124",
  "STM_09056126",
  "STM_09056127",
  "STM_09056128",
  "STM_09056132",
  "STM_09056138",
  "STM_09056139",
  "STM_09056140",
  "STM_09056141",
  "STM_09056142",
  "STM_09056149",
  "STM_09056151",
  "STM_09056154",
  "STM_09056155",
  "STM_09056156",
  "STM_09056157",
  "STM_09056159",
  "STM_09056163",
  "STM_09056166",
  "STM_09056169",
  "STM_09056170"
];
// console.log(devices.length)
const searchBox = document.querySelector('input[name="search"]');
 
if (!searchBox) {
console.error("❌ Search box not found");
} else {
 
const wait = ms => new Promise(r => setTimeout(r, ms));
 
async function selectDevice(device) {
 
console.log("Searching:", device);
 
searchBox.focus();
 
// Clear previous search
searchBox.value = "";
 
searchBox.dispatchEvent(new Event("input", {
bubbles: true
}));
 
await wait(100);
 
// Enter device
searchBox.value = device;
 
searchBox.dispatchEvent(new Event("input", {
bubbles: true
}));
 
searchBox.dispatchEvent(new Event("change", {
bubbles: true
}));
 
await wait(700);
 
// Find exact device text
const textElement = [...document.querySelectorAll("*")]
.find(el =>
el.children.length === 0 &&
el.textContent.trim() === device
);
 
if (!textElement) {
console.warn("❌ Not found:", device);
return;
}
 
// Search upwards for checkbox
let parent = textElement;
 
for (let i = 0; i < 10; i++) {
 
const checkbox = parent?.querySelector(
'input[type="checkbox"]'
);
 
if (checkbox) {
 
if (!checkbox.checked) {
checkbox.click();
}
 
console.log("✅ Selected:", device);
return;
}
 
parent = parent?.parentElement;
}
 
console.warn("⚠️ Checkbox not found:", device);
}
 
async function run() {
 
for (const device of devices) {
await selectDevice(device);
await wait(300);
}
 
console.log("🎉 Done!");
}
 
run();
}
