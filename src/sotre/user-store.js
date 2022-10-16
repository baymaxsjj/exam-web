import { defineStore } from 'pinia' 
import { userInfoRequest } from '../apis/user-api'
const useUserStore = defineStore({ 
    id: 'user', 
    state: () => ({ 
        token:"",
        userInfo:{},
    }),
    actions:{
        async getUserInfo(){
            const resp=await userInfoRequest()
            this.userInfo=resp.data.data
        }
    },
    persist: {
        enabled: true,
    }
}) 
export default useUserStore