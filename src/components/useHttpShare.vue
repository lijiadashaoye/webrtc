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
      height="400px"
      style="margin-right: 10px"
    ></video>
  </div>
</template>

<script>
export default {
  data() {
    return {
      one: null,
      two: null,
    };
  },
  beforeDestroy() {
    if (this.video.srcObject) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    this.$store.commit("closeSocket");
  },
  computed: {
    video: function () {
      return this.$refs.video;
    },
    video1: function () {
      return this.$refs.video1;
    },
  },
  watch: {
    "$store.state.backData": function (s) {
      this.two.setRemoteDescription(JSON.parse(s));
      this.two.createAnswer().then((t) => {
        this.two.setLocalDescription(t);
        this.one.setRemoteDescription(t);
      });
    },
  },
  methods: {
    stop() {
      if (this.video.srcObject) {
        this.video.srcObject.getTracks().forEach((t) => t.stop());
      }
    },
    share() {
      this.$store.commit("openSocket");
      navigator.mediaDevices
        .getDisplayMedia({
          video: {
            frameRate: {
              ideal: 15,
            },
          },
        })
        .then((res) => {
          // 获取流，并建立webrtc链接
          this.one = new RTCPeerConnection(null);
          this.two = new RTCPeerConnection(null);
          this.one.addStream(res);

          res.getVideoTracks()[0].onended = () => {
            console.log("用户已结束共享屏幕");
          };

          this.one.onicecandidate = (t) => {
            this.two.addIceCandidate(t.candidate);
          };
          this.two.onicecandidate = (t) => {
            this.one.addIceCandidate(t.candidate);
          };
          this.two.onaddstream = (t) => {
            this.video.srcObject = t.stream;
          };

          // 获取并分享本地和远程的会话描述(descriptions): 关于本地媒体的 SDP 格式元数据.
          this.one.createOffer(null).then((s) => {
            // 把关键的匹配信息通过网络发送出去
            this.$store.commit("sendData", JSON.stringify(s));
            this.one.setLocalDescription(s);
          });
        });
    },
  },
};
</script>