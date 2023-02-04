const SettingIndex=()=>import("../views/user/Index.vue")
const Home=()=>import("../views/home/Index.vue")
const users = [
    {
        path: '/user',
        component: Home,
        name:'User',
        children: [
            {
                path:"setting",
                component:SettingIndex,
                name:'SettingIndex',
                meta:{
                    title:'个人信息'
                }
            },
        ]
    },
]
export default users;