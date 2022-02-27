<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (addMore.vue)</h3>
    <div>
      <!--  <button @click="stop">停止</button> -->
      <button @click="add" :disabled="!captureStream">添加连接</button>
    </div>
    <div ref="videoWap" class="wap"></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      width: 410,
      height: 310,
      num: 1,
      videos: [], // 保存video标签
      captureStream: null,
    };
  },
  beforeDestroy() {
    this.videos.forEach((t) => {
      if (t.srcObject) {
        let tracks = t.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      }
    });
  },
  mounted() {
    let wap = this.$refs.videoWap,
      video = document.createElement("video"),
      p = document.createElement("p"),
      div = document.createElement("div"),
      button = document.createElement("button");

    video.controls = true;
    video.autoplay = true;
    video.volume = 0.1;
    video.width = this.width;
    video.height = this.height;
    p.innerHTML = `主视频`;
    button.innerHTML = "开始";
    button.style = "margin-left:10px;";
    button.onclick = this.make;
    p.style = `display:inline-block;width:${this.width}px;margin:5px 0;display:flex;align-items:bottom`;
    div.style = `display:flex;flex-wrap: wrap;width:${this.width}px;margin-right: 10px;`;
    p.appendChild(button);
    div.appendChild(p);
    div.appendChild(video);
    wap.appendChild(div);
    this.videos.push({
      tag: video,
      peer: null,
    });
  },
  methods: {
    close(e) {
      let tar = this.videos.find((t) => t.id == e.target.id);
      tar.peer.close();
      this.$refs.videoWap.removeChild(tar.tag.parentElement);
      this.videos = this.videos.filter((t) => t.id != tar.id);
    },
    add() {
      let wap = this.$refs.videoWap,
        video = document.createElement("video"),
        p = document.createElement("p"),
        div = document.createElement("div"),
        button = document.createElement("button");

      video.controls = true;
      video.autoplay = true;
      video.volume = 0.1;
      video.width = this.width;
      video.height = this.height;
      button.id = this.num;
      button.innerHTML = "关闭";
      button.style = "margin-left:10px;";
      button.onclick = this.close;
      p.innerHTML = `第${this.num}个`;

      p.style = `display:inline-block;width:${this.width}px;margin:5px 0;display:flex;align-items:bottom`;
      div.style = `display:flex;flex-wrap: wrap;width:${this.width}px;margin-right: 10px;`;
      p.appendChild(button);
      div.appendChild(p);
      div.appendChild(video);
      wap.appendChild(div);
      let obj = {
        tag: video,
        peer: null,
        id: this.num++,
      };
      this.videos.push(obj);
      this.copy(obj);
    },
    make() {
      navigator.mediaDevices
        .getUserMedia({
          video: true,
          audio: true,
        })
        .then((res) => {
          this.videos[0].tag.srcObject = res;
          this.captureStream = this.videos[0].tag.captureStream();
        });
    },
    async copy(tar) {
      // 每次添加视频，需要重新初始化主视频
      this.videos[0].peer = new RTCPeerConnection(null);
      this.captureStream.getTracks().forEach((track) => {
        this.videos[0].peer.addTrack(track, this.captureStream);
      });

      this.videos[0].peer.onicecandidate = (e) => {
        tar.peer.addIceCandidate(e.candidate);
      };
      tar.peer = new RTCPeerConnection(null);
      tar.peer.onicecandidate = (e) => {
        this.videos[0].peer.addIceCandidate(e.candidate);
      };
      tar.peer.ontrack = (e) => {
        if (tar.tag.srcObject !== e.streams[0]) {
          tar.tag.srcObject = e.streams[0];
        }
      };

      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: true,
      };
      this.videos[0].peer.createOffer(offerOptions).then((res) => {
        this.videos[0].peer.setLocalDescription(res).then(() => {
          tar.peer.setRemoteDescription(res).then(() => {
            tar.peer.createAnswer().then((back) => {
              tar.peer
                .setLocalDescription(back)
                .then(this.videos[0].peer.setRemoteDescription(back));
            });
          });
        });
      });
    },
  },
};
</script>
<style socped>
.wap {
  display: flex;
  flex-wrap: wrap;
}
</style>