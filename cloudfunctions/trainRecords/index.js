// 云函数：trainRecords - 训练记录增删查
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const action = event.action;

  if (action === 'add') {
    const record = event.record || event;
    const res = await db.collection('train_records').add({
      data: {
        _openid: openid,
        _recordId: record._id || '',
        trainType: record.trainType || '',
        exerciseCount: record.exerciseCount || 0,
        duration: record.duration || 0,
        calories: record.calories || 0,
        trainDate: record.trainDate || '',
        totalSeconds: record.totalSeconds || 0,
        timeDisplay: record.timeDisplay || '',
        exercises: record.exercises || [],
        createdAt: db.serverDate()
      }
    });
    return { success: true, _id: res._id };
  }

  if (action === 'delete') {
    try {
      await db.collection('train_records').where({ _openid: openid, _recordId: event.recordId }).remove();
    } catch (e) {
      await db.collection('train_records').doc(event.recordId).remove();
    }
    return { success: true };
  }

  if (action === 'list') {
    const res = await db.collection('train_records')
      .where({ _openid: openid })
      .orderBy('trainDate', 'desc')
      .orderBy('createdAt', 'desc')
      .limit(100)
      .get();
    // 转换云端数据格式到本地格式
    const records = res.data.map(function(r) {
      return {
        _id: r._recordId || r._id,
        trainType: r.trainType,
        exerciseCount: r.exerciseCount,
        duration: r.duration,
        calories: r.calories,
        trainDate: r.trainDate,
        totalSeconds: r.totalSeconds,
        timeDisplay: r.timeDisplay,
        exercises: r.exercises || []
      };
    });
    return { success: true, records: records };
  }

  return { success: false, msg: 'unknown action' };
};
