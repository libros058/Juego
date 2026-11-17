// Música generada en el navegador (sin archivos). Para usar mp3 propios, mira el README.
const A=(()=>{let c,mst,bus,cur,vol=.5,on=true,duck=1,timer,nt=0,st=0;
const MAJ=[0,2,4,7,9],MIN=[0,3,5,7,10];
const S={ // b=bpm, r=nota base, sc=escala, m=melodía (grados), bs=bajo, w=onda, g=volumen
 menu:{b:104,r:60,sc:MAJ,w:'square',g:.05,m:[0,2,4,2,5,4,2,null,0,2,4,7,5,4,2,null],bs:[0,0,3,2]},
 forest:{b:72,r:55,sc:MAJ,w:'triangle',g:.16,m:[0,null,2,null,4,null,2,null,3,null,2,null,0,null,null,null],bs:[0,3,2,0],air:1},
 dark:{b:60,r:48,sc:MIN,w:'triangle',g:.14,m:[0,null,null,null,2,null,null,null,1,null,null,null,null,null,null,null],bs:[0,0,0,1],air:1},
 battle:{b:152,r:52,sc:MIN,w:'square',g:.05,m:[0,0,2,0,3,2,0,2,4,3,2,3,2,0,2,null],bs:[0,0,3,3,2,2,3,4]},
 harry:{b:116,r:62,sc:MAJ,w:'square',g:.045,m:[4,2,0,2,4,4,4,null,2,2,2,null,4,5,5,null],bs:[0,3,2,3]},
 house:{b:62,r:53,sc:MIN,w:'sine',g:.22,m:[0,null,3,null,2,null,null,null,4,null,3,null,2,null,0,null],bs:[0,2,3,1]},
 letter:{b:56,r:57,sc:MAJ,w:'sine',g:.22,m:[4,null,2,null,0,null,2,null,4,null,5,null,4,null,null,null],bs:[0,3,2,4]}};
const hz=n=>440*2**((n-69)/12);
const deg=(s,d)=>s.r+s.sc[((d%5)+5)%5]+12*Math.floor(d/5);
function osc(f,t,d,w,g,o=bus){const a=c.createOscillator(),e=c.createGain();a.type=w;a.frequency.value=f;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+.02);e.gain.exponentialRampToValueAtTime(.0001,t+d);a.connect(e).connect(o);a.start(t);a.stop(t+d+.05)}
function noise(t,d,g,fr){const n=c.sampleRate*d,b=c.createBuffer(1,n,c.sampleRate),x=b.getChannelData(0);for(let i=0;i<n;i++)x[i]=Math.random()*2-1;
 const s=c.createBufferSource(),f=c.createBiquadFilter(),e=c.createGain();s.buffer=b;f.type='bandpass';f.frequency.value=fr;e.gain.setValueAtTime(0,t);e.gain.linearRampToValueAtTime(g,t+d/2);e.gain.linearRampToValueAtTime(0,t+d);s.connect(f).connect(e).connect(bus);s.start(t)}
function tick(){const s=S[cur];if(!s)return;const q=60/s.b/2;
 while(nt<c.currentTime+.2){const m=s.m[st%s.m.length];if(m!=null)osc(hz(deg(s,m)+12),nt,q*1.8,s.w,s.g);
  if(st%2==0)osc(hz(deg(s,s.bs[(st/2)%s.bs.length|0])-12),nt,q*1.9,s.w=='square'?'triangle':s.w,s.g*1.7);
  if(s.air&&st%16==0)noise(nt,q*14,.03,cur=='forest'?1800:500);
  if(cur=='forest'&&Math.random()<.12)osc(2200+Math.random()*900,nt,.12,'sine',.025);
  if(cur=='battle'&&st%2==0)noise(nt,.05,.05,6000);
  nt+=q;st++}}
function apply(){if(mst)mst.gain.value=on?vol*duck:0;const e=document.getElementById('eq');e&&e.classList.toggle('off',!on)}
return{init(){if(c)return c.resume();c=new(window.AudioContext||window.webkitAudioContext)();mst=c.createGain();mst.connect(c.destination);apply();timer=setInterval(tick,60)},
 play(n){if(!c||n==cur)return;const old=bus,t=c.currentTime;if(old){old.gain.cancelScheduledValues(t);old.gain.setValueAtTime(old.gain.value,t);old.gain.linearRampToValueAtTime(0,t+1.6);setTimeout(()=>old.disconnect(),2000)}
  bus=c.createGain();bus.gain.setValueAtTime(0,t);bus.gain.linearRampToValueAtTime(1,t+1.6);bus.connect(mst);cur=n;nt=t+.1;st=0},
 sfx(k){if(!c)return;const t=c.currentTime,o=mst;const seq={ok:[[660,.08],[880,.1]],hit:[[200,.08],[120,.12]],crit:[[300,.06],[600,.06],[900,.1],[1200,.2]],miss:[[300,.1],[200,.15]],get:[[523,.1],[659,.1],[784,.1],[1047,.3]],bad:[[220,.15],[180,.2]],heal:[[500,.08],[700,.08],[900,.12]],win:[[523,.12],[659,.12],[784,.12],[1047,.4]]}[k]||[];
  let x=t;seq.forEach(([f,d])=>{osc(f,x,d*1.6,k=='hit'||k=='bad'||k=='miss'?'sawtooth':'square',.12,o);x+=d})},
 toggle(){on=!on;apply();return on},set(v){vol=v;apply()},duck(d){duck=d?.15:1;apply()}}})();
