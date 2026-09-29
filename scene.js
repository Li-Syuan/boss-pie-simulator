(function(){
'use strict';
const canvas=document.getElementById('scene'),c=canvas.getContext('2d');let frame=0;
const ink='#354039';
function line(points,color=ink,width=2){c.beginPath();c.moveTo(...points[0]);points.slice(1).forEach(p=>c.lineTo(...p));c.strokeStyle=color;c.lineWidth=width;c.lineJoin='round';c.lineCap='round';c.stroke();}
function box(x,y,w,h,fill,skew=2){c.fillStyle=fill;c.beginPath();c.moveTo(x,y+2);c.lineTo(x+w,y);c.lineTo(x+w-skew,y+h);c.lineTo(x+skew,y+h+2);c.closePath();c.fill();c.strokeStyle=ink;c.lineWidth=2;c.stroke();}
function ellipse(x,y,rx,ry,fill){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);c.fillStyle=fill;c.fill();c.strokeStyle=ink;c.lineWidth=2;c.stroke();}
function text(t,x,y,size=16,color=ink,align='left'){c.fillStyle=color;c.font=`${size>=20?'bold ':''}${size}px "Microsoft JhengHei",sans-serif`;c.textAlign=align;c.fillText(t,x,y);}
const positions=[[195,277],[550,277],[905,277],[195,505],[550,505],[905,505]];
function employee(p,s,t){let [x,y]=positions[p.id];let bob=Math.sin(t*2+p.id)*2;
 ellipse(x,y+52,82,16,'#c3cbbd');box(x-42,y-20,84,85,'#828f82');
 let vacation=s.lastAction==='holiday'&&p.id%2===1;
 if(p.active&&!vacation){line([[x-17,y+44],[x-20,y+74],[x-38,y+76]],ink,7);line([[x+17,y+44],[x+20,y+74],[x+36,y+76]],ink,7);
 box(x-35,y-26+bob,70,72,p.color,6);ellipse(x,y-48+bob,27,32,'#efd6b8');
 c.fillStyle=['#745347','#505858','#513e3d','#775744','#444b57','#615448'][p.id];c.beginPath();c.arc(x,y-57+bob,28,Math.PI,Math.PI*2);c.lineTo(x+25,y-41+bob);c.lineTo(x+16,y-60+bob);c.lineTo(x-23,y-44+bob);c.closePath();c.fill();
 const sleepy=p.fatigue>75,angry=p.trust<30;line([[x-14,y-49+bob],[x-7,y-48+bob]],ink,sleepy?2:3);line([[x+7,y-48+bob],[x+14,y-49+bob]],ink,sleepy?2:3);
 if(angry){line([[x-16,y-58+bob],[x-5,y-54+bob]]);line([[x+5,y-54+bob],[x+16,y-58+bob]]);}
 c.beginPath();c.strokeStyle=ink;c.arc(x,y-40+bob,8,angry?Math.PI:0,angry?Math.PI*2:Math.PI);c.stroke();
 if(p.id===1){c.strokeRect(x-20,y-55+bob,17,13);c.strokeRect(x+3,y-55+bob,17,13);line([[x-3,y-50+bob],[x+3,y-50+bob]]);}
 if(p.id===4){ellipse(x+23,y-60+bob,9,11,'#444b57');}
 line([[x-31,y-5+bob],[x-55,y+17],[x-14,y+24+Math.sin(t*8+p.id)*2]],'#efd6b8',10);line([[x+30,y-5+bob],[x+52,y+18],[x+17,y+24-Math.sin(t*8+p.id)*2]],'#efd6b8',10);
 }
 box(x-110,y+26,220,31,'#d4b58c');line([[x-94,y+58],[x-97,y+91]],ink,4);line([[x+94,y+56],[x+97,y+91]],ink,4);
 if(p.active){box(x-43,y-8,86,50,s.equipment?'#b4d4cf':'#c0c5ba');line([[x-33,y+30],[x+33,y+30]],'#74938b',2);text(s.equipment?'✓':'…',x,y+20,22,ink,'center');box(x+64,y+2,20,24,'#fff5de');c.beginPath();c.arc(x+87,y+13,7,-Math.PI/2,Math.PI/2);c.stroke();if(p.fatigue>80)text('Z z',x+46,y-76,21,'#a55d47');
 if(p.danger)text('履歷更新中',x,y-94,16,'#ac5143','center');
 if(vacation){box(x-51,y-78,102,37,'#f7e4b9');text('已去曬太陽',x,y-54,16,ink,'center');}
 if(s.lastAction==='bonus'||s.lastAction==='paid'){box(x-90,y+3,34,23,'#cf7458');text('$',x-73,y+21,16,'#fff1c9','center');}
 if(s.lastAction==='pizza'){ellipse(x-75,y+15,24,11,'#fff8de');c.fillStyle='#e5b15d';c.beginPath();c.moveTo(x-94,y+8);c.lineTo(x-58,y+8);c.lineTo(x-75,y+23);c.closePath();c.fill();ellipse(x-78,y+13,3,3,'#a55842');}
 if(p.id===0){box(x+89,y+5,20,26,'#f1df9b');line([[x+93,y+12],[x+104,y+12]],'#8c8971',1);}
 if(p.id===2){box(x-96,y+9,24,19,'#92a89a');text('123',x-84,y+22,8,ink,'center');}
 }else{box(x-40,y-8,80,45,'#f8f0d7',6);text('離 職 信',x,y+17,16,ink,'center');}
}
function bubble(p){let [x,y]=positions[p.id];let msg=p.quote;let lines=msg.length>13?[msg.slice(0,13),msg.slice(13)]:[msg];let bx=x-123,by=y-169;box(bx,by,246,lines.length>1?61:43,'#fffaf0',-3);line([[x-10,by+(lines.length>1?61:43)],[x,by+(lines.length>1?76:58)],[x+12,by+(lines.length>1?61:43)]],'#354039',2);lines.forEach((l,i)=>text(l,x,by+26+i*20,16,ink,'center'));}
function draw(s,time,paused){if(!paused)frame=time;let t=frame/1000;
 c.clearRect(0,0,1100,620);c.fillStyle='#e9e8d9';c.fillRect(0,0,1100,620);c.fillStyle='#d4dcce';c.fillRect(0,195,1100,425);line([[0,195],[1100,195]],'#89998a');for(let y=245;y<650;y+=95)line([[0,y],[1100,y-2]],'#b8c5b5',1);for(let x=-100;x<1300;x+=190)line([[x,195],[x+130,620]],'#b8c5b5',1);
 box(45,18,250,87,'#fbf3d9',-2);text('我們是一家人。',170,51,24,ink,'center');text('（福利另計）',170,81,15,'#946b52','center');
 box(373,16,335,82,'#b9ccd0');line([[540,16],[540,98]],'#657d7b');line([[373,60],[708,60]],'#657d7b');c.fillStyle='#eff0df';c.fillRect(392,36,38,45);c.fillRect(448,28,54,53);c.fillRect(574,35,30,46);c.fillRect(641,26,39,55);text('PIE CITY',540,91,11,'#4b6864','center');
 ellipse(795,54,35,35,'#fff8e7');let clockAngle=(s.day/12)*Math.PI*2;line([[795,54],[795+Math.sin(clockAngle)*23,54-Math.cos(clockAngle)*23]]);line([[795,54],[785,43]]);text('別加班',795,108,12,ink,'center');
 box(866,16,191,83,'#efe0a9');text('本月願景',961,44,17,ink,'center');text(s.lastAction==='meeting'?'更 大 的 願 景':'先活到月底。',961,75,19,ink,'center');
 const boxes=Math.min(s.counts.pizza||0,8);for(let i=0;i<boxes;i++)box(9,177-i*9,86,9,i%2?'#e9bb83':'#f2dfb7');if(boxes>=3)text('薪酬制度',48,177-boxes*9-9,12,'#965640','center');
 s.people.forEach(p=>employee(p,s,t));let eligible=s.people.filter(p=>p.active);if(eligible.length){let idx=Math.floor(t/4)%eligible.length;bubble(eligible[idx]);}
 if(s.lastAction==='meeting'){box(485,338,133,29,'#fff6e4');text('正在對齊願景…',551,358,13,ink,'center');for(let i=0;i<4;i++){let px=330+i*130,py=142+Math.sin(t*2+i)*13;box(px,py,31,20,'#fff9e9');line([[px+5,py+7],[px+22,py+7]],'#a5ad99',1);}}
 if(s.lastAction==='promise'){ellipse(797,152,64,16,'#ecc76e');text('明天一定！',797,158,15,ink,'center');}
 if(s.equipment){text('★ 新設備 ×'+s.equipment,1067,608,14,'#387968','right');}
}
window.BossScene={draw,positions};
})();
