(() => {
  const root = 'kenney_fish-pack_2/PNG/Default/';
  const names = ['fish_blue','fish_brown','fish_green','fish_grey','fish_grey_long_a','fish_grey_long_b','fish_orange','fish_pink','fish_red','fish_blue_skeleton','fish_green_skeleton','fish_orange_skeleton','fish_pink_skeleton','fish_red_skeleton','bubble_a','bubble_b','bubble_c','rock_a','rock_b','background_rock_a','background_rock_b','background_seaweed_a','background_seaweed_b','background_seaweed_c','background_seaweed_d','background_seaweed_e','background_seaweed_f','background_seaweed_g','background_seaweed_h','seaweed_grass_a','seaweed_grass_b','seaweed_green_a','seaweed_green_b','seaweed_green_c','seaweed_green_d','seaweed_orange_a','seaweed_pink_a','terrain_sand_top_a','terrain_sand_top_b','terrain_sand_top_c','terrain_sand_a','terrain_sand_b','terrain_sand_c'];
  const images = {};
  for (const n of names) { const img = new Image(); img.src = root + n + '.png'; img.onerror = () => console.warn('Asset unavailable:', img.src); images[n] = img; }
  const pack='assets/BATTLE_OF_THE_SEAS/pack/';
  const add=(key,path)=>{const img=new Image();img.src=pack+path;img.onerror=()=>console.warn('Asset unavailable:',img.src);images[key]=img;};
  const frame=n=>String(n).padStart(2,'0');
  for(let level=1;level<=10;level++){const folder=`PLAYER/level-${frame(level)}`;for(let f=0;f<8;f++)add(`player_l${level}_f${f}`,`${folder}/swim-${frame(f)}.svg`);add(`player_l${level}_idle`,`${folder}/idle.svg`);add(`player_l${level}_grow`,`${folder}/level-up.svg`);}
  const species=['blue','orange','yellow-striped','purple','red-predator','puffer'],tiers=['small','medium','large'];
  for(const s of species)for(const z of tiers){const d=`ENEMIES/${s}/${z}`;for(let f=0;f<8;f++)add(`enemy_${s}_${z}_${f}`,`${d}/swim-${frame(f)}.svg`);add(`enemy_${s}_${z}_idle`,`${d}/idle.svg`);}
  for(const z of tiers){const d=`ENEMIES/shark/${z}`;for(let f=0;f<8;f++)add(`shark_${z}_${f}`,`${d}/swim-${frame(f)}.svg`);for(const a of ['idle','turn','attack','hurt','defeated'])add(`shark_${z}_${a}`,`${d}/${a}.svg`);}
  for(const state of ['full','half','empty'])add(`heart_${state}`,`HUD/hearts/heart-${state}.svg`);
  for(const type of ['shield','speed','magnet'])for(const state of ['pickup','active'])add(`boost_${type}_${state}`,`HUD/boosts/${type}-${state}.svg`);
  for(const depth of ['shallow','mid','deep'])add(`bg_${depth}`,`ENVIRONMENT/background/${depth}.svg`);
  for(const prop of ['anchor','coral','rock','rockArch','ruin','seaweed','shell','timber','treasure','wheel'])add(`prop_${prop}`,`ENVIRONMENT/props/${prop}.svg`);
  for(let f=0;f<8;f++){add(`seaweed_${f}`,`ENVIRONMENT/seaweed/sway-${f}.svg`);add(`ambient_bubble_${f}`,`ENVIRONMENT/bubbles/frame-${f}.svg`);}
  for(const item of ['bottle','can','bag','wrapper','container','paper','cap','ring','fragment','net'])for(let f=0;f<8;f++)add(`trash_${item}_${f}`,`ENVIRONMENT/trash/${item}/frame-${frame(f)}.svg`);
  for(const e of ['xp-bubble','level-up-glow','water-ripple','pickup-sparkle','damage','shield-activation','speed-trail','magnet-particles'])for(let f=0;f<8;f++)add(`fx_${e}_${f}`,`EFFECTS/${e}/frame-${frame(f)}.svg`);
  for(let n=0;n<=10;n++)add(`xp_${n*10}`,`HUD/xp-bar/xp-${String(n*10).padStart(3,'0')}.svg`);
  window.DC = { W:1280,H:720,ASSET:root,PACK:pack,images,fish:['fish_blue','fish_green','fish_orange','fish_pink','fish_red','fish_brown','fish_grey','fish_grey_long_a','fish_grey_long_b'],smallFish:['fish_blue','fish_green','fish_orange','fish_pink'],predatorFish:['fish_red','fish_grey_long_a','fish_grey_long_b'],seaweed:['seaweed_green_a','seaweed_green_b','seaweed_green_c','seaweed_green_d','seaweed_grass_a','seaweed_grass_b'],rand:(a,b)=>a+Math.random()*(b-a),clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),lerp:(v,w,t)=>v+(w-v)*t };
})();
