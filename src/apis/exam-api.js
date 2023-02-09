import axios from '../utils/http'
// 删除标签
/**---------------------试卷相关-----------------------------*/
export const delExamPaperRequest=(examId)=>{
    return axios.post(`/eapi/exam-paper/delete/${examId}`)
}
export const updateExamPaperRequest=(examPaper,questions)=>{
    return axios.post(`/eapi/exam-paper/update`,{
        examPaper,
        questions
    })
}
export const getExamPaperListRequest=(courseId,page=1,pageSize=10)=>{
    return axios.get(`/eapi/exam-paper/list/${courseId}?page=${page}&pageSize=${pageSize}`)
}
export const getExamPaperDetailRequest=(examId)=>{
    return axios.get(`/eapi/exam-paper/detail/${examId}`)
}
export const getExamPaperQuestionRequest=(examId)=>{
    return axios.get(`/eapi/exam-paper/quesiton/${examId}`)
}
//试卷数据统计
export const getExamPaperStatisticsRequest=(examId)=>{
    return axios.get(`/eapi/exam-paper/statistics/${examId}`)
}
/**---------------------考试相关-----------------------------*/
export const delExamInfoRequest=(examInfoId)=>{
    return axios.post(`/eapi/exam-info/delete/${examInfoId}`)
}
export const updateExamInfoRequest=(examInfo,classIds)=>{
    return axios.post(`/eapi/exam-info/update`,{
        examInfo,
        classIds
    })
}
export const getExamInfoListRequest=(courseId,status=0,page=1,pageSize=10)=>{
    return axios.get(`/eapi/exam-info/list/${courseId}?status=${status}&page=${page}&pageSize=${pageSize}`)
}
export const getExamInfoDetailRequest=(examInfoId)=>{
    return axios.get(`/eapi/exam-info/detail/${examInfoId}`)
}