
const
  path = require('path'),
  globule = require('globule'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  Autoprefixer = require('autoprefixer'),
  CopyWebpackPlugin = require('copy-webpack-plugin'),
  ImageminWebpackPlugin = require('imagemin-webpack-plugin').default,


  internalIp = require('internal-ip'),

  // setting : paths
  paths = {
    src: './develop/',
    dest: './public/',
    assets: 'assets/',
    scss: 'scss/',
    css: 'css/',
    pug: 'pug/',
    js: 'js/',
    img: 'images/',
    fonts: 'fonts/',
    audio: 'audio/',
    json: 'json/',
    html: 'html/'
    // initialsetting: 'initialsetting/',
  };



let
  localhost = internalIp.v4.sync(),
  localhostPort = 8080;

const
  config  = {
    target: 'web',
    mode: 'development',
    // mode: 'production',
    entry: {
      script: [
        `${paths.src + paths.js}script.js`,
        `${paths.src + paths.scss}style.scss`
      ]
    },
    output: {
      path: path.resolve(__dirname, paths.dest),
      filename: `${paths.assets + paths.js}[name].js`,
    },

    devServer: {
      host: localhost,
      port: localhostPort,
      disableHostCheck: true,
      open: true,
      // openPage: paths.userweb,
      contentBase: path.resolve(__dirname, paths.src),

      watchContentBase: true,
      inline: true,
      hot: true,

      watchOptions: {
        aggregateTimeout: 1000,
        ignored: /(?:node_modules|\.css$)/,
      },

      historyApiFallback: true,
      compress: true,
    },

    module: {
      rules: [
        // pug
        {
          test: /\.pug$/,
          use: [
            {
              loader: 'pug-loader',
              options: {
                pretty: true,
                root: path.resolve(__dirname, paths.src + paths.pug)
              }
            }
          ],
          exclude: /node_modules/
        },

        // scss
        {
          test: /\.scss$/,
          use: [
            MiniCssExtractPlugin.loader,
            {
              loader: 'css-loader',
              options: {
                url: false
                // minimize: true,
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: [
                  Autoprefixer({
                    grid: true
                  })
                ]
              }
            },
            {
              loader: 'sass-loader'
            }
          ]
        },

        // js
        {
          test: /\.js$/,
          use: [
            {
              loader: 'babel-loader',
              options: {
                presets: [
                  [
                    '@babel/preset-env',
                    {
                      // targets: {
                      //   node: true,
                      //   // browsers: [
                      //   //   'last 2 versions',
                      //   //   'ie >= 11'
                      //   // ]
                      // },
                      // useBuiltIns: 'usage',
                      useBuiltIns: 'entry',
                      corejs: 3,
                      modules: false
                    }
                  ]
                ],
                plugins: [
                  '@babel/plugin-transform-runtime'
                  // [
                  //   '@babel/plugin-transform-spread',
                  //   {
                  //     'loose': true
                  //   }
                  // ],
                  // [
                  //   '@babel/plugin-proposal-decorators',
                  //   {
                  //     'legacy': true
                  //   }
                  // ]
                ]
              }
            }
          ],
          exclude: /node_modules\/(?!(micromodal|dom7|ssr-window|swiper)\/).*/,
        },

        // img
        {
          test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
                name: `${paths.assets + paths.img}[name].[ext]`
              }
            }
          ]
        },
      ]
    },

    plugins: [
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: `${paths.assets + paths.css}style.css`
      }),
      new CopyWebpackPlugin([
        // initialsetting
        // {
        //   from: path.resolve(__dirname, paths.src + paths.initialsetting),
        //   to: path.resolve(__dirname, paths.dest)
        // },
        // html
        {
          from: path.resolve(__dirname, paths.src + paths.html),
          to: path.resolve(__dirname, paths.dest)
        },
        // img
        {
          from: path.resolve(__dirname, paths.src + paths.img),
          to: path.resolve(__dirname, paths.dest + paths.assets + paths.img)
        },
        // fonts
        {
          from: path.resolve(__dirname, paths.src + paths.fonts),
          to: path.resolve(__dirname, paths.dest + paths.assets + paths.fonts)
        },
        // audio
        {
          from: path.resolve(__dirname, paths.src + paths.audio),
          to: path.resolve(__dirname, paths.dest + paths.assets + paths.audio)
        },
        // json
        {
          from: path.resolve(__dirname, paths.src + paths.json),
          to: path.resolve(__dirname, paths.dest + paths.assets + paths.json)
        },
      ]),
      new ImageminWebpackPlugin({
        test: /\.(jpe?g|png|gif|svg|ico)(\?.+)?$/i,
        pngquant: {
          quality: '65-80'
        }
      })
    ]
  };

const
  documents = globule.find(
    `${paths.src + paths.pug}**/*.pug`,
    {
      ignore: [
        `${paths.src + paths.pug}**/_*/*.pug`
      ]
    }
  );

documents.forEach((document) => {
  const
    fileName = document
      .replace(paths.src + paths.pug, '')
      .replace('.pug', '.html');
  config.plugins.push(
    new HtmlWebpackPlugin({
      filename: fileName,
      template: document,
      inject: false
    })
  )
});

module.exports = config;


