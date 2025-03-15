import "./registerServiceWorker";

import App from "./App.vue";
import AppButton from "@/components/UI/AppButton.vue";
import Vue from "vue";
import router from "./router"; // Import router




Vue.component("Button", AppButton);

Vue.config.productionTip = false;

new Vue({
  router, // Register Vue Router
  render: (h) => h(App),
}).$mount("#app");
