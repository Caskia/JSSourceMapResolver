import axios, {AxiosRequestConfig, Canceler} from 'axios';
import Logger from './logger';
import {IRequestBuilder} from 'jsmodules/lib/http/interface';
import {di, qs} from "jsmodules";

/**
 * 自动判断平台后,创建请求实例
 */

export function AutoHttpFactory(baseUrl) {
    return di.Resolve("httpFactory", baseUrl, AxiosRequestBuilder);
}

const contentTypes = {
    json: "application/json",
    form: "application/x-www-form-urlencoded"
}

export class AxiosRequestBuilder implements IRequestBuilder {

    constructor(public url) {}

    isJson() {
        return this.contentType(contentTypes.json);
    }

    isForm() {
        return this.contentType(contentTypes.form)
    }

    private _contentType = contentTypes.json;

    contentType(contentType) {
        this._contentType = contentType;
        return this;
    }

    private _dataType = "json";

    dataType(dataType) {
        this._dataType = dataType;
        return this;
    }

    private __headers:{[name:string]:string}={};

    headers(obj : any) : IRequestBuilder {
        this.__headers ={... obj};
        return this;
    }

    private __canceler__ : Canceler;

    private async requestAsync(options : AxiosRequestConfig) {
        try {
            Logger.info(`开始ajax请求[${options.method}][${this.url}]`);
            var headers=this.__headers;
            if(this._contentType){
                headers.contentType=this._contentType;
            }
            var response = await axios.request({
                url: this.url,
                responseType: this._dataType,
                cancelToken: new axios.CancelToken((c) => {
                    this.__canceler__ = c;
                }),
                headers,
                ...options
            });
            Logger.info(`结束ajax请求[${options.method}][${this.url}]`);
            return response
        } catch (err) {
            //axios把304认为是异常
            if (err.response&&err.response.status == 304) {
                Logger.info(`结束ajax请求[${options.method}][${this.url}]`);
                return err.response;
            }
            Logger.error(`结束ajax异常[${options.method}][${this.url}]`,err);
            throw err;
        }
    }

    private getDataFormat(data) {
        if (this._contentType == contentTypes.form) {
            data = qs.encode(data);
        }
        return data;
    }

    get(query?: any) {
        return this.requestAsync({method: "GET", params: query})
    }

    post(data?: any) {
        return this.requestAsync({
            method: "POST",
            data: this.getDataFormat(data)
        })
    }

    put(data?: any) {
        return this.requestAsync({
            method: "PUT",
            data: this.getDataFormat(data)
        })
    }

    remove(query?: any) {
        return this.requestAsync({method: "DELETE", params: query})
    }

    jsonp(query : any, callbackParam?: any) : Promise < any > {
        throw new Error("不支持JSONP操作");
    }

    stop() {
        if (this.__canceler__) {
            this.__canceler__("ajax.abort");
        }
    }
}