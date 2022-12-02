import axios from '../utils/http'
///登录
export const userInfoRequest=()=>{
    return axios.get(`/uapi/user/info`)
}
