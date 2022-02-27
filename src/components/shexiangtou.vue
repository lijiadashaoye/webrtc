<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (shexiangtou)</h3>
    <div>
      <button @click="make">调用</button>
      <button @click="stop">停止</button>
      <button @click="shebei">查看设备</button>
    </div>
    <video autoplay controls ref="video" width="600px" height="450px"></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
    };
  },
  beforeDestroy() {
    this.stop();
  },
  methods: {
    shebei() {
      navigator.mediaDevices.enumerateDevices().then((res) => {
        console.log(res);
      });
    },
    make() {
      this.video = this.$refs.video;
      // Chrome升级后，新版本的Chrome不再支持 createObjectURL 其他主流浏览器也是如此
      if (navigator.getUserMedia) {
        let obj = {
          peizhi: {
            video: true,
            // audio: true,
          },
          success: (stream) => {
            this.video.srcObject = stream;

            // const videoTracks = stream.getVideoTracks()[0];
            // console.log(stream);
            // console.log(videoTracks);
          },
          fail: (e) => {
            console.log(e);
          },
        };
        navigator.getUserMedia(obj.peizhi, obj.success, obj.fail);
      } else {
        navigator.mediaDevices
          .getUserMedia({
            video: true,
            audio: true,
          })
          .then((stream) => {
            try {
              this.video.srcObject = stream;
            } catch {
              this.video.src = window.URL.createObjectURL(stream);
            }
          });
      }
    },
    stop() {
      if (this.video) {
        let tracks = this.video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    },
  },
};
</script>