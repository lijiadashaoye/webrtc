<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (fenbianlv.vue)</h3>
    <div>
      <label for="range"
        >宽：<input
          id="range"
          v-model="isWidth"
          max="2000"
          min="300"
          type="range"
          step="5"
          @change="setFenBian(1)"
        />{{ isWidth }}</label
      >
      <label for="range"
        >高：<input
          step="5"
          id="range"
          v-model="isHeight"
          max="2000"
          min="300"
          type="range"
          @change="setFenBian(2)"
        />{{ isHeight }}</label
      >
    </div>
    <video autoplay controls ref="video" width="600px" height="450px"></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      isWidth: 300,
      isHeight: 300,
      time: null,
    };
  },

  beforeDestroy() {
    if (this.video) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  },
  mounted() {
    this.make();
  },
  methods: {
    setFenBian(num) {
      if (!this.time) {
        this.time = setTimeout(() => {
          if (num === 1) {
            this.video.width = this.isWidth;
          } else {
            this.video.height = this.isHeight;
          }
          this.time = null;
        }, 300);
      }
    },
    make() {
      this.video = this.$refs.video;
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((res) => {
          this.video.srcObject = res;
        });
    },
  },
};
</script>

<style scoped>
label {
  display: inline-block;
  width: 230px;
}
video {
  background: palegoldenrod;
}
</style>