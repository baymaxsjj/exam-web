import axios from '../utils/http'
export const uploadAvatar=(image,config)=>{
    return axios.post(`/uapi/user/upload-avatar`,image,config)
}
export const uploadCourseCover=(image,config)=>{
    return axios.post(`/uapi/courses/upload-cover`,image,config)
}