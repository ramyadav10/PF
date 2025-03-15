export default new Worker(new URL("./Worker.js", import.meta.url), {
  type: "module",
});
