(function(root){
'use strict';
const clamp=(v,a=0,b=100)=>Math.max(a,Math.min(b,v));
const PEOPLE=[['小真','熱血新人','#ea956e','把願景寫進筆記本，也會記下到期日。'],['阿穩','資深工程師','#78a79a','承諾聽多了，證據要留好。'],['美玲','行政','#bd93b9','福利可以省，帳不能算錯。'],['阿哲','業務','#e8bd5a','客戶的「小改一下」，從來不小。'],['可可','設計師','#93a8d0','我把老闆的話，做成一套貼圖。'],['小伍','準時下班派','#acb778','下班不是福利，是時間到了。']];
const ACTIONS={
 promise:{name:'明天一定發獎金',cost:0,icon:'餅',desc:'今天產出 +25%；明天須付 32。跳票傷信任，重複跳票更嚴重。'},
 pizza:{name:'披薩派對',cost:14,icon:'餐',desc:'疲勞 −12、信任 +3；連續吃效果變差。信任低於 35 時反而 −8。'},
 meeting:{name:'全員開會',cost:0,icon:'會',desc:'今日產出 −40%，疲勞 −5；明日協作產出 +35%。連續開會會更累。'},
 bonus:{name:'發放獎金',cost:38,icon:'錢',desc:'每位員工信任 +17。阿穩與美玲另外 +3；疲勞不會消失。'},
 holiday:{name:'放半天假',cost:0,icon:'假',desc:'今日產出 −50%、疲勞 −26、信任 +7；小伍額外恢復精神。'},
 rush:{name:'接急單',cost:0,icon:'急',desc:'3 天內完成 18 點額外工作，成功收 52、失敗扣 25；工作先交急單。'},
 upgrade:{name:'升級設備',cost:34,icon:'新',desc:'永久效率 +35%，最多升級兩次。破電腦真的會被換掉。'},
 sprint:{name:'全力衝刺',cost:0,icon:'衝',desc:'今日產出 +85%、額外疲勞 +18、信任 −5；過勞者可能交出錯誤。'}
};
const EVENTS=[
 {name:'咖啡機罷工',copy:'只剩熱水，大家開始直視人生。疲勞 +8。',fatigue:8},
 {name:'客戶說「小改一下」',copy:'小改變成重做。主專案進度 −8，信任 −2。',progress:-8,trust:-2},
 {name:'新人第一張薪資單',copy:'小真反覆確認小數點，團隊信任 −5。',trust:-5},
 {name:'客戶提前匯款',copy:'終於有人說話算話！現金 +22。',cash:22},
 {name:'隔壁公司徵才',copy:'群組裡出現一個「純分享」的職缺連結。信任 −7。',trust:-7},
 {name:'設計梗圖爆紅',copy:'可可的「願景不能繳房租」貼圖被全公司轉發。信任 +5。',trust:5},
 {name:'有人帶了家鄉點心',copy:'這次真的是自願分享。疲勞 −8、信任 +3。',fatigue:-8,trust:3},
 {name:'客户寄來感謝卡',copy:'不是修改清單！大家把它裱在牆上。信任 +7。',trust:7}
];
const QUOTES={
 promise:['明天，我有記下來喔。','我按錄音了，你繼續。','這筆是應付帳款，還是科幻小說？','客戶的承諾也長這樣。','新貼圖：明天的明天。','請問明天幾點入帳？'],
 pizza:['起司可以，但承諾也要。','這是第幾版薪酬制度？','每人兩片，財務很精準。','客戶能接受披薩交貨嗎？','本月薪資：瑪格麗特。','我要的是休息，不是加料。'],
 meeting:['這個會需要一個會前會嗎？','我的程式在等散會。','咖啡從熱的變成冷萃。','客戶問為什麼沒人回信。','第 38 頁：更大的願景。','這個會不能是一封信嗎？'],
 bonus:['原來不是傳說！','銀行簡訊比願景好聽。','核對完畢，這次是真的。','今天我接電話比較大聲。','做一張真的開心的貼圖。','謝謝，但下班還是準時。'],
 holiday:['原來白天外面長這樣。','讓電腦也冷靜一下。','休假不用另外填三張表吧？','自動回覆已經準備好了。','今天的靈感在公園。','這項決策我全票通過。'],
 rush:['急，是客戶的急還是我的急？','昨天的急單還熱著呢。','先看違約金，不要只看營收。','這次我有把範圍寫清楚。','「隨便做」通常最不隨便。','急件不代表可以沒有下班。'],
 upgrade:['開機竟然不用先泡麵！','風扇終於沒有要起飛。','這筆錢花得看得見。','視訊不再像定格動畫。','轉存圖檔不再轉世。','設備快一點，我就早點走。'],
 sprint:['我可以！……應該吧。','快跟好是兩個不同的字。','咖啡預算先不要刪。','電話跟心跳一樣快。','我的復原鍵也累了。','我保留準時下班的意見。'],
 wait:['今天可以好好做事嗎？','沒有消息，就是好消息。','我繼續核對帳目。','客戶今天還算客氣。','先把這張圖畫完。','時間到了我就走。'],
 broken:['我把筆記本那一頁撕掉了。','錄音檔我已經備份。','這筆轉列「不太可能收到」。','原來我們也會被放鳥。','新貼圖：下次一定。','我在更新履歷了。'],
 paid:['我不用撕筆記本了！','兌現一次，比講十次有用。','付款章，蓋下去。','可以把這個信用借給客戶嗎？','畫一張說到做到。','這次我有收到。']
};
function mean(s,key){let p=s.people.filter(p=>p.active);return p.length?p.reduce((v,p)=>v+p[key],0)/p.length:0;}
function metrics(s){return {trust:mean(s,'trust'),fatigue:mean(s,'fatigue'),staff:s.people.filter(p=>p.active).length};}
function log(s,text,weight=1){s.logs.unshift({day:s.day,text,weight});s.logs=s.logs.slice(0,60);}
function affect(s,t=0,f=0){s.people.filter(p=>p.active).forEach(p=>{p.trust=clamp(p.trust+t);p.fatigue=clamp(p.fatigue+f);});}
function quote(s,key){const lines=QUOTES[key]||QUOTES.wait;s.people.forEach((p,i)=>{if(p.active)p.quote=lines[i];});s.lastAction=key;}
function create(seed=Date.now()>>>0){let x=seed||1;const rand=()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/4294967296;};let pool=EVENTS.map((_,i)=>i);for(let i=pool.length-1;i>0;i--){let j=Math.floor(rand()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
 return {version:1,seed,day:1,remaining:20,cash:120,progress:0,target:72,equipment:0,people:PEOPLE.map((p,i)=>({id:i,name:p[0],role:p[1],color:p[2],bio:p[3],trust:58,fatigue:12+i,active:true,danger:0,quote:QUOTES.wait[i]})),events:pool.slice(0,4),event:null,logs:[{day:1,text:'月初：帶著 120 現金和六位員工開工。',weight:1}],counts:{},lastAction:'wait',pizzaStreak:0,meetingStreak:0,promise:null,debts:[],broken:0,paid:0,rush:null,rushWins:0,rushLosses:0,coordination:false,result:null,revenue:0};
}
function reason(s,id){if(s.result)return '這一局已結束，請重新開始。';if(s.promise&&s.promise.due<=s.day)return '先決定如何處理到期獎金。';if(id==='wait')return '';let a=ACTIONS[id];if(!a)return '未知決策';if(s.cash<a.cost)return `現金不足：需要 ${a.cost}，目前 ${Math.floor(s.cash)}。`;if(id==='upgrade'&&s.equipment>=2)return '設備已升級到最高等級。';if(id==='rush'&&s.rush)return '目前急單尚未結案，請先交付。';return '';}
function settlePromise(s,pay){if(!s.promise||s.promise.due>s.day||s.result)return false;if(pay&&s.cash<32)return false;let debt=s.debts.find(d=>d.status==='pending');if(pay){s.cash-=32;s.paid++;affect(s,12);quote(s,'paid');log(s,'獎金承諾兌現，現金 −32、信任 +12。',5);if(debt)debt.status='paid';}else{s.broken++;let loss=20+s.broken*5;affect(s,-loss);quote(s,'broken');log(s,`第 ${s.broken} 次跳票！信任 −${loss}，員工開始保留證據。`,6);if(debt)debt.status='broken';}s.promise=null;finish(s,false);return true;}
function finish(s,last){let m=metrics(s),key=null;if(!m.staff)key='alone';else if(s.cash<=0)key='bankrupt';else if(last)key=s.progress>=s.target?(m.trust>=65?'good':'cold'):'survive';if(key){s.result=key;s.remaining=0;log(s,'月底結算：'+ENDINGS[key].title,0);}}
function act(s,id){let why=reason(s,id);if(why)return {ok:false,reason:why};let a=ACTIONS[id];s.cash-=a?.cost||0;s.counts[id]=(s.counts[id]||0)+1;let mult=s.coordination?1.35:1;s.coordination=false;
 s.pizzaStreak=id==='pizza'?s.pizzaStreak+1:0;s.meetingStreak=id==='meeting'?s.meetingStreak+1:0;
 if(id==='promise'){mult*=1.25;s.promise={due:s.day+1};s.debts.push({day:s.day,status:'pending'});log(s,'「明天一定發獎金」：欠條已貼上，隔日到期 32。',4);}
 if(id==='pizza'){let low=mean(s,'trust')<35;affect(s,low?-8:3, -Math.max(2,12-(s.pizzaStreak-1)*5));log(s,low?'披薩反彈：員工說「我要的是錢」。信任 −8。':`披薩送達：連續第 ${s.pizzaStreak} 次，疲勞恢復逐次遞減。`,3);}
 if(id==='meeting'){mult*=.6;affect(s,0,s.meetingStreak>1?8:-5);s.coordination=true;log(s,s.meetingStreak>1?'又開會：疲勞 +8，產出被會議吃掉。':'開會對齊分工：今日少做，明日協作效率提高。',2);}
 if(id==='bonus'){affect(s,17);[1,2].forEach(i=>s.people[i].trust=clamp(s.people[i].trust+3));log(s,'現金獎金發下去：銀行簡訊比願景有效。',4);}
 if(id==='holiday'){mult*=.5;affect(s,7,-26);s.people[5].fatigue=clamp(s.people[5].fatigue-8);log(s,'半天假：辦公室空一半，精神回來一大半。',3);}
 if(id==='rush'){s.rush={remaining:18,due:s.day+2};log(s,`接下急單：第 ${s.day+2} 日前完成 18 工作量，成功 +52，逾期 −25。`,4);}
 if(id==='upgrade'){s.equipment++;log(s,'設備升級：效率永久 +35%，風扇停止尖叫。',3);}
 if(id==='sprint'){mult*=1.85;affect(s,-5,18);log(s,'全力衝刺：產出提高，但疲勞與抱怨一起累積。',3);}
 quote(s,id);let workers=s.people.filter(p=>p.active);let output=workers.reduce((v,p)=>v+1.7*(.65+p.trust*.006)*(1-p.fatigue/160),0)*(1+s.equipment*.35)*mult;let tired=workers.filter(p=>p.fatigue>80).length;if(tired){output*=.72;log(s,`${tired} 人過勞，返工使今日產出再減 28%。`,4);}
 s.cash+=output*1.5-workers.length*2;s.revenue+=output*1.5;let delivered=output;
 if(s.rush){let done=Math.min(output,s.rush.remaining);s.rush.remaining-=done;delivered-=done;if(s.rush.remaining<=.001){s.cash+=52;s.rushWins++;log(s,'急單準時交付！客戶付清 52。',5);s.rush=null;}else if(s.day>=s.rush.due){s.cash-=25;s.rushLosses++;log(s,'急單逾期，扣款 25。未完成工作取消。',5);s.rush=null;}}
 s.progress=clamp(s.progress+delivered,0,s.target);affect(s,id==='wait'?-2:0,5);
 workers.forEach(p=>{if(p.trust<18||p.fatigue>=95)p.danger++;else p.danger=0;if(p.danger===1){p.quote='再這樣下去，我明天就走。';log(s,p.name+' 開始收拾桌面：連續兩天危險狀態就離職。',4);}if(p.danger>=2){p.active=false;p.quote='我去找會兌現的人了。';log(s,p.name+' 留下離職信，座位空了。',6);}});
 log(s,`第 ${s.day} 日完成：產出 ${output.toFixed(1)}，主專案 ${s.progress.toFixed(1)}/${s.target}。`,1);
 finish(s,s.day===12);if(!s.result){s.day++;s.remaining=20;s.event=null;let ei=[3,6,9,11].indexOf(s.day);if(ei>=0){let ev=EVENTS[s.events[ei]];s.event=ev;s.cash+=ev.cash||0;s.progress=clamp(s.progress+(ev.progress||0),0,s.target);affect(s,ev.trust||0,ev.fatigue||0);log(s,ev.name+'：'+ev.copy,3);finish(s,false);}}
 return {ok:true,output};
}
const ENDINGS={alone:{title:'全公司只剩你',copy:'你終於擁有一間完全沒有反對意見的公司。',stamp:'員工 0 人'},bankrupt:{title:'夢想很大，帳戶很小',copy:'願景無法扣款，銀行也不接受披薩。',stamp:'現金耗盡'},good:{title:'大家真的有分到',copy:'案子做完了，人也還願意留下。這次的慶功照沒有人假笑。',stamp:'值得留下'},cold:{title:'有賺錢，沒朋友',copy:'專案交了，辦公室安靜得能聽見履歷上傳的聲音。',stamp:'目標達成'},survive:{title:'月底勉強存活',copy:'公司還在，專案還沒做完。大家決定下個月再問一次。',stamp:'繼續努力'}};
function badges(s){return [s.counts.pizza>=3?'披薩暴君':null,s.counts.meeting>=3?'會議永動機':null,s.paid>=2&&s.broken===0?'說到做到':null,s.rushWins>=2?'急單馴獸師':null].filter(Boolean);}
const api={create,act,settlePromise,reason,metrics,ACTIONS,ENDINGS,badges};root.BossEngine=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
