Page({
  data: {
    timeDisplay: '00:00',
    isRunning: false,
    seconds: 0,
    exercises: [],
    showRest: false,
    restSeconds: 60,
    showEndModal: false,
    trainName: '',
    todayStr: '',
    doneCount: 0
  },

  _timer: null,
  _restTimer: null,
  _currentExIdx: -1,

  onLoad: function () {
    this.setData({ todayStr: this._fmt(new Date()) });
    this._startClock();
  },

  onUnload: function () {
    this._clearTimers();
  },

  // 接收动作库返回的选中动作
  onShow: function () {
    var selected = wx.getStorageSync('selected_exercises');
    if (selected && selected.length > 0) {
      var exercises = this.data.exercises;
      selected.forEach(function (ex) {
        exercises.push({
          _id: 'ex_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          name: ex.name,
          status: 'pending',
          currentSet: 0,
          sets: [
            { weight: '', reps: '', checked: false },
            { weight: '', reps: '', checked: false },
            { weight: '', reps: '', checked: false }
          ]
        });
      });
      this.setData({ exercises: exercises });
      wx.removeStorageSync('selected_exercises');
    }

    // 复用历史训练
    var reuse = wx.getStorageSync('reuse_training');
    if (reuse && reuse.length > 0) {
      var exs = this.data.exercises;
      reuse.forEach(function (ex) {
        exs.push({
          _id: 'ex_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
          name: ex.name,
          status: 'pending',
          currentSet: 0,
          sets: (ex.sets && ex.sets.length > 0) ? ex.sets.map(function () { return { weight: '', reps: '', checked: false }; }) : [{ weight: '', reps: '', checked: false }, { weight: '', reps: '', checked: false }, { weight: '', reps: '', checked: false }]
        });
      });
      this.setData({ exercises: exs });
      wx.removeStorageSync('reuse_training');
    }
  },

  // ===== 时钟 =====
  _startClock: function () {
    var that = this;
    this._timer = setInterval(function () {
      if (!that.data.isRunning) return;
      var s = that.data.seconds + 1;
      var m = Math.floor(s / 60);
      var sec = s % 60;
      that.setData({
        seconds: s,
        timeDisplay: ('0' + m).slice(-2) + ':' + ('0' + sec).slice(-2)
      });
    }, 1000);
  },

  _clearTimers: function () {
    if (this._timer) clearInterval(this._timer);
    if (this._restTimer) clearInterval(this._restTimer);
  },

  // ===== 开始动作 =====
  onStartExercise: function (e) {
    var exIdx = parseInt(e.currentTarget.dataset.exidx);
    var exercises = this.data.exercises;
    var ex = exercises[exIdx];
    if (!ex) return;

    // 开始计时
    if (!this.data.isRunning) {
      this.setData({ isRunning: true });
    }

    // 已完成 → 不做任何事
    if (ex.status === 'done') return;

    // 设为进行中
    ex.status = 'doing';
    this._currentExIdx = exIdx;
    this.setData({ exercises: exercises });
  },

  // ===== 勾选当前组 =====
  onCheckSet: function (e) {
    var exIdx = parseInt(e.currentTarget.dataset.exidx);
    var si = parseInt(e.currentTarget.dataset.si);
    var exercises = this.data.exercises;
    var ex = exercises[exIdx];
    if (!ex) return;

    // 保存当前组数据
    ex.sets[si].checked = true;

    // 前进到下一组
    if (si + 1 < ex.sets.length) {
      ex.currentSet = si + 1;
      this.setData({ exercises: exercises });
      // 弹出组间休息
      this._showRest(exIdx);
    } else {
      // 全部组完成 → 动作完成
      ex.status = 'done';
      ex.currentSet = ex.sets.length;
      this.setData({ exercises: exercises });
      this._updateProgress();
    }
  },

  // ===== 组间休息 =====
  _showRest: function (exIdx) {
    var that = this;
    this.setData({ showRest: true, restSeconds: 60 });
    this._restTimer = setInterval(function () {
      var s = that.data.restSeconds - 1;
      if (s <= 0) {
        that._endRest();
        return;
      }
      that.setData({ restSeconds: s });
    }, 1000);
  },

  onSkipRest: function () {
    this._endRest();
  },

  onRestAdjust: function (e) {
    var delta = parseInt(e.currentTarget.dataset.delta);
    var s = Math.max(10, this.data.restSeconds + delta);
    this.setData({ restSeconds: s });
  },

  _endRest: function () {
    if (this._restTimer) clearInterval(this._restTimer);
    this.setData({ showRest: false });
  },

  // ===== 组数输入 =====
  onSetInput: function (e) {
    var exIdx = parseInt(e.currentTarget.dataset.exidx);
    var si = parseInt(e.currentTarget.dataset.si);
    var field = e.currentTarget.dataset.field;
    var val = e.detail.value;
    var exercises = this.data.exercises;
    var ex = exercises[exIdx];
    if (ex && ex.sets[si]) {
      ex.sets[si][field] = val;
    }
  },

  // ===== 进度 =====
  _updateProgress: function () {
    var exercises = this.data.exercises;
    var done = exercises.filter(function (e) { return e.status === 'done'; }).length;
    this.setData({ doneCount: done });

    // 检查是否全部完成
    if (done === exercises.length && exercises.length > 0) {
      this.setData({ isRunning: false });
    }
  },

  // ===== 加动作 =====
  onAddExercise: function () {
    wx.navigateTo({ url: '/pages/exercises/index' });
  },

  // ===== 结束训练 =====
  onEndTrain: function () {
    this.setData({ showEndModal: true, isRunning: false });
    if (this._restTimer) clearInterval(this._restTimer);
  },

  onContinueTrain: function () {
    this.setData({ showEndModal: false, isRunning: true });
  },

  onNameInput: function (e) {
    this.setData({ trainName: e.detail.value });
  },

  // 保存训练
  onSaveTrain: function () {
    var that = this;
    var name = this.data.trainName.trim() || '自由训练';
    var duration = Math.round(this.data.seconds / 60 * 10) / 10;
    var calories = Math.round(duration * 8);
    var exercises = this.data.exercises;

    var record = {
      _id: 'r_' + Date.now(),
      trainType: name,
      trainDate: this._fmt(new Date()),
      exerciseCount: exercises.length,
      duration: duration,
      calories: calories,
      totalSeconds: this.data.seconds,
      timeDisplay: this.data.timeDisplay,
      exercises: exercises.map(function (ex) {
        return {
          name: ex.name,
          status: ex.status,
          sets: ex.sets.filter(function (s) { return s.weight || s.reps; })
        };
      })
    };

    var records = wx.getStorageSync('train_records') || [];
    records.push(record);
    wx.setStorageSync('train_records', records);

    if (wx.cloud) {
      wx.cloud.callFunction({
        name: 'trainRecords',
        data: { action: 'add', record: record }
      });
    }

    this._clearTimers();
    wx.showToast({ title: '训练已保存', icon: 'success' });
    setTimeout(function () {
      wx.redirectTo({ url: '/pages/workout/index' });
    }, 800);
  },

  _fmt: function (d) {
    var y = d.getFullYear();
    var m = ('0' + (d.getMonth() + 1)).slice(-2);
    var day = ('0' + d.getDate()).slice(-2);
    return y + '-' + m + '-' + day;
  }
});
