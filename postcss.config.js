/* eslint-disable import/no-extraneous-dependencies,global-require */
/* global module :true */
module.exports = {
  "plugins"   : [
    'calc',
    'colorguard',
    'postcss-import',
    'postcss-extend',
    'postcss-mixins',
    'precss',
    'postcss-simple-vars',
    'autoprefixer',
    'postcss-flexbugs-fixes',
    [
      "postcss-preset-env",
      {
        "autoprefixer": {
          "flexbox": "no-2009",
          "remove" : true
        },
        "stage": 3,
        "features": {
          "custom-properties": false
        }
      }
    ],
  ]
}

