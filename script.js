
const canvas = document.getElementById('space');
const ctx = canvas.getContext('2d');
let stars = [];
let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);

function resize(){
  w = innerWidth;
  h = innerHeight;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
  ctx.setTransform(dpr,0,0,dpr,0,0);

  const count = innerWidth < 720 ? 62 : Math.min(150, Math.floor(w*h/9000));
  stars = Array.from({length:count},()=>({
    x:Math.random()*w,
    y:Math.random()*h,
    r:Math.random()*1.15+.2,
    a:Math.random()*.55+.13,
    s:Math.random()*.15+.025
  }));
}

function draw(){
  ctx.clearRect(0,0,w,h);
  for(const s of stars){
    s.y += s.s;
    if(s.y > h){ s.y = 0; s.x = Math.random()*w; }
    ctx.beginPath();
    ctx.arc(s.x,s.y,s.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(145,190,255,${s.a})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

resize();
draw();
addEventListener('resize', resize, {passive:true});

const revealObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
},{threshold:.09,rootMargin:'0px 0px -4% 0px'});

document.querySelectorAll('.reveal').forEach(el=>revealObserver.observe(el));

const glow = document.getElementById('cursorGlow');
const orb = document.getElementById('orbWrap');

if(matchMedia('(pointer:fine)').matches){
  addEventListener('pointermove',e=>{
    glow.style.left = e.clientX+'px';
    glow.style.top = e.clientY+'px';

    const x = (e.clientX-innerWidth/2)/innerWidth;
    const y = (e.clientY-innerHeight/2)/innerHeight;
    if(orb && innerWidth>900){
      orb.style.transform = `translate(${x*17}px,${y*17}px) rotateX(${-y*5}deg) rotateY(${x*5}deg)`;
    }
  },{passive:true});

  document.querySelectorAll('[data-tilt]').forEach(card=>{
    card.addEventListener('pointermove',e=>{
      const r = card.getBoundingClientRect();
      const x = (e.clientX-r.left)/r.width-.5;
      const y = (e.clientY-r.top)/r.height-.5;
      card.style.transform = `perspective(850px) rotateX(${-y*6}deg) rotateY(${x*6}deg) translateY(-3px)`;
    },{passive:true});
    card.addEventListener('pointerleave',()=>card.style.transform='');
  });
}

const phrase = 'Building smarter, more efficient organizations.';
const typeLine = document.getElementById('typeLine');
let typeIndex = 0;

function typeText(){
  if(typeIndex <= phrase.length){
    typeLine.textContent = phrase.slice(0,typeIndex++);
    setTimeout(typeText,38);
  }
}
setTimeout(typeText,650);

function flashTarget(hash){
  const target = document.querySelector(hash);
  if(!target) return;

  target.scrollIntoView({behavior:'smooth',block:'center'});

  if(target.classList.contains('exp-card')){
    target.classList.remove('flash');
    void target.offsetWidth;
    setTimeout(()=>target.classList.add('flash'),380);
    setTimeout(()=>target.classList.remove('flash'),1800);
  }
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click',e=>{
    const hash = a.getAttribute('href');
    if(hash && hash !== '#'){
      e.preventDefault();
      history.replaceState(null,'',hash);
      flashTarget(hash);
    }
  });
});

const dockLinks = [...document.querySelectorAll('.mobile-dock a')];
const sections = ['home','about','journey','experience','contact']
  .map(id=>document.getElementById(id))
  .filter(Boolean);

const sectionObserver = new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      dockLinks.forEach(a=>a.classList.toggle('active',a.getAttribute('href') === '#'+entry.target.id));
    }
  });
},{threshold:.42});

sections.forEach(section=>sectionObserver.observe(section));

addEventListener('load',()=>{
  if(location.hash && document.querySelector(location.hash)){
    setTimeout(()=>flashTarget(location.hash),350);
  }
});
