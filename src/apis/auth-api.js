import axios from '../utils/http'
///登录
export const loginRequest=(username,password)=>{
    return axios.post(`/aapi/oauth/token?client_secret=123456&grant_type=password&username=${username}&password=${password}&client_id=exam-app`)
}

///注册
export const registerRequest=(params,code)=>{
    return axios.post(`/uapi/public/user/register?code=${code}`,params)
}
// 找回密码
export const forgetPassRequest=(email,code,password)=>{
    return axios.post(`/uapi/public/user/forgetPass?email=${email}&code=${code}`,password)
}
// 发送邮箱验证码
export const sendEmailCodeRequest=(type,email)=>{
    return axios.post(`/uapi/public/user/sendEmailCode?type=${type}&email=${email}`)
}
