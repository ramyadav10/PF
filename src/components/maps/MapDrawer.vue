<template>
  <div class="Map">
    <div
      id="test-map"
      v-if="showTestMap"
      style="height: 400px; width: 100%; z-index: 1000"
    ></div>

    <Tutorial
      :darkMode="darkMode"
      :modalIsOpen="modalIsOpen"
      @setIsOpen="setIsOpen($event)"
    />

    <div v-if="loading">
      <Loading :darkMode="darkMode" :progress="progress" />
    </div>

    <template v-else>
      <div class="Settings">
        <div class="Child" style="justify-content: flex-start">
          <div
            style="
              position: absolute;
              margin-left: 40px;
              display: flex;
              flex-direction: column;
            "
          >
            <select v-model="algorithm" class="Select">
              <option
                v-for="algo in algos"
                :key="algo.value"
                :value="algo.value"
              >
                {{ algo.label }}
              </option>
            </select>
            <div class="StatContainer">
              <label v-if="timeTaken >= 0" class="Label">
                {{
                  pathFound
                    ? `Path found in ${(timeTaken / 1000.0).toFixed(2)} seconds`
                    : "Finding path..."
                }}
              </label>
              <label v-if="pathFound && path.length > 0" class="Label">
                Path length: {{ path.length }} nodes
              </label>
            </div>
          </div>
        </div>

        <div class="Child" style="justify-content: center">
          <select v-model="city" class="Select">
            <option
              v-for="city in cities"
              :key="city.value"
              :value="city.value"
            >
              {{ city.label }}
            </option>
          </select>
          <button
            class="Button"
            :disabled="isRunning || !startNode || !endNode"
            @click="runPathfinding(100, true)"
          >
            Visualize
          </button>
          <Button
            class="hover btn-block success"
            key="block-view"
            @click="toggleMapView"
          >
            <img
              src="data:image/jpeg;base64,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"
              alt=""
            />
            <span class="lg">{{ "3D View" }}</span>
          </Button>
          <!-- <button class="Button" @click="forceShowMap">Force Show Map</button>
          <button class="Button" @click="toggleTestMap">Test Map</button> -->
        </div>

        <div class="Child" style="justify-content: flex-end">
          <div class="IconWrapper" @click="setIsOpen(true)">
            <InfoIcon :size="24" />
          </div>
          <div class="IconWrapper" @click="openGitHub">
            <MarkGithubIcon :size="24" />
          </div>
        </div>
      </div>

      <div id="map-container" ref="mapContainer" class="map-container">
        <l-map
          ref="map"
          :center="[lat, lng]"
          :zoom="zoom"
          :zoomControl="false"
          @click="handleClick"
        >
          <l-tile-layer
            :url="layerTiles"
            :attribution="'&copy; <a href=\'http://osm.org/copyright/\'>OpenStreetMap</a> contributors'"
          />

          <l-control-zoom position="bottomleft" />

          <PathfindingMarkers :nodeData="nodeData" :nodes="nodes" />

          <l-marker
            v-if="startMarkerPos"
            :lat-lng="[startMarkerPos.lat, startMarkerPos.lng]"
            :icon="markerA"
            :draggable="true"
            @drag="onStartNodeDrag"
            @dragend="onStartNodeDragEnd"
          />

          <l-marker
            v-if="endMarkerPos"
            :lat-lng="[endMarkerPos.lat, endMarkerPos.lng]"
            :icon="markerB"
            :draggable="true"
            @dragstart="clearPath"
            @drag="onEndNodeDrag"
            @dragend="onEndNodeDragEnd"
          />

          <AnimatedPolyline
            v-if="pathFound && path.length > 0"
            :positions="path"
            :snakeSpeed="300"
          />
        </l-map>
      </div>
    </template>
  </div>
</template>

