const ExamStart = () => import("../views/exam-center/ExamStart.vue");
const ExamConsole = () => import("../views/exam-center/ExamConsole.vue");
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
