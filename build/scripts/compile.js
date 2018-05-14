const fs = require('fs-extra')
const path = require('path')
const chalk = require('chalk')
const webpack = require('webpack')
const logger = require('../lib/logger')
const webpackConfig = require('../webpack.config');
const project = require('../../project.config');
const inProject = path.resolve.bind(path, project.basePath);
var buildApps = ["main"];
const runWebpackCompiler = (webpackConfig) =>
    new Promise((resolve, reject) => {
        webpack(webpackConfig).run((err, stats) => {
            if (err) {
                logger.error('Webpack compiler encountered a fatal error.', err)
                return reject(err)
            }
            const jsonStats = stats.toJson()
            if (jsonStats.errors.length > 0) {
                logger.error('Webpack compiler encountered errors.')
                logger.log(jsonStats.errors.join('\n'))
                return reject(new Error('Webpack compiler encountered errors'))
            } else if (jsonStats.warnings.length > 0) {
                logger.warn('Webpack compiler encountered warnings.')
                logger.log(jsonStats.warnings.join('\n'))
            }
            resolve(stats)
        })
    })

function PromiseForEach(arr, cb) {
    let realResult = []
    let result = Promise.resolve()
    arr.forEach((a, index) => {
        result = result.then(() => {
            return cb(a).then((res) => {
                realResult.push(res)
            })
        })
    })
    return result.then(() => {
        return realResult
    })
}

const buildConfigs = {
    main: {
        name: "webpack.config.js",
        config: webpackConfig
    }
};

logger.info('准备编译...');
logger.info('编译目标: ' + chalk.bold(project.env));
PromiseForEach(buildApps, (item) => {
    var config = buildConfigs[item];
    return Promise.resolve()
        .then(() => {
            logger.info("开始编译: " + config.name);
            return runWebpackCompiler(config.config)
        })
        .then(stats => {
            if (project.verbose) {
                logger.log(stats.toString({
                    colors: true,
                    chunks: false,
                }))
            }
            if (config.success) {
                return config.success()
            }
            return stats
        });

}).then(() => {
    logger.info(`复制静态文件: ./public --> ./${project.outDir}.`)
    fs.copySync(
        path.resolve(project.basePath, 'public'),
        path.resolve(project.basePath, project.outDir)
    );
}).then(() => {
    logger.success(`所有编译完成! 查看 ./${project.outDir}.`)
}).catch((err) => logger.error('编译时发生错误.', err));

