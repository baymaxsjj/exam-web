import axios from '../utils/http'
/**---------------------开始考试啦~相关-----------------------------*/
const examStartRequest=(examInfoId)=>{
    return axios.get(`/eapi/exam-center/${examInfoId}/start`)
}
const examQuestionOptionRequest=(examInfoId,questionId)=>{
    return axios.get(`/eapi/exam-center/${examInfoId}/question/${questionId}`)
}
const saveExamAnswerRequestion=(examInfoId,questionId,answerMap)=>{
    return axios.post( `/eapi/exam-center/${examInfoId}/answer/${questionId}`,answerMap)
}
export{
    examStartRequest,
    examQuestionOptionRequest,
    saveExamAnswerRequestion
}