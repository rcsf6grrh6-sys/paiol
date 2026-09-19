const PEOPLE = [
  { id: "jose", name: "José Alcântara", role: "Patriarca · a sede", years: "1948 —", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80", bio: "Acordou a fazenda mais vezes do que consegue contar. Diz que terra boa é a que você reconhece no escuro." },
  { id: "lourdes", name: "Lourdes Alcântara", role: "Matriarca · a mesa", years: "1951 —", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", bio: "Manda no café, no bolo e no recado que ninguém esquece." },
  { id: "renato", name: "Renato Alcântara", role: "Filho · quem toca hoje", years: "1978 —", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=800&q=80", bio: "Ficou. Aprendeu o gado com o pai e o silêncio da estrada com o fim da tarde." },
  { id: "clara", name: "Clara Nunes Alcântara", role: "Nora · o arquivo", years: "1981 —", photo: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=800&q=80", bio: "É quem tira a foto, pergunta o nome e não deixa o ano se perder." }
];
const EVENTS = [
  { year: "1972", title: "A sede fica de pé", text: "José e Lourdes entram na casa nova." },
  { year: "1978", title: "Nasce o Renato", text: "Primeiro filho criado inteiro no terreiro." },
  { year: "2003", title: "Clara chega na família", text: "Casamento na capela do povoado." },
  { year: "2011", title: "A porteira nova", text: "A estrada ganha as palmeiras de referência." },
  { year: "2024", title: "O paiol digital", text: "A família decide guardar gente, terra e foto no mesmo lugar." }
];
const STORIES = [
  { title: "O Ford e a chuva de novembro", text: "José jura que o caminhão atravessou o córrego no peito. Lourdes jura que eles empurraram.", by: "Renato", when: "2023" },
  { title: "Bolo de fubá antes do terreiro esfriar", text: "Não existe visita sem café. A regra da casa não está escrita.", by: "Clara", when: "cozinha da sede" },
  { title: "Quem fecha a porteira", text: "Na fazenda, parentesco também é encargo. Fecha quem passou por último.", by: "José", when: "fim de tarde" }
];
const STARTER_PHOTOS = [
  { src: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80", title: "A sede ao cair do dia", album: "A Sede", caption: "Varanda, telha e o pátio." },
  { src: "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=80", title: "A estrada das palmeiras", album: "A Sede", caption: "Quem chega reconhece a casa." },
  { src: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1200&q=80", title: "Café e fubá", album: "A Mesa", caption: "A cozinha é o outro centro." },
  { src: "https://images.unsplash.com/photo-1543353071-087092ec393f?auto=format&fit=crop&w=1200&q=80", title: "Almoço sob a manga", album: "A Mesa", caption: "Cadeira sobrando é visita que ainda vem." },
  { src: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80", title: "Gado no campo", album: "O Campo", caption: "O serviço da tarde." },
  { src: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=800&q=80", title: "José", album: "Gente da casa", caption: "Retrato do patriarca." },
  { src: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80", title: "Lourdes", album: "Gente da casa", caption: "A varanda é o escritório dela." }
];
const ALBUMS = ["A Sede", "O Campo", "A Mesa", "Gente da casa"];
const storeKey = "paiol.photos.v1";
function loadPhotos(){ try { return [...STARTER_PHOTOS, ...JSON.parse(localStorage.getItem(storeKey)||"[]")]; } catch { return [...STARTER_PHOTOS]; } }
function saveExtraPhoto(photo){ const extra = JSON.parse(localStorage.getItem(storeKey)||"[]"); extra.unshift(photo); localStorage.setItem(storeKey, JSON.stringify(extra)); }
function $(sel){ return document.querySelector(sel); }
function el(html){ const t=document.createElement("template"); t.innerHTML=html.trim(); return t.content.firstElementChild; }
function go(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.toggle("active", v.id===view));
  document.querySelectorAll(".nav button").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  window.scrollTo({top:0,behavior:"smooth"});
}
function renderPeople(){
  const root=$("#people-grid"); root.innerHTML="";
  PEOPLE.forEach(p=>{
    const card=el(`<article class="card"><button class="hit" type="button"><img class="portrait" src="${p.photo}" alt="${p.name}"><div class="meta"><h3>${p.name}</h3><div class="role">${p.role}</div></div></button></article>`);
    card.querySelector("button").addEventListener("click", ()=>openPerson(p));
    root.appendChild(card);
  });
}
function openPerson(p){
  const modal=$("#modal");
  modal.innerHTML=`<div class="modal-card"><img src="${p.photo}" alt="${p.name}"><div class="body"><div class="role">${p.years}</div><h3>${p.name}</h3><p class="role">${p.role}</p><p>${p.bio}</p></div></div>`;
  modal.classList.add("open");
}
function chip(p){ return `<button class="person-chip" data-id="${p.id}" type="button"><img src="${p.photo}" alt="${p.name}"><span>${p.name.split(" ")[0]}</span></button>`; }
function renderTree(){ $("#tree").innerHTML=`<div class="branch-label">Quem plantou</div><div class="generation">${chip(PEOPLE[0])}${chip(PEOPLE[1])}</div><div class="branch-label">Quem ficou na sede</div><div class="generation">${chip(PEOPLE[2])}${chip(PEOPLE[3])}</div>`; }
function renderTime(){ $("#timeline").innerHTML=EVENTS.map(e=>`<article class="event"><div class="year">${e.year}</div><h3>${e.title}</h3><p>${e.text}</p></article>`).join(""); }
function renderStories(){ $("#stories").innerHTML=STORIES.map(s=>`<article class="story"><h3>${s.title}</h3><p>${s.text}</p><footer>${s.by} · ${s.when}</footer></article>`).join(""); }
function renderAlbums(filter="Todos"){
  const photos=loadPhotos().filter(p=>filter==="Todos"||p.album===filter);
  const root=$("#photo-grid");
  root.innerHTML=photos.map(p=>`<article class="card"><button class="hit" type="button" data-src="${p.src}" data-caption="${p.title} — ${p.caption}"><img class="thumb" src="${p.src}" alt="${p.title}"><div class="caption"><strong>${p.title}</strong><br>${p.album} · ${p.caption}</div></button></article>`).join("");
  root.querySelectorAll("button.hit").forEach(b=>b.addEventListener("click", ()=>openLightbox(b.dataset.src, b.dataset.caption)));
}
function openLightbox(src, caption){
  const box=$("#lightbox");
  box.innerHTML=`<img src="${src}" alt=""><p class="caption" style="color:#f3eadc">${caption||""}</p>`;
  box.classList.add("open");
}
function renderAlbumFilters(){
  const wrap=$("#album-filters");
  wrap.innerHTML=["Todos", ...ALBUMS].map((name,i)=>`<button class="btn ${i===0?"primary":""}" data-album="${name}" type="button">${name}</button>`).join("");
  wrap.addEventListener("click", e=>{
    const btn=e.target.closest("button"); if(!btn) return;
    wrap.querySelectorAll("button").forEach(b=>b.classList.toggle("primary", b===btn));
    renderAlbums(btn.dataset.album);
  });
}
function setupAddPhoto(){
  $("#add-photo").addEventListener("submit", e=>{
    e.preventDefault();
    const file=$("#photo-file").files[0];
    const title=$("#photo-title").value.trim();
    const caption=$("#photo-caption").value.trim();
    const album=$("#photo-album").value;
    if(!file||!title){ alert("Manda uma foto e um título."); return; }
    const reader=new FileReader();
    reader.onload=()=>{ saveExtraPhoto({src:reader.result,title,caption:caption||"Sem mais detalhes — ainda.",album}); e.target.reset(); renderAlbums("Todos"); go("albuns"); };
    reader.readAsDataURL(file);
  });
}
document.addEventListener("DOMContentLoaded", ()=>{
  renderPeople(); renderTree(); renderTime(); renderStories(); renderAlbumFilters(); renderAlbums(); setupAddPhoto();
  document.querySelectorAll("[data-view]").forEach(btn=>btn.addEventListener("click", ()=>go(btn.dataset.view)));
  $("#tree").addEventListener("click", e=>{ const chipBtn=e.target.closest("[data-id]"); if(!chipBtn) return; const person=PEOPLE.find(p=>p.id===chipBtn.dataset.id); if(person) openPerson(person); });
  $("#modal").addEventListener("click", e=>{ if(e.target.id==="modal") e.currentTarget.classList.remove("open"); });
  $("#lightbox").addEventListener("click", e=>{ if(e.target.id==="lightbox"||e.target.tagName==="IMG") e.currentTarget.classList.remove("open"); });
});
