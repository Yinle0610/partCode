<template>
  <div ref="dom" style="width: 550px; height: 200px;" :style="h?{height: `${h}px`}:''"></div>
</template>

<script>
import echarts from "echarts";
export default {
  name: "ChartBar",
  props: {
    value: Object,
    h: Number
  },
  data() {
    return {
      dom: null
    };
  },
  methods: {
    resize() {
      this.dom.resize();
    },
    drawEchart() {
      let option = this.value;
      this.dom = echarts.init(this.$refs.dom);
      this.dom.setOption(option);
    }
  },
  mounted() {
    // this.$nextTick(() => {
    //   let option = this.value;
    //   this.dom = echarts.init(this.$refs.dom);
    //   this.dom.setOption(option);
    // });
  },
  beforeDestroy() {}
};
</script>
