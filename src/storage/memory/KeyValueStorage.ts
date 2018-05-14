import * as localForage from 'localforage';
import { IKeyValueStorage } from '../IKeyValueStorage';
import { Logger } from '../../utils/logger';


let __CACHE__={};

export class MemKeyValueStorage implements IKeyValueStorage {
    constructor(private __NAME__:string){
        if(!__CACHE__[__NAME__]){
            __CACHE__[__NAME__]={};
        }
    }
    async keys(){
        return await Object.keys(__CACHE__[this.__NAME__]);
    }

    async getAsync(key : string, defaultValue = null) {
        var result=await __CACHE__[this.__NAME__][key];
        return result||defaultValue;
    }
    
    async setAsync(key : string, value : any) {
        __CACHE__[this.__NAME__][key]=value;
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
        delete __CACHE__[this.__NAME__][key];
    }

    async clearAsync() : Promise < any > {
        __CACHE__[this.__NAME__]={};
    }
}

export default MemKeyValueStorage;