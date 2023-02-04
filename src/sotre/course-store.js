import { defineStore } from "pinia";
import { getCourseInfoRequest, getClassListRequest } from "../apis/course-api";
import useUserStore from "./user-store";
const useCourseStore = defineStore({
  id: "course",
  state: () => ({
    courseInfo: {},
  }),
  getters: {
    isTeacher() {
      const userStore = useUserStore();
      return userStore.userInfo["userId"] == this.courseInfo["userId"];
    },
    menu() {
      const id = this.courseInfo["id"];
      const params = {
        courseId: id,
      };
      return [
        {
          name: "课堂",
          icon: "icon-apps",
          key: "Classroom",
          params: params,
          visble: true,
        },
        {
          name: "作业",
          icon: "icon-select-all",
          key: "Homework",
          params: params,
          visble: true,
        },
        {
          name: "考试",
          icon: "icon-at",
          key: "ExamManage",
          params: params,
          visble: true,
        },
        {
          name: "试卷",
          icon: "icon-at",
          key: "ExamPaperManger",
          params: params,
          visble: this.isTeacher,
        },
        {
          name: "题库",
          icon: "icon-bookmark",
          key: "Question",
          params: params,
          visble: true,
        },
        {
          name: "班级",
          icon: "icon-command",
          key: "MyClasses",
          params: params,
          visble: true,
        },
      ];
    },
    getClassList() {
      return this.classList;
    },
  },
  actions: {
    async getCourseInfo(courseId) {
      const resp = await getCourseInfoRequest(courseId);
      if (resp.status == 200) {
        this.courseInfo = resp.data.data;
        console.log(this.courseInfo);
      }
    },
  },
});
export default useCourseStore;
