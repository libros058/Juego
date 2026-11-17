const $=s=>document.querySelector(s),wait=ms=>new Promise(r=>setTimeout(r,ms)),st=$('#stage'),box=$('#box'),spr=$('#spr'),ch=$('#choices');
const G={items:[],pet:null};
$('#mute').onclick=e=>{e.target.textContent=A.toggle()?'🔊':'🔇'};$('#vol').oninput=e=>A.set(e.target.value/100);
function sp(img,x,y,w,cls=''){const e=document.createElement('img');e.src='img/'+img+'.png';e.className='s '+cls;e.style.cssText=`left:${x}%;bottom:${y}%;width:${w}%`;spr.append(e);return e}
function luc(x,y,w,pose=0){const e=document.createElement('div');e.className='s sheet bob';e.style.cssText=`left:${x}%;bottom:${y}%;width:${w}%;background-position:${['0% 0%','100% 0%','0% 100%','100% 100%'][pose]}`;spr.append(e);return e}
async function go(bg,lvl,music){$('#fade').classList.add('on');await wait(550);$('#bg').style.cssText=bg.startsWith('bg-')?`background-image:url(img/${bg}.png)`:`background:${bg}`;spr.innerHTML='';$('#fx').innerHTML='';ch.innerHTML='';
 if(lvl)$('#lvl').textContent='NIVEL '+lvl;A.play(music);await wait(150);$('#fade').classList.remove('on');await wait(450)}
function inv(){$('#inv').innerHTML=G.items.map(i=>`<span>${i}</span>`).join('')}
function add(i){G.items.push(i);inv();A.sfx('get')}
function say(t,bx=null){return new Promise(r=>{box.className=bx!=null?'bub':'';if(bx!=null)box.style.setProperty('--bx',bx+'%');box.hidden=0;const s=box.firstChild;let i=0,done=0;
 const iv=setInterval(()=>{s.textContent=t.slice(0,++i);if(i>=t.length){clearInterval(iv);done=1}},26);
 const h=e=>{if(e.target.closest('.btn,#player'))return;if(!done){clearInterval(iv);s.textContent=t;done=1;return}st.removeEventListener('pointerdown',h);box.hidden=1;A.sfx('ok');r()};st.addEventListener('pointerdown',h)})}
function ask(opts){return new Promise(r=>{ch.innerHTML='';opts.forEach((o,i)=>{const b=document.createElement('button');b.className='btn'+(o.off?' off':'');b.textContent=o.t||o;b.onclick=()=>{A.sfx('ok');ch.innerHTML='';r(i)};ch.append(b)})})}
const hit=(e,c='shake')=>{e.classList.remove(c);void e.offsetWidth;e.classList.add(c)};

$('#play').onclick=async()=>{A.init();A.sfx('ok');A.play('menu');$('#title').style.transition='opacity .6s';$('#title').style.opacity=0;await wait(600);$('#title').remove();mission()};

async function mission(){await go('bg-title',0,'menu');const L=luc(8,6,22);
 const T=[['Un héroe ha sido elegido para recorrer un mundo lleno de recuerdos, risas y pequeñas pruebas. ¿Aceptas la misión?',['Aceptar misión','rechazar misión']],
  ['¿Seguro? A veces las mejores aventuras empiezan con un "sí".',['Aceptar misión','rechazar misión']],['... ¿De verdad?',['Aceptar misión','Seguir rechazando']],
  ['Está bien. No puedo obligarte. Pero... Preparé todo esto con mucho cariño. ❤️ ¿Le damos una oportunidad?',['Aceptar misión']]];
 for(let i=0;i<4;i++){L.style.backgroundPosition=i==3?'100% 100%':'0% 0%';const p=say(T[i][0],30);await p;if(await ask(T[i][1])==0)break;}
 L.style.backgroundPosition='0% 100%';await say('Misión aceptada. Todo gran héroe comienza dando el primer paso.',30);nivel1()}

