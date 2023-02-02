const Home=()=>import("../views/home/Index.vue")
const Question=()=>import("../views/course/Question.vue")
const MyClasses=()=>import("../views/course/MyClasses.vue")
const Classroom=()=>import("../views/course/Classroom.vue")
const ClassUser=()=>import("../views/course/ClassUser.vue")
const BatchImportQuestion=()=>import("../views/course/BatchImportQuestion.vue")

const ExamPaper=()=>import("../views/exam/ExamPaper.vue")
const ExamPaperManger=()=>import("../views/exam/ExamPaperManger.vue")
const ExamPaperPreView=()=>import("../views/exam/ExamPaperPreView.vue")

const ExamManage=()=>import("../views/exam/ExamManage.vue")
const courses = [
    {
        path: '/course/:courseId(\\d+)',
        component: Home,
        name:'Course',
        children: [
            {
                path:"classroom",
                component:Classroom,
                name:'Classroom',
                meta:{
                    title:'课堂'
                }
            },
            {
                path:"exam/manage",
                component:ExamManage,
                name:'ExamManage',
                meta:{
                    title:'考试中心'
                }
            },
            {
                path:"exam/paper/:examId(\\d+)?",
                component:ExamPaper,
                name:'ExamPaper',
                meta:{
                    title:'创建试卷'
                }
            },
            {
                path:"exam/paper/preview/:examId(\\d+)",
                component:ExamPaperPreView,
                name:'ExamPaperPreView',
                meta:{
                    title:'试卷预览'
                }
            },
            {
                path:"exam/paper/manage",
                component:ExamPaperManger,
                name:'ExamPaperManger',
                meta:{
                    title:'试卷管理'
                }
            },
            {
                path:"question",
                component:Question,
                name:'Question',
                meta:{
                    title:'课程题库'
                }
            },
            {
                path:"question/batch-import",
                component:BatchImportQuestion,
                name:'BatchImportQuestion',
                meta:{
                    title:'批量导入题库'
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