<template>
  <div></div>
</template>

<script>
import L from "leaflet";
import AnimatedPolyline from "./Leaflet.AnimatedPolyline";

export default {
  props: {
    positions: {
      type: Array,
      required: true,
    },
    snakeSpeed: {
      type: Number,
      default: 500,
    },
    options: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      polyline: null,
      map: null,
    };
  },
  mounted() {
    this.map = this.$parent.mapObject; // Assuming `mapObject` is provided by a parent Vue-Leaflet component
    this.initPolyline();
  },
  watch: {
    positions(newPositions, oldPositions) {
      if (this.polyline && newPositions.length > 0) {
        this.polyline.setSnakeLatLngs(newPositions);
        if (oldPositions.length === 0) {
          this.polyline.snakeIn(this.snakeSpeed);
        } else {
          this.polyline.snakeIn(Infinity);
        }
      }
    },
  },
  methods: {
    initPolyline() {
      if (this.map && this.positions.length) {
        this.polyline = new AnimatedPolyline(this.positions, this.options);
        this.map.addLayer(this.polyline);
        this.polyline.snakeIn(this.snakeSpeed);
      }
    },
  },
  beforeDestroy() {
    if (this.map && this.polyline) {
      this.map.removeLayer(this.polyline);
    }
  },
};
</script>
