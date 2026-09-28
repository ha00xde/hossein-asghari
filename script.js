const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let stars = [];
let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize(){
  w = innerWidth; h = innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  canvas.style.width = w + 'px'; canvas.style.height = h + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);
  stars = Array.from({length: Math.min(150, Math.floor(w*h/9000))}, () => ({
    x: Math.random()*w, y: Math.random()*h, r: Math.random()*1.25+.2,
    a: Math.random()*.65+.15, s: Math.random()*.18+.03
  }));
}
function draw(){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){
    s.y += s.s;
    if(s.y>h){s.y=0;s.x=Math.random()*w}
    ctx.beginPath(); ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle=`rgba(145,190,255,${s.a})`; ctx.fill();
  }
  requestAnimationFrame(draw);
}
resize(); draw(); addEventListener('resize', resize);

const reveal = new IntersectionObserver(entries=>{
  entries.forEach((entry,i)=>{
    if(entry.isIntersecting){
      setTimeout(()=>entry.target.classList.add('visible'), 80);
      reveal.unobserve(entry.target);
    }
  });
},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>reveal.observe(el));

const glow = document.getElementById('cursorGlow');
const orb = document.getElementById('orbWrap');
addEventListener('pointermove', e=>{
  glow.style.left = e.clientX+'px';
  glow.style.top = e.clientY+'px';
  const x = (e.clientX-innerWidth/2)/innerWidth;
  const y = (e.clientY-innerHeight/2)/innerHeight;
  if(orb && innerWidth>700) orb.style.transform=`translate(${x*18}px,${y*18}px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
});

document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('pointermove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5;
    const y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${-y*7}deg) rotateY(${x*7}deg) translateY(-3px)`;
  });
  card.addEventListener('pointerleave',()=>card.style.transform='');
});

const text = 'Build smarter, more efficient organizations.';
const typeLine = document.getElementById('typeLine');
let ti=0;
function type(){
  if(ti<=text.length){
    typeLine.textContent=text.slice(0,ti++);
    setTimeout(type,42);
  }
}
setTimeout(type,900);

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const id=a.getAttribute('href');
    const target=document.querySelector(id);
    if(target){e.preventDefault(); target.scrollIntoView({behavior:'smooth'});}
  });
});