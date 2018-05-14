
import { expect } from 'chai';
import { RequestPool } from '../../src/utils/RequestPool';
import Logger from '../../src/utils/logger';


const mock_Request=(name,age)=>{
    Logger.info("start-",name,age)
    return new Promise((resolve)=>{
        setTimeout(()=>{
            resolve("end-"+name);
        },Math.random()*1000);
    })
}

const HistoryRequestPool=new RequestPool();
describe("请求池测试",function(){
    this.timeout(50000);
    it("请求100个任务并取消50个",async ()=>{
        var tasks=[];
        var x=0;
        for(let i=0;i<100;i++){
            var task= HistoryRequestPool.queueRequest({
                onRequest:()=>{
                    return mock_Request("a"+i,i);
                },
                onCancel:async ()=>{

                }
            });
            tasks.push(task.data().then((data)=>{
                if(data){
                    x++;
                    console.log(data);
                }else{
                    console.log("cancel");
                }
            }));
            if(i%2==0){
                task.abort();
            }
        }     
        await Promise.all(tasks);
        Logger.info("成功执行任务",x,"个")
        expect(x).to.be.equal(50);
    })
})