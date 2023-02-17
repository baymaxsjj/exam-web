import { defineStore } from 'pinia' 
import { userAuthInfoRequest,baseUserInfoRequest } from '../apis/user-api'
import SocketService from '../utils/web-stocket-service.js'
import {getImageUrl} from '../utils/image'
const useUserStore = defineStore({ 
    id: 'user', 
    state: () => ({ 
        token:null,
        userInfo:null,
        baseUserInfo:null,
        theme:'light'
    }),
    getters:{
        isLogin: (state) => state.token!=null,
        menu:()=>{
            return [
                {
                    name: "个人信息",
                    icon: "icon-apps",
                    key: "UserInfo",
                    params: {},
                    visble: true,
                },
                {
                    name: "学校认证",
                    icon: "icon-apps",
                    key: "SchoolAuth",
                    params: {},
                    visble: true,
                },
                {
                    name: "安全设置",
                    icon: "icon-apps",
                    key: "LoginManagement",
                    params: {},
                    visble: true,
                },
                {
                    name: "系统设置",
                    icon: "icon-apps",
                    key: "SystemSetting",
                    params: {},
                    visble: true,
                }
            ]
        }
    },
    actions:{
        async getUserInfo(){
            const resp=await userAuthInfoRequest()
            const data=resp.data.data;
            data.picture=getImageUrl(data.picture)
            this.userInfo=data
        },
        async getBaseUserInfo(){
            const resp=await baseUserInfoRequest()
            const data=resp.data.data;
            data.picture=getImageUrl(data.picture)
            this.baseUserInfo=data
        },
        toggleTheme(dark){
            if (dark) {
                this.theme = 'dark';
                document.body.setAttribute('arco-theme', 'dark');
              } else {
                this.theme = 'light';
                document.body.removeAttribute('arco-theme');
              }
        },
        logOut(){
            this.userInfo=null
            this.token=null
            this.baseUserInfo=null
            SocketService.instance?.close()
        }
    },
    persist: {
        enabled: true,
    }
}) 
export default useUserStore