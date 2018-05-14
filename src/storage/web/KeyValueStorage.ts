import * as localForage from 'localforage';
import { IKeyValueStorage } from '../IKeyValueStorage';
import { Logger } from '../../utils/logger';


const stores={};

export class WebKeyValueStorage implements IKeyValueStorage {
    private store:LocalForage;
    constructor(private __NAME__){
        if(!stores[__NAME__]){
            stores[__NAME__]=localForage.createInstance({
                name:"app.db",
                storeName:__NAME__
            });
        }
        this.store=stores[__NAME__];
    }
    
    keys(){
        return this.store.keys();
    }

    async getAsync(key : string, defaultValue = null) {
        var result=await this.store.getItem(key);
        return result||defaultValue;
    }
    
    async setAsync(key : string, value : any) {
        await this.store.setItem(key,value);
        return value;
    }

    async setObjectAsync(key : string, value : any) : Promise < any > {
        return await this.setAsync(key, value);
    }

    async getObjectAsync(key : string) : Promise < any > {
        return await this.getAsync(key, null);
    }

    async setObjectProperty(key : string, propertyName : string, value : any) {
        var obj = await this.getObjectAsync(key);
        if (!obj) {
            obj = {};
        }
        obj[propertyName] = value;
        return await this.setObjectAsync(key, obj);
    }

    async getObjectProperties(key : string, ...propertyNames : any[]) {
        var obj = await this.getObjectAsync(key);
        if (!obj) {
            obj = {};
        }
        var result = {};
        for (var propertyName of propertyNames) {
            result[propertyName] = obj[propertyName];
        }
        return result;
    }

    async getObjectValue(key : string, propertyName : string) {
        var obj = await this.getObjectAsync(key);
        if (obj) {
            return obj[propertyName];
        }
        return null;
    }

    async removeAsync(key : string) : Promise < any > {
        await this.store.removeItem(key);
    }

    async clearAsync() : Promise < any > {
        await this.store.clear();
    }
}

export default WebKeyValueStorage;