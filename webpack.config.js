const path = require('path')

module.exports = {
  entry: path.join(__dirname, 'src/index.js'),
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  devtool: 'sourcemaps',
  cache: true,
  mode: 'none',
  module: {
    rules: [ {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
              presets: [ '@babel/preset-env', '@babel/preset-react' ]
          }
      }
  }, {
      test: /\.css$/,
      use: [ 'style-loader', 'css-loader' ]
  }, { 
      test: /\.(png|svg|jpg|jpeg|gif)$/,
      use: [ 'url-loader' ] 
  }, { 
      test: /\.(eot|svg|ttf|woff|woff2)$/, 
      use: ['file-loader'], 
  }
    ]
  }
};

