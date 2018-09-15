const path = require('path');

const config = require('./webpack.config.js');

config.mode = 'development';

config.devServer = {
	contentBase: path.join(__dirname, 'dist')
}

module.exports = config;
