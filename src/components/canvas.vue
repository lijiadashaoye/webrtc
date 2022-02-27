<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (canvas.vue)</h3>
    <div>
      <button @click="jieping">截屏</button>
      <button @click="save">保存图片</button>
    </div>
    <div >
      <video
        autoplay
        controls
        ref="video"
        :width="this.width"
        :height="this.height"
      ></video>
      <canvas
        style="margin-left: 20px"
        :width="this.width"
        :height="this.height"
        ref="can"
      ></canvas>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      width: 500,
      height: 374,
    };
  },
  mounted() {
    this.make();
  },
  beforeDestroy() {
    if (this.video) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  },
  methods: {
    save() {
      var strDataURI = this.$refs.can.toDataURL("image/jpeg");
      var image = strDataURI.replace("image/jpeg", "image/octet-stream");
      var a = document.createElement("a");
      a.download = "下载.png";
      a.href = image;
      a.click();
    },
    make() {
      this.video = this.$refs.video;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          // audio: true,
        })
        .then((res) => {
          this.video.srcObject = res;
        });
    },
    jieping() {
      this.$refs.can.getContext("2d").drawImage(this.video, 0, 0, 600, 450);
    },
  },
};
</script>