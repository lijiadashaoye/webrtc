<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (sendFile.vue)</h3>
    <input type="file" @change="selectFile" multiple />
    <button @click="make" :disabled="!files.length && !canClick">
      上传
      <span v-show="upProgress > 0">{{ upProgress * 100 + "%" }}</span>
    </button>
    <button @click="down" :disabled="!canClick">下载</button>
    <ul v-if="files.length">
      <li v-for="(t, ind) of files" :key="ind">{{ ind + 1 }}：{{ t.name }}</li>
    </ul>
    <div></div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channels: [],
      files: [],
      bufferArrary: [],
      upProgress: 0,
      canClick: false,
      total: 0,
    };
  },
  beforeDestroy() {
    this.channels.forEach((t) => t.close());
  },
  methods: {
    down() {
      // console.log(this.bufferArrary);
      // let fileReader = new FileReader();
      // fileReader.readAsText(new Blob(this.bufferArrary));
      // fileReader.onload = (t) => {
      //   let res = t.target.result;
      //   console.log(res);
      // };

      let a = document.createElement("a");
      let received = new Blob(this.bufferArrary);
      a.href = URL.createObjectURL(received);
      // a.download = this.files[this.num].name;
      a.download = "retewr.pptx";
      a.click();
    },
    selectFile(e) {
      this.bufferArrary = [];
      this.files = e.target.files;
    },
    make() {
      this.upProgress = 0;
      let localConnection = new RTCPeerConnection(null),
        remoteConnection = new RTCPeerConnection(null),
        sendChannel = localConnection.createDataChannel("sendDataChannel");
      sendChannel.binaryType = "arraybuffer";

      sendChannel.onbufferedamountlow = (e) => {
        console.log(e);
      };

      sendChannel.onopen = () => {
        this.files.forEach((t) => (this.total += t.size));
        for (let i = 0; i < this.files.length; i++) {
          let fileReader = new FileReader(),
            max = 0,
            file = this.files[i];

          fileReader.onload = (t) => {
            let data = t.target.result;
            sendChannel.send(data);
            if (max < file.size) {
              max += 1024 * 50;
              readSlice();
            }
          };
          const readSlice = () => {
            const slice = file.slice(max, max + 1024 * 50);
            fileReader.readAsArrayBuffer(slice);
          };
          readSlice();
        }
      };
      // 数据传完会自动关闭
      // sendChannel.onclose = (e) => {
      //   console.log(e);
      // };
      // sendChannel.onmessage = (e) => {
      //   console.log(e);
      // };

      localConnection.onicecandidate = async (e) => {
        await remoteConnection.addIceCandidate(e.candidate);
      };
      remoteConnection.onicecandidate = async (e) => {
        await localConnection.addIceCandidate(e.candidate);
      };

      localConnection.createOffer().then(async (e) => {
        await localConnection.setLocalDescription(e);
        await remoteConnection.setRemoteDescription(e);
        remoteConnection.createAnswer().then(async (t) => {
          await remoteConnection.setLocalDescription(t);
          await localConnection.setRemoteDescription(t);
        });
      });
      remoteConnection.ondatachannel = (event) => {
        let receiveChannel = event.channel;
        receiveChannel.binaryType = "arraybuffer";
        this.channels.push(
          localConnection,
          remoteConnection,
          sendChannel,
          receiveChannel
        );
        // receiveChannel.onopen = (e) => {
        //   console.log(e);
        // };
        // receiveChannel.onclose = (e) => {
        //   console.log(e);
        // };
        let num = 0;
        receiveChannel.onmessage = (e) => {
          this.bufferArrary.push(e.data);
          let n = Math.trunc(Math.ceil((num / this.total) * 100)) / 100;
          this.upProgress = n > 1 ? 1 : n;
          num += e.data.byteLength;
          this.canClick = true;
        };
      };
    },
  },
};
</script>

<style socped>
ul {
  font-size: 12px;
  margin: 5px 0;
}
</style>