async function nivel1(){await go('bg-intro',1,'forest');await say('Dicen que existen aventuras que cambian una vida. Pero esta... puede cambiar un corazón. ¿Estás listo?');
 await go('bg-forest',1,'forest');await say('Has llegado al Bosque de Ooo. Aquí todos dicen que la verdadera fuerza no está en la espada. Sino en quien decide caminar contigo.');
 sp('mago',2,0,26,'bob');const o=[{t:'La fuerza'},{t:'La magia'},{t:'El cariño'}];await say('Hola viajero. Antes de continuar debes responder. ¿Qué crees que hace fuerte a una persona?',22);
 for(;;){const i=await ask(o);if(i==2)break;A.sfx('bad');o[i].off=1;await say('No exactamente. Pero todos podemos equivocarnos. Intenta otra vez.',22)}
 await say('Correcto. Nunca olvides eso.',22);spr.innerHTML='';const k=sp('kevin-espada',26,21,48,'pop');
 for(let i=0;i<14;i++){const s=document.createElement('div');s.textContent='✦';s.style.cssText=`position:absolute;left:${35+Math.random()*25}%;top:${25+Math.random()*30}%;color:#ffd84a;font-size:2cqw;animation:pop .6s ${i*.07}s both`;$('#fx').append(s)}
 add('🗡️');await say('Felicidades. Espada obtenida.');nivel2()}

async function nivel2(){await go('bg-dark',2,'dark');await say('Todo comienza a oscurecerse. Ya no escuchas nada. Solo tus pasos.');await say('... Algo bloquea el camino.');
 const g=sp('guardian',4,2,26,'bob');
 for(;;){const i=await ask(['⚔ Atacar','💬 Hablar','🏃 Huir']);
  if(i==2){await say('¿Tan rápido te vas?');await say('Corres... Pero algo te dice que aún no es momento de rendirte.');continue}
  if(i==1){await say('¿Por qué quieres seguir?',32);await ask(['Porque debo.','Porque quiero.']);await say('Entonces eres digno.',32);await say('Puedes pasar.',32);return nivel3()}
  await batalla(g);return nivel3()}}

async function batalla(g){A.play('battle');spr.innerHTML='';const b=sp('batalla',22,6,52);
 const hp=(l,x,n)=>{const e=document.createElement('div');e.className='hp';e.style.cssText=`left:${x}%;top:11%`;e.innerHTML=`${n}<div><i></i></div>`;st.append(e);return e.querySelector('i')};
 let K=100,E=70;const kb=hp(0,4,'KEVIN'),eb=hp(0,70,'GUARDIÁN'),up=()=>{kb.style.width=Math.max(K,0)+'%';eb.style.width=Math.max(E,0)/70*100+'%'};up();let heals=2;
 await say('Has iniciado combate.');
 while(E>0){const i=await ask(['⚔ Espadazo','💥 Ataque final','💚 Curarse ('+heals+')']);let d=0;
  if(i==2){if(!heals){await say('Ya no te quedan curaciones.');continue}heals--;K=Math.min(100,K+28);A.sfx('heal');up();await say('Respiras hondo y recuperas fuerzas.')}
  else if(i==0){d=14+Math.random()*8|0;A.sfx('hit')}
  else if(Math.random()<.65){d=26+Math.random()*8|0;A.sfx('crit')}else{A.sfx('miss');await say('¡El ataque final falló! El Guardián esquivó.')}
  if(d){E-=d;hit(b);up();await say(i==1?`¡Golpe crítico! El enemigo recibe ${d} de daño.`:`Espadazo. El enemigo recibe ${d} de daño.`)}
  if(E<=0)break;const e=8+Math.random()*7|0;K-=e;A.sfx('bad');hit(b,'shake');up();await say(`El Guardián contraataca. Pierdes ${e} de vida.`);
  if(K<=0){K=50;up();await say('Caes... pero recuerdas por qué empezaste. Te levantas con la mitad de tu fuerza.')}}
 A.sfx('win');spr.innerHTML='';sp('batalla-fin',22,6,52);document.querySelectorAll('.hp').forEach(e=>e.remove());await say('Has ganado.');
 await go('bg-dark',2,'dark');sp('guardian',4,2,26,'bob');await say('No buscaba detenerte. Solo quería saber si seguirías adelante.',32)}

