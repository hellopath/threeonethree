const rucksack = require('rucksack-css')
const webpack = require('webpack')
const path = require('path')
const env = process.env.NODE_ENV
const plugins = [
    new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.bundle.js'),
    new webpack.DefinePlugin({
        'process.env': { NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development') }
    })
]
if (env === 'production') {
    plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                drop_console: true
            },
            output: {
                comments: false
            }
        })
    )
}
module.exports = {
    context: path.join(__dirname, './client'),
    entry: {
        jsx: './index.js',
        // html: './index.html',
        vendor: [
            'gsap'
        ]
    },
    output: {
        path: ('./dev'),
        filename: 'bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.html$/,
                loader: 'file?name=[name].[ext]'
            },
            {
                test: /\.css$/,
                include: /client/,
                loaders: [
                    'style-loader',
                    'css-loader?modules&sourceMap&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
                    'postcss-loader'
                ]
            },
            {
                test: /\.css$/,
                exclude: /client/,
                loader: 'style!css'
            },
            {
                test: /\.scss$/,
                loaders: ["style", "css", "sass"]
            },
            { 
                test: /\.(png|jpe?g|gif)$/, 
                loader: 'url-loader?limit=8192'
            },
            {
                test: /\.(woff|woff2|ttf|eot|svg)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file?name=static/fonts/[name].[ext]'
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: [
                    'babel-loader'
                ]
            },
            { 
                test: /\.glsl$/,
                loader: 'shader'
            },
            {
                test: /\.hbs/,
                loader: 'handlebars-template-loader'
            }
        ],
        preLoaders: [
            // {
            //     test: /\.js$/,
            //     loaders: ['eslint'],
            //     include: [new RegExp(path.join(__dirname, 'client'))]
            // }
        ]
    },
    node: {
        fs: 'empty' // avoids error messages
    },
    eslint: {
        configFile: '.eslintrc'
    },
    glsl: {
        chunkPath: __dirname + '/glsl'
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    postcss: [
        rucksack({
            autoprefixer: true
        })
    ],
    plugins: plugins,
    devServer: {
        contentBase: './dev',
        hot: true
    }
}
