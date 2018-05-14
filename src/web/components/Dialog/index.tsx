import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Modal } from 'antd';
import { ModalProps } from 'antd/lib/modal/Modal';
import * as _ from 'lodash'
interface DialogProps extends ModalProps { };

class Dialog extends React.Component<DialogProps, any> {
    public render(): JSX.Element {
        return (<Modal  
        visible={true}
        closable
        {...this.props}>
            {this.props.children}
        </Modal>);
    }

    static show(Component, dialogProps?: DialogProps) {
        var div = document.createElement("div");
        document.body.appendChild(div);
        const result={
            close: () => {
                const unmontResult = ReactDOM.unmountComponentAtNode(div);
                if (unmontResult && div.parentNode) {
                    div.parentNode.removeChild(div);
                }
            }
        }
        ReactDOM.render(<Dialog {...dialogProps}>
            {Component}
        </Dialog>, div);
        return result;
    }

    static success(message,title="操作成功"){
        return new Promise((resolve,reject)=>{
            Modal.success({
                title:title,
                content:message,
                onCancel:()=>{
                    resolve(false)
                },
                onOk:()=>{
                    resolve(true)
                }
            })

        });
    }
    static confirm(message,title="确认操作"){
        return new Promise((resolve,reject)=>{
            Modal.confirm({
                title:title,
                content:message,
                onCancel:()=>{
                    resolve(false)
                },
                onOk:()=>{
                    resolve(true)
                }
            })

        });
    }

    static error(ex,title="错误!"){
        var message="系统发送一个错误";
        if(_.isString(ex)){
            message=ex;
        }
        if(_.isPlainObject(ex)){
            if(ex.success===false){
                message=ex.error.message;
            }
        }
        
        return new Promise((resolve,reject)=>{
            Modal.error({
                title:title,
                content:message,
                onCancel:()=>{
                    resolve(false)
                },
                onOk:()=>{
                    resolve(true)
                }
            })

        });
    }
}

export default Dialog;
