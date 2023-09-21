<template>
  <div class="Playlist">
    <!--导航栏开始-->
    <div class="top">
      <div class="fanhui" @click="topreturn">＜</div>
      <div class="title">歌单</div>
    </div>
    <!--导航栏结束-->
    <!--歌单详情-->
    <div class="banner">
      <div>
        <div>
          <img class="listpic" :src="playlistmsg.coverImgUrl" alt="" />
        </div>
      </div>
      <div class="head-info">
        <div class="listname">{{ playlistmsg.name }}</div>
        <div>
          <img class="createrpic" :src="creatormsg.avatarUrl" alt="" />
        </div>
        <div class="creatername">{{ creatormsg.nickname }}</div>
      </div>
      <div class="desc" @click="goDesc">
        <div v-if="!isdesc" class="description one-txt">
          无
        </div>
        <div v-else class="description one-txt">
          {{ playlistmsg.description }}
        </div>
        <div class="descmore">＞</div>
      </div>
    </div>

    <!--歌单简介弹出页面-->
    <van-popup
      class="descshow"
      v-model="showdesc"
      closeable
      position="bottom"
      :style="{ width: '100%', height: '100%' }"
    >
      <div>
        <img class="showlistimg" :src="playlistmsg.coverImgUrl" alt=""> 
      </div>
      <div class="showlisttitle">{{playlistmsg.name}}</div>
      <div class="showlistdesc">
        <div v-for="(item,index) in playlistdesc" :key="index">
          <div class="desclist">{{item}}<br/>
        </div>
      </div>
      </div>
    </van-popup>

    <!--播放列表-->
    <div class="playlist">
      <div class="playlisttop">
        <div>
          <img class="playallicon" src="../assets/icon/播放全部.png" alt=""  @click="playmusic(0)"/>
        </div>
        <div class="playalltitle">播放全部</div>
        <div class="playlistnum">(共{{ playlist.length }}首)</div>
        <div class="shoucangbutton">
          收藏({{ changeCount(playlistmsg.subscribedCount) }})
        </div>
      </div>
      <div v-for="(item, index) in playlist" :key="index">
        <div class="songs" :class='{bg:index==isactive}' @click="playmusic(index)">
          <div class="songindex">{{ index + 1 }}</div>
          <div class="songname one-txt">{{ item.name }}</div>
          <div v-if="item.ar.length>1" class="songer one-txt">
            <span v-for="(item1, i) in item.ar.slice(0,item.ar.length-1)" :key="i">
              {{ item1.name }} /
            </span>
            <span>{{item.ar[item.ar.length-1].name}}</span>
          </div>
          <div v-else class="songer one-txt">
            <span v-for="(item1, i) in item.ar" :key="i">
              {{ item1.name }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div class="footbox"></div>
  </div>
</template>

<script>
import res from "../request/request";
import store from "@/store/index";
export default {
  data() {
    return {
      //歌单id
      playlistid: "",
      //歌单详情信息
      playlistmsg: [],
      //歌单简介信息
      playlistdesc:[],
      //歌单简介有无
      isdesc:true,
      //歌单作者信息
      creatormsg: [],
      //歌曲列表
      playlist: [],
      //歌单简介界面显示
      showdesc:false,
      //选中
      isactive:'a'
    };
  },
  created() {
    this.getPlaylist();
  },
  methods: {
    //返回跳转
    topreturn() {
      //跳转回上一个页面
      this.$router.go(-1);
    },
    //获取歌单列表数据
    getPlaylist() {
      //接收路由传参的歌单id
      this.playlistid = this.$route.query.id;
      res
        .request({
          url: "/playlist/detail",
          params: {
            id: this.playlistid,
          },
        })
        .then((data) => {
          console.log("歌单详情", data);
          //console.log(data.playlist.subscribedCount);
          this.playlistmsg = data.playlist;
          this.creatormsg = data.playlist.creator;
          //拆分歌单简介信息
          if(data.playlist.description == null){
            this.isdesc = false;
          }else{
            this.playlistdesc = data.playlist.description.split("\n");
          }
        });

      res
        .request({
          url: "/playlist/track/all",
          params: {
            id: this.playlistid,
          },
        })
        .then((data) => {
          console.log("歌单所有歌曲", data);
          //console.log(data.songs.length);
          this.playlist = data.songs;
        });
    },
    //处理播放量数据
    changeCount(num) {
      if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + "亿";
      } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + "万";
      } else{
        return num
      }
    },
    //歌单简介弹出界面
    goDesc(){
      this.showdesc = true;
    },
    //点击列表播放歌曲
    playmusic(index){
      store.commit("updatePlaylist",this.playlist);
      store.commit("updateIndex",index);
      this.isactive=index;
    },
  },
  computed:{
    //返回歌曲在列表中的下标值
    storeindex() {
      return store.state.map.playListIndex;
    },
  },
  watch:{
    //监听如果发生改变，就切换背景高亮
    async storeindex(){
      this.isactive=store.state.map.playListIndex;
    }
  }
};
</script>

