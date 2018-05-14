const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const project = require("../project.config");
const inProject = path.resolve.bind(path, project.basePath);

const inProjectSrc = file => {
    return inProject(project.srcDir, file);
};
const __TEST__ = project.env === "test";
const __PROD__ = project.env === "production";
const __PREVIEW__ = project.env === "preview";
const __DEV__ = project.env === "development" || __PREVIEW__;
//几乎所有浏览器
const browsers = [">0%"];

const entrys = {
    //normalize: [inProjectSrc("normalize")]
};

const entry = project.entry;

for (var name in entry) {
    entrys[name] = [inProjectSrc(name)];
}

const config = {
    entry: entrys,
    devtool: project.sourcemaps ? "source-map" : false,
    mode: __DEV__ ? "development" : "production",
    output: {
        path: inProject(project.outDir),
        filename: __DEV__ ?
            "assets/scripts/[name].js" : "assets/scripts/[name].[chunkhash].js",
        chunkFilename: __DEV__ ?
            "assets/scripts/[id].[name].js" : "assets/scripts/[id].[name].[chunkhash].js",
        publicPath: project.publicPath
    },
    resolve: {
        modules: [inProject(project.srcDir), "node_modules"],
        extensions: ["*", ".ts", ".tsx", ".js", ".jsx", ".json"],
        alias: {
            "editor.md": inProject("public/editor.md")
        }
    },
    externals: project.externals,
    module: {
        rules: []
    },
    node: {
        fs: "empty",
        module: "empty",
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        new webpack.DefinePlugin(
            Object.assign({
                "process.env": {
                    NODE_ENV: JSON.stringify(project.env)
                },
                __DEV__,
                __TEST__,
                __PROD__,
                __BUILD_TIME__: JSON.stringify(new Date().toUTCString())
            },
                project.globals
            )
        )
    ]
};

//TypeScript
config.module.rules.push({
    test: /\.(ts|tsx)$/,
    //exclude: /node_modules/,
    use: [{
        loader: "ts-loader"
    }]
});

// Styles
// ------------------------------------
const extractStyles = new ExtractTextPlugin({
    filename: "assets/styles/[name].[hash].css",
    allChunks: true,
    disable: __DEV__ && !__PREVIEW__
});

config.module.rules.push({
    test: /\.css$/,
    loader: extractStyles.extract({
        fallback: "style-loader",
        use: [{
            loader: "css-loader",
            options: {
                sourceMap: project.sourcemaps,
                minimize: {
                    autoprefixer: {
                        add: true,
                        remove: true,
                        browsers: browsers
                    },
                    discardComments: {
                        removeAll: true
                    },
                    discardUnused: false,
                    mergeIdents: false,
                    reduceIdents: false,
                    safe: true,
                    sourcemap: project.sourcemaps
                }
            }
        },
        {
            loader: "postcss-loader",
            options: {
                sourceMap: true
            }
        }
        ]
    })
});

config.module.rules.push({
    test: /\.less$/,
    include: [inProject('src')],
    loader: extractStyles.extract({
        fallback: "style-loader",
        use: [{
            loader: "css-loader",
            options: {
                sourceMap: project.sourcemaps,
                modules: false,
                localIdentName: __DEV__ ? '[path][name]-[local]-[hash:base64:5]' : null,
                minimize: {
                    autoprefixer: {
                        add: true,
                        remove: true,
                        browsers: browsers
                    },
                    discardComments: {
                        removeAll: true
                    },
                    discardUnused: false,
                    mergeIdents: false,
                    reduceIdents: false,
                    safe: true,
                    sourcemap: project.sourcemaps
                }
            }
        },
        {
            loader: "postcss-loader",
            options: {
                sourceMap: true
            }
        },
        {
            loader: "less-loader",
            options: {
                sourceMap: project.sourcemaps,
                includePaths: [inProjectSrc("styles")]
            }
        }
        ]
    })
});

config.plugins.push(extractStyles);
// Images
// ------------------------------------
config.module.rules.push({
    test: /\.(png|jpg|gif)$/,
    loader: "url-loader",
    options: {
        name: "assets/images/[hash].[ext]",
        limit: 10000
    }
});

// Fonts
// ------------------------------------
[
    ["woff", "application/font-woff"],
    ["woff2", "application/font-woff2"],
    ["otf", "font/opentype"],
    ["ttf", "application/octet-stream"],
    ["eot", "application/vnd.ms-fontobject"],
    ["svg", "image/svg+xml"]
].forEach(font => {
    const extension = font[0];
    const mimetype = font[1];

    config.module.rules.push({
        test: new RegExp(`\\.${extension}$`),
        loader: "url-loader",
        options: {
            name: "assets/fonts/[name].[ext]",
            limit: 10000,
            mimetype
        }
    });
});

// HTML Template
// ------------------------------------

for (var name in entry) {
    var conf = entry[name];
    var output = conf.output || name + ".html";
    var chunks =
        conf.chunks || ["manifest", "normalize", "vendor"].concat([name]);
    config.plugins.push(
        new HtmlWebpackPlugin({
            template: inProjectSrc(conf.template || "index.html"),
            inject: true,
            chunksSortMode: "dependency",
            filename: output,
            chunks: chunks,
            facebook_sdk: conf.facebook_sdk,
            facebook_appid: project.globals.__FB_APPID__,
            flexible: conf.flexible,
            viewport: conf.viewport,
            minify: {
                collapseWhitespace: true
            }
        })
    );
}

// Development Tools
// ------------------------------------
if (__DEV__ && !__PREVIEW__) {
    for (var key in entrys) {
        config.entry[key].push(
            `webpack-hot-middleware/client.js?path=${
            config.output.publicPath
            }__webpack_hmr`
        );
    }
    config.plugins.push(
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NamedModulesPlugin()
    );
}

// Bundle Splitting
// ------------------------------------
if (!__TEST__) {
    const bundles = ["manifest"];
    if (project.vendors && project.vendors.length) {
        bundles.unshift("vendor");
        config.entry.vendor = project.vendors;
    }
    // config.plugins.push(
    //     new webpack.optimize.CommonsChunkPlugin({
    //         names: bundles
    //     })
    // );
    config.optimization = {
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks: {
            cacheGroups: {
                commons: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendor",
                    chunks: "all"
                }
            }
        }
    };
}
// Production Optimizations
// ------------------------------------
if (__PROD__) {
    config.plugins.push(
        new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false
        })
    );
}

module.exports = config;