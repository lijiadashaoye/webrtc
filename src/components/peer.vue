<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (peer.vue)</h3>
    <div>
      <button @click="make">开始</button>
      <button @click="stop">停止</button>
    </div>
    <div>
      <video
        autoplay
        controls
        ref="video1"
        :width="this.width"
        :height="this.height"
      ></video>
      <video
        autoplay
        controls
        ref="video2"
        :width="this.width"
        :height="this.height"
      ></video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video1: null,
      video2: null,
      width: 400,
      height: 300,
      pc1: null,
      pc2: null,
    };
  },
  beforeDestroy() {
    if (this.video1.srcObject) {
      let tracks = this.video1.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    if (this.video2.srcObject) {
      let tracks = this.video2.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  },
  mounted() {
    this.video1 = this.$refs.video1;
    this.video2 = this.$refs.video2;

    this.video1.volume = 0.1;
    this.video2.volume = 0.1;
  },
  methods: {
    make() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((res) => {
          this.video1.srcObject = res;
          this.copy();
        });
    },
    async copy() {
      this.pc1 = new RTCPeerConnection(null);
      this.pc2 = new RTCPeerConnection(null);

      let stream = this.video1.captureStream();
      this.pc1.onicecandidate = (e) => {
        // console.log(e);
        this.pc2.addIceCandidate(e.candidate);
        // .then(() => console.log("this.pc2 添加成功"));
      };
      this.pc2.onicecandidate = (e) => {
        // console.log(e);
        this.pc1.addIceCandidate(e.candidate);
        // .then(() => console.log("this.pc1 添加成功"));
      };

      // 监听链接状态变化
      // this.pc1.oniceconnectionstatechange = () => {
      //   console.log(this.pc1.iceConnectionState);
      // };
      // this.pc2.oniceconnectionstatechange = () => {
      //   console.log(this.pc2.iceConnectionState);
      // };

      this.pc2.ontrack = (e) => {
        if (this.video2.srcObject !== e.streams[0]) {
          this.video2.srcObject = e.streams[0];
        }
      };

      // [auido, video]
      stream.getTracks().forEach((track) => {
        this.pc1.addTrack(track, stream);
      });
      // const offerOptions = {
      //   // offerToReceiveAudio: 1,
      //   // offerToReceiveVideo: 1,
      // };
      //  this.pc1.createOffer(offerOptions)

      this.pc1.createOffer().then((res) => {
        this.pc1.setLocalDescription(res).then(() => {
          this.pc2.setRemoteDescription(res).then(() => {
            this.pc2.createAnswer().then((back) => {
              back.sdp = back.sdp.replace(
                /a=mid:(.*)\r\n/g,
                "a=mid:$1\r\nb=AS:" + 50000 + "\r\n"
              );
              this.pc2
                .setLocalDescription(back)
                .then(() => this.pc1.setRemoteDescription(back));
            });
          });
        });
      });
    },
    stop() {
      if (this.pc1 || this.pc2) {
        this.pc1.close();
        this.pc2.close();
        this.pc1 = null;
        this.pc2 = null;
      }
    },
  },
};
</script>
<style socped>
video {
  margin-right: 10px;
}
</style>