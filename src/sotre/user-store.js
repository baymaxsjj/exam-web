import { defineStore } from 'pinia' 
import { userAuthInfoRequest } from '../apis/user-api'
const useUserStore = defineStore({ 
    id: 'user', 
    state: () => ({ 
        token:null,
        userInfo:null,
    }),
    getters:{
        isLogin: (state) => state.token!=null&&state.userInfo!=null
    },
    actions:{
        async getUserInfo(){
            const resp=await userAuthInfoRequest()
            this.userInfo=resp.data.data
        },
        logOut(){
            this.userInfo=null
            this.token=null
        }
    },
    persist: {
        enabled: true,
    }
}) 
export default useUserStore