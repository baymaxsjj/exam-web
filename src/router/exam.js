const ExamStart = () => import("../views/exam-center/ExamStart.vue");
const ExamSuccess = () => import("../views/exam-center/SubmitSuccess.vue");
const ExamConsole = () => import("../views/exam-center/console/ExamConsole.vue");
const courses = [
  {
    path: "/exam/:examInfoId(\\d+)/start",
    component: ExamStart,
    name: "ExamStart",
    meta: {
      title: "考试",
      header: false,
    },
  },
  {
    path: "/exam/:examInfoId(\\d+)/success",
    component: ExamSuccess,
    name: "ExamSuccess",
    meta: {
      title: "提交成功",
    },
  },
  {
    path: "/exam/:examInfoId(\\d+)/console",
    component: ExamConsole,
    name: "ExamConsole",
    meta: {
      title: "考试控制台",
      header: false,
    },
  },
//   {
//     path: "/exam/:examInfoId(\\d+)",
//     component: Home,
//     name: "Course",
//     children: [],
//   },
];
export default courses;