const POKE={Gengar:['gengar','Travieso y misterioso. Se ríe de todo, hasta de sus propios chistes.'],Pikachu:['pikachu','Chispeante y leal. Siempre tiene energía para una aventura más.'],Charmander:['charmander','Pequeño pero valiente. Su llama nunca se apaga.']};
const comp=(x=4,y=3,w=14)=>G.pet&&sp(POKE[G.pet][0],x,y,w,'bob');
async function nivel3(){await go('#071a33',3,'harry');
 sp('luna',84,70,8);sp('nube',8,66,26);sp('nube',55,74,22);sp('pino',88,12,7);
 const f=document.createElement('div');f.style.cssText="position:absolute;left:0;right:0;bottom:0;height:13%;background:url(img/bg-stones.png) 0 0/20% 100% repeat-x;z-index:2";spr.append(f);
 const h=document.createElement('div');h.style.cssText="position:absolute;left:0;right:0;bottom:12%;height:5%;background:url(img/hierba.png) 0 0/20% 100% repeat-x;z-index:2";spr.append(h);
 sp('entrenador',3,10,16,'bob');
 const balls=[28,44,60].map((x,i)=>{const b=sp('pokeball',x,36,8,'bob');b.style.cssText+=`;cursor:pointer;z-index:3;animation-delay:${i*.3}s`;return b});
 await say('Un entrenador aparece. Todo entrenador necesita un compañero. ¿Cuál eliges? Toca una Poké Ball.');
 const b=await new Promise(r=>balls.forEach(x=>x.onclick=()=>r(x)));A.sfx('get');
 balls.forEach(x=>x!=b&&x.remove());b.remove();
 const fl=document.createElement('div');fl.style.cssText='position:absolute;inset:0;background:#fff;opacity:1;transition:opacity .7s;z-index:30';$('#fx').append(fl);requestAnimationFrame(()=>requestAnimationFrame(()=>fl.style.opacity=0));setTimeout(()=>fl.remove(),900);
 const ks=Object.keys(POKE),k=ks[Math.random()*ks.length|0];sp(POKE[k][0],38,16,24,'pop');
 await say(k+': '+POKE[k][1]);G.pet=k;add('🔴');
 await say('Buena elección. Aunque... los mejores compañeros no siempre caben en una Poké Ball.');nivel4()}

function hearts(x,y){for(let i=0;i<5;i++){const s=document.createElement('div');s.textContent='❤';s.style.cssText=`position:absolute;left:${x+Math.random()*8}%;top:${y}%;color:#f44;font-size:2.4cqw;animation:up 1.2s ${i*.12}s both`;$('#fx').append(s);setTimeout(()=>s.remove(),2000)}}
async function nivel4(){await go('bg-park',4,'harry');await say('Escuchas un ruido...');await say('Parece que viene detrás de los arbustos. Deberías revisar.');
 sp('arbusto',64,10,17);await ask(['Revisar los arbustos']);spr.innerHTML='';sp('arbusto-harry',62,8,20,'pop');A.sfx('get');await say('Parece que es un pequeño amigo del pasado.');
 for(let i=0;i<3;i++){await ask(['Acariciarlo'+(i<2?' ('+(3-i)+')':'')]);hearts(46,50);A.sfx('heal');if(i==0)await say('Harry quiere ayudarte.')}
 spr.innerHTML='';sp('kevin-harry',28,6,42,'pop wag');comp(4,4,12);await say('Harry mueve la cola. Encontró algo.');add('🗝️');await say('🗝 Llave de los recuerdos.');nivel5()}

