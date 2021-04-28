// eslint-disable-next-line @typescript-eslint/no-var-requires
const { join } = require('path')

module.exports = [
  {
    mode: 'development',
    entry: './src/renderer.tsx',
    target: 'electron-main',
    devtool: 'source-map',
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          include: /src/,
          use: [{ loader: 'ts-loader' }],
        },
      ],
    },
    output: {
      path: join(process.cwd(), 'bundle'),
    },
  },
]
