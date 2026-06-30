Page({
  onLoad:function(){
    var u=wx.getStorageSync('userInfo');
    setTimeout(function(){
      if(u&&u.nickName) wx.redirectTo({url:'/pages/home/index'});
      else wx.redirectTo({url:'/pages/login/index'});
    },1500);
  }
});