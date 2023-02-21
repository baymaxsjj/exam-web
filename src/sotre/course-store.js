import { defineStore } from "pinia";
import { getCourseInfoRequest, getClassListRequest } from "../apis/course-api";
import useUserStore from "./user-store";
import {IconApps,IconSelectAll,IconAt,IconBookmark,IconCommand} from "@arco-design/web-vue/es/icon";

const useCourseStore = defineStore({
  id: "course",
  state: () => ({
    courseInfo: {},
    classList:[]
  }),
  getters: {
    isTeacher(state) {
      const userStore = useUserStore();
      return userStore.userInfo?.userId == state.courseInfo?.userId;
    },
    menu() {
      const id = this.courseInfo["id"];
      const params = {
        courseId: id,
      };
      return [
        {
          name: "课堂",
          icon: IconApps,
          key: "Classroom",
          params: params,
          visble: true,
        },
        {
          name: "作业",
          icon: IconSelectAll,
          key: "Homework",
          params: params,
          visble: true,
        },
        {
          name: "考试",
          icon: IconAt,
          key: "ExamManage",
          params: params,
          visble: true,
        },
        {
          name: "试卷",
          icon: IconAt,
          key: "ExamPaperManger",
          params: params,
          visble: this.isTeacher,
        },
        {
          name: "题库",
          icon: IconBookmark,
          key: "Question",
          params: params,
          visble: true,
        },
        {
          name: "班级",
          icon: IconCommand,
          key: "MyClasses",
          params: params,
          visble: true,
        },
      ];
    },
  },
  actions: {
    async getCourseInfo(courseId) {
      const resp = await getCourseInfoRequest(courseId);
        this.courseInfo = resp.data.data;
    },
    async getClassList(courseId) {
      const resp = await getClassListRequest(courseId);
      this.classList = resp.data.data;
    },
  },
});
export default useCourseStore;