async function nivel5(){await go('bg-casa',5,'harry');const w=sp('kevin-camina',54,3,30);comp(30,3,10);await say('Parece que tú y Harry han encontrado una casa. Necesitas una llave.');
 await ask(['usar la llave']);A.sfx('get');$('#fade').classList.add('on');await wait(300);await casa()}

const SONGS=[
['Eclipse Solar','Duki','29QWLM6tRe7Yp4dvNt02JC',`Tu alma tiene un pedazo de mi\nTu alma tiene un pedazo de mi\nComo llenaste este corazon vacío\nDiez mil recuerdos que ya nunca lo olvido\nSiento que lo puedo todo\nCuando estás conmigo\nVos le das sentido\nVos me das motivos`,'#d9a441'],
['Congratulations','Mac Miller','1OubIZ0ARYCUq5kceYUQiO',`This sun don't shine when I'm alone\nI lose my mind and I lose control\nI see your eyes look through my soul\nDon't be surprised this all I know\nI felt the highs and they felt like you\nSee, a love like mine is too good to be true\nAnd you too divine to just be mine\nYou remind me of the color blue\nGirl, I'm so in love with you, yeah\nGirl, I'm so in love with you`,'#3f7fd0'],
['Serotonina','Humbe','0cvNgL1H2mrGMxYZJmagUP',`Serotonina es lo que liberas en mí\nEl agua en mis ojitos cuando te sentí\nDespués de un tiempo, me dan ganas de seguir\nA diario encuentro mi razón para vivir\nCon solo verte sonreír así`,'#e0689a'],
['i think about you all the time','Deftones','0M5NH22uVXHSXjSi5SXTXM',`We sail\nInside of your warship\nYou sing your refrain, and I'm out of my mind\nAll of my life\nYou've been the same\nAll of our days\nAnd we'll never change`,'#6a4cb0'],
['My One and Only Love','Mon Laferte, Silvana Estrada, Natália Lafourcade','0ILCaNMr4s5CZdF1Km09Ln',`Tú eres lo que siempre yo soñé\nMy love, my one and only love\nThere's no reason\nNot to love you like I love you`,'#c0392b'],
['Baby Blue','Rocco','0Sc2BfHM8q8WIWlq9SeFcZ',`But when your lips press on mine\nThere's not much that'll change my mind\nIt's you that I'm looking for, all my life\nUnder the sheets, we'll intertwine\nI love you, my baby blue`,'#2aa7c9'],
['Souk Eye','Gorillaz','4fjzDf54eBNOlW45mNe14U',`I will always think about you\nThat's why I'm calling you back\nOn my way through\nI wanna stay with you for a long time`,'#4aa86a']];
function ov(html){const o=document.createElement('div');o.id='ov';o.innerHTML=html;st.append(o);return o}
function hot(x,y,w,h,t,fn,cls=''){const e=document.createElement('div');e.className='hot '+cls;e.style.cssText=`left:${x}%;top:${y}%;width:${w}%;height:${h}%`;e.onclick=()=>{A.sfx('ok');fn()};e.title=t;spr.append(e)}
async function casa(){await go('bg-room',5,'house');sp('cofre',38,26,20,'bob');sp('tocadiscos',6,23,13,'bob');
 await say('Aquí se guardan los recuerdos más valiosos.');await say('Toca los objetos para explorar. El tocadiscos parece funcionar...');
 let played=0;const T=async t=>{await say(t)};
 hot(34,22,28,40,'Chimenea',()=>T('La chimenea sigue encendida, como si alguien siempre te esperara.'));
 hot(72,12,22,70,'Libros',()=>T('Cada libro guarda un recuerdo. Algunos todavía se están escribiendo.'));
 hot(38,24,24,30,'Cofre',cofre,'big');
 hot(5,47,15,30,'Tocadiscos',async()=>{await discos();if(!played){played=1;await say('Alguien quiere decirte algo importante.');ch.innerHTML='';const i=await ask(['ver qué es','seguir mirando']);if(i==0)carta()}else{if(await ask(['ver la carta','seguir mirando'])==0)carta()}},'big')}
