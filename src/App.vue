<template>
  <div id="app" style="padding-left: 10px">
    <button @click="back">返回</button>
    <p style="font-size: 14px">
      MediaStream 获取和渲染音频和视频流<br />
      RTCPeerConnection的作用是在浏览器之间建立数据的“点对点”（peer to
      peer）通信，也就是将浏览器获取的麦克风或摄像头数据，传播给另一个浏览器。这里面包含了很多复杂的工作，比如信号处理、多媒体编码/解码、点对点通信、数据安全、带宽管理等等。
      <br />
      RTCDataChannel的作用是在点对点之间，传播任意数据，支持应用级的数据通信
      <br />
      <a href="https://www.imweb.io/topic/5930541b7720c3b21fa5c303" target="trank"
        >https://www.imweb.io/topic/5930541b7720c3b21fa5c303</a
      >
    </p>
    <router-view />
  </div>
</template>
<script>
export default {
  data() {
    return {
      num: 0,
      socket: null,
    };
  },
  created() {},
  methods: {
    back() {
      if (this.$route.name !== "MainPage") {
        this.$router.push({
          name: "MainPage",
        });
      }
    },
  },
};
</script>

<style lang="scss">
#app,
html,
body,
h1,
h2,
h3,
h4,
p {
  padding: 0;
  margin: 0;
}
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}
.content {
  padding: 5px;
}
button {
  font-size: 14px;
  padding: 0px 8px;
  margin: 0 10px 5px 0;
  cursor: pointer;
}
</style>
