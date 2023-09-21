<template>
  <div class="FooterMusic">
    <div class="Musictitle" @click="Songshow">
      <img
        class="musicpic"
        :src="
          $store.state.map.playList[$store.state.map.playListIndex].al.picUrl
        "
        alt=""
      />
      <p class="musicname one-txt">
        {{ $store.state.map.playList[$store.state.map.playListIndex].name }}
      </p>
    </div>
    <div class="Musicicon">
      <div @click="play()" v-if="$store.state.map.isbtnShow">
        <img class="playicon" src="../assets/icon/歌曲播放.png" alt="" />
      </div>
      <div @click="play()" v-else>
        <img class="playicon" src="../assets/icon/暂停.png" alt="" />
      </div>
      <div @click="Listshow()">
        <img class="listicon" src="../assets/icon/播放列表2.png" alt="" />
      </div>
    </div>

    <audio
      class="bofang"
      ref="audio"
      @pause="pauseTime"
      @ended="switchsong(1)"
      :src="musicURL"
    ></audio>

    <!-- <audio
      class="bofang"
      ref="audio"
      @pause="pauseTime"
      @ended="switchsong(1)"
      :src="`https://music.163.com/song/media/outer/url?id=${
        $store.state.map.playList[$store.state.map.playListIndex].id
      }.mp3`"
    ></audio> -->

    <!--歌曲详情弹出页面-->
    <van-popup
      class="songshow"
      v-model="$store.state.map.detailShow"
      closeable
      close-icon-position="top-left"
      close-icon="arrow-down"
      position="bottom"
      :style="{ width: '100%', height: '100%' }"
    >
      <div class="detailbgc">
        <div class="detailtop">
          <p class="detailsongname">
            <marquee width="150px" direction="left" scrollamount="2">
              {{
                $store.state.map.playList[$store.state.map.playListIndex].name
              }}
            </marquee>
          </p>
          <!--歌手名字处理-->
          <div
            v-if="
              $store.state.map.playList[$store.state.map.playListIndex].ar
                .length > 1
            "
            class="detailsonger one-txt"
          >
            <span
              v-for="(item, index) in $store.state.map.playList[
                $store.state.map.playListIndex
              ].ar.slice(
                0,
                $store.state.map.playList[$store.state.map.playListIndex].ar
                  .length - 1
              )"
              :key="index"
            >
              {{ item.name }} /
            </span>
            <span>{{
              $store.state.map.playList[$store.state.map.playListIndex].ar[
                $store.state.map.playList[$store.state.map.playListIndex].ar
                  .length - 1
              ].name
            }}</span>
          </div>
          <div v-else class="detailsonger one-txt">
            <span
              v-for="(item1, i) in $store.state.map.playList[
                $store.state.map.playListIndex
              ].ar"
              :key="i"
            >
              {{ item1.name }}
            </span>
          </div>
        </div>

        <div class="detailContent" v-show="!isLyricshow">
          <img class="cdimg" src="../assets/icon/碟盘外框.png" alt="" />
          <img
            class="songimg"
            :class="{
              songimg_active: !$store.state.map.isbtnShow,
              songimg_paused: $store.state.map.isbtnShow,
            }"
            :src="
              $store.state.map.playList[$store.state.map.playListIndex].al
                .picUrl
            "
            @click="Lyricshow"
            alt=""
          />
        </div>
        <div
          class="detailContent1"
          @click="Lyricshow"
          v-show="isLyricshow"
          ref="musiclyric"
        >
          <p
            v-for="(item, index) in Lyric"
            :key="index"
            :class="{
              active:
                $store.state.map.currentTime * 1000 >= item.time &&
                $store.state.map.currentTime * 1000 < item.pre,
            }"
          >
            {{ item.lrc }}
          </p>
        </div>

        <div class="detailFooter">
          <div class="footicon">
            <img
              v-if="!islike"
              @click="changelike"
              class="likeicon"
              src="../assets/icon/喜欢.png"
              alt=""
            />
            <img
              v-else
              @click="changelike"
              class="likeicon"
              src="../assets/icon/喜欢2.png"
              art=""
            />
            <img
              class="downicon"
              @click="download"
              src="../assets/icon/下载.png"
              alt=""
            />
            <img
              class="dieicon"
              src="../assets/icon/光碟.png"
              alt=""
              @click="Lyricshow"
            />
            <img
              class="pingicon"
              src="../assets/icon/评论.png"
              alt=""
              @click="Commentshow"
            />
            <img
              v-if="isxun"
              class="xunicon"
              src="../assets/icon/循环播放.png"
              alt=""
              @click="changexun"
            />
            <img
              v-else
              class="xunicon"
              src="../assets/icon/单曲循环.png"
              alt=""
              @click="changexun"
            />
          </div>
          <input
            type="range"
            class="range"
            ref="songrange"
            @input="changeload"
            min="0"
            :max="Duration"
            v-model="$store.state.map.currentTime"
            step="0.05"
          />
          <div class="detailplayicon">
            <img
              class="playshangicon"
              src="../assets/icon/上一首.png"
              alt=""
              @click="switchsong(-1)"
            />
            <img
              class="playcentericon"
              v-if="$store.state.map.isbtnShow"
              @click="play()"
              src="../assets/icon/歌曲播放(1).png"
              alt=""
            />
            <img
              class="playcentericon"
              v-else
              @click="play()"
              src="../assets/icon/暂停(1).png"
              alt=""
            />
            <img
              class="playxiaicon"
              src="../assets/icon/下一首.png"
              alt=""
              @click="switchsong(1)"
            />
          </div>
        </div>
      </div>
    </van-popup>

    <!--歌曲评论页面弹出-->
    <van-popup
      class="commentshow"
      v-model="$store.state.map.commentShow"
      closeable
      close-icon-position="top-left"
      close-icon="arrow-left"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <div class="commenttop">
        <div class="commenttitle">部分热门评论</div>
      </div>
      <div class="commentList">
        <div v-for="(item, index) in hotcomment" :key="index">
          <div class="comments">
            <div class="contenttop">
              <div>
                <img class="commentpic" :src="item.user.avatarUrl" alt="" />
              </div>
              <p class="commentname">{{ item.user.nickname }}</p>
              <div class="contenttime">{{ item.timeStr }}</div>
              <div class="likedcount">{{ changeCount(item.likedCount) }}</div>
              <img class="likeicon" src="../assets/icon/点赞.png" alt="" />
            </div>
            <div class="content">{{ item.content }}</div>
          </div>
        </div>
      </div>
    </van-popup>

    <!--当前播放列表-->
    <van-popup
      class="listshow"
      v-model="$store.state.map.nowlistShow"
      position="bottom"
      :style="{ width: '100%', height: '50%' }"
    >
      <div class="nowlisttop">
        <div class="nowlisttitle">当前播放</div>
        <div class="nowlistnum">
          (共{{ $store.state.map.playList.length }}首)
        </div>
      </div>
      <div class="nowplaylist">
        <div v-for="(item, index) in $store.state.map.playList" :key="index">
          <div
            class="songs"
            :class="{ bg: index == isactive }"
            @click="playmusic(index)"
          >
            <div class="songindex">{{ index + 1 }}</div>
            <div class="songtitle one-txt">
              <div class="songname one-txt">{{ item.name }}</div>
              <div v-if="item.ar.length > 1" class="songer one-txt">
                <span
                  v-for="(item1, i) in item.ar.slice(0, item.ar.length - 1)"
                  :key="i"
                >
                  {{ item1.name }} /
                </span>
                <span>{{ item.ar[item.ar.length - 1].name }}</span>
              </div>
              <div v-else class="songer one-txt">
                <span v-for="(item1, i) in item.ar" :key="i">
                  {{ item1.name }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import store from "@/store/index";
import res from "../request/request";
//import { ref } from 'vue';
export default {
  data() {
    return {
      //歌曲信息列表
      playlistmsg: [],
      //列表下标
      listindex: "",
      //播放按钮图标是否显示
      playbtnshow: "",
      //歌词是否显示
      isLyricshow: false,
      //喜欢切换
      islike: false,
      //循环播放切换
      isxun: true,
      //歌词
      Lyric: {},
      //处理过的歌词
      Lyric_chu: [],
      //歌曲总时长
      Duration: 0,
      //热门评论
      hotcomment: [],
      //获取播放时间计时器
      interVal: 0,
      //选中
      isactive: "a",
      //音乐url
      musicURL:""
    };
  },
  created() {},
  mounted() {
    //获取音乐url
    this.getMusic(store.state.map.playList[store.state.map.playListIndex].id);
    //获取歌词
    this.getLyric(store.state.map.playList[store.state.map.playListIndex].id);
    //获取评论
    this.getComment(store.state.map.playList[store.state.map.playListIndex].id);
    //获取当前歌曲总时长
    this.addDuration();
  },
  updated() {
    //获取当前歌曲总时长
    this.addDuration();
    //console.log(this.Lyric);
  },
  methods: {
    //点击播放
    play() {
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
        store.commit("updateIsbtn", false);
        //console.log(store.state.map.isbtnShow);
        //歌曲列表背景高亮
        this.isactive = store.state.map.playListIndex;
        this.updateTime();
      } else {
        this.$refs.audio.pause();
        store.commit("updateIsbtn", true);
        //console.log(store.state.map.isbtnShow);
        clearInterval(this.interVal);
      }
    },
    //获取评论
    getComment(value) {
      res
        .request({
          url: "/comment/hot",
          params: {
            id: value,
            type: 0,
            limit: 20,
          },
        })
        .then((data) => {
          //console.log("评论信息",data);
          store.commit("updateCommentList", data.hotComments);
          //console.log("store里的comment",[store.state.map.commentList]);
          this.hotcomment = store.state.map.commentList;
          //console.log([this.hotcomment]);
        });
    },
    //获取歌词
    getLyric(value) {
      res
        .request({
          url: "/lyric",
          params: {
            id: value,
          },
        })
        .then((data) => {
          //console.log("歌词",data.lrc.lyric);
          store.commit("updateLyricList", data.lrc);
          this.Lyric = store.state.map.lyricList;
          //console.log("处理后的歌词",this.Lyric);
        });
    },
    //获取音乐url
    getMusic(value){
      res.request({
        url:"/song/url",
        params:{
          id:value,
        },
      }).then((data)=>{
        //console.log("音乐url",data.data[0]);
        this.musicURL = data.data[0].url;
        //console.log(this.musicURL);
      })
    },
    //获取歌曲时长
    addDuration() {
      //console.log("歌曲总时长",this.$refs.audio.duration);
      store.commit("updateDuration", this.$refs.audio.duration);
      this.Duration = store.state.map.duration;
    },
    //获取当前歌曲播放时间
    updateTime() {
      this.interVal = setInterval(() => {
        store.commit("updateCurrentTime", this.$refs.audio.currentTime);
        //console.log(store.state.map.currentTime);
      }, 100);
    },
    //改变进度条位置
    changeload() {
      let p = document.querySelector("p.active");
      let b = 0;
      //将当前改变后的时间传给state里的currentTime
      store.commit("updateCurrentTime", this.$refs.songrange.value);
      //更新播放进度
      this.$refs.audio.currentTime = store.state.map.currentTime;
      if (p) {
        //console.log("p.offsetTop:",p.offsetTop);
        if (p.offsetTop > 260) {
          b = p.offsetTop - 260;
          this.$refs.musiclyric.scrollTop = b;
          //console.log(this.$refs.musiclyric.scrollTop);
        } else if (p.offsetTop < 260) {
          this.$refs.musiclyric.scrollTop = 0;
        }
      }
    },
    //暂停清除定时器
    pauseTime() {
      clearInterval(this.interVal);
      //console.log("test");
    },
    //喜欢切换
    changelike() {
      this.islike = !this.islike;
    },
    //下载提示
    download() {
      this.$toast.success("下载(迫真)");
      this.$toast.setDefaultOptions({ duration: 2000 });
    },
    //循环播放切换
    changexun() {
      this.isxun = !this.isxun;
      if (!this.isxun) {
        this.$toast("单曲循环");
      } else {
        this.$toast("列表循环");
      }
    },
    //显示歌词
    Lyricshow() {
      this.isLyricshow = !this.isLyricshow;
    },
    //切换上一首下一首歌曲
    switchsong(num) {
      let index = store.state.map.playListIndex + num;
      if (index < 0) {
        index = store.state.map.playList.length - 1;
      } else if (index == store.state.map.playList.length) {
        index = 0;
      }
      store.commit("updateIndex", index);
    },
    //弹出歌曲详情页面
    Songshow() {
      store.commit("updateDetailShow");
    },
    //弹出当前播放列表页面
    Listshow() {
      store.commit("updateNowlistShow");
    },
    //弹出歌曲评论页面
    Commentshow() {
      store.commit("updateCommentShow");
    },
    //点击列表播放歌曲
    playmusic(index) {
      //store.commit("updatePlaylist",this.playlist);
      store.commit("updateIndex", index);
      this.isactive = index;
    },
    //处理播放量数据
    changeCount(num) {
      if (num >= 100000000) {
        return (num / 100000000).toFixed(1) + "亿";
      } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + "万";
      } else {
        return num;
      }
    },
  },
  computed: {
    //返回歌曲在列表中的下标值
    storeindex() {
      return store.state.map.playListIndex;
    },
    //返回歌单列表
    storeplaylist() {
      return store.state.map.playList;
    },
    //返回歌曲播放当前时间
    storecurrent() {
      return store.state.map.currentTime;
    },
  },
  watch: {
    //监听如果发生改变，就自动播放音乐
    async storeindex() {
      this.$refs.audio.autoplay = true;
      //切换当前播放列表背景高亮
      this.isactive = store.state.map.playListIndex;
      //获取音乐url
      this.getMusic(store.state.map.playList[store.state.map.playListIndex].id);
      //获取当前歌曲播放时间
      this.updateTime();
      //获取歌词
      this.getLyric(store.state.map.playList[store.state.map.playListIndex].id);
      //获取评论
      this.getComment(
        store.state.map.playList[store.state.map.playListIndex].id
      );
      if (this.$refs.audio.paused) {
        store.commit("updateIsbtn", false);
      }
    },
    async storeplaylist() {
      if (store.state.map.isbtnShow) {
        this.$refs.audio.autoplay = true;
        //切换当前播放列表背景高亮
        this.isactive = store.state.map.playListIndex;
        //获取音乐url
        this.getMusic(store.state.map.playList[store.state.map.playListIndex].id);
        //获取当前歌曲播放时间
        this.updateTime();
        //获取歌词
        this.getLyric(
          store.state.map.playList[store.state.map.playListIndex].id
        );
        //获取评论
        this.getComment(
          store.state.map.playList[store.state.map.playListIndex].id
        );
        store.commit("updateIsbtn", false);
      }
    },
    //监听改变歌词高亮位置
    async storecurrent() {
      let p = document.querySelector("p.active");
      //console.log(store.state.map.currentTime);
      //console.log("p.offsetTop:",p.offsetTop);
      let b = 0;
      //console.log([this.$refs.musiclyric]);
      if (p) {
        //console.log("p.offsetTop:",p.offsetTop);
        if (p.offsetTop > 260) {
          b = p.offsetTop - 260;
          this.$refs.musiclyric.scrollTop = b;
          //console.log(this.$refs.musiclyric.scrollTop);
        } else if (p.offsetTop < 260) {
          this.$refs.musiclyric.scrollTop = 0;
        }
      }
      //切换单曲循环播放模式方法
      if (this.isxun == false) {
        //console.log("当前时间",this.$refs.audio.currentTime);
        //console.log("总时间",store.state.map.duration);
        if (
          this.$refs.audio.currentTime >= store.state.map.duration - 0.3 &&
          this.$refs.audio.currentTime <= store.state.map.duration - 0.1
        ) {
          //将当前播放时间改为0并传给state里的currentTime
          store.commit("updateCurrentTime", 0);
          //console.log("改了吗",store.state.map.currentTime);
          //更新播放进度
          this.$refs.audio.currentTime = store.state.map.currentTime;
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.FooterMusic {
  width: 100%;
  height: 50px;
  //background-color: white;
  background: repeating-linear-gradient(
    to left,
    rgb(108, 165, 230),
    rgb(67, 130, 224)
  );
  position: fixed;
  bottom: 0;
  //border: 1px solid rgb(212, 210, 210);
  .Musictitle {
    float: left;
    .musicpic {
      float: left;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      margin-left: 10px;
      margin-top: 5px;
    }
    .musicname {
      float: left;
      width: 220px;
      text-align: left;
      //font-weight: bold;
      font-size: 15px;
      color: white;
      margin-left: 10px;
    }
  }
  .Musicicon {
    float: right;
    .playicon {
      float: right;
      width: 20px;
      margin-right: 50px;
      margin-top: 15px;
    }
    .listicon {
      float: right;
      width: 25px;
      margin-right: 10px;
      margin-top: -22px;
    }
  }
  .bofang {
    width: 100px;
    height: 30px;
    float: left;
  }
  /deep/ .van-popup {
    background-color: rgb(185, 182, 182);
  }
  /deep/ .van-popup__close-icon {
    left: 4%;
    color: white;
    position: fixed;
  }
  .detailbgc {
    width: 100%;
    height: 100%;
    .detailtop {
      float: left;
      width: 98%;
      height: 60px;
      //border-bottom: 1px solid gray;
      .detailsongname {
        float: left;
        font-size: 17px;
        margin-left: 50px;
        margin-top: 10px;
        color: white;
        //width: 100px;
        //background-color: blue;
      }
      .detailsonger {
        float: left;
        position: absolute;
        font-size: 12px;
        margin-left: 50px;
        margin-top: 35px;
        //width: 100px;
      }
    }
    .detailContent {
      float: left;
      width: 100%;
      height: 60%;
      margin-top: 5%;
      margin-bottom: 5%;
      //border-bottom: 1px solid gray;
      //background-color: blue;
      .cdimg {
        float: left;
        margin-left: 16.65%;
        margin-top: 12.5%;
        width: 66.7%;
      }
      .songimg {
        float: left;
        position: absolute;
        width: 45.3%;
        margin-left: 27.33%;
        margin-top: 23.5%;
        border-radius: 50%;
        animation: rotate_songimg 15s linear infinite;
      }
      //碟片转动
      .songimg_active {
        animation-play-state: running;
      }
      //碟片暂停转动
      .songimg_paused {
        animation-play-state: paused;
      }
      @keyframes rotate_songimg {
        0% {
          transform: rotateZ(0deg);
        }
        100% {
          transform: rotateZ(360deg);
        }
      }
    }
    .detailContent1 {
      float: left;
      width: 90%;
      height: 60%;
      margin-top: 5%;
      margin-left: 5%;
      margin-bottom: 5%;
      overflow: scroll;
      //overflow-x: hidden;
      //padding-right: 25px;
      scroll-behavior: smooth;
      //background-color: aqua;
      p {
        color: rgb(99, 97, 97);
        margin-bottom: 10px;
      }
      .active {
        color: white;
        font-size: 25px;
      }
    }
    .detailFooter {
      float: left;
      width: 100%;
      height: 23.2%;
      //border-bottom: 1px solid gray;
      .footicon {
        float: left;
        width: 90%;
        height: 25%;
        margin-left: 5%;
        margin-bottom: 5%;
        //border-bottom: 1px solid gray;
        .likeicon,
        .downicon,
        .dieicon,
        .pingicon,
        .xunicon {
          float: left;
          width: 30px;
          margin-left: 10.2%;
          margin-top: 1.5%;
        }
      }
      .range {
        width: 90%;
        height: 5%;
      }
      .detailplayicon {
        float: left;
        width: 60%;
        height: 40%;
        //align-content: center;
        margin-left: 21%;
        margin-top: 5%;

        .playshangicon,
        .playcentericon,
        .playxiaicon {
          float: left;
          width: 25px;
          margin-left: 15%;
          margin-top: 5%;
        }
        .playcentericon {
          width: 50px;
          margin-top: 1%;
        }
      }
    }
  }
  .commenttop {
    float: left;
    width: 100%;
    height: 50px;
    position: fixed;
    background-color: rgb(185, 182, 182);
    .commenttitle {
      float: left;
      font-size: 17px;
      font-weight: bold;
      margin-left: 40px;
      margin-top: 15px;
    }
  }
  .commentList {
    float: left;
    width: 100%;
    height: auto;
    margin-top: 40px;
    .comments {
      float: left;
      height: auto;
      width: 100%;
      padding-top: 5px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(23, 24, 24, 0.1);
      .contenttop {
        width: 100%;
        height: 50px;
        .commentpic {
          float: left;
          width: 35px;
          height: 35px;
          margin-left: 10px;
          margin-top: 10px;
          border-radius: 100%;
          overflow: hidden;
        }
        .commentname {
          float: left;
          margin-left: 10px;
          margin-top: 13px;
          font-size: 14px;
          color: #555252;
          //background-color: blue;
        }
        .contenttime {
          position: absolute;
          margin-left: 55px;
          margin-top: 35px;
          font-size: 5px;
          color: #7a7878;
          //background-color: blue
        }
        .likedcount {
          position: absolute;
          margin-top: 14px;
          margin-left: 295px;
          text-align: right;
          color: #6b6969;
          width: 40px;
          font-size: 10px;
        }
        .likeicon {
          position: absolute;
          width: 15px;
          margin-top: 14px;
          margin-left: 340px;
        }
      }
      .content {
        float: left;
        width: 80%;
        margin-left: 55px;
        margin-top: 10px;
        font-size: 15px;
        text-align: left;
        color: #6b6969;
      }
    }
  }
  .nowlisttop {
    float: left;
    width: 98%;
    height: 40px;
    position: fixed;
    background-color: rgb(185, 182, 182);
    .nowlisttitle {
      float: left;
      font-size: 15px;
      font-weight: bold;
      margin-left: 20px;
      margin-top: 10px;
    }
    .nowlistnum {
      float: left;
      color: #6b6969;
      font-size: 12px;
      margin-top: 13px;
    }
  }
  .nowplaylist {
    float: left;
    width: 100%;
    height: auto;
    margin-top: 40px;
    .songs {
      float: left;
      height: 30px;
      width: 100%;
      padding-top: 5px;
      padding-bottom: 5px;
      border-bottom: 1px solid rgba(23, 24, 24, 0.1);
      .songindex {
        float: left;
        color: #807d7d;
        font-size: 15px;
        width: 25px;
        margin-left: 5px;
        margin-top: 7px;
      }
      .songtitle {
        float: left;
        margin-left: 5px;
        //width: 360px;
        .songname {
          float: left;
          width: 180px;
          font-size: 15px;
          text-align: left;
          margin-left: 10px;
          margin-top: 5px;
        }
        .songer {
          float: left;
          color: #727070;
          font-size: 12px;
          margin-top: 7px;
          margin-left: 5px;
          width: 140px;
          text-align: left;
        }
      }
    }
    .bg {
      background-color: rgb(165, 162, 162);
    }
  }
}
</style>