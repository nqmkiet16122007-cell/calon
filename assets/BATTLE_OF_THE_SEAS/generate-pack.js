// Generates the editable, independent SVG assets used by the game.
const fs = require('node:fs');
const path = require('node:path');
const ROOT = path.join(__dirname, 'pack');
const files = [];
function save(rel, svg) {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, svg, 'utf8');
  files.push(rel.replaceAll('\\', '/'));
}
function svg(view, body, defs = '') {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${view}" fill="none">${defs}${body}</svg>`;
}
const palettes = {
  player: { body:'#36b7ec', shade:'#2389c9', light:'#9ae5f5', belly:'#d4f5f4', eye:'#103953' },
  blue: { body:'#35a9e8', shade:'#227fc1', light:'#8bdcf1', belly:'#c5eff0', eye:'#103953' },
  orange: { body:'#ff9a55', shade:'#e76d38', light:'#ffd08c', belly:'#fff0c5', eye:'#5b3040' },
  striped: { body:'#f7ca4c', shade:'#db9430', light:'#ffe998', belly:'#fff3ce', eye:'#493247' },
  purple: { body:'#ab8ae8', shade:'#795ab9', light:'#d7c5ff', belly:'#eee7ff', eye:'#372e5c' },
  predator: { body:'#ed6474', shade:'#bd405b', light:'#ff9aa0', belly:'#ffe0cf', eye:'#3e253d' },
  rare: { body:'#5ee1c1', shade:'#29ad9c', light:'#b4fff0', belly:'#e5fff1', eye:'#204856' },
  puffer: { body:'#fa9d91', shade:'#de6571', light:'#ffc0a7', belly:'#fff0db', eye:'#49334a' },
  shark: { body:'#3e90c9', shade:'#23669e', light:'#82c4e7', belly:'#d8eff1', eye:'#13344c' }
};
function fishSvg(kind, scale=1, frame=0, pose='swim') {
  const p=palettes[kind]||palettes.blue, angle=Math.sin(frame*Math.PI/4)*13, sway=Math.sin(frame*Math.PI/4)*2.4;
  const turn=pose==='turn'?-14:pose==='defeated'?82:0, flip=pose==='turn'?1:1;
  const shark=kind==='shark', puffer=kind==='puffer', attack=pose==='attack', hurt=pose==='hurt';
  const tail=`<g transform="rotate(${angle} 48 64)"><path d="M52 64 C37 48 21 46 9 48 C17 59 17 69 9 81 C27 82 41 77 52 64Z" fill="${p.shade}"/><path d="M35 63 Q23 57 14 52" stroke="${p.light}" stroke-width="2" opacity=".6"/></g>`;
  const fins=shark
    ? `<path d="M94 43 Q110 17 137 21 L128 46Z" fill="${p.shade}"/><path d="M120 83 Q140 106 159 94 L150 78Z" fill="${p.shade}"/><path d="M150 56 Q162 39 178 43 L165 61Z" fill="${p.shade}"/>`
    : `<path d="M91 42 Q111 22 134 34 L125 48Z" fill="${p.shade}"/><path d="M109 82 Q127 100 145 87 L132 75Z" fill="${p.shade}"/><path d="M138 59 Q151 48 164 54 L150 67Z" fill="${p.shade}"/>`;
  const bodyShape=shark
    ? 'M48 64 C67 43 111 34 163 43 Q202 47 231 64 Q205 80 165 86 C112 96 68 84 48 64Z'
    : puffer
      ? 'M51 64 C54 35 83 23 124 24 C168 24 198 40 207 64 C198 87 168 103 124 103 C83 103 54 90 51 64Z'
      : 'M48 64 C68 39 109 31 157 38 Q200 43 231 64 Q203 84 158 90 C110 98 67 87 48 64Z';
  let spikes='';
  if(puffer){const pts=[[76,34],[96,24],[119,20],[143,22],[164,29],[181,39],[190,52],[190,76],[180,89],[161,98],[137,104],[112,104],[90,98],[72,87],[61,75],[61,51]];spikes=pts.map(([x,y],i)=>{const cy=64,dx=x-cy,dy=y-cy,l=Math.hypot(dx,dy)||1,nx=dx/l,ny=dy/l;return `<path d="M${x-nx*4} ${y-ny*4} L${x+nx*9-ny*4} ${y+ny*9+nx*4} L${x+nx*9+ny*4} ${y+ny*9-nx*4}Z" fill="${i%2?p.shade:p.light}"/>`;}).join('');}
  const pattern=kind==='striped'?`<path d="M104 39 Q91 63 104 91 M134 36 Q121 64 134 94 M164 39 Q151 64 164 88" stroke="${p.shade}" stroke-width="8" opacity=".88"/>`:kind==='rare'?`<circle cx="107" cy="51" r="4" fill="${p.light}"/><circle cx="137" cy="44" r="3" fill="${p.light}"/><circle cx="156" cy="64" r="4" fill="${p.light}"/>`:'';
  const mouth=attack?`<path d="M211 64 Q230 60 237 66 Q228 76 211 75Z" fill="#873f62"/><path d="M215 64L220 70L225 63L230 69" fill="#fff4da"/>`:'';
  const expression=hurt?`<path d="M197 53L205 60M205 53L197 60" stroke="${p.eye}" stroke-width="2.5" stroke-linecap="round"/>`:`<circle cx="200" cy="55" r="4" fill="${p.eye}"/><circle cx="201" cy="54" r="1.2" fill="#fff"/>`;
  const gill=shark?`<path d="M170 53Q174 64 169 75M178 53Q182 64 177 74" stroke="${p.shade}" stroke-width="2" stroke-linecap="round"/>`:`<path d="M178 55Q182 64 177 73" stroke="${p.shade}" stroke-width="2" stroke-linecap="round"/>`;
  const defs=`<defs><linearGradient id="body" x1="0" y1="0" x2="0" y2="1"><stop stop-color="${p.light}"/><stop offset=".46" stop-color="${p.body}"/><stop offset="1" stop-color="${p.shade}"/></linearGradient></defs>`;
  return svg('0 0 256 128',`<g transform="translate(128 64) rotate(${turn}) scale(${scale*flip} ${scale}) translate(-128 -64)" opacity="${hurt?.78:1}">${tail}${fins}${spikes}<path d="${bodyShape}" fill="url(#body)" stroke="#0d405a" stroke-width="1.6" stroke-linejoin="round"/><path d="M59 70 C96 83 158 89 213 67 Q197 91 158 96 C111 99 77 89 59 70Z" fill="${p.belly}"/><path d="M86 42 Q103 34 118 37" stroke="${p.light}" stroke-width="3" stroke-linecap="round" opacity=".65"/>${pattern}<path d="M134 62 Q145 ${61+sway} 156 66 Q146 72 134 68Z" fill="${p.shade}" opacity=".8"/>${gill}${expression}${mouth}</g>`,defs);
}

