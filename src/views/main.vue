<template>
  <div>
    <ul>
      <li @click="toOpen(t)" v-for="(t, ind) of list" :key="ind">
        {{ t.name }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      list: [
        {
          name: "浏览器调用电脑摄像头",
          route: "shexiangtou",
        },
        {
          name: "屏幕分享",
          route: "share",
        },
        {
          name: "通过网络分享屏幕",
          route: "useHttpShare",
        },
        {
          name: "截屏到 canvas",
          route: "canvas",
        },
        {
          name: "复制canvas",
          route: "copyCanvas",
        },
        {
          name: "调整分辨率",
          route: "fenbianlv",
        },
        {
          name: "录像",
          route: "record",
        },
        {
          name: "复制video",
          route: "copy",
        },
        {
          name: "视频对等链接",
          route: "peer",
        },
        {
          name: "动态增减视频链接",
          route: "add",
        },
        {
          name: "传输文字",
          route: "sendText",
        },
        {
          name: "传输文件",
          route: "sendFile",
        },
        {
          name: "录屏并用网络传递数据",
          route: "luping",
        },
      ],
    };
  },
  created() {
    this.$store.commit("closeSocket");
  },
  methods: {
    toOpen(tar) {
      this.$router.push({
        name: tar.route,
        query: { name: tar.name },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
ul {
  padding: 5px;
  display: flex;
  flex-wrap: wrap;
  li {
    padding: 3px 8px;
    border-radius: 3px;
    border: 1px solid rgb(235, 233, 233);
    background-color: rgb(198, 221, 245);
    cursor: pointer;
    margin-right: 10px;
    font-size: 14px;
    &:hover {
      background-color: rgb(51, 139, 233);
      color: #fff;
    }
  }
}
</style>