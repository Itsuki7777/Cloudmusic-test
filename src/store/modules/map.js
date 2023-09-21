//import axios from "axios";

//import res from "@request/request";
const state = {
  //播放列表
  playList: [
    {
      al: {
        id: 152033474,
        name: "青春コンプレックス",
        pic: 109951167898699340,
        picUrl:
          "http://p3.music.126.net/VXqVAs8P4ko7j7ft94KUiw==/109951167898699349.jpg",
        pic_str: "109951167898699349",
      },
      name: "青春コンプレックス",
      id: 1983527215,
      ar:[{
        name:"結束バンド"
      },]
    },
    {
      al: {
        id: 165227805,
        name: "光の中へ",
        pic: 109951168600028690,
        picUrl:
          "http://p4.music.126.net/46eCLFr03W610lhOct2Peg==/109951168600028683.jpg",
        pic_str: "109951168600028683",
      },
      name: "光の中へ",
      id: 2045878962,
      ar:[{
        name:"結束バンド"
      },]
    },
    {
      al: {
        id: 155874456,
        name: "星座になれたら",
        pic: 109951168110222500,
        picUrl:
          "http://p4.music.126.net/KcRtt7Vi4b-jWSKmCgb8zQ==/109951168110222499.jpg",
        pic_str: "109951168110222499",
      },
      name: "星座になれたら",
      id: 2003496380,
      ar:[{
        name:"結束バンド"
      },]
    },
    {
      al: {
        id: 153542094,
        name: "ギターと孤独と蒼い惑星",
        pic: 109951167983448240,
        picUrl:
          "http://p4.music.126.net/rfstzrVK05hCPjU-4mzSFA==/109951167983448236.jpg",
        pic_str: "109951167983448236",
      },
      name: "ギターと孤独と蒼い惑星",
      id: 1991012773,
      ar:[{
        name:"結束バンド"
      },]
    },
  ],
  playListIndex: 0, //默认下标为0
  isbtnShow: true, //暂停按钮显示
  detailShow:false,  //歌曲详情弹出显示
  nowlistShow:false,  //当前播放列表弹出显示
  commentShow:false,  //歌曲评论页面弹出显示
  lyricList:[],     //歌词  
  commentList:[],    //热门评论
  currentTime:0,   //当前时间
  duration:0,      //歌曲总时长
};

const mutations = {
  updateIsbtn(state, value) {
    state.isbtnShow = value;
  },
  updatePlaylist(state, value) {
    state.playList = value;
  },
  updateIndex(state,value){
    state.playListIndex=value;
  },
  updateNewsong(state,value){
    state.playList.unshift(value);
  },
  updateDetailShow(state){
    state.detailShow=!state.detailShow;
  },
  updateNowlistShow(state){
    state.nowlistShow=!state.nowlistShow;
  },
  updateCommentShow(state){
    state.commentShow = !state.commentShow;
  },
  updateCommentList(state,value){
    state.commentList = value;
  },
  updateLyricList(state,value){
    let arr;
    let lylist = value;
      if(lylist.lyric){
        //使用正则以换行符进行切割
        arr=lylist.lyric.split(/[(\r\n)\r\n]+/).map((item)=>{
          let min = item.slice(item.indexOf('[')+1,item.indexOf(':'));
          let sec = item.slice(item.indexOf(':')+1,item.indexOf('.'));
          let mill = item.slice(item.indexOf('.')+1,item.indexOf(']'));
          let lrc = item.slice(item.indexOf(']')+1,item.length);
          let time = parseInt(min)*60*1000+parseInt(sec)*1000+parseInt(mill);
          //console.log(min,sec,Number(mill),lrc);
          return {min,sec,mill,lrc,time}
        })
        arr.forEach((item,i) => {
          if(i===arr.length-1){
            item.pre=0
          }else{
            item.pre=arr[i+1].time
          }
          if(i===arr.length-2){
            //console.log(arr[i].time,item.pre)
            item.pre=arr[i].time+100000
          }
        });
      }
      //console.log(arr);
      state.lyricList=arr;
  },
  updateCurrentTime(state,value){
    state.currentTime=value;
  },
  updateDuration(state,value){
    state.duration = value;
  }
};

export default {
  state,
  mutations,
};
