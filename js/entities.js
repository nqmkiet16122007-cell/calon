(() => {
  const {W,H,images,rand,clamp}=DC;
  class Player {
    constructor(){this.x=W*.5;this.y=H*.5;this.vx=0;this.vy=0;this.level=1;this.xp=0;this.size=1;this.visualLevel=1;this.radius=17;this.hp=3;this.inv=0;this.facing=1;this.boost=0;this.shield=0;this.magnet=0;this.wobble=0;}
    get visualWidth(){return 140*(.4+(DC.clamp(this.visualLevel,1,10)-1)*.0667);}
    update(dt,keys,game){let x=(keys.right?1:0)-(keys.left?1:0),y=(keys.down?1:0)-(keys.up?1:0);if(x||y){let l=Math.hypot(x,y);x/=l;y/=l;this.wobble+=dt*8;game.moved=true;}const a=760;this.vx+=x*a*dt;this.vy+=y*a*dt;let damp=Math.pow(x||y?0.985:0.88,dt*60);this.vx*=damp;this.vy*=damp;let max=(250+Math.min(this.level*3,70))*(this.boost>0?1.45:1);let s=Math.hypot(this.vx,this.vy);if(s>max){this.vx*=max/s;this.vy*=max/s;}this.x=clamp(this.x+this.vx*dt,30,W-30);this.y=clamp(this.y+this.vy*dt,44,H-48);if(Math.abs(this.vx)>5)this.facing=this.vx>0?1:-1;this.size=DC.lerp(this.size,Math.min(2.5,1+(this.level-1)*(1.5/9)),Math.min(1,dt*2.4));this.visualLevel=DC.lerp(this.visualLevel,Math.min(10,this.level),Math.min(1,dt*3.4));this.inv=Math.max(0,this.inv-dt);this.boost=Math.max(0,this.boost-dt);this.shield=Math.max(0,this.shield-dt);this.magnet=Math.max(0,this.magnet-dt);this.radius=this.visualWidth*.24;}
    draw(ctx,t){const lv=DC.clamp(this.visualLevel,1,10),low=Math.floor(lv),high=Math.min(10,low+1),blend=lv-low,frame=Math.floor(t*10)%8,tilt=this.facing*Math.atan2(this.vy,Math.max(1,Math.abs(this.vx)));ctx.save();ctx.translate(this.x,this.y+Math.sin(t*3.5)*1.2);ctx.rotate(tilt);ctx.scale(this.facing,1);if(this.inv>0&&Math.floor(this.inv*15)%2===0)ctx.globalAlpha=.38;const a=images[`player_l${low}_f${frame}`],b=images[`player_l${high}_f${frame}`];if(a?.complete&&a.naturalWidth){ctx.globalAlpha*=1-blend;ctx.drawImage(a,-70,-35,140,70);}if(b?.complete&&b.naturalWidth&&high!==low){ctx.globalAlpha=(this.inv>0&&Math.floor(this.inv*15)%2===0?.38:1)*blend;ctx.drawImage(b,-70,-35,140,70);}if(this.shield>0){ctx.globalAlpha=.72;ctx.strokeStyle='#a6eddd99';ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,Math.max(31,this.radius+11),0,7);ctx.stroke();}ctx.restore();}
  }
  class Fish {
    constructor(game){this.spawn(game);}
    get visualWidth(){const artScale=this.assetSize==='small'?.44:this.assetSize==='medium'?.69:.94;return 90*artScale*this.size*(this.puffer?1+this.puff*.2:1);}
    spawn(game){
      const elapsed=game.time,r=Math.random();
      this.tier=r<(elapsed<30?.67:elapsed<60?.48:.34)?1:r<(elapsed<30?.91:elapsed<60?.82:.73)?2:r<(elapsed<30?.985:elapsed<60?.96:.94)?3:4;
      const alreadyHunting=game.fish?.some(f=>f.alive&&f.hunter);
      if(this.tier===4&&(elapsed<24||alreadyHunting))this.tier=3;
      this.size=this.tier===1?rand(.35,.69):this.tier===2?rand(.72,1.08):this.tier===3?rand(1.12,1.48):rand(1.5,1.85);
      if(this.tier>1&&Math.random()<.24)this.size*=.78;
      this.baseSize=this.size;this.score=[0,10,24,50,90][this.tier];this.xp=[0,10,18,28,38][this.tier];
      this.hunter=this.tier===4||(this.tier===3&&elapsed>20&&!alreadyHunting&&Math.random()<.12);
      this.puffer=this.tier===4&&Math.random()<.46;
      this.species=this.puffer?'puffer':this.tier===4?'shark':this.hunter?'red-predator':this.tier===1?['blue','orange','purple'][Math.floor(Math.random()*3)]:this.tier===2?['blue','orange','yellow-striped','purple'][Math.floor(Math.random()*4)]:['yellow-striped','red-predator'][Math.floor(Math.random()*2)];this.assetSize=this.tier===1?'small':this.tier===2?'medium':'large';
      const edge=Math.floor(Math.random()*2),margin=55,waterTop=105,waterBottom=H-145;
      const entryAngle=edge===0?0:Math.PI;
      this.x=edge===0?-margin:W+margin;this.y=rand(waterTop,waterBottom);
      this.speed=rand(54,82)+Math.min(elapsed*.32,52)+(this.tier===1?8:this.tier===3?5:this.tier===4?12:0);
      this.heading=entryAngle+rand(-.16,.16);this.targetHeading=this.heading;this.vx=Math.cos(this.heading)*this.speed;this.vy=Math.sin(this.heading)*this.speed;
      const kinds=this.tier===1?['fish_orange','fish_pink','fish_green','fish_blue']:this.tier===2?['fish_green','fish_red','fish_blue','fish_brown']:this.tier===3?['fish_brown','fish_red','fish_grey']:this.puffer?['fish_brown']:['fish_grey_long_a','fish_grey_long_b','fish_red'];
      this.sprite=kinds[Math.floor(Math.random()*kinds.length)];this.facing=this.vx>=0?1:-1;this.phase=rand(0,Math.PI*2);this.turnTimer=rand(.6,1.8);this.life=0;this.schoolKey=this.tier<=2?'school':'solo';this.alive=true;this.scale=0;this.worth=this.tier;
      this.huntState='cruise';this.huntCooldown=rand(2.5,5);this.huntTimer=0;this.huntTargetX=0;this.huntTargetY=0;this.puff=0;
    }
    update(dt,game){
      this.scale=Math.min(1,this.scale+dt*2.5);this.life+=dt;this.turnTimer-=dt;
      const p=game.player,px=p.x-this.x,py=p.y-this.y,playerDistance=Math.hypot(px,py)||1;
      let sx=Math.cos(this.targetHeading),sy=Math.sin(this.targetHeading);
      if(this.turnTimer<=0){this.turnTimer=rand(1.2,3.2);this.targetHeading=this.heading+rand(-.55,.55);}

      // Small and mid-size fish keep loose shoals: align gently, stay near neighbors,
      // and leave a little space so the group never turns into one clump.
      if(this.tier<=2&&game.fish){let count=0,cx=0,cy=0,ax=0,ay=0,rx=0,ry=0;
        for(const other of game.fish){if(other===this||!other.alive||other.tier>2)continue;const dx=other.x-this.x,dy=other.y-this.y,d2=dx*dx+dy*dy;if(d2>135*135||d2<1)continue;count++;cx+=other.x;cy+=other.y;ax+=Math.cos(other.heading);ay+=Math.sin(other.heading);if(d2<48*48){rx-=dx/d2;ry-=dy/d2;}}
        if(count){sx+=((cx/count-this.x)*.0028+ax/count*.48+rx*260);sy+=((cy/count-this.y)*.0028+ay/count*.48+ry*260);}
      }

      // Smaller fish dart away from the player; larger prey keeps its distance too.
      const fleeRadius=this.tier===1?190:this.tier===2?145:this.tier===3&&!this.hunter?112:0;
      if(fleeRadius&&playerDistance<fleeRadius){const strength=(1-playerDistance/fleeRadius)*(this.tier===1?2.3:1.8);sx-=px/playerDistance*strength;sy-=py/playerDistance*strength;}
      // A hunter locks on for one short chase, then breaks off to patrol again.
      this.huntCooldown=Math.max(0,this.huntCooldown-dt);
      if(this.hunter&&this.huntState==='cruise'&&playerDistance<(this.puffer?340:460)&&this.huntCooldown===0){
        this.huntState=this.puffer?'warning':'chase';this.huntTimer=this.puffer?0.85:3.2;
        this.huntTargetX=p.x+(p.vx||0)*.35;this.huntTargetY=p.y+(p.vy||0)*.35;
      }
      if(this.hunter&&this.huntState==='warning'){
        this.huntTimer-=dt;this.puff=DC.lerp(this.puff,1,dt*3.5);
        this.huntTargetX=p.x+(p.vx||0)*.35;this.huntTargetY=p.y+(p.vy||0)*.35;
        sx+=(this.huntTargetX-this.x)*.004;sy+=(this.huntTargetY-this.y)*.004;
        if(this.huntTimer<=0){this.huntState='charge';this.huntTimer=.7;this.huntTargetX=p.x+(p.vx||0)*.5;this.huntTargetY=p.y+(p.vy||0)*.5;}
      }else if(this.hunter&&this.huntState==='charge'){
        this.huntTimer-=dt;this.puff=DC.lerp(this.puff,.55,dt*4);
        const dx=this.huntTargetX-this.x,dy=this.huntTargetY-this.y,d=Math.hypot(dx,dy)||1;sx+=dx/d*2.8;sy+=dy/d*2.8;
        if(this.huntTimer<=0){this.huntState='cooldown';this.huntCooldown=rand(4.5,6);this.puff=0;}
      }else if(this.hunter&&this.huntState==='chase'){
        this.huntTimer-=dt;this.huntTargetX=p.x+(p.vx||0)*.3;this.huntTargetY=p.y+(p.vy||0)*.3;const dx=this.huntTargetX-this.x,dy=this.huntTargetY-this.y,d=Math.hypot(dx,dy)||1;sx+=dx/d*2.1;sy+=dy/d*2.1;
        if(this.huntTimer<=0){this.huntState='cooldown';this.huntCooldown=rand(3.5,5);}
      }else if(this.hunter&&this.huntState==='cooldown'&&this.huntCooldown<=0){this.huntState='rearm';}
      else if(this.hunter&&this.huntState==='rearm'&&playerDistance>(this.puffer?390:530)){this.huntState='cruise';this.huntCooldown=rand(1.5,3.5);}

      // Turn inward near the edges instead of disappearing while swimming in a line.
      if(this.x<115)sx+=(115-this.x)/115*1.7;if(this.x>W-115)sx-=(this.x-(W-115))/115*1.7;
      if(this.y<95)sy+=(95-this.y)/95*1.8;if(this.y>H-135)sy-=(this.y-(H-135))/135*2.3;

      const desired=Math.atan2(sy,sx),delta=Math.atan2(Math.sin(desired-this.heading),Math.cos(desired-this.heading));
      const turnRate=this.hunter?1.55:this.tier===1?1.8:1.35;this.heading+=clamp(delta,-turnRate*dt,turnRate*dt);
      const attackBoost=this.huntState==='charge'?1.42:this.huntState==='chase'?1.12:1;
      const cruise=this.speed*attackBoost*(1+.055*Math.sin(game.time*1.5+this.phase));
      this.vx=DC.lerp(this.vx,Math.cos(this.heading)*cruise,Math.min(1,dt*2.6));this.vy=DC.lerp(this.vy,Math.sin(this.heading)*cruise,Math.min(1,dt*2.6));
      this.x+=this.vx*dt;this.y+=this.vy*dt+Math.sin(game.time*1.7+this.phase)*3.2*dt;
      const waterTop=85,waterBottom=H-150;
      if(this.y<waterTop){this.y=waterTop;this.vy=Math.abs(this.vy)*.55;this.heading=Math.atan2(this.vy,this.vx);}
      if(this.y>waterBottom){this.y=waterBottom;this.vy=-Math.abs(this.vy)*.55;this.heading=Math.atan2(this.vy,this.vx);}
      if(Math.abs(this.vx)>3)this.facing=this.vx>0?1:-1;
      if(this.life>42||this.x<-230||this.x>W+230)this.alive=false;
    }
    draw(ctx,t){const frame=Math.floor(t*9+this.phase)%8,sz=this.assetSize,shark=this.species==='shark',state=shark&&this.huntState==='chase'?'attack':null,asset=shark?(state?`shark_${sz}_${state}`:`shark_${sz}_${frame}`):`enemy_${this.species}_${sz}_${frame}`,im=images[asset];if(!im?.complete||!im.naturalWidth)return;const tilt=this.facing*Math.atan2(this.vy,Math.max(1,Math.abs(this.vx))),inflate=this.puffer?1+this.puff*.2:1,scale=this.scale*this.size*inflate;ctx.save();ctx.translate(this.x,this.y+Math.sin(t*3.5+this.phase)*1.1);ctx.rotate(tilt);ctx.scale(this.facing*scale,scale);ctx.globalAlpha=this.huntState==='warning'&&Math.floor(t*10)%2===0?.65:1;ctx.drawImage(im,-45,-22.5,90,45);ctx.restore();}
  }
  class Particle {constructor(x,y,color='bubble'){this.x=x;this.y=y;let a=rand(0,Math.PI*2),s=rand(20,130);this.vx=Math.cos(a)*s;this.vy=Math.sin(a)*s;this.life=rand(.38,.8);this.max=this.life;this.color=color;this.r=rand(2,5);}update(dt){this.life-=dt;this.x+=this.vx*dt;this.y+=this.vy*dt;this.vx*=.96;this.vy*=.96;}draw(ctx){ctx.globalAlpha=Math.max(0,this.life/this.max);if(this.color==='bubble'){ctx.strokeStyle='#b5f3e7';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(this.x,this.y,this.r*(1-this.life/this.max*.3),0,7);ctx.stroke();}else{ctx.fillStyle=this.color;ctx.beginPath();ctx.arc(this.x,this.y,this.r,0,7);ctx.fill();}ctx.globalAlpha=1;}}
  window.DC.Player=Player;window.DC.Fish=Fish;window.DC.Particle=Particle;
})();
