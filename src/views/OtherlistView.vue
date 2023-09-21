<template>
    <div class="Otherlist">
    <!--导航栏开始-->
    <div class="top">
      <div class="fanhui" @click="topreturn">＜</div>
      <div class="title">更多精品歌单</div>
    </div>
    <!--导航栏结束-->

    <!--歌单列表-->
    <div class="songlistdiv">
      <div v-for="(item, index) in SongList" :key="index">
        <div class="listimg" @click="goPlaylist(item)">
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
    </div>
</template>

<script>
import res from "../request/request";
export default {
  data() {
    return {
        //歌单列表
        SongList:[],
    };
  },
  created() {
    this.getSonglist();
    //this.getdivheight();
  },
  methods: {
    //返回跳转
    topreturn() {
      //跳转回上一个页面
      this.$router.go(-1);
    },
    //获取歌单数据
    getSonglist() {
      res
        .request({
          url: "/personalized",
          //method:"post",
          params: {
            limit: 100,
          },
        })
        .then((data) => {
          console.log("歌单数据", data);
          this.SongList = data.result;
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
    //获取高度
    // getdivheight(){
    //     let h = document.getElementsByClassName("Otherlist");
    //     console.log(h[0].scrollHeight);
    //     this.stylechange.height = h[0].scrollHeight;
    //     console.log("高度：",this.stylechange.height);
    //     //console.log([this.$refs.bgheight]);
    // }
  },
};
</script>

<style lang="less" scoped>
.Otherlist{
  background-image: url(../assets/homebg.jpg);
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed;
  background-size: cover;
  width: 100%;
  min-height: 4900px;
  .top {
    width: 100%;
    height: 40px;
    background-color: rgba(211, 211, 211, 0.3);
    position: fixed;
    .fanhui {
      float: left;
      margin-left: 10px;
      margin-top: 8px;
      color: gray;
      font-size: 20px;
    }
    .title {
      float: left;
      margin-top: 10px;
      margin-left: 30%;
      font-weight: bold;
    }
  }
  .songlistdiv {
    width: 94%;
    height: auto;
    margin-left: 3%;
    margin-top: 40px;
    //background-color: blue;
    float: left;
    padding-bottom: 100px;
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
}
</style>