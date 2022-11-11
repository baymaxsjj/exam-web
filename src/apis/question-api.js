import axios from '../utils/http'
// 删除标签
const updateTagRequest=(tags)=>{
    return axios.post(`/eapi/tags/update`,tags)
}
/// 查询标签列表
const tagsListRequest=(courseId,parentId='')=>{
    return axios.get(`/eapi/tags/${courseId}/list?parentId=${parentId}`)
}
// 删除标签
const deleteTagRequest=(tagId)=>{
    return axios.post(`/eapi/tags/delete/${tagId}`)
}
// 查询题目列表
const questionListRequest=(courseId,currentPage,tagId='')=>{
    return axios.get(`/eapi/question/list/${courseId}?currentPage=${currentPage}&tagId=${tagId}`)
}
// 添加题目
const addQuestionRequest=(question)=>{
    return axios.post(`/eapi/question/add`,question)
}
const questionDetailRequest=(questionId)=>{
    return axios.get(`/eapi/question/detail/${questionId}`)
}
// 更新题目
const updateQuestionRequest=(question)=>{
    return axios.post(`/eapi/question/update`,question)
}
// 删除题目
const delQuestionRequest=(questionId)=>{
    return axios.post(`/eapi/question/delete/${questionId}`)
}
//批量导入题目
const batchQuestionRequest=(tagId)=>{
    return axios.post(`/eapi/question/batchAdd/${tagId}`)
}
// 解析题目文本
const analyzeQuestionTextRequest=(questionText)=>{
    return axios.post(`/eapi/question/analyze`,{
        questionText
    })
}
// 更新题目项
const updateQuestionItemRequest=(item)=>{
    return axios.post(`/eapi/question-item/update`,item)
}
// 删除题目项
const delQuestionItemRequest=(itemId)=>{
    return axios.post(`/eapi/question-item/delete/${itemId}`)
}
// 修改/单/多/判 答案
const updateQuestionCorrectRequest=(itemId)=>{
    return axios.post(`/eapi/question-item/correct/${itemId}`)
}


export {
    updateTagRequest,
    tagsListRequest,
    deleteTagRequest,
    questionListRequest,
    addQuestionRequest,
    questionDetailRequest,
    updateQuestionRequest,
    delQuestionRequest,
    updateQuestionItemRequest,
    delQuestionItemRequest,
    updateQuestionCorrectRequest,
    batchQuestionRequest,
    analyzeQuestionTextRequest
}