// Player growth: all ten levels share one canvas and pivot, but body, fins and tail scale together.
for(let level=1;level<=10;level++){
  const scale=.40+(level-1)*.0667;
  for(let frame=0;frame<8;frame++)save(`PLAYER/level-${String(level).padStart(2,'0')}/swim-${String(frame).padStart(2,'0')}.svg`,fishSvg('player',scale,frame));
  save(`PLAYER/level-${String(level).padStart(2,'0')}/idle.svg`,fishSvg('player',scale,0,'idle'));
  save(`PLAYER/level-${String(level).padStart(2,'0')}/level-up.svg`,fishSvg('player',scale,2,'idle'));
}

// Six species, each in three visibly different size tiers and an eight-frame swim loop.
const species=[['blue','blue'],['orange','orange'],['yellow-striped','striped'],['purple','purple'],['red-predator','predator'],['puffer','puffer']];
const sizes=[['small',.44],['medium',.69],['large',.94]];
for(const [name,kind] of species)for(const [size,scale] of sizes){
  for(let frame=0;frame<8;frame++)save(`ENEMIES/${name}/${size}/swim-${String(frame).padStart(2,'0')}.svg`,fishSvg(kind,scale,frame));
  save(`ENEMIES/${name}/${size}/idle.svg`,fishSvg(kind,scale,0,'idle'));
}

