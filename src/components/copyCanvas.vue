<template>
  <div class="content">
    <h3>{{ $route.query.name }} &nbsp; (copyCanvas.vue)</h3>
    <div>
      <canvas :width="this.width" :height="this.height" ref="from"></canvas>
      <video
        playsinline
        autoplay
        muted
        style="margin-left: 30px"
        :width="this.width"
        :height="this.height"
        ref="can"
      ></video>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      video: null,
      width: 600,
      height: 400,
    };
  },
  mounted() {
    this.make();
    this.video = this.$refs.can;
    this.video.srcObject = this.$refs.from.captureStream();
  },
  beforeDestroy() {
    if (this.video) {
      let tracks = this.video.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
  },
  methods: {
    make() {
      const canvas = this.$refs.from;
      const ctx = canvas.getContext("2d");
      let radialGradient,
        distance = 10,
        axis = 10,
        banjing = 7,
        speed = 5,
        num = 0,
        angle = 0;

      const draw = () => {
        num++;
        radialGradient = ctx.createRadialGradient(
          distance,
          axis,
          3,
          distance,
          axis,
          4
        );
        radialGradient.addColorStop(0, "#FFFFFF");
        radialGradient.addColorStop(1, "#EA7F26");
        ctx.fillStyle = radialGradient;

        ctx.beginPath();
        ctx.moveTo(distance, axis);
        ctx.arc(distance, axis, banjing, 0, 2 * Math.PI, false);
        ctx.fill();

        axis =
          this.height / 2 +
          Math.sin(angle * Math.trunc(Math.random() * 1000)) *
            (this.height / 2 - banjing);

        distance = distance + speed;
        if (distance > 650) {
          distance = 0;
          angle = -0.1;
        }
        angle += 0.1;
        if (num < 1000) {
          requestAnimationFrame(draw);
        }
      };
      requestAnimationFrame(draw);
    },
  },
};
</script>