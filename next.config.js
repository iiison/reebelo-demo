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
        // regexEqual(rule.test, /\.module\.(scss|sass)$/)
      );

      if (moduleCssRule) {
        const cssLoader = moduleCssRule.use.find(({ loader }) =>
          loader.includes('css-loader')
        );

        if (cssLoader) {
          console.log('*******************')
          console.log(cssLoader)
          console.log('*******************')

          cssLoader.options.modules.mode = 'local'
          // cssLoader.options.modules = {
          //   modules       : true,
          //   sourceMap     : false,
          //   camelCase     : true,
          //   importLoaders : 3
          // };
        }
      }
    }

    return config
  },
}
