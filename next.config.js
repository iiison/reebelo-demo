// const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const regexEqual = (x, y) => {
  return (
    x instanceof RegExp &&
    y instanceof RegExp &&
    x.source === y.source &&
    x.global === y.global &&
    x.ignoreCase === y.ignoreCase &&
    x.multiline === y.multiline
  );
};

module.exports = {
  reactStrictMode: true,
  webpack: (config) => {
    const oneOf = config.module.rules.find(
      (rule) => typeof rule.oneOf === 'object'
    );

    if (oneOf) {
      const moduleCssRule = oneOf.oneOf.find(
        (rule) => regexEqual(rule.test, /\.module\.css$/)
      );

      if (moduleCssRule) {
        const cssLoader = moduleCssRule.use.find(({ loader }) =>
          loader.includes('css-loader')
        );

        if (cssLoader) {
          cssLoader.options.modules.mode = 'local'
        }
      }
    }

    // // CSS Minimizer fix
    // config.optimization.minimizer = config.optimization.minimizer.filter( minimizer => {
    //   return minimizer.constructor.name !== 'CssMinimizerPlugin';
    // });

    // // create new instance of CssMinimizerPlugin
    // // minimizerOptions === cssnano config
    // const plugin = new CssMinimizerPlugin({
    //   minimizerOptions: {
    //     // your cssnano configuration
    //     preset: [
    //       'default',
    //       {
    //         "calc"                   : true,
    //         "cssDeclarationSorter"   : true,
    //         "colormin"               : true,
    //         "core"                   : true,
    //         "discardDuplicates"      : true,
    //         "discardOverridden"      : true,
    //         "mergeLonghand"          : true,
    //         "minifyFontValues"       : true,
    //         "minifyParams"           : true,
    //         "normalizeCharset"       : true,
    //         "orderedValues"          : true,
    //         "reduceDisplayValues"    : true,
    //         "styleCache"             : true,
    //         "uniqueSelectors"        : true,
    //         "convertValues"          : true,
    //         "discardComments"        : true,
    //         "discardEmpty"           : true,
    //         "discardUnused"          : true,
    //         "filterPlugins"          : true,
    //         "mergeIdents"            : true,
    //         "mergeRules"             : true,
    //         "minifySelectors"        : true,
    //         "normalizeString"        : true,
    //         "normalizeUrl"           : true,
    //         "reduceBackgroundRepeat" : true,
    //         "reduceTransforms"       : true,
    //         "zindex"                 : true
    //       },
    //     ],
    //   },
    // });

    // config.optimization.minimizer.push( plugin );

    return config
  },
}
