<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (sendText.vue)</h3>
    <button @click="make" :disabled="!!channels.length">建立会话</button>
    <button @click="close" :disabled="!channels.length">关闭会话</button>
    <span v-show="tip" style="font-size: 14px; color: red">请输入内容！</span>
    <div>
      <div ref="div2">
        <div :contenteditable="!!channels.length"></div>
        <button :disabled="!channels.length" @click="send(1, $event)">
          发送
        </button>
      </div>
      <div ref="div1">
        <div :contenteditable="!!channels.length"></div>
        <button :disabled="!channels.length" @click="send(2, $event)">
          发送
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      channels: [],
      num: "",
      tip: false,
    };
  },
  beforeDestroy() {
    this.close();
  },
  methods: {
    close() {
      this.channels.forEach((t) => t.close());
    },
    send(num, e) {
      let text = e.target.previousElementSibling.innerHTML;
      this.num = num;
      if (text) {
        if (num === 1) {
          this.channels[2].send(text);
        } else {
          this.channels[3].send(text);
        }
        e.target.previousElementSibling.innerHTML = "";
      } else {
        this.tip = true;
        setTimeout(() => {
          this.tip = false;
        }, 3000);
      }
    },
    showText(text, div) {
      let p = document.createElement("p"),
        time = new Date(),
        year = time.getFullYear(),
        month =
          (time.getMonth() + 1).length > 1
            ? time.getMonth() + 1
            : "0" + (time.getMonth() + 1),
        day = time.getDate().length > 1 ? time.getDate() : "0" + time.getDate(),
        hour = time.getHours() > 9 ? time.getHours() : "0" + time.getHours(),
        minutes =
          time.getMinutes() > 9 ? time.getMinutes() : "0" + time.getMinutes(),
        seconds =
          time.getSeconds() > 9 ? time.getSeconds() : "0" + time.getSeconds();
      p.style = "font-size:12px;display:flex;justify-content:space-between;";

      p.innerHTML = `<span style="margin-right:20px;">${text}</span>
      <span style="display:inline-block;min-width=120px">${year}-${month}-${day} ${hour}:${minutes}:${seconds}</span>`;
      div.appendChild(p);
    },
    make() {
      let localConnection = new RTCPeerConnection(null),
        remoteConnection = new RTCPeerConnection(null),
        // pc.createDataChannel(channelName, channelOptions);
        sendChannel = localConnection.createDataChannel("sendDataChannel");

      localConnection.onicecandidate = (e) => {
        remoteConnection.addIceCandidate(e.candidate);
      };
      remoteConnection.onicecandidate = (e) => {
        localConnection.addIceCandidate(e.candidate);
      };

      sendChannel.onopen = (e) => {
        console.log(e);
      };
      sendChannel.onclose = (e) => {
        console.log(e);
      };
      sendChannel.onmessage = (e) => {
        // console.log(e);
        this.showText(e.data, this.$refs[`div${this.num}`]);
      };

      remoteConnection.ondatachannel = (event) => {
        let receiveChannel = event.channel;
        this.channels.push(
          localConnection,
          remoteConnection,
          sendChannel,
          receiveChannel
        );
        receiveChannel.onopen = (e) => {
          console.log(e);
        };
        receiveChannel.onclose = (e) => {
          console.log(e);
        };
        receiveChannel.onmessage = (e) => {
          // console.log(e);
          this.showText(e.data, this.$refs[`div${this.num}`]);
        };
      };

      localConnection.createOffer().then((e) => {
        localConnection.setLocalDescription(e);
        remoteConnection.setRemoteDescription(e);
        remoteConnection.createAnswer().then((t) => {
          remoteConnection.setLocalDescription(t);
          localConnection.setRemoteDescription(t);
        });
      });
    },
  },
};
</script>

<style socped>
.content > div {
  display: flex;
}
.content > div > div {
  display: inline-block;
  width: 400px;
  margin-right: 30px;
}
.content > div > div:nth-child(1) > div {
  border: 1px solid rgb(168, 167, 167);
  min-height: 100px;
  padding: 5px;
  font-size: 14px;
}
.content > div > div:nth-child(2) > div {
  border: 1px dashed rgb(160, 247, 170);
  min-height: 100px;
  padding: 5px;
  font-size: 14px;
}
</style>