export enum LogLevel {
    info = 4,
    debug = 3,
    warn = 2,
    error = 1
}


export class Logger {
    static logLevel = __DEV__? LogLevel.info:LogLevel.error;

    static info(message, ...args) {
        if (Logger.logLevel < LogLevel.info) {
            return;
        }
        var date = new Date();
        console.log(`✔[INFO][${date.toISOString()}] ${message}`, ...args);
    }
    static debug(message, ...args) {
        if (Logger.logLevel < LogLevel.debug) {
            return;
        }
        var date = new Date();
        console.log(`🐞[DEBUG][${date.toISOString()}] ${message}`, ...args);
    }

    static warn(message, ...args) {
        if (Logger.logLevel < LogLevel.warn) {
            return;
        }
        var date = new Date();
        console.warn(`🥕[WARN][${date.toISOString()}] ${message}`, ...args);
    }
    static error(message, ...args) {
        var date = new Date();
        console.warn(`❌[ERROR][${date.toISOString()}] ${message}`, ...args);
    }
}

export default Logger