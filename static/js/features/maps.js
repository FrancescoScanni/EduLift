import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs";

mermaid.initialize({ startOnLoad:false, securityLevel:'loose', themeVariables:{ fontFamily:'Arial' } });

const WORKER_URL = document.querySelector('meta[name="worker-url"]')?.content || "https://edulift.frascanni07.workers.dev/";
const btn = document.getElementById("generateTTS");
const fileInput = document.getElementById("fileInput");
const upload = document.getElementById("upload");
const wait = document.getElementById("wait");
const show = document.getElementById("showMap");
const dwnld = document.getElementById("dwnldMap");
const map = document.getElementById("map");
let text = "";

async function ask(prompt){
  const r = await fetch(WORKER_URL, { method:"POST", headers:{"Content-Type":"application/json"}, body: JSON.stringify({ prompt }) });
  return (await r.json()).text;
}

fileInput.addEventListener("change", async e => {
  const f = e.target.files?.[0];
  if(!f) return;
  text = await f.text();
  upload.textContent = "File inserted!";
  btn.style.scale = "1.1";
  btn.classList.add("border-[4px]");
});

btn.addEventListener("click", async () => {
  if(!text) return;
  btn.disabled = true;
  wait.textContent = "Generating...";
  show.style.visibility = "hidden";
  map.innerHTML = "";

  const p = `Do a rich research improving these notes (dont use special symbols, just letters and a mermaid-translateable text). Then convert the result text into Mermaid code (respond only with the mermaid code and strip it not with backticks but with ''. Optimize the mermaid code making it functional without adding any additional character and in a 14:9 layout, always start with graph TD):\n\n${text}`;
  const code = (await ask(p)).trim();

  const res = await mermaid.render("generatedDiagram", code);
  const svg = typeof res === "string" ? res : res.svg;
  map.innerHTML = svg;

  const svgEl = map.querySelector("svg");
  const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svgEl)], { type:"image/svg+xml;charset=utf-8" }));
  dwnld.setAttribute("href", url);
  dwnld.setAttribute("download", "mermaid-diagram.svg");
  show.style.visibility = "visible";

  const revoke = () => { setTimeout(() => URL.revokeObjectURL(url), 1000); dwnld.removeEventListener("click", revoke); };
  dwnld.addEventListener("click", revoke);

  wait.textContent = "Your map is ready, click to see it!";
  btn.disabled = false;
});