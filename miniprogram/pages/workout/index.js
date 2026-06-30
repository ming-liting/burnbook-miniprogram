var app = getApp();
Page({
  data:{list:[]},
  onShow:function(){this.load()},
  load:function(){
    var that = this;
    var rs = wx.getStorageSync('train_records') || [];
    rs.sort(function(a,b){return b.trainDate.localeCompare(a.trainDate)});
    rs.forEach(function(r){r._open = false});
    that.setData({list: rs});
    // 云端同步
    app.fetchRecords(function(cloudRecords){
      if (cloudRecords) {
        cloudRecords.sort(function(a,b){return b.trainDate.localeCompare(a.trainDate)});
        cloudRecords.forEach(function(r){r._open = false});
        that.setData({list: cloudRecords});
      }
    });
  },
  onBack:function(){wx.navigateBack()},
  onToggle:function(e){var i=e.currentTarget.dataset.i,list=this.data.list;list[i]._open=!list[i]._open;this.setData({list:list})},
  onReuse:function(e){var i=e.currentTarget.dataset.i,r=this.data.list[i];if(r&&r.exercises){wx.setStorageSync('reuse_training',r.exercises);wx.navigateTo({url:'/pages/timer/index'})}},
  onDel:function(e){
    var id = e.currentTarget.dataset.id, that = this;
    wx.showModal({title:'删除',content:'确定删除？',success:function(res){
      if(!res.confirm)return;
      var rs = wx.getStorageSync('train_records')||[];
      rs = rs.filter(function(r){return r._id!==id});
      wx.setStorageSync('train_records',rs);
      app.deleteRecord(id);
      that.load();
    }})
  }
})