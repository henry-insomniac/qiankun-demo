const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const workspaceSources = [
  path.resolve(__dirname, "src"),
  path.resolve(__dirname, "../../packages/contracts/src"),
  path.resolve(__dirname, "../../packages/auth-sdk/src"),
  path.resolve(__dirname, "../../packages/design-tokens/src"),
  path.resolve(__dirname, "../../packages/shared-utils/src"),
];

function normalizePublicBasePath(basePath = "/") {
  if (!basePath || basePath === "/") {
    return "/";
  }

  return `/${basePath.replace(/^\/+|\/+$/g, "")}/`;
}

function normalizeShellBasePath(basePath = "") {
  if (!basePath || basePath === "/") {
    return "";
  }

  return `/${basePath.replace(/^\/+|\/+$/g, "")}`;
}

module.exports = (_, argv) => {
  const isProduction = argv.mode === "production";
  const publicBasePath = normalizePublicBasePath(process.env.PUBLIC_BASE_PATH || "/");
  const shellBasePath = normalizeShellBasePath(
    process.env.SHELL_BASE_PATH || publicBasePath,
  );

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
      publicPath: publicBasePath,
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
      new webpack.DefinePlugin({
        __SHELL_BASE_PATH__: JSON.stringify(shellBasePath),
        __ROOMS_APP_ENTRY__: JSON.stringify(
          process.env.ROOMS_APP_ENTRY || "http://localhost:7102",
        ),
        __SURVEY_DOCTOR_QA_PROXY_URL__: JSON.stringify(
          process.env.SURVEY_DOCTOR_QA_URL || "http://localhost:7203",
        ),
        __CROSS_DOCUMENT_ANNOTATION_PROXY_URL__: JSON.stringify(
          process.env.CROSS_DOCUMENT_ANNOTATION_URL || "http://localhost:7205",
        ),
        __PDF_PARSER_PROXY_URL__: JSON.stringify(
          process.env.PDF_PARSER_URL || "http://localhost:7204",
        ),
        __KNOWLEDGE_GRAPH_PROXY_URL__: JSON.stringify(
          process.env.KNOWLEDGE_GRAPH_URL || "http://localhost:7206",
        ),
      }),
    ],
    devServer: {
      port: 7100,
      hot: true,
      historyApiFallback: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    stats: "minimal",
  };
};
