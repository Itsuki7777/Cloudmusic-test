<template>
  <div class="home">
    <!-- <div class="homebg1">
    <div class="homebg"></div>
    </div> -->
    <div class="head">
      <div class="head-search">
        <van-search
          v-model="value"
          show-action
          shape="round"
          placeholder="请输入关键字"
          @search="onSearch"
        >
          <template #action>
            <div @click="onSearch(value)">搜索</div>
          </template>
        </van-search>
      </div>
    </div>
    <!--轮播图-->
    <div class="banner">
      <van-swipe class="my-swipe" :autoplay="3000" indicator-color="#0c34ba">
        <van-swipe-item v-for="(item, index) in bannerList" :key="index">
          <img :src="item.pic" alt="" />
          <div class="banner-name">{{ item.typeTitle }}</div>
        </van-swipe-item>
      </van-swipe>
    </div>
    <!--推荐歌单-->
    <div class="tuijian">
      <div class="tuititle" @click="goOtherlist">推荐歌单 ></div>
    </div>
    <div class="tuijiandiv">
      <div v-for="(item, index) in tuijianList" :key="index">
        <div class="tuiimg" @click="goPlaylist(item)">
          <div class="picture">
            <img :src="item.picUrl" alt="" />
          </div>
          <div class="name one-txt">{{ item.name }}</div>
          <div class="playicon">
            <img class="icon" src="../assets/icon/播放.png" alt="" />
          </div>
          <div class="playnum">{{ changeCount(item.playCount) }}</div>
        </div>
      </div>
    </div>
    <div class="footbox"></div>
  </div>
</template>

<script>
import res from "../request/request";
export default {
  data() {
    return {
      //搜索框
      value: "陈奕迅",
      //轮播图图片
      bannerList: [],
      //推荐歌单
      tuijianList: [],
      //搜索歌曲列表
      searchlist:[],
      //搜索歌曲数量
      songnum:"",
      //搜索歌单列表
      songplaylist:[],
      //搜索歌单数量
      playlistnum:""
    };
  },
  mounted() {
    this.getBanner();
    this.getTuijian();
  },
  methods: {
    //获取轮播图数据
    getBanner() {
      res
        .request({
          url: "/banner",
          //method:"post",
          params: {
            type: 2,
          },
        })
        .then((data) => {
          console.log("轮播图数据", data);
          this.bannerList = data.banners;
        });
    },
    //获取推荐歌单数据
    getTuijian() {
      res
        .request({
          url: "/personalized",
          //method:"post",
          params: {
            limit: 6,
          },
        })
        .then((data) => {
          console.log("推荐歌单数据", data);
          this.tuijianList = data.result;
        });
    },
    //搜索方法
    onSearch(value) {
      localStorage.setItem("Value",value);
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
          console.log("歌曲搜索信息", data);
          this.searchlist = data.result.songs;
          this.songnum = data.result.songCount;
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
          console.log("歌单搜索信息", data);
          this.songplaylist = data.result.playlists;
          this.playlistnum = data.result.playlistCount;
          this.$router.push({
            name: "Search",
            //路由传参
            query: {
              searchlist: this.searchlist,
              songnum:this.songnum,
              songplaylist: this.songplaylist,
              playlistnum: this.playlistnum,
            },
        });
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
    //跳转到更多歌单页面
    goOtherlist(){
      this.$router.push({
        path:"/otherlist"
      })
    }
  },
};
</script>

<style lang="less" scoped>
.home {
  background-image: url(../assets/homebg.jpg);
  background-repeat:no-repeat;
  background-position:center;
  background-attachment: fixed;
  background-size: cover;
  width: 100%;
  height: 1000px;
  //background-color: aqua;
  padding-bottom: 20px;
  .head {
    //display: flex;
    //opacity: 0.6;
    //background-color: blue;
    .head-search {
      flex: 1;
      /deep/ .van-search__content{
        opacity: 0.5;
      }
     
      /deep/ .van-search{
        background-color: transparent;
      }
      /deep/ .van-search__action{
        color: white;
      }
    }
  }
  .banner {
    margin-top: 10px;
    margin-left: 10px;
    margin-right: 10px;
    border-radius: 20px;
    overflow: hidden;
    //样式穿透
    /deep/ .van-swipe__indicators {
      left: 55%;
    }
    /deep/ .van-swipe__indicator {
      width: 13px;
      height: 3px;
      border-radius: 0;
      background: #64696e;
      opacity: 1;
    }
    .banner-name {
      position: absolute;
      font-weight: bold;
      font-size: 12px;
      width: 50px;
      height: 17px;
      left: 10px;
      bottom: 10px;
      background: #e6dfdfcc;
      padding: 4px 10px;
      border-radius: 20px;
      color: #c54129;
    }
  }
  .tuijian {
    margin-top: 10px;
    margin-bottom: 10px;
    .tuititle {
      text-align: left;
      margin-left: 10px;
      color: rgb(247, 243, 243);
    }
  }
  .tuijiandiv {
    width: 92%;
    height: auto;
    margin-left: 4.5%;
    //background-color: blue;
    float: left;
    padding-bottom: 10px;
    .tuiimg {
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
        color: #f4f4f5;
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
  .footbox {
    float: left;
    width: 100%;
    height: 60px;
    //background-color: red;
  }
}
</style>