<style lang="less" scoped>
.Playlist {
  //height: auto;
  //background-color: #888080;
  .top {
    width: 100%;
    height: 50px;
    background-color: rgba(211, 211, 211, 0.2);
    position: fixed;
    .fanhui {
      float: left;
      margin-left: 10px;
      margin-top: 15px;
      color: gray;
      font-size: 20px;
    }
    .title {
      float: left;
      margin-top: 14px;
      margin-left: 37%;
      font-weight: bold;
    }
  }
  .banner {
    float: left;
    background-color: rgba(107, 104, 101, 0.2);
    width: 100%;
    height: auto;
    padding-bottom: 10px;
    margin-top: 50px;
    .listpic {
      float: left;
      border: 0px solid rgb(128, 123, 123);
      margin-top: 10px;
      margin-left: 10px;
      width: 130px;
      height: 130px;
      border-radius: 10%;
      overflow: hidden;
    }
    .head-info {
      float: left;
      margin-left: 10px;
      .listname {
        float: left;
        width: 200px;
        text-align: left;
        margin-top: 10px;
        font-weight: bold;
        font-size: 15px;
      }
      .createrpic {
        float: left;
        width: 20px;
        height: 20px;
        margin-top: 20px;
        border-radius: 100%;
        overflow: hidden;
      }
      .creatername {
        float: left;
        margin-left: 10px;
        margin-top: 20px;
        font-size: 14px;
        color: #7e7777;
      }
    }
    .desc {
      float: left;
      width: 100%;
      //margin-left: 10px;
      margin-top: 10px;
      //background-color: red;
      .description {
        float: left;
        margin-left: 10px;
        width: 85%;
        color: #807d7d;
        //background-color: blue;
        text-align: left;
        font-size: 14px;
      }
      .descmore {
        float: right;
        color: #807d7d;
        margin-right: 10px;
        font-size: 14px;
      }
    }
  }
  .descshow{
    background-color: #d6d0d0;
    .showlistimg{
      float: left;
      //left: 85px;
      width: 200px;
      height: 200px;
      margin-left: 87.5px;
      margin-top: 50px;
      border-radius: 10px;
    }
    .showlisttitle{
      float: left;
      font-size: 17px;
      font-weight: bold;
      width: 250px;
      text-align: center;
      margin-left: 70px;
      margin-top: 13px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(40, 42, 42, 0.1);
    }
    .showlistdesc{
      margin-top: 10px;
      width: 340px;
      float: left;
      margin-left: 17.5px;
      font-size: 13px;
      text-align: center;
      padding-bottom: 30px;
    }
    /deep/ .van-popup__close-icon{
      color: rgb(97, 92, 92);
    }
  }
  .playlist {
    width: 100%;
    height: auto;
    background-color: white;
    //margin-top: 100px;
    .playlisttop {
      float: left;
      width: 100%;
      height: auto;
      //background-color: blue;
      padding-bottom: 10px;
      .playallicon {
        width: 30px;
        float: left;
        margin-top: 5px;
        margin-left: 5px;
      }
      .playalltitle {
        float: left;
        font-size: 15px;
        font-weight: bold;
        margin-left: 10px;
        margin-top: 10px;
      }
      .playlistnum {
        float: left;
        color: #999898;
        font-size: 12px;
        margin-top: 12px;
      }
      .shoucangbutton {
        float: right;
        color: #807d7d;
        margin-right: 10px;
        margin-top: 10px;
        font-size: 14px;
      }
    }
    .songs {
      float: left;
      height: 50px;
      width: 100%;
      padding-top: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(40, 42, 42, 0.1);
      .songindex {
        float: left;
        color: #807d7d;
        font-size: 15px;
        width: 25.2px;
        margin-left: 13px;
        margin-top: 15px;
      }
      .songname {
        float: left;
        width: 200px;
        //background-color: red;
        font-weight: bold;
        font-size: 15px;
        text-align: left;
        margin-left: 17px;
        margin-top: 5px;
      }
      .songer {
        float: left;
        position: absolute;
        color: #999898;
        font-size: 12px;
        margin-top: 27px;
        margin-left: 55px;
        width: 200px;
        //background-color: greenyellow;
        text-align: left;
      }
    }
    .bg{
      background-color: rgb(223, 223, 223);
    }
  }
  .footbox{
    float: left;
    height: 120px;
  }
}
</style>