<script>
import { markerA, markerB } from "@/Icons";
import Loading from "@/components/maps/Loading.vue";
import PathfindingMarkers from "@/components/maps/PathfindingMarkers.vue";
import Tutorial from "@/components/maps/Tutorial.vue";
import { algos, cities, cityLocs, getCityData } from "@/constants";
import AnimatedPolyline from "@/lib/react-leaflet-animated-polyline/AnimatedPolyline.vue";
import { hasKey } from "@/utils";
import {
  InfoIcon,
  MarkGithubIcon,
  MoonIcon,
  SunIcon,
} from "@primer/octicons-react";
import * as d3 from "d3-quadtree";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { LControlZoom, LMap, LMarker, LTileLayer } from "vue2-leaflet";
import PathfindingWorker from "worker-loader!@/path-worker/Worker.js";

export default {
  name: "PathfindingVisualizer",
  components: {
    Tutorial,
    Loading,
    PathfindingMarkers,
    AnimatedPolyline,
    SunIcon,
    MoonIcon,
    InfoIcon,
    MarkGithubIcon,
    LMap,
    LTileLayer,
    LMarker,
    LControlZoom,
  },
  data() {
    return {
      lng: -122.4372,
      lat: 37.7546,
      zoom: 11.48,
      worker: null,
      timeTaken: -1,
      startNode: null,
      endNode: null,
      startMarkerPos: null,
      endMarkerPos: null,
      nodes: new Set(),
      pathFound: false,
      isRunning: false,
      path: [],
      algorithm: "dijkstras",
      darkMode: false,
      loading: true,
      progress: 0,
      modalIsOpen: false,
      city: "san_francisco",
      qt: d3.quadtree(),
      nodeData: {},
      map: null,
      algos: algos,
      cities: cities,
      markerA: markerA,
      markerB: markerB,
      showTestMap: false,
      testMap: null,
    };
  },
  computed: {
    layerTiles() {
      return this.darkMode
        ? "https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    },
  },
  mounted() {
    console.log("Component mounted");

    // Fix Leaflet icon paths if needed
    if (
      typeof window !== "undefined" &&
      L.Icon.Default.imagePath === undefined
    ) {
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
        iconUrl: require("leaflet/dist/images/marker-icon.png"),
        shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
      });
      console.log("Leaflet icon paths fixed");
    }

    // Initialize worker
    try {
      this.worker = new PathfindingWorker();
      console.log("Worker initialized successfully");

      this.worker.onmessage = (event) => {
        console.log("Worker message received");
        const data = JSON.parse(event.data);
        if (data.type === "updateNodes") {
          const newNodes = new Set(data.nodes);
          if (newNodes) {
            this.addNodes(newNodes);
          }
        } else if (data.type === "setPath") {
          if (data.path) {
            this.pathFound = true;
            this.timeTaken = data.timeTaken;
            this.pathfindingComplete(data.path);
          }
        }
      };

      this.worker.onerror = (error) => {
        console.error("Worker error:", error);
      };
    } catch (error) {
      console.error("Error initializing worker:", error);
    }

    // Check the map reference
    console.log("Map container:", this.$refs.mapContainer);
    console.log("Map reference:", this.$refs.map);

    // Force a check of the loading state after a short delay
    setTimeout(() => {
      console.log("Loading state after 5s delay:", this.loading);
      if (this.loading) {
        console.warn(
          "Map still in loading state after delay. Try forcing to false."
        );
        // Don't automatically force loading to false, let the user do it with the button
      }
    }, 5000);

    // Check if the node data is successfully loading
    setTimeout(() => {
      console.log("Node data after delay:", Object.keys(this.nodeData).length);
      if (Object.keys(this.nodeData).length === 0) {
        console.warn(
          "No node data loaded after delay. Check getCityData function."
        );
      }
    }, 7000);
  },
  watch: {
    city: {
      handler(newCity) {
        console.log("City changed to " + newCity);
        console.log("Loading state before city change:", this.loading);

        if (newCity) {
          if (hasKey(cityLocs, newCity)) {
            this.lat = cityLocs[newCity].lat;
            this.lng = cityLocs[newCity].lng;
          }

          this.startNode = null;
          this.endNode = null;
          this.path = [];
          this.timeTaken = -1;
          this.pathFound = false;
          this.startMarkerPos = null;
          this.endMarkerPos = null;

          // Ensure loading state updates
          const setLoading = (value) => {
            console.log(`Setting loading state to: ${value}`);
            this.loading = value;
          };

          const onProgress = (value) => {
            this.progress = value;
            console.log(`Loading progress: ${value}%`);
          };

          console.log("Calling getCityData...");
          getCityData(newCity, setLoading, onProgress)
            .then((data) => {
              console.log("GETCITYDATA completed successfully");
              console.log(
                "Sample data point:",
                JSON.stringify(data[Object.keys(data)[0]])
              );
              console.log("Loading state after data received:", this.loading);
              this.nodeData = data;
            })
            .catch((error) => {
              console.error("Error in getCityData:", error);
              setLoading(false); // Make sure to set loading to false on error
            });
        }
      },
      deep: true,
      immediate: true,
    },
    nodeData: {
      handler(newNodeData) {
        console.log(
          "nodeData changed, keys count:",
          Object.keys(newNodeData).length
        );
        if (Object.keys(newNodeData).length > 0) {
          const transformed = Object.entries(newNodeData).map(
            ([key, value]) => ({
              key,
              lat: value.lat,
              lon: value.lon,
            })
          );

          console.log("Transformed data sample:", transformed.slice(0, 1));
          this.qt = d3
            .quadtree()
            .x((d) => d.lat)
            .y((d) => d.lon)
            .addAll(transformed);

          console.log("Quadtree size:", this.qt.size());
        }
      },
      deep: true,
      immediate: true,
    },
    loading: {
      handler(newLoading) {
        console.log("Loading state changed to:", newLoading);
        if (!newLoading) {
          console.log("Map should be visible now");
          this.$nextTick(() => {
            console.log("Map reference after loading change:", this.$refs.map);
            if (this.$refs.map) {
              console.log("Map internal state:", this.$refs.map.mapObject);
            }
          });
        }
      },
    },
    startNode: {
      handler(newStartNode) {
        console.log("Start node changed:", newStartNode);
        if (this.pathFound) {
          this.runPathfinding(0, true);
        }
      },
    },
    endNode: {
      handler(newEndNode) {
        console.log("End node changed:", newEndNode);
        if (this.pathFound) {
          this.runPathfinding(0, true);
        }
      },
    },
  },
  methods: {
    toggleMapView() {
      console.log("Loading map view");
      this.$router.push("/").then(() => {
        window.location.reload();
      });
    },
    forceShowMap() {
      console.log("Forcing map to show");
      this.loading = false;
      this.$nextTick(() => {
        if (this.$refs.map) {
          console.log("Map reference after force:", this.$refs.map);
          if (this.$refs.map.mapObject) {
            console.log("Map object exists, invalidating size");
            this.$refs.map.mapObject.invalidateSize();
          }
        } else {
          console.warn("Map reference not found after force show");
        }
      });
    },
    toggleTestMap() {
      this.showTestMap = !this.showTestMap;
      console.log("Test map toggled:", this.showTestMap);

      if (this.showTestMap) {
        this.$nextTick(() => {
          try {
            if (!this.testMap) {
              console.log("Creating test map");
              this.testMap = L.map("test-map").setView([51.505, -0.09], 13);
              L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                  attribution: "&copy; OpenStreetMap contributors",
                }
              ).addTo(this.testMap);
              console.log("Test map created successfully");
            } else {
              console.log("Test map already exists, invalidating size");
              this.testMap.invalidateSize();
            }
          } catch (error) {
            console.error("Error creating test map:", error);
          }
        });
      }
    },
    findClosestNode(latlng) {
      if (this.qt.size() > 0) {
        return this.qt.find(latlng.lat, latlng.lng);
      }
    },
    handleClick(e) {
      console.log("Map clicked at:", e.latlng);
      if (!this.startNode || !this.endNode) {
        const closest = this.findClosestNode(e.latlng);
        if (closest) {
          console.log("Found closest node:", closest);
          if (!this.startNode) {
            this.startNode = closest.key;
            this.startMarkerPos = { lat: closest.lat, lng: closest.lon };
            console.log("Set start node:", this.startNode);
          } else {
            this.endNode = closest.key;
            this.endMarkerPos = { lat: closest.lat, lng: closest.lon };
            console.log("Set end node:", this.endNode);
          }
        } else {
          console.warn(
            "No closest node found - quadtree size:",
            this.qt.size()
          );
        }
      }
    },
    onStartNodeDrag(e) {
      // Handle drag event if needed
      console.log("Dragging start marker");
    },
    onEndNodeDrag(e) {
      // Handle drag event if needed
      console.log("Dragging end marker");
    },
    onStartNodeDragEnd(e) {
      console.log("Start marker drag ended");
      const closest = this.findClosestNode(e.target._latlng);
      if (closest) {
        this.startNode = closest.key;
        this.startMarkerPos = { lat: closest.lat, lng: closest.lon };
        console.log("Updated start node:", this.startNode);
      }
    },
    onEndNodeDragEnd(e) {
      console.log("End marker drag ended");
      const closest = this.findClosestNode(e.target._latlng);
      if (closest) {
        this.endNode = closest.key;
        this.endMarkerPos = { lat: closest.lat, lng: closest.lon };
        console.log("Updated end node:", this.endNode);
      }
    },
    clearPath() {
      console.log("Clearing path");
      this.path = [];
    },
    runPathfinding(delayInMs, shouldReset) {
      console.log("Running pathfinding with algorithm:", this.algorithm);
      if (shouldReset) this.nodes = new Set();
      this.isRunning = true;

      if (this.startNode && this.endNode) {
        const message = JSON.stringify({
          city: this.city,
          algorithm: this.algorithm,
          startNode: this.startNode,
          endNode: this.endNode,
          delayInMs,
        });

        console.log("Sending message to worker:", message);
        this.worker.postMessage(message);
      } else {
        console.warn("Cannot run pathfinding: start or end node is missing");
        this.isRunning = false;
      }
    },
    addNodes(nodesToRender) {
      console.log("Adding nodes to render, count:", nodesToRender.size);
      this.nodes = new Set([...this.nodes, ...nodesToRender]);
    },
    pathfindingComplete(newPath) {
      console.log("Pathfinding complete, path length:", newPath.length);
      this.path = newPath;
      this.isRunning = false;
    },
    setIsOpen(value) {
      this.modalIsOpen = value;
    },
    openGitHub() {
      window.open("https://github.com/0kzh/pathfinding-visualizer", "_blank");
    },
  },
};
</script>

<style>
.Map {
  height: 100vh;
  width: 100%;
  position: relative;
}

.map-container {
  height: calc(100vh - 60px);
  width: 100%;
  position: relative;
}

.Settings {
  position: fixed;
  z-index: 999;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  height: 60px;
  padding: 0 24px;
  box-sizing: border-box;
  background-color: rgba(255, 255, 255, 0.9);
}

.Child {
  flex: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
}

.Select {
  height: 35px;
  margin-right: 10px;
  padding: 0 10px;
  background-color: white;
  border: 1px solid #ccc;
  border-radius: 4px;
  appearance: none;
}

.Button {
  height: 35px;
  padding: 0 16px;
  margin-left: 10px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.Button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.IconWrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 16px;
  cursor: pointer;
}

.Label {
  font-size: 14px;
  margin: 4px 0;
  color: #333;
}

.StatContainer {
  display: flex;
  flex-direction: column;
}

.btn-block {
  left: 500px;
}

.leaflet-container {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  padding: 0;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica,
    Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
</style>
