Page({
  data:{avatarUrl:'',nickName:'燃本人'},
  onShow:function(){var u=wx.getStorageSync('userInfo');if(u&&u.nickName)this.setData({avatarUrl:u.avatarUrl||'',nickName:u.nickName})},
  onMenu:function(e){var t=e.currentTarget.dataset.t;if(t==='favorites'){wx.navigateTo({url:'/pages/exercises/index?fav=1'});return}wx.showToast({title:'功能待迭代',icon:'none'})},
  onLogout:function(){wx.showModal({title:'退出',content:'确定退出吗？',success:function(r){if(r.confirm){wx.removeStorageSync('userInfo');wx.redirectTo({url:'/pages/login/index'})}}})},
  onNav:function(e){var t=e.currentTarget.dataset.t;if(t==='home')wx.redirectTo({url:'/pages/home/index'});else if(t==='training')wx.navigateTo({url:'/pages/training/index'});else if(t==='record')wx.redirectTo({url:'/pages/record/index'})}
})