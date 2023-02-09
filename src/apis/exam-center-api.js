import axios from '../utils/http'
/**---------------------开始考试啦~相关-----------------------------*/
export const examStartRequest=(examInfoId)=>{
    return axios.get(`/eapi/exam-center/${examInfoId}/start`)
}
export const examSubmitRequest=(examInfoId)=>{
    return axios.post(`/eapi/exam-center/${examInfoId}/submit`)
}
export const examQuestionOptionRequest=(examInfoId,questionId)=>{
    return axios.get(`/eapi/exam-center/${examInfoId}/question/${questionId}`)
}
export const saveExamAnswerRequestion=(examInfoId,questionId,answerMap)=>{
    return axios.post( `/eapi/exam-center/${examInfoId}/answer/${questionId}`,answerMap)
}
export const answerActionRequestion=(examInfoId,action)=>{
    return axios.post( `/eapi/exam-center/${examInfoId}/action`,action)
}
/**---------------------考试控制台啦~相关-----------------------------*/
export const examAnswerLogRequest=(examInfoId)=>{
    return axios.get(`/eapi/exam-answer-log/statistics/${examInfoId}`)
}
export const examAnswerInfoRequest=(examInfoId,classids,status,page=1,pageSize=10)=>{
    const pageParam={page,pageSize}
    return axios.post(`/eapi/exam-console/${examInfoId}/outline-monitor?status=${status}&page=${page}&pageSize=${pageSize}`,classids)
}

export const examStudentAnswerResultRequest=(examInfoId,studentId)=>{
    return axios.get(`/eapi/exam-console/${examInfoId}/review/${studentId}`)
}
export const examStudentLogRequest=(examInfoId,studentId,page=1,pageSize=10)=>{
    return axios.get(`/eapi/exam-answer-log/student/${examInfoId}/${studentId}?page=${page}&pageSize=${pageSize}`)
}
export const getExamStudentNumber=(examInfoId)=>{
    return axios.get(`/eapi/exam-console/${examInfoId}/student-number`)
}
/**---------------------考试批阅~相关-----------------------------*/
export const examAnswerReviewRequest=(examInfoId,classids,reviewType,page=1,pageSize=10)=>{
    const pageParam={page,pageSize}
    return axios.post(`/eapi/exam-console/${examInfoId}/review/list?reviewType=${reviewType}&page=${page}&pageSize=${pageSize}`,classids)
}
export const examAnswerReviewExportRequest=(examInfoId,classids,reviewType)=>{
    return axios.post(`/eapi/exam-console/${examInfoId}/review/list/export?reviewType=${reviewType}`,classids,{
        responseType:'blob'
    })
}
export const examSubmitReviewRequest=(examInfoId,scoreList)=>{
    return axios.post(`/eapi/exam-score-record/${examInfoId}/update/score`,scoreList)
}
