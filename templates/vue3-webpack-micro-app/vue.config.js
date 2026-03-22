const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === "development" ? "/" : "/",
  devServer: {
    port: __APP_PORT__,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    historyApiFallback: true,
  },
  configureWebpack: {
    output: {
      library: "__APP_LIBRARY__",
      libraryTarget: "umd",
      chunkLoadingGlobal: "webpackJsonp___APP_LIBRARY__",
    },
  },
});

