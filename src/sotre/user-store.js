import { defineStore } from 'pinia' 
import { userAuthInfoRequest,baseUserInfoRequest } from '../apis/user-api'
import SocketService from '../utils/web-stocket-service.js'
import {getImageUrl} from '../utils/image'
const useUserStore = defineStore({ 
    id: 'user', 
    state: () => ({ 
        token:null,
        userInfo:null,
        baseUserInfo:null
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