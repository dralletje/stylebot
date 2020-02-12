let webpack = require("webpack");
let HtmlWebpackPlugin = require("html-webpack-plugin");
let ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
let WorkboxWebpackPlugin = require('workbox-webpack-plugin');
let HotModuleReplacementPlugin = webpack.HotModuleReplacementPlugin;

module.exports = [
  "@rescripts/rescript-env",
  {
    webpack: webpack_config => {
      // console.log(`webpack_config:`, webpack_config)

      // let hotreplacemement = webpack_config.plugins.find(x => x instanceof HotModuleReplacementPlugin);
      // console.log(`hotreplacemement:`, hotreplacemement)
      // hotreplacemement.multiStep = true;

      webpack_config.plugins = webpack_config.plugins.filter(x => !(x instanceof ModuleScopePlugin));
      webpack_config.plugins = webpack_config.plugins.filter(x => !(x instanceof WorkboxWebpackPlugin.GenerateSW));

      let html_webpack_plugin = webpack_config.plugins.find(
        x => x instanceof HtmlWebpackPlugin
      );

      html_webpack_plugin.options = {
        ...html_webpack_plugin.options,
        inject: false,
        filename: "entry.js",
        template: "public/entry-template.js"
      };

      webpack_config.entry = [
        // require.resolve('webpack-dev-server/client') + '?/',
        // require.resolve('webpack/hot/dev-server'),
        ...(webpack_config.entry.length === 1
          ? webpack_config.entry
          : webpack_config.entry.slice(1))
      ];

      webpack_config.output.globalObject = "globalThis";

      console.log(`webpack_config.plugins:`, webpack_config.plugins);

      // console.log(`webpack_config.plugins:`, webpack_config.plugins)
      // process.exit();

      return webpack_config;
    },
    devServer: devserver_config => {
      devserver_config.headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods":
          "GET, POST, PUT, DELETE, PATCH, OPTIONS",
        "Access-Control-Allow-Headers":
          "X-Requested-With, content-type, Authorization"
      };
      // devserver_config.hot = true;
      console.log(`devserver_config:`, devserver_config);
      return devserver_config;
    }
  }
];
