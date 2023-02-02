import axios from '../utils/http'
//课程消息
export const getClassroomMessageListRequest=(classId,startId,page,pageSize)=>{
    return axios.get(`/mapi/message-info/classroom/${classId}?startId=${startId}&page=${page}&pageSize=${pageSize}`)
}
export const sendClassroomMessageRequest=(classId,message)=>{
    return axios.post(`/mapi/message-info/send/classroom/${classId}`,{
        introduce:message
    })
}
