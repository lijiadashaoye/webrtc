<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (share)</h3>
    <div>
      <button @click="share">分享</button>
      <button @click="stop">停止分享</button>
    </div>
    <!-- muted 关闭视频声音 -->
    <video
      autoplay
      controls
      muted
      ref="video"
      width="600px"
      height="450px"
    ></video>
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  beforeDestroy() {
    if (this.video.srcObject) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  },
  computed: {
    video: function () {
      return this.$refs.video;
    },
  },
  methods: {
    stop() {
      this.video.srcObject.getTracks().forEach((t) => t.stop());
    },
    share() {
      navigator.mediaDevices.getDisplayMedia().then((res) => {
        console.log(res);
        this.video.srcObject = res;
      });
    },
  },
};
</script>