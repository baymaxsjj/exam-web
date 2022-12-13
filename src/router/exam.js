const ExamHome = () => import("../views/exam-center/ExamHome.vue");
const ExamStart = () => import("../views/exam-center/ExamStart.vue");
const ExamSuccess = () => import("../views/exam-center/ExamSuccess.vue");
const ExamReview = () => import("../views/exam-center/ExamReview.vue");
const ExamConsole = () => import("../views/exam-center/ExamConsole.vue");
const ConsoleReview = () => import("../views/exam-center/console/Review.vue");
const ConsoleOutline = () => import("../views/exam-center/console/Outline.vue");
const ConsoleStatistic = () =>
  import("../views/exam-center/console/Statistic.vue");
const courses = [
  {
    path: "/exam/:examInfoId(\\d+)",
    component: ExamHome,
    name: "ExamHome",
    redirect: "ExamHome",
    children: [
      {
        path: "start",
        component: ExamStart,
        name: "ExamStart",
        meta: {
          title: "考试",
          header: false,
        },
      },
      {
        path: "success",
        component: ExamSuccess,
        name: "ExamSuccess",
        meta: {
          title: "提交成功",
        },
      },
      {
        path: "review/:studentId(\\d+)",
        component: ExamReview,
        name: "ExamReview",
        meta: {
          title: "考试批阅",
        },
      },
      {
        path: "console",
        component: ExamConsole,
        name: "ExamConsole",
        redirect: "outline",
        children: [
          {
            path: "outline",
            component: ConsoleOutline,
            name: "ConsoleOutline",
            meta: {
              title: "考试总览",
              header: false,
            },
          },
          {
            path: "review",
            component: ConsoleReview,
            name: "ConsoleReview",
            meta: {
              title: "考试批阅",
              header: false,
            },
          },
          {
            path: "statistic",
            component: ConsoleStatistic,
            name: "ConsoleStatistic",
            meta: {
              title: "数据统计",
              header: false,
            },
          },
        ],
      },
    ],
  },

  //   {
  //     path: "/exam/:examInfoId(\\d+)",
  //     component: Home,
  //     name: "Course",
  //     children: [],
  //   },
];
export default courses;
