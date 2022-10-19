const Home=()=>import("../views/home/Index.vue")
const Question=()=>import("../views/course/Question.vue")
const MyClasses=()=>import("../views/course/MyClasses.vue")
const ClassUser=()=>import("../views/course/ClassUser.vue")
const courses = [
    {
        path: '/course/:courseId(\\d+)',
        component: Home,
        name:'Course',
        children: [
            {
                path:"question",
                component:Question,
                name:'Question',
                meta:{
                    title:'课程题库'
                }
            },
            {
                path:"classes",
                component:MyClasses,
                name:'MyClasses',
                meta:{
                    title:'我的班级'
                }
            },
            {
                path:"class/:classId(\\d+)/users",
                component:ClassUser,
                name:'ClassUser',
                meta:{
                    title:'班级用户'
                }
            },
        ]
    },
]
export default courses;