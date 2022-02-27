<template>
  <div>
    <h3>{{ $route.query.name }} &nbsp; (luping.vue)</h3>
    <button @click="lupingFn">录屏</button>
    <div>
      <video
        :width="this.width"
        :height="this.height"
        autoplay
        controls
        style="margin-right: 10px"
        ref="video"
      ></video>
      <video
        :width="this.width"
        :height="this.height"
        autoplay
        controls
        ref="video1"
      ></video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 450,
      height: 338,
      one: null,
      two: null,
    };
  },
  beforeDestroy() {
    if (this.$refs.video.srcObject) {
      let tracks = this.$refs.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    this.$store.commit("closeSocket");
  },
  created() {
    this.$store.commit("openSocket");
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
    async lupingFn() {
      navigator.getUserMedia(
        { video: true },
        (e) => {
          this.$refs.video.srcObject = e;
          this.test(e);
        },
        (e) => {
          console.log(e);
        }
      );
    },
    test(stream) {
      // 新建数据通信通道
      this.one = new RTCPeerConnection(null);
      this.two = new RTCPeerConnection(null);
      this.one.addStream(stream);

      // 获取并分享网络信息: 这些待连接的终端被称为 ICE 候选者(candidates).
      // one分享给two，two反馈给one
      this.one.onicecandidate = (t) => {
        this.two.addIceCandidate(t.candidate);
      };
      this.two.onicecandidate = (t) => {
        this.one.addIceCandidate(t.candidate);
      };
      this.two.onaddstream = (t) => {
        this.$refs.video1.srcObject = t.stream;
      };

      // 获取并分享本地和远程的会话描述(descriptions): 关于本地媒体的 SDP 格式元数据.
      this.one.createOffer(null).then((s) => {
        // 把关键的匹配信息通过网络发送出去
        this.$store.commit("sendData", JSON.stringify(s));
        this.one.setLocalDescription(s);
      });
    },
  },
};
</script>
