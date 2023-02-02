import useUserStore from '../sotre/user-store'

export default class SocketService {
    static instance = null;
    static get Instance() {
        if (!this.instance) {
            this.instance = new SocketService();
        }
        return this.instance;
    }
    // 和服务端连接的socket对象
    ws = null;
    // 存储回调函数
    callBackMapping = {};
    // 标识是否连接成功
    connected = false;
    // 记录重试的次数
    sendRetryCount = 0;
    // 重新连接尝试的次数
    connectRetryCount = 0;
 
    //重连时间 毫秒
    retryTime = 500;
 
    store = useUserStore();
 
    //  定义连接服务器的方法
    connect() {
        console.log("连接websocket")
        // 连接服务器
        if (!window.WebSocket) {
            return console.log('您的浏览器不支持WebSocket');
        }
        let ip = import.meta.env.VITE_API_HOST_IP;//配置文件获取url
        let message_path =import.meta.env.VITE_MESSAGE_API_URL;//配置文件获取url
        this.ws = new WebSocket(`ws://${ip}${message_path}/socket?token=${this.store.token}`);//getToken()请求头添加token鉴权
        // 连接成功的事件
        this.ws.onopen = () => {
            console.log('ws连接服务端成功' );
 
            //server重启，将重连次数存入store，监听该值的组件重新订阅socket
            if(this.connectRetryCount > 0){
                this.store.commit("setWsRetryCount", this.connectRetryCount)
            }
 
            this.connected = true;
            // 重置重新连接的次数
            this.connectRetryCount = 0;
        };
        // 1.连接服务端失败
        // 2.当连接成功之后, 服务器关闭的情况
        this.ws.onclose = () => {
            console.log('ws连接服务端失败, url:');
            this.connected = false;
            this.connectRetryCount++;
            setTimeout(() => {
                this.connect();
            }, this.wsTimeout(this.connectRetryCount , this.retryTime));
        };
        // 得到服务端发送过来的数据
        this.ws.onmessage = msg => {
            console.log(msg.data, '从服务端获取到了数据');
            const recvData = JSON.parse(msg.data)
            const socketType = recvData.code;
            //注册回调函数 参数2 是需要回调的方法
            if (this.callBackMapping[socketType]) {
                // const realData = msg.data // 得到该图表的数据
                this.callBackMapping[socketType].call(this,recvData)
            }
        };
    }
    // 回调函数的注册
    registerCallBack(socketType, callBack) {
        this.callBackMapping[socketType] = callBack;
    }
    // 取消某一个回调函数
    unRegisterCallBack(socketType) {
        this.callBackMapping[socketType] = null;
    }
    // 发送数据的方法
    send(data) {
        console.log("websocket发送数据："+JSON.stringify(data))
        // 判断此时此刻有没有连接成功
        if (this.connected) {
            this.sendRetryCount = 0;
            try {
                this.ws.send(JSON.stringify(data));
            } catch (e) {
                this.ws.send(data);
            }
        } else {
            this.sendRetryCount++;
            setTimeout(() => {
                this.send(data);
            }, this.wsTimeout(this.sendRetryCount , this.retryTime));
        }
    }
    //关闭连接
    close(){
        this.ws.close();
    }
    wsTimeout(count,time){
        return count*time;
    }
}

  