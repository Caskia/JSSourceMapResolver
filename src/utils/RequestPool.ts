import { Logger } from './logger';
import { nextId } from 'jsmodules/lib/system';



export type TaskOptions={
    onRequest:()=>Promise<any>;
    onCancel:()=>Promise<any>;

}

export class RequestPoolBuilder{    
    constructor(private options:TaskOptions,public callback){}
    exec(){
        return this.options.onRequest().then((data)=>{
            this.callback(data);
        }).catch(()=>{
            this.callback(false);
        });
    }
    abort(){
        this.options.onCancel().then(()=>{
            this.callback(false);
        })
    }
}


export class RequestPool {

    private __tasks__:{[id:string]:RequestPoolBuilder}={};

    private __queue__ = [];

    private __running__ = false;

    private __runningCnt__=0;

    /**
     * 实例化一个请求池
     * @param ___max__ 最多同时请求数
     */
    constructor(private __max__=5){

    }

    /**
     * 尝试开始一个任务
     */
    private tryStart() {
        if(!this.__running__){
            this.__running__=true;
            this.next();
        }
    }

    /**
     * 尝试停止一个任务
     * @param task_id 
     */
    private tryStop(task_id){
        var task=this.__tasks__[task_id];
        if(task){
            task.abort();
            this.removeTask(task_id);
        }
    }

    /**
     * 执行下一个任务
     */
    private async next() {
        if(this.__queue__.length==0){
            this.__running__=false;
            return;
        }
        var task_id=this.__queue__.shift();
        var task=this.__tasks__[task_id];
        if(task){
            this.__runningCnt__++;
            task.exec().then(()=>{
                this.__runningCnt__--;
            });
        }
        var max=Math.min(this.__queue__.length,this.__max__);
        if(this.__runningCnt__<max){
            this.next();
        }
    }
    /**
     * 添加一个任务
     * @param task_id 任务ID 
     * @param options 配置
     */
    private addTask(task_id,options:TaskOptions){
        return new Promise(resolve=>{            
            this.__tasks__[task_id]=new RequestPoolBuilder(options,resolve);
            this.__queue__.push(task_id);
            this.tryStart();
        }).then((data)=>{
            //任务结束或取消,删除此任务,并且尝试执行下一个任务
            this.removeTask(task_id);
            this.next();
            return data;
        });
    }
    /**
     * 删除指定任务
     * @param task_id 任务ID 
     */
    private removeTask(task_id){
        delete this.__tasks__[task_id];
    }

    /**
     * 排队一个任务
     * @param options 
     */
    queueRequest(options:TaskOptions) {
        var task_id=`TASK-${nextId()}`;
        var task=this.addTask(task_id,options);
        return {
            data:()=>{
                return task;
            },
            abort:()=>{
                this.tryStop(task_id);
            }
        }
    }

}

export default new RequestPool();