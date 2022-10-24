import { defineStore } from 'pinia' 
import { getCourseInfoRequest } from '../apis/course-api'
import useUserStore from './user-store';
const useCourseStore = defineStore({ 
    id: 'course', 
    state: () => ({ 
        courseInfo:{},
    }),
    getters:{
        isTeacher(){
            const userStore=useUserStore()
            return userStore.userInfo['id']==this.courseInfo['userId']
        }
    },
    actions:{
        async getCourseInfo(courseId){
            const resp=await getCourseInfoRequest(courseId)
            if(resp.status==200){
                this.courseInfo=resp.data.data
                console.log(this.courseInfo)
            }
        }
    },
   
}) 
export default useCourseStore