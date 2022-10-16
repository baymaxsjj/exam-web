import axios from '../utils/http'
///登录
const userInfoRequest=()=>{
    return axios.get(`/uapi/user/info`)
}
export {
    userInfoRequest
}