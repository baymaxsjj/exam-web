const ExamStart = () => import("../views/exam-center/ExamStart.vue");
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
//   {
//     path: "/exam/:examInfoId(\\d+)",
//     component: Home,
//     name: "Course",
//     children: [],
//   },
];
export default courses;
