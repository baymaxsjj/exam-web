import axios from 'axios'
import useUserStore from "../sotre/user-store";
import { Message } from '@arco-design/web-vue';

var instance = axios.create({
    // baseURL: process.env.VUE_APP_API_URL,
    timeout: 10000,
});
// 添加请求拦截器
instance.interceptors.request.use(function(config) {
    const userStore=useUserStore();
    // 在发送请求之前做些什么
    if(userStore.token!=""){
        config.headers['Authorization'] = userStore.token
    }
    // config.headers['X-Requested-With'] = 'XMLHttpRequest'
    return config;
}, function(error) {
    // 对请求错误做些什么
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use(function(response) {
        
        // 对响应数据做点什么
        // Message('操作成功')
        const authorization=response.headers.authorization
        if (authorization) {
            const userStore=useUserStore();
            userStore.token=authorization
            console.log(authorization)
        }
        //获取自定义状态码
        const code=response.data.code
        console.log(code)
        //如果自定义状态码存在
        if(code&&code!="00000"){
            const msg=response.data.msg
            if(code.startsWith("0")){
                Message.success(msg)
                return response
            }
            if(code.startsWith("A")){
                Message.info(msg)
            }else if(code.startsWith("B")){
                Message.warning(msg)
            }else{
                Message.error(msg)
            }
           return Promise.reject(response)
        }
        return response
    },
    function(error) {
        if(error.response.status==500){
            Message.error("服务器连接失败~");
        }
        // 对响应错误做点什么
        return Promise.reject(error.response)
    });
export default instance;