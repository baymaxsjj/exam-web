import axios from '../utils/http'
// 删除标签
/**---------------------试卷相关-----------------------------*/
const delExamPaperRequest=(examId)=>{
    return axios.post(`/eapi/exam-paper/delete/${examId}`)
}
const updateExamPaperRequest=(examPaper,questions)=>{
    return axios.post(`/eapi/exam-paper/update`,{
        examPaper,
        questions
    })
}
const getExamPaperListRequest=(courseId,page=1,pageSize=10)=>{
    return axios.get(`/eapi/exam-paper/list/${courseId}?page=${page}&pageSize=${pageSize}`)
}
const getExamPaperDetailRequest=(examId)=>{
    return axios.get(`/eapi/exam-paper/detail/${examId}`)
}
const getExamPaperQuestionRequest=(examId)=>{
    return axios.get(`/eapi/exam-paper/quesiton/${examId}`)
}
//试卷数据统计
const getExamPaperStatisticsRequest=(examId)=>{
    return axios.get(`/eapi/exam-paper/statistics/${examId}`)
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

export{
    updateExamPaperRequest,
    delExamPaperRequest,
    getExamPaperListRequest,
    getExamPaperDetailRequest,
    getExamPaperQuestionRequest,
    getExamPaperStatisticsRequest,

    updateExamInfoRequest,
    delExamInfoRequest,
    getExamInfoListRequest,
    getExamInfoDetailRequest,
}