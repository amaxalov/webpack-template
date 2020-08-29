const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCSSExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const isEnvDevelopment = process.env.NODE_ENV === 'development';
const isEnvProduction = process.env.NODE_ENV === 'production';

const { CLIENT_APP = 'template' } = process.env;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isEnvProduction) {
    config.minimizer = [new OptimizeCssAssetsPlugin(), new TerserWebpackPlugin()];
  }

  return config;
};

const fileName = (ext) => (isEnvDevelopment ? `[name].${ext}` : `[name].[hash].${ext}`);

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCSSExtractPlugin.loader,
      options: {
        xmr: isEnvDevelopment,
        reloadAll: true,
      },
    },
    {
      loader: 'css-loader',
      options: {
        modules: true,
      },
    },
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const plugins = () => {
  const base = [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'public', 'index.html'),
      minify: {
        collapseWhitespace: isEnvProduction,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/favicon.ico'),
          to: path.resolve(__dirname, 'build'),
        },
      ],
    }),
    new MiniCSSExtractPlugin({
      filename: fileName('css'),
    }),
  ];

  if (isEnvDevelopment) {
    new HardSourceWebpackPlugin({
      cacheDirectory: path.resolve(__dirname, 'tmp/hard-source/[confighash]'),
      configHash(webpackConfig) {
        const hash = require('node-object-hash')({ sort: false }).hash(webpackConfig);

        return `${hash}-${CLIENT_APP.toLowerCase()}`;
      },
    });
  }

  if (isEnvProduction) {
    base.push(new BundleAnalyzerPlugin());
  }

  return base;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  entry: path.resolve(__dirname, 'src/index.tsx'),
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: fileName('js'),
  },
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    alias: {
      '@components': path.resolve(__dirname, 'src/components'),
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    hot: isEnvDevelopment,
    compress: true,
    watchContentBase: true,
    progress: true,
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: [
          'awesome-typescript-loader',
          {
            options: {
              eslintPath: require.resolve('eslint'),
            },
            loader: require.resolve('eslint-loader'),
          },
        ],
        exclude: /node_modules/,
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
    ],
  },
  plugins: plugins(),
};
