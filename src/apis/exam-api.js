import axios from '../utils/http'
// 删除标签
/**---------------------试卷相关-----------------------------*/
const delExamPaperRequest=(examId)=>{
    return axios.post(`/eapi/exam/delete/${examId}`)
}
const updateExamPaperRequest=(exam,questions)=>{
    return axios.post(`/eapi/exam/update`,{
        exam,
        questions
    })
}
const getExamPaperListRequest=(courseId,page=1,pageSize=10)=>{
    return axios.get(`/eapi/exam/list/${courseId}?page=${page}&pageSize=${pageSize}`)
}
const getExamPaperDetailRequest=(examId)=>{
    return axios.get(`/eapi/exam/detail/${examId}`)
}
const getExamPaperQuestionRequest=(examId)=>{
    return axios.get(`/eapi/exam/quesiton/${examId}`)
}
/**---------------------考试相关-----------------------------*/
const delExamInfoRequest=(examInfoId)=>{
    return axios.post(`/eapi/exam-info/delete/${examInfoId}`)
}
const updateExamInfoRequest=(examInfo,classList)=>{
    return axios.post(`/eapi/exam-info/update`,{
        examInfo,
        classList
    })
}
const getExamInfoListRequest=(courseId,status=0,page=1,pageSize=10)=>{
    return axios.get(`/eapi/exam-info/list/${courseId}?status=${status}&page=${page}&pageSize=${pageSize}`)
}
const getExamInfoDetailRequest=(examInfoId)=>{
    return axios.get(`/eapi/exam-info/detail/${examInfoId}`)
}
/**---------------------开始考试啦~相关-----------------------------*/
const examStartRequest=(examInfoId)=>{
    return axios.get(`/eapi//exam-info/start/${examInfoId}`)
}
export{
    updateExamPaperRequest,
    delExamPaperRequest,
    getExamPaperListRequest,
    getExamPaperDetailRequest,
    getExamPaperQuestionRequest,

    updateExamInfoRequest,
    delExamInfoRequest,
    getExamInfoListRequest,
    getExamInfoDetailRequest,

    examStartRequest
}