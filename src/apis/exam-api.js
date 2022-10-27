import axios from '../utils/http'
// 删除标签
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
export{
    updateExamPaperRequest,
    delExamPaperRequest,
    getExamPaperListRequest,
    getExamPaperDetailRequest,
    getExamPaperQuestionRequest
}