// Sharks have a consistent pivot across idle, swim, turn, attack, hurt and defeated states.
for(const [size,scale] of sizes){
  const base=`ENEMIES/shark/${size}`;
  save(`${base}/idle.svg`,fishSvg('shark',scale,0,'idle'));
  for(let frame=0;frame<8;frame++)save(`${base}/swim-${String(frame).padStart(2,'0')}.svg`,fishSvg('shark',scale,frame));
  for(const pose of ['turn','attack','hurt','defeated'])save(`${base}/${pose}.svg`,fishSvg('shark',scale,pose==='turn'?3:0,pose));
}

// XP bar states are separate assets for engine/timeline use; game UI uses the same fractions smoothly.
function xpBar(progress){const defs='<defs><linearGradient id="xp" x2="0" y2="1"><stop stop-color="#8ff8ee"/><stop offset="1" stop-color="#21b9d5"/></linearGradient></defs>';const fill=progress?`<rect x="8" y="8" width="${Math.round(944*progress)}" height="48" rx="24" fill="url(#xp)"/><circle cx="${8+Math.round(944*progress)}" cy="32" r="${progress===1?10:6}" fill="#d5fff7" opacity=".9"/>`:'';return svg('0 0 960 64',`<rect x="2" y="2" width="956" height="60" rx="30" fill="#092e43" stroke="#287991" stroke-width="4"/><rect x="8" y="8" width="944" height="48" rx="24" fill="#0b3c52"/>${fill}`,defs);}
for(let i=0;i<=10;i++)save(`HUD/xp-bar/xp-${String(i*10).padStart(3,'0')}.svg`,xpBar(i/10));
function heart(state){const defs='<linearGradient id="h" x2="0" y2="1"><stop stop-color="#ff91ae"/><stop offset="1" stop-color="#ee547d"/></linearGradient>';let heartPath='M32 55 C24 48 7 36 7 22 C7 9 24 5 32 17 C40 5 57 9 57 22 C57 36 40 48 32 55Z';if(state==='empty')return svg('0 0 64 64',`<path d="${heartPath}" fill="#173d51" stroke="#6d9bab" stroke-width="3"/>`);if(state==='half')return svg('0 0 64 64',`<path d="${heartPath}" fill="#173d51" stroke="#6d9bab" stroke-width="3"/><path d="M32 17 C40 5 57 9 57 22 C57 36 40 48 32 55Z" fill="url(#h)"/>`,defs);return svg('0 0 64 64',`<path d="${heartPath}" fill="url(#h)" stroke="#ffd0dc" stroke-width="2"/><path d="M18 21Q20 14 27 16" stroke="#fff" stroke-width="3" stroke-linecap="round" opacity=".8"/>`,defs);}
for(const state of ['full','half','empty'])save(`HUD/hearts/heart-${state}.svg`,heart(state));
function boost(type,state='pickup',frame=0){const glow=state==='active'?'<circle cx="32" cy="32" r="29" fill="#71e8dc" opacity=".12"/>':'';let icon='';if(type==='shield')icon='<path d="M32 7L52 15V29C52 43 43 52 32 57C21 52 12 43 12 29V15Z" fill="#47baf1" stroke="#c3f7ff" stroke-width="3"/><path d="M32 14V49" stroke="#e9ffff" stroke-width="2" opacity=".7"/>';if(type==='speed')icon=`<path d="M9 20H42L31 11M9 32H54M9 44H42L31 53" stroke="#69edc5" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>`;if(type==='magnet')icon='<path d="M15 12V34C15 57 49 57 49 34V12" stroke="#ff6d8a" stroke-width="10" stroke-linecap="round"/><path d="M15 12V23M49 12V23" stroke="#f7ffff" stroke-width="8"/>';const bob=Math.sin(frame*Math.PI/4)*1.5;return svg('0 0 64 64',`${glow}<g transform="translate(0 ${bob})">${icon}</g>`);}
for(const type of ['shield','speed','magnet']){save(`HUD/boosts/${type}-pickup.svg`,boost(type,'pickup'));save(`HUD/boosts/${type}-active.svg`,boost(type,'active'));for(let frame=0;frame<8;frame++)save(`HUD/boosts/${type}-frame-${frame}.svg`,boost(type,'pickup',frame));}

