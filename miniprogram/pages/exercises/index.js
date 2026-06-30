Page({
  data:{cur:'all',cats:[],list:[],n:0},
  onLoad:function(o){
    if(o&&o.fav==='1')this.setData({cur:'fav'});
    var cats=[{key:'chest',name:'胸部'},{key:'back',name:'背部'},{key:'legs',name:'腿部'},{key:'shoulder',name:'肩部'},{key:'arms',name:'手臂'},{key:'core',name:'核心'},{key:'cardio',name:'有氧'}];
    var exs=[{id:1,name:'平板杠铃卧推',cat:'chest',muscle:'胸大肌',level:'基础'},{id:2,name:'上斜哑铃卧推',cat:'chest',muscle:'上胸',level:'基础'},{id:3,name:'哑铃飞鸟',cat:'chest',muscle:'胸大肌',level:'进阶'},{id:4,name:'绳索夹胸',cat:'chest',muscle:'胸中缝',level:'进阶'},{id:5,name:'引体向上',cat:'back',muscle:'背阔肌',level:'基础'},{id:6,name:'杠铃划船',cat:'back',muscle:'背阔肌',level:'基础'},{id:7,name:'高位下拉',cat:'back',muscle:'背阔肌',level:'基础'},{id:8,name:'坐姿划船',cat:'back',muscle:'中背',level:'进阶'},{id:9,name:'杠铃深蹲',cat:'legs',muscle:'股四头肌',level:'基础'},{id:10,name:'腿举',cat:'legs',muscle:'股四头肌',level:'基础'},{id:11,name:'罗马尼亚硬拉',cat:'legs',muscle:'腘绳肌',level:'进阶'},{id:12,name:'哑铃弓步蹲',cat:'legs',muscle:'臀腿',level:'基础'},{id:13,name:'哑铃推举',cat:'shoulder',muscle:'三角肌',level:'基础'},{id:14,name:'侧平举',cat:'shoulder',muscle:'三角肌中束',level:'基础'},{id:15,name:'面拉',cat:'shoulder',muscle:'后束',level:'进阶'},{id:16,name:'杠铃弯举',cat:'arms',muscle:'肱二头肌',level:'基础'},{id:17,name:'窄距卧推',cat:'arms',muscle:'肱三头肌',level:'进阶'},{id:18,name:'锤式弯举',cat:'arms',muscle:'肱肌',level:'基础'},{id:19,name:'平板支撑',cat:'core',muscle:'核心',level:'基础'},{id:20,name:'卷腹',cat:'core',muscle:'腹直肌',level:'基础'},{id:21,name:'悬垂举腿',cat:'core',muscle:'下腹',level:'进阶'},{id:22,name:'跑步机',cat:'cardio',muscle:'全身',level:'基础'},{id:23,name:'跳绳',cat:'cardio',muscle:'全身',level:'基础'},{id:24,name:'波比跳',cat:'cardio',muscle:'全身',level:'进阶'}];
    var favs=wx.getStorageSync('exercise_favs')||[];
    exs.forEach(function(e){e.fav=favs.indexOf(e.id)!==-1;e.sel=false});
    this.setData({cats:cats,all:exs});this._filter();
  },
  onCat:function(e){this.setData({cur:e.currentTarget.dataset.c});this._filter()},
  _filter:function(){
    var c=this.data.cur,all=this.data.all;
    var list;
    if(c==='all')list=all;
    else if(c==='fav')list=all.filter(function(e){return e.fav});
    else list=all.filter(function(e){return e.cat===c});
    this.setData({list:list});
  },
  onSel:function(e){
    var id=e.currentTarget.dataset.id,all=this.data.all,list=this.data.list;
    var ex=all.find(function(x){return x.id===id});if(!ex)return;
    ex.sel=!ex.sel;
    var le=list.find(function(x){return x.id===id});if(le)le.sel=ex.sel;
    var n=all.filter(function(x){return x.sel}).length;
    this.setData({all:all,list:list,n:n});
  },
  onFav:function(e){
    var id=e.currentTarget.dataset.id,all=this.data.all;
    var ex=all.find(function(x){return x.id===id});if(!ex)return;
    ex.fav=!ex.fav;
    var favs=all.filter(function(x){return x.fav}).map(function(x){return x.id});
    wx.setStorageSync('exercise_favs',favs);
    this.setData({all:all});this._filter();
  },
  onAdd:function(){
    var sel=this.data.all.filter(function(x){return x.sel});
    if(!sel.length){wx.showToast({title:'请选择动作',icon:'none'});return}
    wx.setStorageSync('selected_exercises',sel.map(function(x){return{name:x.name,category:x.cat}}));
    this.data.all.forEach(function(x){x.sel=false});
    this.setData({all:this.data.all,n:0});this._filter();
    wx.navigateBack();
  }
})