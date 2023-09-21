<template>
  <div class="Search">
    <div class="head">
      <div class="fanhui" @click="topreturn">＜</div>
      <div class="head-search">
        <van-search
          v-model="value"
          shape="round"
          show-action
          placeholder="请输入关键字"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch(value)">搜索</div>
          </template>
        </van-search>
      </div>
    </div>

    <div class="searchtype">
      <van-tabs v-model="active">
        <van-tab title="歌曲">
          <!--播放列表-->
          <div class="playlist" v-if="songnum != 0">
            <div class="playlisttop">
              <div>
                <img
                  class="playallicon"
                  src="../assets/icon/播放全部.png"
                  alt=""
                  @click="playmusic(0)"
                />
              </div>
              <div class="playalltitle">播放全部</div>
              <div class="playlistnum">(共{{ searchlist.length }}首)</div>
            </div>
            <div v-for="(item, index) in searchlist" :key="index">
              <div class="songs" :class='{bg:index==isactive}' @click="playmusic(index)">
                <div class="songindex">{{ index + 1 }}</div>
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
          <div class="searchnull" v-else>
            没有找到歌曲，请重新输入关键字搜索
          </div>
        </van-tab>
        <van-tab title="歌单">
          <!--歌单列表-->
          <div class="songlistdiv" v-if="playlistnum != 0">
            <div v-for="(item, index) in songplaylist" :key="index">
              <div class="listimg" @click="goPlaylist(item)">
                <div class="picture">
                  <img :src="item.coverImgUrl" alt="" />
                </div>
                <div class="name one-txt">{{ item.name }}</div>
                <div class="playicon">
                  <img class="icon" src="../assets/icon/播放.png" alt="" />
                </div>
                <div class="playnum">{{ changeCount(item.playCount) }}</div>
              </div>
            </div>
          </div>
          <div class="searchnull" v-else>
            没有找到歌单，请重新输入关键字搜索
          </div>
        </van-tab>
      </van-tabs>
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
      //搜索框
      value: "陈奕迅",
      //标签切换
      active: 0,
      //歌曲搜索结果
      searchlist: [],
      //歌单搜索结果
      songplaylist: [],
      //歌曲搜索结果数量
      songnum: "",
      //歌单搜索结果数量
      playlistnum: "",
      //选中
      isactive:'a'
    };
  },
  created() {
    this.value = localStorage.getItem("Value") || "";
    this.onSearch(this.value);
    this.getSearch();
  },
  methods: {
    //返回跳转
    topreturn() {
      //跳转
      this.$router.go(-1);
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
    //跳转到歌单详情页面
    goPlaylist(item) {
      this.$router.push({
        path: "/playlist",
        //路由传参
        query: {
          id: item.id,
        },
      });
    },
    //获取搜索结果
    getSearch() {
      //接收路由传参的对象值
      if (this.$route.query.songnum == 0) {
        console.log("歌曲搜索结果为0");
        this.songnum = 0;
      }
      else {
        this.searchlist = this.$route.query.searchlist;
        this.songnum = this.$route.query.songnum;
        console.log("歌曲搜索结果", this.searchlist);
      }
      if(this.$route.query.playlistnum == 0){
        console.log("歌单搜索结果为0");
        this.playlistnum = 0;
      }else{
        this.songplaylist = this.$route.query.songplaylist;
        this.playlistnum = this.$route.query.playlistnum;
        console.log("歌单搜索结果",this.songplaylist);
      }
    },
    //搜索方法
    onSearch(value) {
      if(value == ""){
        value = "陈奕迅";
      }
      res
        .request({
          url: "/cloudsearch",
          params: {
            keywords: value,
          },
        })
        .then((data) => {
          console.log("歌曲搜索结果", data);
          localStorage.setItem("Value",value);
          if (data.result.songCount == 0) {
            console.log("歌曲搜索结果为0", data);
            this.songnum = 0;
          } else {
            this.searchlist = data.result.songs;
            this.songnum = data.result.songCount;
          }
        });

      res
        .request({
          url: "/search",
          params: {
            keywords: value,
            type: 1000,
            limit: 30,
          },
        })
        .then((data) => {
          console.log("歌单搜索结果", data);
          if (data.result.playlistCount == 0) {
            console.log("歌单搜索结果为0", data);
            this.playlistnum = 0;
          } else {
            this.songplaylist = data.result.playlists;
            this.playlistnum = data.result.playlistCount;
          }
        });
    },
    //点击列表播放歌曲
    playmusic(index) {
      store.commit("updatePlaylist", this.searchlist);
      store.commit("updateIndex", index);
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
.Search {
  //background: #f7f7f7;
  padding-bottom: 20px;
  .head {
    display: flex;
    //background-color: red;
    .fanhui {
      float: left;
      margin-left: 10px;
      margin-top: 12px;
      background: white;
      font-size: 20px;
      color: rgb(101, 101, 102);
    }
    .head-search {
      flex: 1;
      //background-color: red
    }
  }
  /deep/ .van-tabs__line{
    z-index: 0;
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
        background-color: red;
        color: white;
        border-radius: 30px;
        //width: 70px;
        padding: 8px;
        //height: 30px;
        margin-right: 10px;
        margin-top: 5px;
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
  .songlistdiv {
    width: 94%;
    height: auto;
    margin-left: 3%;
    margin-top: 5px;
    //background-color: blue;
    float: left;
    padding-bottom: 50px;
    .listimg {
      width: 110px;
      height: 120px;
      //background-color: red;
      margin-left: 2px;
      margin-top: 10px;
      //margin-bottom: 10px;
      //position: relative;
      float: left;
      padding-bottom: 10px;
      .picture {
        float: left;
        width: 100px;
        height: auto;
        //position: absolute;
        margin-top: 5px;
        margin-left: 5px;
        border-radius: 10px;
        overflow: hidden;
      }
      .name {
        //position: absolute;
        //background-color: red;
        width: 100px;
        //height: 34px;
        float: left;
        margin-left: 5px;
        text-align: left;
        margin-top: 5px;
        font-size: 13px;
        color: #4e4e50;
      }
      .playicon {
        position: absolute;
        width: 18px;
        height: 18px;
        background-color: rgba(229, 229, 240, 0.5);
        border-radius: 100%;
        margin-left: 70px;
        margin-top: 70px;
        padding: 5px;
        .icon {
          width: 20px;
        }
      }
      .playnum {
        position: absolute;
        font-size: 14px;
        font-weight: bold;
        margin-left: 40px;
        margin-top: 5px;
        width: 56.83px;
        text-align: right;
        color: rgb(236, 232, 232);
      }
    }
  }
  .searchnull {
    margin-top: 200px;
    color: #a29e9e;
  }
  .footbox {
    float: left;
    width: 100%;
    height: 60px;
    //background-color: red;
  }
}
</style>