Page({
  data:{avatarUrl:'',nickName:'木林',today:'',weekBars:[],parts:[]},
  onShow:function(){
    var that=this;
    var u=wx.getStorageSync('userInfo');if(u&&u.nickName)that.setData({avatarUrl:u.avatarUrl||'',nickName:u.nickName});
    var d=new Date();that.setData({today:('0'+(d.getMonth()+1)).slice(-2)+'月'+('0'+d.getDate()).slice(-2)+'日'});
    var rs=wx.getStorageSync('train_records')||[],dw=d.getDay()||7;
    var mon=new Date(d);mon.setDate(d.getDate()-dw+1);
    var bars=[],maxK=0,parts={};
    // 精细部位映射
    var map={'平板':'胸部','卧推':'胸部','飞鸟':'胸部','夹胸':'胸部','上斜':'胸部',
      '引体':'背部','划船':'背部','下拉':'背部','硬拉':'腿部',
      '深蹲':'腿部','腿举':'腿部','弓步':'腿部','臀':'腿部',
      '推举':'肩部','侧平举':'肩部','面拉':'肩部',
      '弯举':'手臂','臂':'手臂','窄距':'手臂','三头':'手臂','二头':'手臂',
      '平板支撑':'核心','卷腹':'核心','举腿':'核心','腹':'核心',
      '跑步':'有氧','跳绳':'有氧','波比':'有氧','HIIT':'有氧','燃脂':'有氧'};
    for(var i=0;i<7;i++){
      var dt=new Date(mon);dt.setDate(mon.getDate()+i);var ds=that.fmt(dt);
      var k=0;rs.forEach(function(r){var t=r.trainType||'';if(r.trainDate===ds){k+=parseFloat(r.calories)||0;var found=false;
        for(var mk in map){if(t.indexOf(mk)!==-1){parts[map[mk]]=(parts[map[mk]]||0)+1;found=true;break}}
        if(!found)parts['全身']=(parts['全身']||0)+1}});
      bars.push({d:['一','二','三','四','五','六','日'][i],v:k,cal:k});if(k>maxK)maxK=k;
    }
    if(maxK===0)maxK=1;
    bars.forEach(function(b){b.h=Math.max(8,Math.round(b.cal/maxK*200))});
    var total=0;for(var k in parts)total+=parts[k];if(total===0)total=1;
    var list=[];for(var k in parts)list.push({name:k,count:parts[k],pct:Math.round(parts[k]/total*100)});
    list.sort(function(a,b){return b.pct-a.pct});
    that.setData({weekBars:bars,parts:list});
  },
  fmt:function(d){var y=d.getFullYear();var m=('0'+(d.getMonth()+1)).slice(-2);var day=('0'+d.getDate()).slice(-2);return y+'-'+m+'-'+day},
  onNav:function(e){var t=e.currentTarget.dataset.t;if(t==='home')wx.redirectTo({url:'/pages/home/index'});else if(t==='training')wx.navigateTo({url:'/pages/training/index'});else if(t==='profile')wx.redirectTo({url:'/pages/profile/index'})}
})