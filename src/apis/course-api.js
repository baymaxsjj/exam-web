import axios from '../utils/http'
// 查询课程列表
export const courseListRequest=(role,page,status)=>{
    return axios.get(`/uapi/courses/list/${role}?&currentPage=${page}&status=${status}`)
}
/// 添加课程
export const stuAddCourseRequest=(code)=>{
    return axios.post(`/uapi/classes/join/${code}`)
}
/// 教师添加/更新课程信息
export const teaCreateCourseRequest=(params)=>{
    return axios.post(`/uapi/courses/update`,params)
}
///获取课程班级列表
export const getClassListRequest=(courseId)=>{
    return axios.get(`/uapi/classes/${courseId}/list`)
}
export const getPartClassListRequest=(courseId,classIds)=>{
    return axios.post(`/uapi/classes/${courseId}/part/list`,classIds)
}
// 添加/修改编辑
export const teaAddClassRequest=(params)=>{
    return axios.post(`/uapi/classes/update`,params)
}
export const teaDelClassRequest=(classId)=>{
    return axios.post(`/uapi/classes/delete/${classId}`)
}
export const teaGetClassCodeRequest=(classId,anew=false)=>{
    return axios.get(`/uapi/classes/classCode/${classId}?anew=${anew}`)
}
export const getClassUsersRequest=(classId,currentPage,pageSize=10)=>{
    return axios.get(`/uapi/join-class/${classId}/student/list?currentPage=${currentPage}&pageSize=${pageSize}`)
}
export const getBatchClassUsersRequest=(classIds,currentPage,pageSize=10)=>{
    return axios.post(`/uapi/join-class/student/batch/list?currentPage=${currentPage}&pageSize=${pageSize}`,classIds)
}
export const getCourseInfoRequest=(courseId)=>{
    return axios.get(`/uapi/courses/getInfo?courseId=${courseId}`)
}

