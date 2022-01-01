/* global process :true, __dirname :true, module :true */

import path                                from 'path'
import webpack                             from 'webpack'
import minimist                            from 'minimist'
import TerserPlugin                        from 'terser-webpack-plugin'
import ManifestPlugin                      from 'webpack-manifest-plugin'
import PnpWebpackPlugin                    from 'pnp-webpack-plugin'
import safePostCssParser                   from 'postcss-safe-parser'
import HtmlWebpackPlugin                   from 'html-webpack-plugin'
import MiniCssExtractPlugin                from 'mini-css-extract-plugin'
import { BundleAnalyzerPlugin }            from 'webpack-bundle-analyzer'
import OptimizeCSSAssetsPlugin             from 'optimize-css-assets-webpack-plugin'
import CaseSensitivePathsPlugin            from 'case-sensitive-paths-webpack-plugin'
import { devStyleConfig, prodStyleConfig } from './build-configs'

const LAUNCH_COMMAND = process.env.npm_lifecycle_event
const commandsConfigs = minimist(process.argv.slice(2))

const { api = null } = commandsConfigs

const isProduction = LAUNCH_COMMAND.includes('prod')

// const isLocal = LAUNCH_COMMAND === 'local'
const shouldUseSourceMaps = isProduction
const PATHS = {
  app          : path.join(__dirname, 'app'),
  build        : path.join(__dirname, 'build'),
  utils        : path.join(__dirname, 'app/utils'),
  redux        : path.join(__dirname, 'app/redux'),
  reduxUtils   : path.join(__dirname, 'app/redux/utils'),
  styles       : path.join(__dirname, 'app/styles'),
  configs      : path.join(__dirname, 'app/configs'),
  components   : path.join(__dirname, 'app/components'),
  screens      : path.join(__dirname, 'app/screens'),
  icons        : path.join(__dirname, 'app/components/icons'),
  reduxModules : path.join(__dirname, 'app/redux/modules')
}

// Plugins Initialization with configs
const caseSensitivePathPlugin = new CaseSensitivePathsPlugin({
  debug: true
})

const terserPlugin = new TerserPlugin({
  cache         : true,
  parallel      : true,
  sourceMap     : shouldUseSourceMaps,
  terserOptions : {
    parse : {
      ecma : 8
    },
    compress : {
      // warning     : true, // Could cause problems
      comparisons : false,
      ecma        : 5,
      inline      : 2
    },
    output : {
      ascii_only : true,
      ecma       : 5
    }
  }
})

const optimizeCSSAssetsPlugin = new OptimizeCSSAssetsPlugin({
  cssProcessorOptions : {
    parser : safePostCssParser,
    map    : shouldUseSourceMaps
      ? {
        inline     : false,
        annotation : true
      }
      : false
  }
})

const defaultHtmlPlugConfig = {
  inject   : true,
  template : `${PATHS.app}/index.html`
}

const additionalHtmlPlugConfig = isProduction && {
  minify : {
    minifyJS                      : true,
    minifyCSS                     : true,
    minifyURLs                    : true,
    removeComments                : true,
    useShortDoctype               : true,
    keepClosingSlash              : true,
    collapseWhitespace            : true,
    removeEmptyAttributes         : true,
    removeRedundantAttributes     : true,
    removeStyleLinkTypeAttributes : true
  }
}

const htmlWebpackPlugin = new HtmlWebpackPlugin({
  ...defaultHtmlPlugConfig,
  ...additionalHtmlPlugConfig
})

const prodPlugin = new webpack.DefinePlugin({
  'process.env' : {
    NODE_ENV : JSON.stringify('production')
  }
})

const envInfo = new webpack.DefinePlugin({
  isProduction,
  testAPI       : JSON.stringify(api),
  command       : JSON.stringify(LAUNCH_COMMAND),
  isDevelopment : LAUNCH_COMMAND === 'start'
})

const manifestPlugin = new ManifestPlugin({
  fileName   : '../asset-manifest.json',
  publicPath : '/',
  generate   : (seed, files) => {
    const manifestFiles = files.reduce(function (manifest, file) {
      manifest[file.name] = file.path
      return manifest
    }, seed)

    return {
      files: manifestFiles
    }
  }
})

const miniCssExtractPlugin = new MiniCssExtractPlugin({
  // filename      : '[name].[hash:8].css',
  filename      : 'css/[name].css',
  chunkFilename : 'css/[id].[hash:8].css'
})

