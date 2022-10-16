import { defineStore } from 'pinia' 
import { getCourseInfoRequest } from '../apis/course-api'
const useCourseStore = defineStore({ 
    id: 'course', 
    state: () => ({ 
        courseInfo:{},
    }),
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