import { Polyline as LeafletPolyline } from "leaflet";

if (typeof window.exports !== "object") {
  window.exports = {};
}

let Leaflet_module = window.L ? window.L : require("leaflet");

class Animated_Polyline extends Leaflet_module.Polyline {
  constructor(...args) {
    super(...args);
    this._snakingTimestamp = 0;
    this._snakingRings = 0;
    this._snakingVertices = 0;
    this._snakingDistance = 0;
    this._snaking = false;
    this._snakingTime = performance.now();
    this._snakeSpeed = 200;
    this._snakeLatLngs = null;
  }

  snakeIn(snakeSpeed) {
    if (!this._snakeLatLngs || this._snakeLatLngs.length === 0) return;
    if (this._snaking) return;

    if (
      !("performance" in window) ||
      !("now" in window.performance) ||
      !this._map
    ) {
      return;
    }

    this._snaking = true;
    this._snakeSpeed = snakeSpeed;
    this._snakingTime = performance.now();
    this._snakingVertices = this._snakingRings = this._snakingDistance = 0;

    if (!this._snakeLatLngs) {
      this._snakeLatLngs = Leaflet_module.LineUtil.isFlat(this.getLatLngs())
        ? [this.getLatLngs()]
        : this.getLatLngs();
    }

    this.setLatLngs([[this._snakeLatLngs[0][0], this._snakeLatLngs[0][0]]]);
    this._snake();
    this.fire("snakestart");
    return this;
  }

  setSnakeLatLngs(latlngs) {
    this._snakeLatLngs = Leaflet_module.LineUtil.isFlat(latlngs)
      ? [latlngs]
      : latlngs;
  }

  _snake() {
    var now = performance.now();
    var diff = now - this._snakingTime;
    var forward = (diff * this._snakeSpeed) / 1000;
    this._snakingTime = now;

    const prev = this.getLatLngs()[this._snakingRings];
    if (Array.isArray(prev)) {
      prev.pop();
      this.setLatLngs(prev);
    }

    return this._snakeForward(forward);
  }

  _snakeForward(forward) {
    if (!this._map) return;

    var currPoint = this._map.latLngToContainerPoint(
      this._snakeLatLngs[this._snakingRings][this._snakingVertices]
    );
    var nextPoint = this._map.latLngToContainerPoint(
      this._snakeLatLngs[this._snakingRings][this._snakingVertices + 1]
    );

    var distance = currPoint.distanceTo(nextPoint);

    if (this._snakingDistance + forward > distance) {
      this._snakingVertices++;
      const prev = this.getLatLngs()[this._snakingRings];
      if (Array.isArray(prev)) {
        prev.push(
          this._snakeLatLngs[this._snakingRings][this._snakingVertices]
        );
        this.setLatLngs(prev);
      }

      if (
        this._snakingVertices >=
        this._snakeLatLngs[this._snakingRings].length - 1
      ) {
        if (this._snakingRings >= this._snakeLatLngs.length - 1) {
          return this._snakeEnd();
        } else {
          this._snakingVertices = 0;
          this._snakingRings++;
          this.setLatLngs([
            this._snakeLatLngs[this._snakingRings][this._snakingVertices],
          ]);
        }
      }

      this._snakingDistance -= distance;
      return this._snakeForward(forward);
    }

    this._snakingDistance += forward;

    var percent = this._snakingDistance / distance;

    var headPoint = nextPoint
      .multiplyBy(percent)
      .add(currPoint.multiplyBy(1 - percent));

    var headLatLng = this._map.containerPointToLatLng(headPoint);
    this.addLatLng(headLatLng);
    Leaflet_module.Util.requestAnimFrame(this._snake.bind(this));
  }

  _snakeEnd() {
    this.setLatLngs(this._snakeLatLngs);
    this._snaking = false;
    this.fire("snakeend");
  }
}

window.Animated_Polyline = Animated_Polyline;

export default Animated_Polyline;
