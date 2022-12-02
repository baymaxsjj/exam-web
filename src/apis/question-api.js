import axios from '../utils/http'
// 删除标签
export const updateTagRequest=(tags)=>{
    return axios.post(`/eapi/tags/update`,tags)
}
/// 查询标签列表
export const tagsListRequest=(courseId,parentId='')=>{
    return axios.get(`/eapi/tags/${courseId}/list?parentId=${parentId}`)
}
// 删除标签
export const deleteTagRequest=(tagId)=>{
    return axios.post(`/eapi/tags/delete/${tagId}`)
}
// 查询题目列表
export const questionListRequest=(courseId,currentPage,tagId='')=>{
    return axios.get(`/eapi/question/list/${courseId}?currentPage=${currentPage}&tagId=${tagId}`)
}
// 查询题目列表
export const questionRulesRequest=()=>{
    return axios.get(`/eapi/question/rules`)
}
// 添加题目
export const addQuestionRequest=(question)=>{
    return axios.post(`/eapi/question/add`,question)
}
export const questionDetailRequest=(questionId)=>{
    return axios.get(`/eapi/question/detail/${questionId}`)
}
// 更新题目
export const updateQuestionRequest=(question)=>{
    return axios.post(`/eapi/question/update`,question)
}
// 删除题目
export const delQuestionRequest=(questionId)=>{
    return axios.post(`/eapi/question/delete/${questionId}`)
}
//批量导入题目
export const batchQuestionRequest=(courseId,tagId,questionInfos,questionConfig=null)=>{
    return axios.post(`/eapi/question/batchAdd`,{
        tagId,
        courseId,
        questionInfos,
        questionConfig
    })
}
// 解析题目文本
export const parseQuestionTextRequest=(questionsText,defaultRule=null,customRule=null)=>{
    return axios.post(`/eapi/question/analyze`,{
        questionsText,
        defaultRule,
        customRule
    })
}
// 更新题目项
export const updateQuestionItemRequest=(item)=>{
    return axios.post(`/eapi/question-item/update`,item)
}
// 删除题目项
export const delQuestionItemRequest=(itemId)=>{
    return axios.post(`/eapi/question-item/delete/${itemId}`)
}
// 修改/单/多/判 答案
export const updateQuestionCorrectRequest=(itemId)=>{
    return axios.post(`/eapi/question-item/correct/${itemId}`)
}
