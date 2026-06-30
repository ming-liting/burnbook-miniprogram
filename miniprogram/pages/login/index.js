var app = getApp();

Page({
  data: {
    isAuthorized: false,
    canUseGetUserProfile: false, // 新版基础库设为 false，走 chooseAvatar 方案
    tempAvatarUrl: '',
    nickNameInput: '',
    avatarUrl: '',
    nickName: ''
  },

  onLoad: function () {
    var userInfo = wx.getStorageSync('userInfo');
    if (userInfo && userInfo.nickName) {
      // 已登录，直接跳转
      app.globalData.userInfo = userInfo;
      app.globalData.isLogin = true;
      this.goToHome();
    }
  },

  // === 旧版 getUserProfile (兼容) ===
  onGetUserProfile: function (e) {
    var userInfo = e.detail.userInfo;
    if (!userInfo) {
      wx.showToast({ title: '请授权后使用', icon: 'none' });
      return;
    }
    this.saveAndGo(userInfo.avatarUrl, userInfo.nickName);
  },

  // === 新版 chooseAvatar ===
  onChooseAvatar: function (e) {
    this.setData({ tempAvatarUrl: e.detail.avatarUrl });
  },

  // === 昵称输入 ===
  onNickInput: function (e) {
    this.setData({ nickNameInput: e.detail.value });
  },

  onNickBlur: function (e) {
    this.setData({ nickNameInput: e.detail.value });
  },

  // === 进入 App ===
  onEnterApp: function () {
    var avatar = this.data.tempAvatarUrl || '';
    var nick = this.data.nickNameInput.trim();

    if (!nick) {
      nick = '燃本人';
    }

    this.saveAndGo(avatar, nick);
  },

  // === 保存用户信息并跳转 ===
  saveAndGo: function (avatarUrl, nickName) {
    var userInfo = { avatarUrl: avatarUrl, nickName: nickName };
    wx.setStorageSync('userInfo', userInfo);
    app.globalData.userInfo = userInfo;
    app.globalData.isLogin = true;

    // 云端同步
    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'login',
        data: { nickName: nickName, avatarUrl: avatarUrl }
      });
    }

    this.goToHome();
  },

  goToHome: function () {
    var that = this;
    that.setData({ isAuthorized: true });
    setTimeout(function () {
      wx.redirectTo({ url: '/pages/home/index' });
    }, 300);
  }
});
