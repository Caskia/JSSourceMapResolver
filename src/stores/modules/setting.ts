import AppState from '../app';
import { IAppModule, module, moduleFunc } from '.';
import { autorun, observable } from 'mobx';
import { Logger } from '../../utils/logger';
import { di } from 'jsmodules';
import { IKeyValueStorage } from '../../storage/IKeyValueStorage';


export class SettingModule implements IAppModule {
    name: string="setting";
    __ready__:boolean;
    __installed__:boolean;

    @di.Inject() app: AppState;

    @di.Inject() kvStorage: IKeyValueStorage;

     /**
     * 系统设置语言,默认en-US
     */
    @observable language="en-US";

    /**
     * 系统设置主题,默认light
     */
    @observable theme="light";

    /**
     * 读
     */
    async read(){
        Logger.info("加载系统配置");
        var setting= await this.kvStorage.getObjectAsync("app");
        if(setting){
            this.language=setting.language||this.language;
            this.theme=setting.theme||this.theme;
        }
        Logger.info("系统语言:",this.language);
        Logger.info("系统主题:",this.theme);
    }

    /**
     * 修改系统主题
     * @param theme 
     */
    @moduleFunc
    async setTheme(theme){
        this.theme=theme;
        await this.kvStorage.setObjectProperty("app","theme",theme);
        Logger.info("主题已经修改为",theme);
    }

    /**
     * 修改系统语言
     * @param language 
     */
    @moduleFunc
    async setLanguage(language){
        this.language=language;
        await this.kvStorage.setObjectProperty("app","language",language);
        Logger.info("语言已经修改为",language);
    }


    @module
    async install() {
        await this.read();
    }
}