const bundleAnalyzerPlugin = new BundleAnalyzerPlugin()
const HMRPlugin = new webpack.HotModuleReplacementPlugin() // Only for CSS
const ignorePlugin = new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/) // For momentjs
// ***************************************************

process.env.BABEL_ENV = LAUNCH_COMMAND
process.env.LINT_ENV = LAUNCH_COMMAND
process.env.isProduction = isProduction

const devPlugins = [HMRPlugin]
const commonPlugins = [
  bundleAnalyzerPlugin,
  caseSensitivePathPlugin,
  miniCssExtractPlugin,
  htmlWebpackPlugin,
  PnpWebpackPlugin,
  prodPlugin,
  envInfo
]
const prodPlugins = [ignorePlugin, manifestPlugin]

if (LAUNCH_COMMAND === 'prod' || LAUNCH_COMMAND === 'start') {
  commonPlugins.shift()
}

const prodEntry = [PATHS.app, `${PATHS.styles}/main.css`]
const devEntry = [...prodEntry, require.resolve('webpack-dev-server/client') + '?/']

const baseConfigs = {
  entry : isProduction ? prodEntry : devEntry,
  output : {
    // chunkFilename: 'js/[name].[hash:8].].bundle.js',
    filename   : 'js/[name].[hash:8].bundle.js',
    path       : PATHS.build,
    publicPath : "/"
  },
  module : {
    strictExportPresence : true,
    rules : [
      { parser : { requireEnsure: false } },
      {
        enforce : 'pre',
        test    : /\.(js|jsx)$/,
        include : PATHS.app,
        options : { fix: true },
        loader  : 'eslint-loader',
        exclude : [/bundle\.js|coverage/, /node_modules/]
      },
      // {
      // oneOf  : [
      {
        test    : /\.(js|jsx)$/,
        loader  : 'babel-loader',
        exclude : [/node_modules/]
      },
      {
        loader  : require.resolve('file-loader'),
        exclude : [/\.(js|mjs|jsx|ts|tsx|css)$/, /\.html$/, /\.json$/],
        options : {
          name : 'media/[name].[hash:8].[ext]',
        },
      },
      {
        test    : /\.css$/,
        exclude : [path.resolve(__dirname, 'coverage'), /node_modules/],
        loader  : isProduction ? prodStyleConfig : devStyleConfig
      }
      // ]
      // }
    ]
  },
  resolve : {
    extensions : ['.js', '.jsx', '.css', '.json'],
    modules    : [path.resolve('.'), 'node_modules'],
    alias      : {
      $APP        : PATHS.app,
      $REDUX      : PATHS.redux,
      $BUILD      : PATHS.build,
      $CONFIGS    : PATHS.configs,
      $RUTILS     : PATHS.reduxUtils,
      $RMODULES   : PATHS.reduxModules,
      $SCREENS    : PATHS.screens,
      $COMPONENTS : PATHS.components,
      $ICONS      : PATHS.icons,
      $UTILS      : PATHS.utils
    }
  },
  optimization : {
    minimize    : isProduction,
    minimizer   : [terserPlugin, optimizeCSSAssetsPlugin],
    splitChunks : {
      chunks : 'async',
      name   : false,
      cacheGroups : {
        styles : {
          name    : 'styles',
          test    : /\.css$/,
          chunks  : 'all',
          enforce : true
        }
      }
    },
    runtimeChunk : {
      name : entrypoint => `runtime-${entrypoint.name}`
    }
  },
  resolveLoader : {
    plugins : [PnpWebpackPlugin.moduleLoader(module)]
  },
  node : {
    fs            : 'empty',
    dns           : 'mock',
    net           : 'empty',
    tls           : 'empty',
    dgram         : 'empty',
    http2         : 'empty',
    module        : 'empty',
    child_process : 'empty'
  }
}

const devConfigs = {
  devtool : 'cheap-module-source-map',
  plugins : [...commonPlugins, ...devPlugins],
  devServer : {
    hot                : true,
    open               : true,
    compress           : true,
    contentBase        : PATHS.build,
    watchContentBase   : true,
    clientLogLevel     : 'info',
    historyApiFallback : true,
    watchOptions       : {
      ignored          : /node_modules/,
      aggregateTimeout : 800
    },
    overlay : {
      warnings : isProduction,
      errors   : true
    }
  }
}

const prodConfigs = {
  devtool : false,
  bail    : isProduction,
  plugins : [...commonPlugins, ...prodPlugins]
}

const mainConfig = isProduction
  ? {
    ...baseConfigs,
    ...prodConfigs
  }
  : {
    ...baseConfigs,
    ...devConfigs
  }

export default mainConfig