// Trash frames share a 96x96 pivot and drift by gentle position/rotation changes.
function trashSvg(type,frame){const a=Math.sin(frame*Math.PI/4)*7,y=Math.sin(frame*Math.PI/4)*2.5+(type==='paper'?frame*.3:0);let item='';switch(type){
case 'bottle':item='<path d="M42 13H54V25L61 34V72Q61 81 52 82H40Q31 81 31 72V34L38 25V13Z" fill="#67c7d5" stroke="#1c6074" stroke-width="3"/><path d="M42 13H54V24H42Z" fill="#f0a857"/><path d="M35 47H58V61H35Z" fill="#c5f1dc" opacity=".7"/>';break;
case 'can':item='<path d="M31 20Q48 13 65 20V73Q48 81 31 73Z" fill="#df7783" stroke="#744b62" stroke-width="3"/><ellipse cx="48" cy="21" rx="17" ry="5" fill="#e9d9bc"/><ellipse cx="48" cy="72" rx="17" ry="5" fill="#ba5d70"/><path d="M36 38H60" stroke="#f5d5ac" stroke-width="5"/>';break;
case 'bag':item='<path d="M29 32Q29 18 39 22Q44 24 46 33Q51 19 60 23Q67 26 62 36L73 70Q73 77 66 77H29Q22 77 24 69Z" fill="#5eadd0" stroke="#215d79" stroke-width="3" opacity=".86"/><path d="M31 44Q47 51 65 43" stroke="#b9eff0" stroke-width="3" opacity=".7"/>';break;
case 'wrapper':item='<path d="M22 33L29 27L37 31L45 26L54 31L66 28L71 38L67 48L73 58L65 67L54 64L45 70L36 64L26 68L21 57L26 47Z" fill="#f08768" stroke="#9e4d5d" stroke-width="3"/><path d="M30 45Q46 38 62 49M33 55Q48 50 64 56" stroke="#ffe2aa" stroke-width="3"/> ';break;
case 'container':item='<path d="M26 34H70V70Q70 77 63 77H33Q26 77 26 70Z" fill="#90b7c4" stroke="#496f81" stroke-width="3"/><path d="M23 30H73V39H23Z" fill="#d0e1d9" stroke="#496f81" stroke-width="3"/><path d="M34 49H62" stroke="#6a98a5" stroke-width="3"/>';break;
case 'paper':item='<path d="M28 20L65 25L69 68L32 73L25 38Z" fill="#d9dfd2" stroke="#657d81" stroke-width="3"/><path d="M34 37L59 40M33 47L61 50M35 57L55 59" stroke="#94aeb0" stroke-width="3" stroke-linecap="round"/>';break;
case 'cap':item='<path d="M28 48Q28 29 48 28Q68 29 68 48V59H28Z" fill="#4d9fc7" stroke="#275c78" stroke-width="3"/><path d="M33 51H63M34 57H62" stroke="#b8e5e1" stroke-width="2"/>';break;
case 'ring':item='<circle cx="48" cy="48" r="23" stroke="#5cb8c8" stroke-width="11"/><path d="M32 32L40 37M58 59L65 64" stroke="#d5f0da" stroke-width="3"/>';break;
case 'fragment':item='<path d="M25 45L34 27L48 36L60 24L70 43L63 57L68 70L49 65L39 73L33 58Z" fill="#6bb8cf" stroke="#356d87" stroke-width="3"/><path d="M35 42L55 53" stroke="#d6f2dd" stroke-width="3"/>';break;
case 'net':item='<path d="M25 27L69 25L73 66L29 71Z" stroke="#398f90" stroke-width="3"/><path d="M25 27L73 66M69 25L29 71M25 45L71 45M47 26L48 69M25 59L73 34" stroke="#79c7b3" stroke-width="2"/>';break;
case 'plastic':item='<path d="M30 39L43 29L54 35L66 30L72 44L64 56L69 68L49 74L35 64L25 56Z" fill="#78c8d8" stroke="#397790" stroke-width="3" opacity=".85"/><path d="M38 42L57 57" stroke="#d7f2d7" stroke-width="3"/>';break;
}return svg('0 0 96 96',`<g transform="translate(0 ${y}) rotate(${a} 48 48)">${item}</g>`);}
const trash=['bottle','can','bag','wrapper','container','paper','cap','ring','fragment','net'];
for(const type of trash)for(let frame=0;frame<8;frame++)save(`ENVIRONMENT/trash/${type}/frame-${String(frame).padStart(2,'0')}.svg`,trashSvg(type,frame));

