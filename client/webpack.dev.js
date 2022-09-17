const webpack = require("webpack");
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const LodashModuleReplacementPlugin = require("lodash-webpack-plugin");
const BundleAnalyzerPlugin =
  require("webpack-bundle-analyzer").BundleAnalyzerPlugin;

module.exports = () => ({
  mode: "development",
  entry: "./src/index.js",
  output: {
    publicPath: "/",
    path: path.resolve(__dirname, "./dist"),
    filename: "./js/[name].[contenthash].js",
    clean: true,
  },

  devServer: {
    client: {
      overlay: true,
    },
    proxy: {
      "/api": "http://localhost:5000",
    },
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, "dist"),
    },
    open: true,
    hot: true,
    compress: true,
    port: 9000,
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new LodashModuleReplacementPlugin(),
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /ru/),
    // new BundleAnalyzerPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./public/favicon.ico",
      title: "Follow",
      template: path.resolve(__dirname, "./public/index.html"), // шаблон
      filename: "index.html", // название выходного файла
      inject: true,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
        },
      },
      {
        test: /\.css$/i,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              importLoaders: 1,
              modules: {
                localIdentName: "[local]___[hash:base64:5]",
              },
            },
          },
        ],
        include: /\.module\.css$/,
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
        exclude: /\.module\.css$/,
      },

      {
        test: /\.(png|svg|jpg|gif|ico)$/,
        type: "asset/resource",
        generator: {
          filename: "./image/[hash][ext][query]",
        },
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        type: "asset/resource",
        generator: {
          filename: "./fonts/[hash][ext][query]",
        },
      },
    ],
  },
});
