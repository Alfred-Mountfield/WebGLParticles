const path = require('path');
module.exports = {
    entry: './src/main.ts',
    devtool: 'inline-source-map',
    devServer: {
        filename: 'bundle.js',
        publicPath: '/dist/'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(glsl|vs|fs)$/,
                use: 'ts-shader-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, '/dist'),
    }
};
