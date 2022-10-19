import axios from '../utils/http'
// 删除标签
const updateTagRequest=(tags)=>{
    return axios.post(`/eapi/tags/update`,tags)
}
// 查询标签列表
const tagsListRequest=(courseId,parentId='')=>{
    return axios.get(`/eapi/tags/${courseId}/list?parentId=${parentId}`)
}
// 删除标签
const deleteTagRequest=(tagId)=>{
    return axios.post(`/eapi/tags/delete/${tagId}`)
}
export {
    updateTagRequest,
    tagsListRequest,
    deleteTagRequest
}