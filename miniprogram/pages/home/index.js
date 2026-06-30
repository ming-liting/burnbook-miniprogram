Page({
  data:{avatarUrl:'',nickName:'燃本人',greetingText:'下午好',todayKcal:0,recentList:[]},
  onShow:function(){
    var u=wx.getStorageSync('userInfo');if(u&&u.nickName){this.setData({avatarUrl:u.avatarUrl||'',nickName:u.nickName})}
    var h=new Date().getHours();this.setData({greetingText:h<12?'早上好':h<18?'下午好':'晚上好'});
    var rs=wx.getStorageSync('train_records')||[],t=this._fmt(new Date()),k=0;
    rs.forEach(function(r){if(r.trainDate===t)k+=parseFloat(r.calories)||0});
    this.setData({todayKcal:k});rs.sort(function(a,b){return b.trainDate.localeCompare(a.trainDate)});
    this.setData({recentList:rs.slice(0,5)});
  },
  onStartWorkout:function(){wx.navigateTo({url:'/pages/training/index'})},
  onNav:function(e){var t=e.currentTarget.dataset.t;if(t==='training')wx.navigateTo({url:'/pages/training/index'});else if(t==='record')wx.redirectTo({url:'/pages/record/index'});else if(t==='profile')wx.redirectTo({url:'/pages/profile/index'})},
  _fmt:function(d){var y=d.getFullYear();var m=('0'+(d.getMonth()+1)).slice(-2);var day=('0'+d.getDate()).slice(-2);return y+'-'+m+'-'+day}
})