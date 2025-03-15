<template>
  <div id="app">
    <router-view></router-view>
    <!-- This should now work -->
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style lang="scss">
body {
  font-family: Arial, Helvetica, sans-serif;
  margin: 0;
}
* {
  box-sizing: border-box;
}
#app {
  min-height: 100vh;
}
</style>
