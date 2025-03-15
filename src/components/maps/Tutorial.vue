<template>
  <div v-if="modalIsOpen" class="modal-overlay" @click.self="closeModal">
    <div class="modal-container" :style="customStyles">
      <!-- Tabs -->
      <div class="tabs">
        <div
          v-for="tabName in ['about', 'algorithms']"
          :key="tabName"
          @click="tab = tabName"
          class="tab"
          :class="{ active: tab === tabName }"
        >
          {{ tabName }}
        </div>
      </div>

      <!-- Content -->
      <div v-if="tab === 'about'">
        <h2>Welcome to Maps Pathfinding Visualizer</h2>
        <div class="description">
          <div class="subtitle">What is this?</div>
          ❓ This app visualizes graph pathfinding algorithms for real-time
          route-finding on a map.
        </div>
        <div class="description">
          <div class="subtitle">How do I use it?</div>
          👉 Select an algorithm to visualize on the top-left corner. <br />
          🏘 Choose a city by clicking on the dropdown on the top-middle. <br />
          👀 When you're ready, click "Visualize" to see the algorithm in
          action.
        </div>
      </div>

      <div v-else-if="tab === 'algorithms'">
        <h2>About the Algorithms</h2>
        <div v-for="algo in descriptions" :key="algo.name" class="description">
          <b>{{ algo.name }}: </b> {{ algo.desc }} <br />
          <i>{{ algo.tags }}</i>
        </div>
      </div>

      <!-- Close Button -->
      <div class="button-container">
        <button @click="closeModal" class="close-button">Close</button>
      </div>
    </div>
  </div>
</template>

<script>
import { descriptions } from "@/constants";

export default {
  props: {
    darkMode: Boolean,
    modalIsOpen: Boolean,
  },
  data() {
    return {
      tab: "about",
      descriptions,
    };
  },
  computed: {
    customStyles() {
      return {
        background: this.darkMode ? "#212121" : "white",
        color: this.darkMode ? "white" : "black",
        borderColor: this.darkMode ? "#353535" : "white",
        padding: "30px",
        maxWidth: "50%",
        position: "relative",
      };
    },
  },
  methods: {
    closeModal() {
      this.$emit("update:modalIsOpen", false);
    },
  },
};
</script>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Modal Container */
.modal-container {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.3);
  max-width: 50%;
}

/* Tabs */
.tabs {
  display: flex;
  justify-content: center;
  margin-bottom: 16px;
}

.tab {
  cursor: pointer;
  padding: 8px 16px;
  font-size: 16px;
  text-transform: uppercase;
  text-decoration: underline;
  margin: 0 10px;
}

.tab.active {
  font-weight: bold;
}

/* Content */
.description {
  margin-bottom: 10px;
}

.subtitle {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 5px;
}

/* Close Button */
.button-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

.close-button {
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.close-button:hover {
  background-color: #357abd;
}
</style>
