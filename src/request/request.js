import Vue from 'vue';
import {Toast} from 'vant';
import axios from 'axios';
//import { resolve } from 'core-js/fn/promise';
Vue.use(Toast);

const request = obj => {
    //动态键
    let type = obj.method == "post" ? "data" : "params"
    //公共的url
    const baseUrl = "http://localhost:3000"
    return new Promise((reslove,reject) =>{
        //发送请求
        axios({
            ...obj,
            url:baseUrl + obj.url,
            [type]:{
                ...obj[type],
            }
        }).then(data =>{
            //console.log("请求方法",data);
            //判断是post还是get
            if(type == "params"){
                //成功
                reslove(data.data)
            }else if(type == "data"){
                reslove(data.data)
            }
        }).catch(err =>{
            reject(err)
        })
    })
}
export default{
    request
}