function cofre(){const r=[-6,5,-3,7,-8];const o=ov(`<div class="col">${[1,2,3,4,5].map((n,i)=>`<img src="img/foto${n}.jpg" style="transform:rotate(${r[i]}deg)">`).join('')}</div><button class="btn x">cerrar</button>`);A.sfx('get');o.querySelector('.x').onclick=()=>o.remove()}
function discos(){return new Promise(res=>{const o=ov(`<h2>Nuestra playlist</h2><div class="rack">${SONGS.map((s,i)=>`<div class="d" data-i="${i}"><div class="vin" style="--c:${s[4]}"></div><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div><div class="det" hidden></div><button class="btn x">cerrar</button>`);
 const det=o.querySelector('.det'),rack=o.querySelector('.rack');
 o.querySelectorAll('.d').forEach(d=>d.onclick=()=>{const s=SONGS[d.dataset.i];A.sfx('ok');A.duck(1);rack.hidden=1;det.hidden=0;
  det.innerHTML=`<div class="vin big spin" style="--c:${s[4]}"></div><div class="info"><h3>${s[0]}</h3><p class="ar">${s[1]}</p><pre>${s[3].replace(/</g,'&lt;')}</pre><iframe src="https://open.spotify.com/embed/track/${s[2]}" width="100%" height="152" frameborder="0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe><button class="btn back">← otros discos</button></div>`;
  det.querySelector('.back').onclick=()=>{det.innerHTML='';det.hidden=1;rack.hidden=0;A.duck(0)}});
 o.querySelector('.x').onclick=()=>{A.duck(0);o.remove();res()}})}

async function carta(){await go('radial-gradient(#3a2236,#120a16)',0,'letter');$('#lvl').textContent='';const T=`Querido Kevin:\nTe hice este juego con mucho amor, se que no es tan genial como los que juegas pero al menos espero que te la hayas pasado bien.\n\nGracias por cada risa, por cada abrazo, por hacer que incluso los días normales se sientan como una aventura. Espero que esta sea solo una de las muchas aventuras que viviremos.\nTe amo muchísimo. ❤️`;
 const s=document.createElement('div');s.id='env';s.className='pop';s.innerHTML='<img src="img/sello.png"><span>❤</span>';st.append(s);await say('Es una carta... para ti.');await ask(['abrir la carta']);A.sfx('get');s.remove();
 const L=document.createElement('div');L.id='letter';L.innerHTML=`<img class="fl" src="img/flores.png"><img class="se" src="img/sello.png"><pre></pre><button class="btn" hidden>continuar</button>`;st.append(L);
 const pre=L.querySelector('pre'),b=L.querySelector('button');let i=0;await new Promise(r=>{const iv=setInterval(()=>{pre.textContent=T.slice(0,++i);if(i>=T.length){clearInterval(iv);r()}},55);L.onclick=()=>{i=T.length-1}});
 b.hidden=0;await new Promise(r=>b.onclick=r);L.remove();creditos()}

async function creditos(){await go('bg-credits',0,'letter');$('#lvl').textContent='';
 [['guardian',2,16],['mago',13,15],['gengar',25,11],['pikachu',36,9],['charmander',45,11],['harry',56,10]].forEach(([n,x,w],i)=>sp(n,x,3,w,'bob'));sp('abrazo',72,2,24,'bob');
 const c=document.createElement('div');c.id='cred';c.innerHTML='<h2>Juego terminado</h2><p>créditos:</p><p>Directora: Lucero</p><p>Protagonista: Kevin</p><p>Compañero fiel: Harry</p><p>Inspiración: Nuestra historia</p><p class="th">Gracias por jugar. ❤️</p><button class="btn">jugar de nuevo</button>';st.append(c);c.querySelector('button').onclick=()=>location.reload()}
