import axios from '../utils/http'
///登录
const loginRequest=(username,password)=>{
    return axios.post(`/aapi/oauth/token?client_secret=123456&grant_type=password&username=${username}&password=${password}&client_id=exam-app`)
}

///注册
const registerRequest=(params)=>{
    return axios.post("/uapi/register",params)
}
// 找回密码
const forgetPassRequest=(params)=>{
    return axios.post("/uapi/forgetPass",params)
}
// 发送邮箱验证码
const sendEmailCodeRequest=(params)=>{
    return axios.post("/uapi/sendEmailCode",params)
}
export {
    loginRequest,
    registerRequest,
    forgetPassRequest,
    sendEmailCodeRequest
} 