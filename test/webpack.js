import path from 'path';
import webpack from 'webpack';
import memoryfs from 'memory-fs';

export default (fixture, options = {}) => {
  const compiler = webpack({
    context: __dirname,
    entry: `${fixture}`,
    output: {
      path: path.resolve(__dirname),
      filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: path.resolve(__dirname, '../index.js'),
              options: {
                enable: true,
                include: /test/,
                exclude: /src/,
              },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: path.resolve(__dirname, '../index.js'),
            },
            'less-loader',
          ],
        },
        {
          test: /\.s(c|a)ss/,
          use: [
            'style-loader',
            'css-loader',
            {
              loader: path.resolve(__dirname, '../index.js'),
            },
            'sass-loader'
          ],
        },
      ],
    },
  });

  compiler.outputFileSystem = new memoryfs();

  return new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if (err) reject(err);
      console.log('errors', stats.compilation.errors);
      console.log('warnings', stats.compilation.warnings);
      resolve(stats);
    });
  });
}