<template>
  <div id="app">
    <!--一级路由插座-->
    <router-view />
    <FooterMusic />
  </div>
</template>

<script>
import FooterMusic from "@/components/FooterMusic.vue";
export default {
  data() {
    return {};
  },
  methods: {},
  components: {
    FooterMusic,
  },
};
</script>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
img {
  height: auto;
  width: 100%;
  display: block;
}
.one-txt {
  //-webkit-line-clamp:2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
