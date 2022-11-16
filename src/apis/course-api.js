import axios from '../utils/http'
// 查询课程列表
const courseListRequest=(role,page,status)=>{
    return axios.get(`/uapi/courses/list/${role}?&currentPage=${page}&status=${status}`)
}
/// 添加课程
const stuAddCourseRequest=(code)=>{
    return axios.post(`/uapi/classes/join/${code}`)
}
/// 教师添加/更新课程信息
const teaCreateCourseRequest=(params)=>{
    return axios.post(`/uapi/courses/update`,params)
}
///获取课程班级列表
const getClassListRequest=(courseId)=>{
    return axios.get(`/uapi/classes/${courseId}/list`)
}
// 添加/修改编辑
const teaAddClassRequest=(params)=>{
    return axios.post(`/uapi/classes/update`,params)
}
const teaDelClassRequest=(classId)=>{
    return axios.post(`/uapi/classes/delete/${classId}`)
}
const teaGetClassCodeRequest=(classId,anew=false)=>{
    return axios.get(`/uapi/classes/classCode/${classId}?anew=${anew}`)
}
const getClassUsersRequest=(classId,currentPage,pageSize=10)=>{
    return axios.get(`/uapi/join-class/${classId}/student/list?currentPage=${currentPage}&pageSize=${pageSize}}`)
}
const getBatchClassUsersRequest=(classIds,currentPage,pageSize=10)=>{
    return axios.post(`/uapi/join-class/student/batch/list?currentPage=${currentPage}&pageSize=${pageSize}`,classIds)
}
const getCourseInfoRequest=(courseId)=>{
    return axios.get(`/uapi/courses/getInfo?courseId=${courseId}`)
}
export {
    courseListRequest,
    stuAddCourseRequest,
    teaCreateCourseRequest,
    getClassListRequest,
    teaAddClassRequest,
    teaDelClassRequest,
    teaGetClassCodeRequest,
    getClassUsersRequest,
    getBatchClassUsersRequest,
    getCourseInfoRequest
}