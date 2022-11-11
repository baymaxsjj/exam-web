import axios from '../utils/http'
/**---------------------开始考试啦~相关-----------------------------*/
const examStartRequest=(examInfoId)=>{
    return axios.get(`/eapi/exam-center/${examInfoId}/start`)
}
const examQuestionOptionRequest=(examInfoId,questionId)=>{
    return axios.get(`/eapi/exam-center/${examInfoId}/question/${questionId}`)
}
const saveExamAnswerRequestion=()=>{
    
}
export{
    examStartRequest,
    examQuestionOptionRequest
}