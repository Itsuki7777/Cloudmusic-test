<template>
  <div class="Login">
    <input type="button" @click="sendtest" value="测试1"/>
    <input type="button" @click="gettest" value="测试2"/>
    <input type="button" @click="logintest" value="测试3"/>
  </div>
</template>

<script>
import axios from 'axios';
import res from "../request/request";
export default {
    data(){
        return {
            //验证码
            key:""
        }
    },
  methods: {
    sendtest() {
      res
        .request({
          url: "/login/qr/key",
          params: {
            
          },
        })
        .then((data) => {
          console.log("二维码信息", data);
        });
    },
    gettest() {
      res
        .request({
          url: "/login/status",
          params: {
            
          },
        })
        .then((data) => {
          console.log("登录状态信息", data);
        });
    },
    logintest(){
        axios({
          url: "http://localhost:3000/user/account",
          params: {
           
          },
        })
        .then((data) => {
          console.log("获取用户信息", data);
        });
    }
  },
};
</script>

<style>
</style>