// Backgrounds are independent layers; props below can be placed and animated separately.
function background(depth){const top=depth==='shallow'?'#0a5063':depth==='mid'?'#083d55':'#081e3a';const mid=depth==='shallow'?'#0a4053':depth==='mid'?'#092f48':'#071b32';const sand=depth==='deep'?'#52616a':'#d3c58a';const defs=`<defs><linearGradient id="water" x2="0" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${mid}"/></linearGradient></defs>`;let rays='';for(let i=0;i<9;i++){const x=145+i*145;rays+=`<path d="M${x} 0L${x-95} 360L${x+95} 360Z" fill="#63d6df" opacity="${depth==='deep'?.025:.07}"/>`;}return svg('0 0 1280 720',`<rect width="1280" height="720" fill="url(#water)"/>${rays}<path d="M0 485Q180 440 350 487T700 474T1040 480T1280 456V620H0Z" fill="#0b2d3e" opacity=".62"/><path d="M0 620Q160 585 330 620T680 610T1000 620T1280 598V720H0Z" fill="${sand}"/><path d="M0 620Q160 585 330 620T680 610T1000 620T1280 598" stroke="#f0dc9e" stroke-width="9" fill="none"/><g fill="#bde9df" opacity=".35">${Array.from({length:34},(_,i)=>`<circle cx="${(i*113+47)%1280}" cy="${(i*79+53)%560}" r="${i%4===0?3:1.5}"/>`).join('')}</g>`,defs);}
for(const depth of ['shallow','mid','deep'])save(`ENVIRONMENT/background/${depth}.svg`,background(depth));
function prop(name){
  const spokes=Array.from({length:8},(_,i)=>`<path d="M64 18V47M64 81V110M18 64H47M81 64H110" stroke="#b78655" stroke-width="6" transform="rotate(${i*45} 64 64)"/>`).join('');
  const parts={
    rock:'<path d="M8 78L15 47L34 29L49 9L70 22L89 17L116 42L123 78Z" fill="#286582" stroke="#123d57" stroke-width="4"/><path d="M18 49L39 36L51 15L69 28L87 24L108 46" stroke="#64b1c4" stroke-width="4" opacity=".7"/>',
    coral:'<path d="M64 99V57M64 73L38 48V27M64 65L87 41V18M43 54L26 55V39M85 47L104 47V30" stroke="#f27fa4" stroke-width="12" stroke-linecap="round"/><circle cx="26" cy="36" r="8" fill="#f59ab1"/><circle cx="104" cy="27" r="8" fill="#f59ab1"/>',
    seaweed:'<path d="M30 110Q6 75 28 20M55 110Q77 70 50 5M79 110Q103 76 91 31" stroke="#39a77e" stroke-width="12" stroke-linecap="round"/><path d="M28 35L36 25M52 24L61 12M90 49L99 39" stroke="#8fe1a3" stroke-width="4"/>',
    ruin:'<path d="M20 105V34Q20 12 48 12H79Q106 12 106 37V105M20 42H106M14 105H112" stroke="#71969b" stroke-width="15"/><path d="M27 39Q27 20 48 20H78Q99 20 99 39" stroke="#a9c4ae" stroke-width="4" fill="none"/>',
    anchor:'<path d="M64 16V82M40 42H88M42 81Q18 81 20 54M86 81Q110 81 108 54M51 19A13 13 0 1 1 77 19A13 13 0 1 1 51 19Z" stroke="#ba8b58" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>',
    wheel:`<circle cx="64" cy="64" r="38" stroke="#b78655" stroke-width="7"/><circle cx="64" cy="64" r="9" fill="#daae71"/>${spokes}`,
    shell:'<path d="M20 80Q21 30 64 18Q107 30 108 80Z" fill="#edb7a0" stroke="#a97883" stroke-width="4"/><path d="M64 21V79M44 29L52 79M84 29L76 79M29 47L44 79M99 47L84 79" stroke="#f7d2b5" stroke-width="4"/>',
    treasure:'<path d="M18 48H110V93H18Z" fill="#b87546" stroke="#704853" stroke-width="5"/><path d="M13 45Q64 7 115 45Z" fill="#e2a74e" stroke="#704853" stroke-width="5"/><path d="M54 49H74V65H54Z" fill="#f5d17b"/>',
    timber:'<path d="M13 82L101 27L114 44L26 99Z" fill="#a96c47" stroke="#633f49" stroke-width="5"/><path d="M22 78L103 29" stroke="#e0aa6c" stroke-width="4"/>',
    rockArch:'<path d="M12 105V58Q12 12 64 12Q116 12 116 58V105H91V59Q91 34 64 34Q37 34 37 59V105Z" fill="#2d6680" stroke="#17475e" stroke-width="4"/>'
  };
  return svg('0 0 128 128',parts[name]||parts.rock);
}
for(const name of ['rock','coral','seaweed','ruin','anchor','wheel','shell','treasure','timber','rockArch'])save(`ENVIRONMENT/props/${name}.svg`,prop(name));
for(let frame=0;frame<8;frame++){const angle=Math.sin(frame*Math.PI/4)*8;save(`ENVIRONMENT/seaweed/sway-${frame}.svg`,svg('0 0 128 128',`<g transform="rotate(${angle} 64 118)">${prop('seaweed').replace(/^<svg[^>]*>|<\/svg>$/g,'')}</g>`));save(`ENVIRONMENT/bubbles/frame-${frame}.svg`,svg('0 0 64 64',`<circle cx="32" cy="32" r="${8+frame%3*2}" fill="#8be6ed" opacity=".12"/><circle cx="32" cy="32" r="${8+frame%3*2}" stroke="#a9eff2" stroke-width="2" opacity=".78"/><path d="M27 28Q29 24 33 25" stroke="#e6ffff" stroke-width="2" stroke-linecap="round"/>`));}

