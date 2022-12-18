import { defineStore } from 'pinia' 
import { userAuthInfoRequest } from '../apis/user-api'
const useUserStore = defineStore({ 
    id: 'user', 
    state: () => ({ 
        token:"",
        userInfo:{},
    }),
    actions:{
        async getUserInfo(){
            const resp=await userAuthInfoRequest()
            this.userInfo=resp.data.data
        }
    },
    persist: {
        enabled: true,
    }
}) 
export default useUserStore