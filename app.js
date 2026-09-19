const ALBUMS = ["A Sede", "O Campo", "A Mesa", "Gente da casa"];
const KEY = "paiol.album.v2";
const DEMO = {
  started: false,
  farm: "Fazenda Santa Luzia",
  place: "Sede · cerrado · estrada de chão",
  family: "Alcântara",
  volume: "volume I",
  cover: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80",
  farmPhoto: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80",
  people: [],
  events: [],
  stories: [],
  photos: []
};
function emptyHouse(){return {started:true,farm:"",place:"",family:"",volume:"volume I",cover:"",farmPhoto:"",people:[],events:[],stories:[],photos:[]};}
function load(){try{const raw=localStorage.getItem(KEY);if(!raw)return Object.assign(emptyHouse(),JSON.parse(JSON.stringify(DEMO)));return Object.assign(emptyHouse(),JSON.parse(raw));}catch{return Object.assign(emptyHouse(),JSON.parse(JSON.stringify(DEMO)));}}
function save(state){localStorage.setItem(KEY,JSON.stringify(state));}
let state=load();
function $(sel){return document.querySelector(sel);}
function uid(){return "p"+Date.now().toString(36)+Math.random().toString(36).slice(2,6);}
function compressFile(file,max=1400,quality=0.72){return new Promise((resolve,reject)=>{const img=new Image();const url=URL.createObjectURL(file);img.onload=()=>{const scale=Math.min(1,max/Math.max(img.width,img.height));const canvas=document.createElement("canvas");canvas.width=Math.round(img.width*scale);canvas.height=Math.round(img.height*scale);canvas.getContext("2d").drawImage(img,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);resolve(canvas.toDataURL("image/jpeg",quality));};img.onerror=reject;img.src=url;});}
function go(view){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active",v.id===view));document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active",b.dataset.view===view));window.scrollTo({top:0,behavior:"smooth"});}
function renderHouse(){if(!$('#cover-kicker'))return;$("#cover-kicker").textContent=[state.farm||"A fazenda",state.volume||"volume I"].join(" · ");$("#cover-img").src=state.cover||DEMO.cover;$("#farm-img").src=state.farmPhoto||state.cover||DEMO.farmPhoto;$("#farm-title").textContent=state.farm||"Sua fazenda";$("#farm-place").textContent=state.place||"Município · sede";$("#farm-note").textContent=state.started?(state.family?"Família "+state.family+".":"A casa já está no seu nome."):"Isto ainda é o exemplo.";$("#cover-lede").textContent=state.started&&state.farm?("Álbum da "+state.farm+(state.family?", família "+state.family:"")+". Foto entra com nome, ano e lugar."):"Paiol é o álbum da casa.";$("#set-farm").value=state.farm||"";$("#set-place").value=state.place||"";$("#set-family").value=state.family||"";$("#set-volume").value=state.volume||"volume I";}
function renderPeople(){const root=$("#people-grid");if(!root)return;root.innerHTML="";const empty=$("#people-empty");if(empty)empty.hidden=state.people.length>0;state.people.forEach(p=>{const card=document.createElement("article");card.className="card";card.innerHTML=`<button class="hit" type="button">${p.photo?`<img class="portrait" src="${p.photo}" alt="${p.name}">`:""}<div class="meta"><h3>${p.name}</h3><div class="role">${p.role||""}</div></div></button>`;card.querySelector("button").addEventListener("click",()=>openPerson(p));root.appendChild(card);});}
function openPerson(p){const modal=$("#modal");modal.innerHTML=`<div class="modal-card">${p.photo?`<img src="${p.photo}" alt="${p.name}">`:""}<div class="body"><div class="role">${p.years||""}</div><h3>${p.name}</h3><p class="role">${p.role||""}</p><p>${p.bio||""}</p><button class="btn" data-del="${p.id}" type="button">Tirar do volume</button></div></div>`;modal.classList.add("open");modal.querySelector("[data-del]")?.addEventListener("click",()=>{state.people=state.people.filter(x=>x.id!==p.id);persist();modal.classList.remove("open");});}
function renderTree(){const tree=$("#tree");if(!tree)return;if(!state.people.length){tree.innerHTML='<p class="hint">A árvore aparece quando você guarda a primeira pessoa.</p>';return;}tree.innerHTML=`<div class="branch-label">Quem entra neste volume</div><div class="generation">`+state.people.map(p=>`<button class="person-chip" data-id="${p.id}" type="button">${p.photo?`<img src="${p.photo}" alt="${p.name}">`:""}<span>${p.name.split(" ")[0]}</span></button>`).join("")+`</div>`;}
function renderTime(){const root=$("#timeline");if(!root)return;if(!state.events.length){root.innerHTML='<p class="hint">Nenhum marco ainda. Em A casa você põe o ano.</p>';return;}root.innerHTML=[...state.events].sort((a,b)=>String(a.year).localeCompare(String(b.year))).map(e=>`<article class="event"><div class="year">${e.year}</div><h3>${e.title}</h3><p>${e.text||""}</p></article>`).join("");}
function renderStories(){const root=$("#stories");if(!root)return;if(!state.stories.length){root.innerHTML='<p class="hint">Causo ainda não entrou.</p>';return;}root.innerHTML=state.stories.map(s=>`<article class="story"><h3>${s.title}</h3><p>${s.text}</p><footer>${[s.by,s.when].filter(Boolean).join(" · ")}</footer></article>`).join("");}
function renderAlbums(filter="Todos"){const root=$("#photo-grid");if(!root)return;const photos=state.photos.filter(p=>filter==="Todos"||p.album===filter);const empty=$("#photos-empty");if(empty)empty.hidden=state.photos.length>0;root.innerHTML=photos.map(p=>`<article class="card photo-card"><button class="hit" type="button" data-open="${p.id}"><img class="thumb" src="${p.src}" alt="${p.title}"><div class="caption"><strong>${p.title}</strong><br>${p.album} · ${p.caption||""}</div></button><button class="kill" data-kill="${p.id}" type="button">×</button></article>`).join("");root.querySelectorAll("[data-open]").forEach(b=>b.addEventListener("click",()=>{const photo=state.photos.find(x=>x.id===b.dataset.open);if(photo)openLightbox(photo.src,photo.title+" — "+(photo.caption||""));}));root.querySelectorAll("[data-kill]").forEach(b=>b.addEventListener("click",e=>{e.stopPropagation();state.photos=state.photos.filter(x=>x.id!==b.dataset.kill);persist();}));}
function openLightbox(src,caption){const box=$("#lightbox");box.innerHTML=`<img src="${src}" alt=""><p class="caption" style="color:#f3eadc">${caption||""}</p>`;box.classList.add("open");}
function renderAlbumFilters(){const wrap=$("#album-filters");if(!wrap)return;wrap.innerHTML=["Todos",...ALBUMS].map((name,i)=>`<button class="btn ${i===0?"primary":""}" data-album="${name}" type="button">${name}</button>`).join("");wrap.onclick=e=>{const btn=e.target.closest("button");if(!btn)return;wrap.querySelectorAll("button").forEach(b=>b.classList.toggle("primary",b===btn));renderAlbums(btn.dataset.album);};}
function persist(){save(state);paint();}
function paint(){renderHouse();renderPeople();renderTree();renderTime();renderStories();renderAlbums();}
function startMine(farm,place,family){state=emptyHouse();state.farm=farm;state.place=place;state.family=family;persist();$("#setup")?.classList.remove("open");go("casa");}
document.addEventListener("DOMContentLoaded",()=>{
  renderAlbumFilters();paint();
  if(!state.started)$("#setup")?.classList.add("open");
  document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click",()=>go(btn.dataset.view)));
  $("#form-setup")?.addEventListener("submit",e=>{e.preventDefault();startMine($("#boot-farm").value.trim(),$("#boot-place").value.trim(),$("#boot-family").value.trim());});
  $("#btn-see-demo")?.addEventListener("click",()=>$("#setup").classList.remove("open"));
  $("#form-house")?.addEventListener("submit",e=>{e.preventDefault();state.started=true;state.farm=$("#set-farm").value.trim();state.place=$("#set-place").value.trim();state.family=$("#set-family").value.trim();state.volume=$("#set-volume").value.trim()||"volume I";persist();go("capa");});
  $("#form-person")?.addEventListener("submit",async e=>{e.preventDefault();const file=$("#p-photo").files[0];const photo=file?await compressFile(file):"";state.people.push({id:uid(),name:$("#p-name").value.trim(),role:$("#p-role").value.trim(),years:$("#p-years").value.trim(),bio:$("#p-bio").value.trim(),photo});e.target.reset();persist();go("familia");});
  $("#form-event")?.addEventListener("submit",e=>{e.preventDefault();state.events.push({year:$("#e-year").value.trim(),title:$("#e-title").value.trim(),text:$("#e-text").value.trim()});e.target.reset();persist();go("tempo");});
  $("#form-story")?.addEventListener("submit",e=>{e.preventDefault();state.stories.push({title:$("#s-title").value.trim(),text:$("#s-text").value.trim(),by:$("#s-by").value.trim(),when:$("#s-when").value.trim()});e.target.reset();persist();go("causos");});
  $("#add-photo")?.addEventListener("submit",async e=>{e.preventDefault();const file=$("#photo-file").files[0];const title=$("#photo-title").value.trim();if(!file||!title){alert("Manda uma foto e um título.");return;}const src=await compressFile(file);const album=$("#photo-album").value;const caption=$("#photo-caption").value.trim();state.photos.unshift({id:uid(),src,title,album,caption});if($("#photo-cover")?.checked){state.cover=src;if(album==="A Sede")state.farmPhoto=src;}if(!state.cover)state.cover=src;e.target.reset();persist();go("albuns");});
  $("#btn-start-mine")?.addEventListener("click",()=>{if(!confirm("Apaga o exemplo e começa o seu Volume I?"))return;startMine($("#set-farm").value.trim()||"A fazenda",$("#set-place").value.trim(),$("#set-family").value.trim());});
  $("#btn-backup")?.addEventListener("click",()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([JSON.stringify(state)],{type:"application/json"}));a.download="paiol-"+(state.farm||"album").replace(/\s+/g,"-").toLowerCase()+".json";a.click();});
  $("#import-backup")?.addEventListener("change",async e=>{const file=e.target.files[0];if(!file)return;try{state=Object.assign(emptyHouse(),JSON.parse(await file.text()),{started:true});persist();go("capa");}catch{alert("Esse arquivo não é um backup do Paiol.");}});
  $("#tree")?.addEventListener("click",e=>{const chipBtn=e.target.closest("[data-id]");if(!chipBtn)return;const person=state.people.find(p=>p.id===chipBtn.dataset.id);if(person)openPerson(person);});
  $("#modal")?.addEventListener("click",e=>{if(e.target.id==="modal")e.currentTarget.classList.remove("open");});
  $("#lightbox")?.addEventListener("click",e=>{if(e.target.id==="lightbox"||e.target.tagName==="IMG")e.currentTarget.classList.remove("open");});
});
