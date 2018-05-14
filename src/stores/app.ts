import { di } from 'jsmodules';
import { IKeyValueStorage } from '../storage/IKeyValueStorage';
import { Logger } from '../utils/logger';
import { observable } from 'mobx';
import { IAppModule } from './modules';
import { Events } from 'jsmodules/lib/events';

export enum AppStatus {
    starting = "starting",
    error = "error",
    ready = "ready"
}

export class AppState extends Events {
    /**
     * app 状态
     */
    @observable status : AppStatus=null;

    modules:{[name:string]:IAppModule} = {};

    use(module:IAppModule){
        this.modules[module.name] = module;
        return this;
    }

    /**
     * 启动应用
     */
    public async start() {
        Logger.info("启动应用程序");
        this.status=AppStatus.starting;
        for(var name in this.modules){
            const module=this.modules[name];
            await module.install();
        }
        this.status=AppStatus.ready;
        Logger.info("启动成功",this.status);
    }
}

export default AppState;