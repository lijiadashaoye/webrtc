<template>
  <div>
    <h3>{{ $route.query.name }} &nbsp; (record.vue)</h3>
    <div class="content">
      <div>
        <button @click="make">录像</button>
        <button @click="stop">停止录像</button>
        <button @click="blobData = []">清空</button><br />
        <video
          autoplay
          controls
          ref="video"
          width="500px"
          height="375px"
        ></video>
      </div>
      <div v-if="blobData.length">
        <div>
          <button @click="download">下载</button>
          <select @change="toSee">
            <option value="false">请选择</option>
            <option v-for="(t, ind) of blobData" :key="ind" :value="ind">
              查看第{{ ind + 1 }}个
            </option>
          </select>
          <br />
          <video
            autoplay
            controls
            ref="video1"
            width="500px"
            height="375px"
          ></video>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      options: [
        "video/webm;codecs=vp9,opus",
        "video/webm;codecs=vp8,opus",
        "video/webm;codecs=h264,opus",
      ],
      mimeType: "",
      MediaRecorder: null,
      blobData: [],
      num: 2,
    };
  },
  created() {
    this.mimeType = this.options[this.num];
  },
  beforeDestroy() {
    if (this.video) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  },
  methods: {
    toSee(e) {
      if (e.target.value !== "false") {
        let blob = [this.blobData[e.target.value]],
          superBuffer = new Blob(blob, {
            type: this.mimeType.split(";")[0],
          }),
          video1 = this.$refs.video1;
        video1.src = URL.createObjectURL(superBuffer);
        video1.play();
      }
    },
    download() {
      this.blobData.forEach((t) => {
        let blob = new Blob([t], { type: "video/mp4" }),
          url = window.URL.createObjectURL(blob),
          a = document.createElement("a");
        a.href = url;
        a.download = `${t.size}_${Math.trunc(Math.random() * 100)}_大小.mp4`;
        a.click();
      });
    },
    stop() {
      if (this.MediaRecorder && this.MediaRecorder.state === "recording") {
        this.MediaRecorder.stop();
        let tracks = this.video.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
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
          let type = this.mimeType;
          this.MediaRecorder = new MediaRecorder(res, { type });
          this.MediaRecorder.start();
          this.MediaRecorder.ondataavailable = (e) => {
            // console.log(e);
            if (e.data && e.data.size > 0) {
              this.blobData.push(e.data);
            }
          };
        });
    },
  },
};
</script>

<style scoped>
.content {
  display: flex;
}
.content > div {
  margin-right: 10px;
}
select {
  padding: 3px 5px;
  margin-left: 20px;
}
</style>