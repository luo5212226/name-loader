const { runLoaders } = require('loader-runner');
const fs = require('fs');
const path = require('path');

runLoaders(
  {
    resource: path.resolve(__dirname, './App.vue'),
    loaders: [path.resolve(__dirname, './src/index')],
    context: {
      minimize: true,
    },
    readResource: fs.readFile.bind(fs),
  },
  (err, res) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log('文件结果：', res);
  }
);