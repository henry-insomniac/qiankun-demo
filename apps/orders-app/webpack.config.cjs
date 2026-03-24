const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const workspaceSources = [
  path.resolve(__dirname, "src"),
  path.resolve(__dirname, "../../packages/contracts/src"),
  path.resolve(__dirname, "../../packages/auth-sdk/src"),
  path.resolve(__dirname, "../../packages/design-tokens/src"),
  path.resolve(__dirname, "../../packages/shared-utils/src"),
];

module.exports = (_, argv) => {
  const isProduction = argv.mode === "production";
  const useHashRouting = process.env.USE_HASH_ROUTING === "true";

  return {
    mode: isProduction ? "production" : "development",
    entry: path.resolve(__dirname, "src/index.tsx"),
    devtool: isProduction ? "source-map" : "eval-cheap-module-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: isProduction
        ? "static/js/[name].[contenthash:8].js"
        : "static/js/[name].js",
      chunkFilename: isProduction
        ? "static/js/[name].[contenthash:8].chunk.js"
        : "static/js/[name].chunk.js",
      publicPath: "auto",
      library: {
        name: "ordersApp",
        type: "umd",
      },
      uniqueName: "ordersApp",
      globalObject: "window",
      clean: true,
    },
    resolve: {
      extensions: [".ts", ".tsx", ".js", ".jsx"],
    },
    module: {
      rules: [
        {
          test: /\.[jt]sx?$/,
          include: workspaceSources,
          use: {
            loader: "babel-loader",
            options: {
              presets: [
                ["@babel/preset-env", { targets: "defaults" }],
                ["@babel/preset-react", { runtime: "automatic" }],
                "@babel/preset-typescript",
              ],
            },
          },
        },
        {
          test: /\.css$/,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "public/index.html"),
      }),
      new (require("webpack")).DefinePlugin({
        __USE_HASH_ROUTING__: JSON.stringify(useHashRouting),
      }),
    ],
    devServer: {
      port: 7101,
      hot: true,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    stats: "minimal",
  };
};
