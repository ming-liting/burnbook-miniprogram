Page({
  data:{month:'',day:'',weekDay:''},
  onShow:function(){var d=new Date(),wm=['日','一','二','三','四','五','六'];this.setData({month:d.getMonth()+1,day:d.getDate(),weekDay:wm[d.getDay()]})},
  onHistory:function(){wx.navigateTo({url:'/pages/workout/index'})},
  onGo:function(){wx.navigateTo({url:'/pages/timer/index'})},
  onNav:function(e){var t=e.currentTarget.dataset.t;if(t==='home')wx.redirectTo({url:'/pages/home/index'});else if(t==='record')wx.redirectTo({url:'/pages/record/index'});else if(t==='profile')wx.redirectTo({url:'/pages/profile/index'})}
})