const effects=['xp-bubble','level-up-glow','water-ripple','pickup-sparkle','damage','shield-activation','speed-trail','magnet-particles'];
function effectSvg(type,frame){const t=frame/7,opacity=.3+.7*Math.sin(t*Math.PI);if(type==='water-ripple')return svg('0 0 128 64',`<ellipse cx="64" cy="35" rx="${12+frame*5}" ry="${4+frame*.5}" stroke="#76e2ec" stroke-width="3" opacity="${opacity}"/>`);if(type==='level-up-glow'||type==='shield-activation')return svg('0 0 128 128',`<circle cx="64" cy="64" r="${25+frame*5}" stroke="${type==='level-up-glow'?'#87f4df':'#71cafa'}" stroke-width="${3-frame*.2}" opacity="${opacity}"/><circle cx="64" cy="64" r="${14+frame*3}" fill="#83e7e5" opacity="${opacity*.1}"/>`);if(type==='damage')return svg('0 0 96 96',`<path d="M48 8L55 31L75 17L66 39L90 43L67 52L82 72L58 63L51 89L43 64L20 80L30 56L7 47L32 41L18 20L40 33Z" fill="#ff91a1" opacity="${opacity}"/>`);if(type==='speed-trail')return svg('0 0 128 64',`<path d="M7 17H76M17 32H112M7 47H81" stroke="#68ecc5" stroke-width="${2+frame%3}" stroke-linecap="round" opacity="${opacity}"/>`);if(type==='magnet-particles')return svg('0 0 96 96',Array.from({length:5},(_,i)=>`<circle cx="${18+i*14}" cy="${25+(i*13+frame*3)%52}" r="3" fill="#e98bff" opacity="${opacity}"/>`).join(''));if(type==='pickup-sparkle')return svg('0 0 96 96',`<path d="M48 8L54 39L84 48L54 56L48 88L41 56L12 48L41 39Z" fill="#fff0a4" opacity="${opacity}"/>`);return svg('0 0 64 64',`<circle cx="32" cy="${50-frame*4}" r="${4+frame%3}" fill="#a8f2ed" opacity="${opacity}"/>`);}
for(const type of effects)for(let frame=0;frame<8;frame++)save(`EFFECTS/${type}/frame-${String(frame).padStart(2,'0')}.svg`,effectSvg(type,frame));

