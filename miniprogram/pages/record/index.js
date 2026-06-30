Page({
  data:{weekDays:0,weekKcal:0,weekMin:0,week:[]},
  onShow:function(){
    var rs=wx.getStorageSync('train_records')||[],d=new Date(),dw=d.getDay()||7;
    var monday=new Date(d);monday.setDate(d.getDate()-dw+1);
    var wDays=0,wKcal=0,wMin=0;
    var week=[];
    for(var i=0;i<7;i++){
      var dt=new Date(monday);dt.setDate(monday.getDate()+i);
      var ds=('0'+(dt.getMonth()+1)).slice(-2)+'-'+('0'+dt.getDate()).slice(-2);
      var active=false;
      rs.forEach(function(r){if(r.trainDate===this.fmt(dt)){wDays++;wKcal+=parseFloat(r.calories)||0;wMin+=parseFloat(r.duration)||0;active=true}}.bind(this));
      week.push({day:['一','二','三','四','五','六','日'][i],date:('0'+dt.getDate()).slice(-2),active:active});
    }
    this.setData({weekDays:wDays,weekKcal:wKcal,weekMin:wMin,week:week});
  },
  fmt:function(d){var y=d.getFullYear();var m=('0'+(d.getMonth()+1)).slice(-2);var day=('0'+d.getDate()).slice(-2);return y+'-'+m+'-'+day},
  onProgress:function(){wx.navigateTo({url:'/pages/progress/index'})},
  onNav:function(e){var t=e.currentTarget.dataset.t;if(t==='home')wx.redirectTo({url:'/pages/home/index'});else if(t==='training')wx.navigateTo({url:'/pages/training/index'});else if(t==='profile')wx.redirectTo({url:'/pages/profile/index'})}
})