<template>
  <div :style="customStyles" class="container">
    <h1 class="text">Loading city data... {{ progress }}%</h1>
  </div>
</template>

<script>
export default {
  props: {
    darkMode: Boolean,
    progress: Number,
  },
  computed: {
    customStyles() {
      return {
        backgroundColor: this.darkMode ? "#090909" : "#FBF8F3",
        color: this.darkMode ? "white" : "#405C78",
        border: this.darkMode ? "2px solid #444444" : "2px solid white",
      };
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  height: 100vh;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.text {
  font-size: 24px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
