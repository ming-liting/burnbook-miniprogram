// 云函数：login - 获取用户 openid + 同步用户档案
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openid = wxContext.OPENID;
  const now = db.serverDate();

  const userRes = await db.collection('user_info').where({ _openid: openid }).get();

  if (userRes.data.length === 0) {
    const newUser = {
      _openid: openid,
      nickName: event.nickName || '燃本人',
      avatarUrl: event.avatarUrl || '',
      email: event.email || '',
      createdAt: now,
      lastLoginAt: now
    };
    await db.collection('user_info').add({ data: newUser });
    return { openid: openid, isNew: true, userInfo: newUser };
  }

  const user = userRes.data[0];
  await db.collection('user_info').doc(user._id).update({
    data: {
      nickName: event.nickName || user.nickName,
      avatarUrl: event.avatarUrl || user.avatarUrl,
      email: event.email || user.email || '',
      lastLoginAt: now
    }
  });

  return {
    openid: openid,
    isNew: false,
    userInfo: {
      nickName: event.nickName || user.nickName,
      avatarUrl: event.avatarUrl || user.avatarUrl,
      email: event.email || user.email || ''
    }
  };
};
