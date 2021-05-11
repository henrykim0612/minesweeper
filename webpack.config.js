const path = require('path');
const reactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = {
  name: 'webpack-settings',
  mode: 'development', // Real: production
  devtool: 'eval', // Real: hidden-source-map
  resolve: {
    extensions: ['.jsx', '.js']
  },
  // Input
  entry: {
    // Client.js 에서 WordRelay.jsx 를 참조하므로 아래에 적어주지 않아도 됨.
    app: ['./client']
  },
  module: {
    rules: [
      {
        test: /\.jsx?/,
        loader: 'babel-loader',
        options: {
          presets: [
            ['@babel/preset-env', {
              targets: {
                // https://github.com/browserslist/browserslist 여기서 확인 가능(설정을 해주는게 좋음 그래야 웹팩이 일을 덜함)
                browsers: ['> 1% in KR'],
              },
              debug: true,
            }],
            '@babel/preset-react',
          ],
          cacheDirectory: true,
          plugins: [
            '@babel/plugin-proposal-class-properties',
            'react-refresh/babel',
            'react-hot-loader/babel',
          ],
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ]
  },
  plugins: [
    new reactRefreshWebpackPlugin()
  ],
  // Out
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'app.js'
  },
  devServer: {
    publicPath: '/dist/',
    hot: true,
  }
}