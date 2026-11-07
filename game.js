(()=>{
const $=s=>document.querySelector(s),c=$('#game'),g=c.getContext('2d');g.imageSmoothingEnabled=false;
const items=[
['sofa','포근한 소파',180000,3,2],['bed','구름 침대',320000,4,3],['table','원목 식탁',120000,3,2],['chair','나무 의자',35000,1,1],['plant','초록 화분',18000,1,1],['lamp','버섯 조명',29000,1,2],['tv','브라운관 TV',90000,2,2],['shelf','작은 책장',85000,2,2],['rug','꽃무늬 러그',45000,3,2],['fridge','민트 냉장고',160000,2,3],['desk','창가 책상',110000,3,2],['bath','작은 욕조',140000,3,2]
].map(([id,name,price,w,h])=>({id,name,price,w,h}));
let s;try{s=JSON.parse(localStorage.getItem('little-home-game'))}catch(e){}
s=s||{name:'나의 작은 집',budget:3000000,coins:3000000,owned:[],placed:[],day:1};
let tab='home',ghost=null,mouse={x:300,y:200},player={x:320,y:350},keys={},selected=-1;
const money=n=>Math.round(n).toLocaleString('ko-KR')+'원',item=id=>items.find(x=>x.id===id);
function save(){localStorage.setItem('little-home-game',JSON.stringify(s));$('#saveState').textContent='저장 완료';$('#money').textContent=money(s.coins)}
function R(x,y,w,h,col){g.fillStyle=col;g.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h))}
function drawRoom(){
 for(let y=0;y<14;y++)for(let x=0;x<20;x++){let px=x*32,py=y*32;R(px,py,32,32,(x+y)%2?'#c99560':'#d3a473');R(px,py+30,32,2,'#93674255');if((x*9+y*5)%23===0)R(px+7,py+9,2,2,'#946942')}
 R(0,0,640,40,'#e8d8b2');R(0,34,640,8,'#805738');R(0,0,8,448,'#704b31');R(632,0,8,448,'#704b31');R(0,440,640,8,'#704b31');
 for(let x=16;x<620;x+=40){R(x,6,34,23,'#a9cbd0');R(x+3,9,12,17,'#d8eeee');R(x+17,9,2,17,'#f5e4c1');R(x+3,18,28,2,'#f5e4c1')}
 R(550,0,55,42,'#68452e');R(557,0,41,34,'#b77d4a');R(562,4,31,25,'#d19b60');R(586,18,4,4,'#f4d47c');
}
function sprite(it){
 let x=it.x,y=it.y,w=it.w*32,h=it.h*32,k=it.id;R(x+4,y+h-3,w-7,4,'#53351f55');
 if(k==='sofa'){R(x+2,y+8,w-4,h-12,'#743c43');R(x,y+3,w,h-12,'#a65058');R(x+5,y,w-10,h-18,'#c97579');R(x+8,y+3,w/2-10,h-22,'#e49a91');R(x+w/2+2,y+3,w/2-11,h-22,'#db8989');R(x+4,y+h-7,5,7,'#58372b');R(x+w-9,y+h-7,5,7,'#58372b')}
 else if(k==='bed'){R(x,y+4,w,h-7,'#80583d');R(x+4,y+8,w-8,h-15,'#f1e6d1');R(x+7,y+10,w/2-10,14,'#fff9e9');R(x+w/2+3,y+10,w/2-10,14,'#fff9e9');R(x+4,y+27,w-8,h-35,'#91aebe')}
 else if(['table','desk'].includes(k)){R(x+5,y+10,w-10,h-13,'#80502f');R(x+2,y+3,w-4,h-13,'#b77b46');R(x+5,y+5,w-10,4,'#e0b37c');R(x+8,y+h-8,5,8,'#75472b');R(x+w-13,y+h-8,5,8,'#75472b');if(k==='desk'){R(x+12,y+9,20,12,'#e9e3ce');R(x+15,y+11,14,8,'#8dbac0')}}
 else if(k==='chair'){R(x+7,y+2,18,15,'#945d36');R(x+5,y+15,22,10,'#bd8249');R(x+8,y+24,4,8,'#70452b');R(x+22,y+24,4,8,'#70452b')}
 else if(k==='plant'){R(x+8,y+19,17,11,'#b96e42');R(x+6,y+17,21,5,'#d38b55');R(x+14,y+6,4,14,'#477c43');R(x+3,y+7,15,9,'#4d914d');R(x+15,y+2,14,11,'#68a953');R(x+13,y+11,14,9,'#3e8044');R(x+1,y+14,12,6,'#77b85c')}
 else if(k==='lamp'){R(x+14,y+14,5,16,'#8c6841');R(x+8,y+27,18,4,'#765237');R(x+7,y+4,20,13,'#e7c35f');R(x+11,y+7,12,7,'#fff0a0')}
 else if(k==='tv'){R(x+2,y+3,w-4,h-10,'#57483c');R(x+6,y+7,w-12,h-18,'#a8c8c9');R(x+9,y+10,w-18,h-24,'#6cabb5');R(x+12,y+12,w-24,5,'#d4ece1');R(x+w-12,y+10,3,3,'#e5ce7c')}
 else if(k==='shelf'){R(x+3,y+2,w-6,h-4,'#845332');R(x+7,y+6,w-14,h-12,'#c18b55');for(let n=0;n<3;n++){R(x+7,y+7+n*18,w-14,3,'#75492d');R(x+10,y+9+n*18,7,8,['#b65d62','#6f91a3','#d7bd70'][n]);R(x+20,y+10+n*18,8,7,['#7b9b69','#c17b57','#8a789e'][n])}}
 else if(k==='rug'){R(x+1,y+3,w-2,h-6,'#a75e56');R(x+5,y+7,w-10,h-14,'#e0b67e');for(let xx=12;xx<w-8;xx+=18){R(x+xx,y+10,4,4,'#bd7665');R(x+xx,y+h-14,4,4,'#bd7665')}}
 else if(k==='fridge'){R(x+4,y+2,w-8,h-4,'#7eaaa3');R(x+7,y+5,w-14,h-10,'#c8e0d4');R(x+7,y+30,w-14,h-37,'#e3eee3');R(x+w-12,y+12,3,9,'#648c84')}
 else if(k==='bath'){R(x+2,y+6,w-4,h-12,'#8daeb0');R(x+6,y+9,w-12,h-18,'#d9eeee');R(x+10,y+12,w-20,h-24,'#b4d6d9')}
}
function draw(){
 g.clearRect(0,0,640,448);drawRoom();s.placed.forEach(sprite);
 if(ghost){let it=item(ghost),x=Math.floor(mouse.x/32)*32,y=Math.floor(mouse.y/32)*32;g.globalAlpha=.55;sprite({...it,x,y});g.globalAlpha=1}
 let x=player.x,y=player.y;R(x-7,y+10,16,5,'#543a2b55');R(x-6,y-9,13,16,'#5b8965');R(x-5,y-18,11,11,'#f0c69b');R(x-7,y-21,14,6,'#684632');R(x-3,y-13,2,2,'#49372c');R(x+2,y-13,2,2,'#49372c');R(x-5,y+5,5,7,'#79533b');R(x+2,y+5,5,7,'#79533b');
}
function renderInventory(){let html=s.owned.map(id=>item(id)).filter(Boolean).map(it=>'<button class="invitem" data-place="'+it.id+'">🪑 '+it.name+' 배치</button>').join('');$('#inventory').innerHTML=html||'<p class="quiet">상점에서 가구를 골라 가방에 담아 보세요.</p>';$('#inventory').querySelectorAll('[data-place]').forEach(b=>b.onclick=()=>{ghost=b.dataset.place;tab='home';show('home');$('#notice').textContent='집 바닥을 눌러 '+item(ghost).name+'을(를) 배치하세요.'})}
function renderShop(){$('#shopItems').innerHTML=items.map(it=>'<div class="shoprow"><div class="swatch '+it.id+'">✦</div><div><b>'+it.name+'</b><small>'+it.w+'×'+it.h+'칸 · '+money(it.price)+'</small></div><button data-buy="'+it.id+'">'+(s.owned.includes(it.id)?'담김':'목록 담기')+'</button></div>').join('');$('#shopItems').querySelectorAll('[data-buy]').forEach(b=>b.onclick=()=>{let id=b.dataset.buy;if(!s.owned.includes(id)){s.owned.push(id);$('#notice').textContent=item(id).name+'을 가구 가방에 넣었어요.';save();renderShop();renderInventory()}})}
function renderBudget(){$('#budgetInfo').innerHTML='<div class="budgetline"><span>전체 예산</span><b>'+money(s.budget)+'</b></div><div class="budgetline"><span>가구 구매 예상액</span><b>'+money(s.owned.reduce((a,id)=>a+item(id).price,0))+'</b></div><div class="budgetline"><span>남은 예산</span><b>'+money(s.coins)+'</b></div><input id="budgetInput" type="number" value="'+s.budget+'"><button id="budgetSave">예산 저장</button>';$('#budgetSave').onclick=()=>{s.budget=Math.max(0,+$('#budgetInput').value||0);s.coins=s.budget-s.owned.reduce((a,id)=>a+item(id).price,0);save();renderBudget()}}
function show(t){tab=t;document.querySelectorAll('[data-screen]').forEach(e=>e.classList.toggle('on',e.dataset.screen===t));document.querySelectorAll('[data-tab]').forEach(e=>e.classList.toggle('active',e.dataset.tab===t));if(t==='shop')renderShop();if(t==='home')renderInventory();if(t==='budget')renderBudget()}
function loop(){let dx=(keys.ArrowRight||keys.d?1:0)-(keys.ArrowLeft||keys.a?1:0),dy=(keys.ArrowDown||keys.s?1:0)-(keys.ArrowUp||keys.w?1:0);if(dx||dy){let l=Math.hypot(dx,dy);player.x=Math.max(20,Math.min(620,player.x+dx/l*2));player.y=Math.max(80,Math.min(430,player.y+dy/l*2))}draw();requestAnimationFrame(loop)}
addEventListener('keydown',e=>{keys[e.key]=true;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(e.key))e.preventDefault()});addEventListener('keyup',e=>keys[e.key]=false);
c.addEventListener('pointermove',e=>{let r=c.getBoundingClientRect();mouse.x=(e.clientX-r.left)*640/r.width;mouse.y=(e.clientY-r.top)*448/r.height});
c.addEventListener('pointerdown',()=>{if(ghost){let it=item(ghost);s.placed.push({id:it.id,x:Math.floor(mouse.x/32)*32,y:Math.floor(mouse.y/32)*32,w:it.w,h:it.h});ghost=null;save();renderInventory();$('#notice').textContent='가구를 놓았어요!'}else{let i=s.placed.findIndex(it=>mouse.x>=it.x&&mouse.x<it.x+it.w*32&&mouse.y>=it.y&&mouse.y<it.y+it.h*32);if(i>=0){let it=s.placed.splice(i,1)[0];s.placed.push(it);$('#notice').textContent=item(it.id).name+'을 선택했어요. 다시 가방에 넣으려면 가구 치우기를 눌러 주세요.'}}});
$('#finishBuild').onclick=()=>{ghost=null;renderInventory();$('#notice').textContent='가구 배치 모드를 종료했어요.'};
$('#clearHouse').onclick=()=>{if(confirm('집 안의 가구를 모두 치울까요?')){s.placed=[];save()}};
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>show(b.dataset.tab));
$('#nextDay').onclick=()=>{s.day++;$('#day').textContent='DAY '+String(s.day).padStart(2,'0');$('#weather').textContent=['맑음','구름 조금','비'][s.day%3];save()};
$('#saveGame').onclick=()=>{save();$('#notice').textContent='집을 저장했어요.'};
$('#renameHouse').onclick=()=>{let n=prompt('집 이름',s.name);if(n){s.name=n;$('#houseName').textContent=n;save()}};
$('#houseName').textContent=s.name;$('#day').textContent='DAY '+String(s.day).padStart(2,'0');$('#money').textContent=money(s.coins);
renderShop();renderInventory();renderBudget();requestAnimationFrame(loop);
})();