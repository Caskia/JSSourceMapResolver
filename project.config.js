const _ = require("lodash");
const NODE_ENV = process.env.NODE_ENV || 'development'

const configs = {
    development: require("./project.config.development"),
    production: require("./project.config.production")
}

var options = {
    /** 当前环境 */
    env: NODE_ENV,
    /** 根目录 */
    basePath: __dirname,
    /** 源码目录 */
    srcDir: 'src',
    /** 输入目录 */
    outDir: "dist",
    /**入口配置*/
    entry: {
        web: {
            server_path: "*",//服务器重定向配置
            template: "../templates/index.html",//相对于src的模板文件，默认index.html
            output: "web.html",//输入文件名,默认为 入口名称
            chunks: false,//自定义chunks, 默认引用  ['manifest', 'normalize', 'vendor'] + 入口文件
            flexible: false,//是否启用flexible布局方案，默认false
            viewport: false //是否添加meta viewport元素，默认false 
        }
    },
    /** The base path for all projects assets (relative to the website root) */
    publicPath: "/",
    /** Whether to generate sourcemaps */
    sourcemaps: true,
    /** A hash map of keys that the compiler should treat as external to the project */
    externals: {},
    /** Whether to enable verbose logging */
    verbose: true,
    /** A hash map of variables and their values to expose globally */
    globals: {
        __PAGE_SIZE__: 15
    }
}
module.exports = _.defaultsDeep(configs[NODE_ENV], options);
