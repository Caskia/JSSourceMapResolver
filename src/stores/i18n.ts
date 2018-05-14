import {di, str } from "jsmodules";

export class I18nState {
    default;
    configs = {};
    /**
     * 初始化默认预言配置
     * @param configs
     * @param defaults
     */
    constructor(configs, default_lang = "en-US") {
        default_lang=default_lang.toLowerCase();
        this.default = configs.default || configs[default_lang];
        this.configs = configs;
    }
    /**
     * 添加语言配置
     * @param configs
     */
    add(configs) {
        this.default = { ...this.default, ...configs.default };
        for (var name in configs) {
            var last_config = this.configs[name];
            if (!last_config) {
                last_config = {};
            }
            var new_config = configs[name];
            this.configs[name] = { ...last_config, ...new_config }
        }
    }
    L<T>(key, params: any, lang = "en-US"): any{
        lang=lang.toLowerCase();
        var langConf = this.configs[lang];
        var val = langConf && langConf[key];
        if (!val) {
            val = this.default[key];
        }
        if (params) {
            val = str.format(val, params);
        }
        return val;
    }
}