<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (video_to_video.vue)</h3>
    <div>
      <button @click="make">开始复制</button>
      <button @click="stop">停止复制</button>
    </div>
    <video
      controls
      :src="videoSrc"
      ref="video1"
      width="600px"
      height="340px"
    ></video>
    <video controls ref="video2" width="600px" height="340px"></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      videoSrc: "",
    };
  },
  created() {
    this.videoSrc = require("@/assets/1.mp4");
  },
  methods: {
    stop() {
      if (this.$refs.video2.srcObject) {
        let tracks = this.$refs.video2.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    },
    make() {
      this.$refs.video1.volume = 0.1;
      this.$refs.video1.play();
      this.$refs.video2.srcObject = this.$refs.video1.captureStream();
      this.$refs.video2.volume = 0.1;
      this.$refs.video2.play();
    },
  },
};
</script>

<style socped>
video {
  margin-right: 10px;
}
</style>