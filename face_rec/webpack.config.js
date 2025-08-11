var webpack = require("webpack");
var path = require("path");

//var ExtractTextPlugin = require("extract-text-webpack-plugin");

var bootstrapPath = __dirname + '/node_modules/bootstrap/dist/css';

module.exports = {
	context: path.resolve(__dirname),
    entry: {
        javascript: "./src/app.js",
        html: "./src/index.html"
    },
    output: {
        path: './dist',
        filename: 'bundle.min.js'
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.css', ".jpg", ".JPG", ".json",'.node']
    },
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    },
    module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: "react-hot",
        },{
            test: /\.jsx?$/,
            //exclude: /node_modules/|/lib/,
            exclude: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'lib')],
            loader: 'babel-loader',
        },{ 
            test: /\.(png|jpg|jpeg|gif)$/,
            //test: /\.(png|jpg|jpeg|gif)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            exclude: /node_modules/, 
            loader: 'file-loader?&name=images/[name].[ext]'
        },{
            test: /\.css$/,
            //exclude: [path.resolve(__dirname, 'node_modules'), path.resolve(__dirname, 'lib')],
            loader: "style-loader!css-loader?"
        }, {
            test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "url-loader?limit=10000&name=fonts/[name].[ext]&mimetype=application/font-woff"
        },{
            test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
            loader: "file-loader?&name=fonts/[name].[ext]"
        },{
            test: /\.html$/,
            loader: "file?name=[name].[ext]",
        }]
    },
    plugins: [
        /*new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),*/
        new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery",
            '_': 'lodash'
        })/*,
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        })*///,
        //new ExtractTextPlugin("bundle.css")
    ]
};
