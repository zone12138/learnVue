{
  mode: 'production',
  context: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project',
  devtool: 'source-map',
  output: {
    hashFunction: 'xxhash64',
    path: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\dist',
    filename: 'assets/js/[name].[contenthash:8].js',
    publicPath: '/dist/',
    chunkFilename: 'assets/js/[name].[contenthash:8].js'
  },
  resolve: {
    alias: {
      '@': 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\src',
      vue$: 'vue/dist/vue.runtime.esm-bundler.js'
    },
    extensions: [
      '.tsx',
      '.ts',
      '.mjs',
      '.js',
      '.jsx',
      '.vue',
      '.json',
      '.wasm'
    ],
    modules: [
      'node_modules',
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules',
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\@vue\\cli-service\\node_modules'
    ],
    fallback: {
      path: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\path-browserify\\index.js'
    }
  },
  resolveLoader: {
    modules: [
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\@vue\\cli-plugin-typescript\\node_modules',
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\@vue\\cli-plugin-babel\\node_modules',
      'node_modules',
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules',
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\@vue\\cli-service\\node_modules'
    ]
  },
  module: {
    noParse: /^(vue|vue-router|vuex|vuex-router-sync)$/,
    rules: [
      /* config.module.rule('esm') */
      {
        test: /\.m?jsx?$/,
        resolve: {
          fullySpecified: false
        }
      },
      /* config.module.rule('vue') */
      {
        test: /\.vue$/,
        use: [
          /* config.module.rule('vue').use('vue-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\vue-loader\\dist\\index.js',
            options: {
              cacheDirectory: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\.cache\\vue-loader',
              cacheIdentifier: '10aafbfa',
              babelParserPlugins: [
                'jsx',
                'classProperties',
                'decorators-legacy'
              ]
            }
          }
        ]
      },
      /* config.module.rule('vue-style') */
      {
        test: /\.vue$/,
        resourceQuery: /type=style/,
        sideEffects: true
      },
      /* config.module.rule('pug') */
      {
        test: /\.pug$/,
        oneOf: [
          /* config.module.rule('pug').oneOf('pug-vue') */
          {
            resourceQuery: /vue/,
            use: [
              /* config.module.rule('pug').oneOf('pug-vue').use('pug-plain-loader') */
              {
                loader: 'pug-plain-loader'
              }
            ]
          },
          /* config.module.rule('pug').oneOf('pug-template') */
          {
            use: [
              /* config.module.rule('pug').oneOf('pug-template').use('raw') */
              {
                loader: 'raw-loader'
              },
              /* config.module.rule('pug').oneOf('pug-template').use('pug-plain-loader') */
              {
                loader: 'pug-plain-loader'
              }
            ]
          }
        ]
      },
      /* config.module.rule('svg') */
      {
        test: /\.(svg)(\?.*)?$/,
        type: 'asset/resource',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('images') */
      {
        test: /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'assets/img/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('media') */
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        type: 'asset',
        generator: {
          filename: 'assets/media/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('fonts') */
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
        type: 'asset',
        generator: {
          filename: 'assets/fonts/[name].[hash:8][ext]'
        }
      },
      /* config.module.rule('css') */
      {
        test: /\.css$/,
        oneOf: [
          /* config.module.rule('css').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('css').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('css').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('css').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('css').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('css').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('css').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('css').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('css').oneOf('normal') */
          {
            use: [
              /* config.module.rule('css').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('css').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('css').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('postcss') */
      {
        test: /\.p(ost)?css$/,
        oneOf: [
          /* config.module.rule('postcss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('postcss').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('postcss').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('postcss').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('postcss').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('postcss').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('postcss').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('postcss').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          },
          /* config.module.rule('postcss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('postcss').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('postcss').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('scss') */
      {
        test: /\.scss$/,
        oneOf: [
          /* config.module.rule('scss').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('scss').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue-modules').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('scss').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('vue').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('scss').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('normal-modules').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('scss').oneOf('normal') */
          {
            use: [
              /* config.module.rule('scss').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('scss').oneOf('normal').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('sass') */
      {
        test: /\.sass$/,
        oneOf: [
          /* config.module.rule('sass').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('sass').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue-modules').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('sass').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('vue').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('sass').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('normal-modules').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          },
          /* config.module.rule('sass').oneOf('normal') */
          {
            use: [
              /* config.module.rule('sass').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('sass').oneOf('normal').use('sass-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\sass-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  sassOptions: {
                    indentedSyntax: true
                  }
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('less') */
      {
        test: /\.less$/,
        oneOf: [
          /* config.module.rule('less').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('less').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue-modules').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('less').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('less').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('vue').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('less').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('normal-modules').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('less').oneOf('normal') */
          {
            use: [
              /* config.module.rule('less').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('less').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('less').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('less').oneOf('normal').use('less-loader') */
              {
                loader: 'less-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('stylus') */
      {
        test: /\.styl(us)?$/,
        oneOf: [
          /* config.module.rule('stylus').oneOf('vue-modules') */
          {
            resourceQuery: /module/,
            use: [
              /* config.module.rule('stylus').oneOf('vue-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2,
                  modules: {
                    localIdentName: '[name]_[local]_[hash:base64:5]',
                    auto: () => true
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue-modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('vue') */
          {
            resourceQuery: /\?vue/,
            use: [
              /* config.module.rule('stylus').oneOf('vue').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('vue').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal-modules') */
          {
            test: /\.module\.\w+$/,
            use: [
              /* config.module.rule('stylus').oneOf('normal-modules').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('normal-modules').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          },
          /* config.module.rule('stylus').oneOf('normal') */
          {
            use: [
              /* config.module.rule('stylus').oneOf('normal').use('extract-css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\mini-css-extract-plugin\\dist\\loader.js',
                options: {
                  publicPath: '/dist/'
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('css-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\css-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  importLoaders: 2
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('postcss-loader') */
              {
                loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\postcss-loader\\dist\\cjs.js',
                options: {
                  sourceMap: false,
                  postcssOptions: {
                    plugins: [
                      function () { /* omitted long function */ }
                    ]
                  }
                }
              },
              /* config.module.rule('stylus').oneOf('normal').use('stylus-loader') */
              {
                loader: 'stylus-loader',
                options: {
                  sourceMap: false
                }
              }
            ]
          }
        ]
      },
      /* config.module.rule('js') */
      {
        test: /\.m?jsx?$/,
        exclude: [
          function () { /* omitted long function */ }
        ],
        use: [
          /* config.module.rule('js').use('thread-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\thread-loader\\dist\\cjs.js'
          },
          /* config.module.rule('js').use('babel-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\babel-loader\\lib\\index.js',
            options: {
              cacheCompression: false,
              cacheDirectory: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\.cache\\babel-loader',
              cacheIdentifier: '24c3feab'
            }
          }
        ]
      },
      /* config.module.rule('ts') */
      {
        test: /\.ts$/,
        use: [
          /* config.module.rule('ts').use('thread-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\thread-loader\\dist\\cjs.js'
          },
          /* config.module.rule('ts').use('babel-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\babel-loader\\lib\\index.js'
          },
          /* config.module.rule('ts').use('ts-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\ts-loader\\index.js',
            options: {
              transpileOnly: true,
              appendTsSuffixTo: [
                '\\.vue$'
              ],
              happyPackMode: true
            }
          }
        ]
      },
      /* config.module.rule('tsx') */
      {
        test: /\.tsx$/,
        use: [
          /* config.module.rule('tsx').use('thread-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\thread-loader\\dist\\cjs.js'
          },
          /* config.module.rule('tsx').use('babel-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\babel-loader\\lib\\index.js'
          },
          /* config.module.rule('tsx').use('ts-loader') */
          {
            loader: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\ts-loader\\index.js',
            options: {
              transpileOnly: true,
              happyPackMode: true,
              appendTsxSuffixTo: [
                '\\.vue$'
              ]
            }
          }
        ]
      }
    ]
  },
  optimization: {
    realContentHash: false,
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
          name: 'chunk-vendors',
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true
        }
      }
    },
    minimizer: [
      /* config.optimization.minimizer('terser') */
      new TerserPlugin(
        {
          terserOptions: {
            compress: {
              arrows: false,
              collapse_vars: false,
              comparisons: false,
              computed_props: false,
              hoist_funs: false,
              hoist_props: false,
              hoist_vars: false,
              inline: false,
              loops: false,
              negate_iife: false,
              properties: false,
              reduce_funcs: false,
              reduce_vars: false,
              switches: false,
              toplevel: false,
              typeofs: false,
              booleans: true,
              if_return: true,
              sequences: true,
              unused: true,
              conditionals: true,
              dead_code: true,
              evaluate: true
            },
            mangle: {
              safari10: true
            }
          },
          parallel: true,
          extractComments: false
        }
      ),
      /* config.optimization.minimizer('css') */
      new CssMinimizerPlugin(
        {
          parallel: true,
          minimizerOptions: {
            preset: [
              'default',
              {
                mergeLonghand: false,
                cssDeclarationSorter: false
              }
            ]
          }
        }
      )
    ]
  },
  plugins: [
    /* config.plugin('vue-loader') */
    new Plugin(),
    /* config.plugin('feature-flags') */
    new DefinePlugin(
      {
        __VUE_OPTIONS_API__: 'true',
        __VUE_PROD_DEVTOOLS__: 'false'
      }
    ),
    /* config.plugin('define') */
    new DefinePlugin(
      {
        'process.env': {
          NODE_ENV: '"production"',
          BASE_URL: '"/dist/"'
        }
      }
    ),
    /* config.plugin('case-sensitive-paths') */
    new CaseSensitivePathsPlugin(),
    /* config.plugin('friendly-errors') */
    new FriendlyErrorsWebpackPlugin(
      {
        additionalTransformers: [
          function () { /* omitted long function */ }
        ],
        additionalFormatters: [
          function () { /* omitted long function */ }
        ]
      }
    ),
    /* config.plugin('extract-css') */
    new MiniCssExtractPlugin(
      {
        filename: 'assets/css/[name].[contenthash:8].css',
        chunkFilename: 'assets/css/[name].[contenthash:8].css'
      }
    ),
    /* config.plugin('html-index') */
    new HtmlWebpackPlugin(
      {
        title: 'vue3-project',
        scriptLoading: 'defer',
        templateParameters: function () { /* omitted long function */ },
        chunks: [
          'chunk-vendors',
          'chunk-common',
          'index'
        ],
        template: 'public/index.html',
        filename: 'index.html',
        cdn: [
          'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.min.js',
          'https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.min.js'
        ]
      }
    ),
    /* config.plugin('html-subPage') */
    new HtmlWebpackPlugin(
      {
        title: 'vue3-project',
        scriptLoading: 'defer',
        templateParameters: function () { /* omitted long function */ },
        chunks: [
          'chunk-vendors',
          'chunk-common',
          'subPage'
        ],
        template: 'public/subPage.html',
        filename: 'subPage.html',
        cdn: [
          'https://cdn.jsdelivr.net/npm/vue@3.5.13/dist/vue.global.min.js',
          'https://cdn.jsdelivr.net/npm/vue-router@4.5.0/dist/vue-router.global.min.js'
        ]
      }
    ),
    /* config.plugin('copy') */
    new CopyPlugin(
      {
        patterns: [
          {
            from: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\public',
            to: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\dist',
            toType: 'dir',
            noErrorOnMissing: true,
            globOptions: {
              ignore: [
                '**/.DS_Store',
                'D:/椤圭洰/鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰/vue3-project/public/index.html',
                'D:/椤圭洰/鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰/vue3-project/public/subPage.html'
              ]
            },
            info: {
              minimized: true
            }
          }
        ]
      }
    ),
    /* config.plugin('eslint') */
    new ESLintWebpackPlugin(
      {
        extensions: [
          '.js',
          '.jsx',
          '.vue',
          '.ts',
          '.tsx'
        ],
        cwd: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project',
        cache: true,
        cacheLocation: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\.cache\\eslint\\0969a776.json',
        context: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project',
        failOnWarning: false,
        failOnError: true,
        eslintPath: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\eslint',
        formatter: 'stylish'
      }
    ),
    /* config.plugin('fork-ts-checker') */
    new ForkTsCheckerWebpackPlugin(
      {
        typescript: {
          extensions: {
            vue: {
              enabled: true,
              compiler: 'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\node_modules\\vue\\compiler-sfc\\index.js'
            }
          },
          diagnosticOptions: {
            semantic: true,
            syntactic: true
          }
        }
      }
    )
  ],
  entry: {
    index: [
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\src\\main.ts'
    ],
    subPage: [
      'D:\\椤圭洰\\鐢ㄤ簬娴嬭瘯鏂板姛鑳芥墍闇€瑕佺殑渚濊禆鍖呯殑椤圭洰\\vue3-project\\src\\main1.ts'
    ]
  },
  externals: {
    vue: 'Vue',
    'vue-router': 'VueRouter'
  }
}
