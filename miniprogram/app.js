App({
  onLaunch: function () {
    if (wx.cloud) {
      wx.cloud.init({ env: 'cloudbase-d8gvmw0io7b17e756', traceUser: true });
      console.log('[CloudBase] 已初始化');
    }
  },
  globalData: { userInfo: null, openid: '', isLogin: false },

  // 通用方法：从云端拉取训练记录
  fetchRecords: function (cb) {
    if (!wx.cloud) { cb && cb(null); return; }
    wx.cloud.callFunction({ name: 'trainRecords', data: { action: 'list' },
      success: function (res) {
        if (res.result && res.result.records) {
          wx.setStorageSync('train_records', res.result.records);
          cb && cb(res.result.records);
        }
      },
      fail: function () { cb && cb(null); }
    });
  },

  // 通用方法：上传单条记录到云端
  uploadRecord: function (record) {
    if (!wx.cloud) return;
    wx.cloud.callFunction({ name: 'trainRecords', data: { action: 'add', record: record } });
  },

  // 通用方法：从云端删除记录
  deleteRecord: function (id) {
    if (!wx.cloud) return;
    wx.cloud.callFunction({ name: 'trainRecords', data: { action: 'delete', recordId: id } });
  }
});
