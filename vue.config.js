module.exports = {

  publicPath:
    process.env.NODE_ENV === "production"
      ? "/Pathfinding-Visualizer-ThreeJS/"
      : "/",
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: "worker-loader" },
        },
      ],
    },
  },
};
