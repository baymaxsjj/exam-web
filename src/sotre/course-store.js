import { defineStore } from 'pinia' 
import { getCourseInfoRequest,getClassListRequest } from '../apis/course-api'
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
        },
        menu(){
            const id=this.courseInfo['id'];
            return [
                {
                    name: "课堂",
                    icon: "icon-apps",
                    url: `/course/${id}/classroom`,
                    visble:true
                },
                {
                    name: "作业",
                    icon: "icon-select-all",
                    url: `/course/${id}/work`,
                    visble:true
                },
                {
                    name: "考试",
                    icon: "icon-at",
                    url: `/course/${id}/exam/manage`,
                    visble:this.isTeacher
                },
                {
                    name: "试卷",
                    icon: "icon-at",
                    url: `/course/${id}/exam/paper/manage`,
                    visble:this.isTeacher
                },
                {
                    name: "题库",
                    icon: "icon-bookmark",
                    url: `/course/${id}/question`,
                    visble:true
                },
                {
                    name: "班级",
                    icon: "icon-command",
                    url: `/course/${id}/classes`,
                    visble:true
                },
        
            ]
        },
        getClassList(){
            return this.classList
        }
    },
    actions:{
        async getCourseInfo(courseId){
            const resp=await getCourseInfoRequest(courseId)
            if(resp.status==200){
                this.courseInfo=resp.data.data
                console.log(this.courseInfo)
            }
        },
    },
   
}) 
export default useCourseStore