/* ===== PERSONALIZE THIS OBJECT FOR THE NEXT BIRTHDAY ===== */
const birthday = {
  name: 'Shruti',
  age: 22,
  // Use MM-DD. The page automatically chooses the next occurrence of this date.
  birthday: '08-13',
  message: 'You make ordinary days feel softer, brighter, and more beautiful. I hope this new year brings you every little thing your heart has been wishing for. Thank you for being you — today and always.',
  from: 'With all my love, ♡',
  // Add your own music file to assets/music.mp3, then set: music: 'assets/music.mp3'
  music: '',
  // Replace src values with your photo paths, for example: 'assets/photos/us-1.jpg'
  photos: [
    { src: 'assets/photos/kklp.jpeg', caption: 'You, being completely you' },
    
  ]
};

const $ = (selector) => document.querySelector(selector);
const screens = [...document.querySelectorAll('.screen')];
const music = $('#background-music');
let currentScreen = 'opening', midnightShown = false, soundOn = false;

function ordinal(n) { const endings = ['th','st','nd','rd']; const v = n % 100; return n + (endings[(v - 20) % 10] || endings[v] || endings[0]); }
function setupContent() {
  document.title = `Happy Birthday ${birthday.name} ♡`;
  $('#opening-copy').textContent = `A birthday story is waiting for ${birthday.name}.`;
  ['#birthday-name','#final-name'].forEach(id => $(id).textContent = birthday.name);
  $('#birthday-age').textContent = `Hello, ${birthday.age}.`;
  $('#final-age').textContent = ordinal(birthday.age);
  $('#age-before').textContent = birthday.age - 1;
  $('#birthday-message').textContent = birthday.message;
  $('#signature').textContent = birthday.from;
  if (birthday.music) music.src = birthday.music;
  const grid = $('#memory-grid');
  birthday.photos.forEach((photo, index) => {
    const item = document.createElement('article'); item.className = 'memory';
    if (photo.src) item.innerHTML = `<img src="${photo.src}" alt="${photo.caption}">`;
    else item.innerHTML = `<div class="placeholder">${birthday.name[0]}</div>`;
    const caption = document.createElement('span'); caption.textContent = photo.caption; item.append(caption); grid.append(item);
  });
}
function showScreen(name) {
  screens.forEach(s => s.classList.toggle('is-active', s.dataset.screen === name));
  currentScreen = name;
  if (name === 'final') { hearts(20); fireworks(); }
}
function nextBirthdayDate() {
  const [month, day] = birthday.birthday.split('-').map(Number); const now = new Date();
  let target = new Date(now.getFullYear(), month - 1, day, 0, 0, 0);
  if (target <= now) target = new Date(now.getFullYear() + 1, month - 1, day, 0, 0, 0);
  return target;
}
const targetBirthday = nextBirthdayDate();
function updateCountdown() {
  const distance = targetBirthday - new Date();
  if (distance <= 0) { $('#countdown').innerHTML = '<div><strong>00</strong><span>It is time!</span></div>'; if (!midnightShown) revealMidnight(); return; }
  const values = [Math.floor(distance/86400000), Math.floor(distance/3600000)%24, Math.floor(distance/60000)%60, Math.floor(distance/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,i) => $('#'+id).textContent = String(values[i]).padStart(2,'0'));
  if (distance <= 60000) { $('#clock-label').textContent = '11:59 PM — one minute to go…'; $('#countdown-note').textContent = 'The next chapter begins at midnight.'; }
}
function revealMidnight() { midnightShown = true; showScreen('midnight'); hearts(12); }
function startMusic() { if (!birthday.music) return; music.play().then(() => { soundOn=true; $('#sound-button').textContent='♫'; }).catch(() => {}); }
function turnMidnight() { showScreen('cake'); hearts(25); fireworks(); }
function hearts(amount=10) { for(let i=0;i<amount;i++){ const h=document.createElement('span'); h.className='heart'; h.textContent=Math.random()>.3?'♥':'♡'; h.style.left=Math.random()*100+'vw'; h.style.setProperty('--drift',(Math.random()*160-80)+'px'); h.style.animationDuration=(3+Math.random()*3)+'s'; h.style.animationDelay=(Math.random()*1.2)+'s'; $('#hearts').append(h); setTimeout(()=>h.remove(),7500); } }
function fireworks() { const canvas=$('#fireworks'), ctx=canvas.getContext('2d'); canvas.width=innerWidth;canvas.height=innerHeight; const sparks=[]; for(let j=0;j<5;j++){const x=canvas.width*(.18+Math.random()*.64),y=canvas.height*(.15+Math.random()*.42);for(let i=0;i<38;i++){let a=Math.PI*2*i/38, speed=1.5+Math.random()*3; sparks.push({x,y,dx:Math.cos(a)*speed,dy:Math.sin(a)*speed,color:['#ffd377','#ff83ba','#dca5ff'][j%3],life:50+Math.random()*25});}} function draw(){ctx.clearRect(0,0,canvas.width,canvas.height);sparks.forEach(s=>{s.x+=s.dx;s.y+=s.dy;s.dy+=.035;s.life--;ctx.globalAlpha=Math.max(0,s.life/70);ctx.fillStyle=s.color;ctx.fillRect(s.x,s.y,3,3)});ctx.globalAlpha=1;if(sparks.some(s=>s.life>0))requestAnimationFrame(draw);else ctx.clearRect(0,0,canvas.width,canvas.height);} draw(); }

$('#start-button').addEventListener('click',()=>{ startMusic(); showScreen('countdown'); updateCountdown(); });
$('#preview-button').addEventListener('click',revealMidnight);
$('#midnight-button').addEventListener('click',turnMidnight);
$('#wish-button').addEventListener('click',()=>{ $('.cake-wrap').style.transform='scale(1.08)'; hearts(35); fireworks(); setTimeout(()=>showScreen('memories'),1000); });
document.querySelectorAll('[data-next]').forEach(button=>button.addEventListener('click',()=>showScreen(button.dataset.next)));
$('#replay-button').addEventListener('click',()=>showScreen('opening'));
$('#sound-button').addEventListener('click',()=>{ if(!birthday.music)return; if(soundOn) { music.pause(); soundOn=false; } else { startMusic(); } $('#sound-button').textContent=soundOn?'♫':'♪'; });
setupContent(); updateCountdown(); setInterval(updateCountdown,1000); window.addEventListener('resize',()=>{const c=$('#fireworks');c.width=innerWidth;c.height=innerHeight});