const manifest={name:'BATTLE OF THE SEAS 2D Asset Pack',format:'SVG',style:'flat vector cartoon, dark teal and cyan underwater palette',canvas:{fish:[256,128],hud:[960,64],trash:[96,96],props:[128,128]},animations:{player:{frames:8,fps:8,pivot:[128,64],loop:true},enemyFish:{frames:8,fps:8,pivot:[128,64],loop:true},shark:{frames:8,fps:9,pivot:[128,64],loop:true,states:['idle','turn','attack','hurt','defeated']},trash:{frames:8,fps:5,pivot:[48,48],loop:true},bubbles:{frames:8,fps:7,pivot:[32,32],loop:true},seaweed:{frames:8,fps:5,pivot:[64,118],loop:true},effects:{frames:8,fps:12,pivot:'center',loop:false}},folders:['PLAYER','ENEMIES','HUD','ENVIRONMENT','EFFECTS']};
fs.mkdirSync(ROOT,{recursive:true});fs.writeFileSync(path.join(ROOT,'manifest.json'),JSON.stringify(manifest,null,2));
const readme=`# BATTLE OF THE SEAS — 2D asset pack\n\nIndependent, animation-ready SVG assets for a calm underwater arcade survival game. Every animated family uses a stable viewBox and pivot.\n\n## Contents\n\n- PLAYER: 10 visibly growing levels, 8 swim frames and idle/level-up states per level.\n- ENEMIES: six fish species in small/medium/large variants, with 8-frame swim loops.\n- SHARK: small, medium and large versions with idle, swim, turn, attack, hurt and defeated states.\n- HUD: 11 XP fill states (0-100%), full/half/empty heart icons, and pickup/active/8-frame states for shield, speed and magnet.\n- ENVIRONMENT: shallow/mid/deep backgrounds, 10 trash types with 8 float/sink frames, modular rocks, coral, seaweed, ruins, ship props, shells and treasure.\n- EFFECTS: 8-frame XP, level-up, ripple, pickup, damage, shield, speed and magnet effects.\n\n## Audio direction\n\nAmbient loop: 58-68 BPM, soft synth pad, gentle piano or marimba plucks, very quiet bubbles and distant water movement. Avoid percussion, dramatic hits and sharp high-frequency sounds.\n\nAll game art is vector SVG with no text embedded. See ` + '`manifest.json`' + ` for animation timing and pivots. The PNG production sheet one directory above is a visual overview; individual assets live here.\n`;
fs.writeFileSync(path.join(ROOT,'README.md'),readme,'utf8');
console.log(`Generated ${files.length} SVG assets in ${ROOT}`);
