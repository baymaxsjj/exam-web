<template>
    <div class="my-course">
        <a-tabs v-model:active-key="defaultTag" @change="tagChange">
            <a-tab-pane key="student">
                <template #title>
                    <icon-calendar /> 我学的课
                </template>
            </a-tab-pane>
            <a-tab-pane key="teacher">
                <template #title>
                    <icon-clock-circle /> 我教的课
                </template>
            </a-tab-pane>
        </a-tabs>
        <!-- 操作区 -->
        <div class="course-operation">
            <a-button type="primary" @click="showAddModal(defaultTag=='student'?0:1)" shape="round">{{ defaultTag=='student'?'添加课程':'创建课程' }}</a-button>
            <a-radio-group type="button" @change="statusChange" default-value="0">
                <a-radio value="0">正在学</a-radio>
                <a-radio value="1">已完结</a-radio>
            </a-radio-group>
        </div>
        <!-- 课程列表 -->
        <div class="course-list" v-if="loading">
            <a-row :gutter="[15, 15]" class="course-list">
                <a-col :xs="24" :sm="12" :xl="8" :xxl="6"  v-for="item of 3" :key="item">
                    <a-skeleton class="course-item">
                        <a-space direction="vertical" size="large" style="width:100%">
                            <a-skeleton-shape class="course-picture" style="width:100%"/>
                            <a-skeleton-line :rows="2" />
                        </a-space>
                    </a-skeleton>
                </a-col>
            </a-row>
            
        </div>
        <div v-else-if="courseList.length != 0">
            <a-row :gutter="[15, 15]" class="course-list" :class="{'course-end':isEnd=='1'}">
                <a-col :xs="24" :sm="12" :xl="8" :xxl="6" v-for="item of courseList" :key="item.id"  @click="toCourse(item)">
                    <!-- <router-link :to="'/course/'+item.id"> -->
                        <div  class="course-item">
                        <div class="course-picture">
                            <a-image width="100%" style="object-fit: cover;" height="100%" :src="getImageUrl(item.cover)"  show-loader/>
                            <div class="course-opera" v-if="defaultTag=='teacher'">
                                <span>{{item.status==0?"结课":"开课"}}</span>
                                <span @click.stop="showAddModal(2,item)">修改</span>
                                <span>{{item.isPublic==0?"公开":"隐藏"}}</span>
                            </div>
                            <div class="course-opera" v-else>
                                <span @click.stop="showAddModal(2,item)">退课</span>
                            </div>
                        </div>
                        <div class="course-info">
                            <h3 class="title">{{ item.name }}</h3>
                            <p class="author">{{ item.teacher.nickname }}</p>
                        </div>
                    </div>
                    <!-- </router-link> -->
                </a-col>
            </a-row>
            <a-pagination style="justify-content: center;margin:10px 0"  v-model:current="currPage"  @change="getCourseList"  :total="total" :current="currPage" :page-size="10" />
        </div>
        <a-empty v-else />
        <!-- 邀请码添加课程 -->
        <a-modal simple v-model:visible="addModalVisible" @ok="courseOk" :title="modalTitle">
            <a-form :model="stuAddInfo" v-if="defaultTag=='student'">
                <a-form-item field="name" label="邀请码">
                    <a-input v-model="stuAddInfo.code" placeholder="输入班级邀请码" />
                </a-form-item>
            </a-form>
            <a-form :model="teaAddInfo" v-else>
                <a-form-item field="name" label="课程名称">
                    <a-input v-model="teaAddInfo.name" placeholder="输入课程名称" />
                </a-form-item>
                <a-form-item field="name" label="课程简介">
                    <a-input v-model="teaAddInfo.introduce" placeholder="输入课程简介" />
                </a-form-item>
                <a-form-item field="name" label="课程封面">
                    <a-upload :show-file-list="false" :custom-request="customRequest"  list-type="picture-card">
                        <template #upload-button>
                            <a-avatar class="info-avatar" shape="square">
                                <template #trigger-icon>
                                    <icon-camera />
                                </template>
                                <img style="object-fit: cover;" v-if="teaAddInfo.cover" v-loadImg :src="teaAddInfo.cover" />
                                <icon-plus v-else  style="font-size: 25px;"/>
                            </a-avatar>
                        </template>
                    </a-upload>
                </a-form-item>
                <a-form-item field="name" label="课程公开">
                    <a-radio-group type="button" v-model:model-value="teaAddInfo.isPublic" default-value="0">
                        <a-radio value="0">隐藏</a-radio>
                        <a-radio value="1">公开</a-radio>
                    </a-radio-group>
                </a-form-item>
                <a-form-item field="name" label="课程状态" v-if="modalType!=1">
                    <a-radio-group type="button" v-model:model-value="teaAddInfo.status"  default-value="0">
                        <a-radio value="0">开课</a-radio>
                        <a-radio value="1">结课</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { courseListRequest,stuAddCourseRequest,teaCreateCourseRequest } from '@/apis/course-api.js'
import useCourseStore from '../../sotre/course-store';
import {uploadCourseCover} from '../../apis/file-api'
import {imageUploadHandle,getImageUrl} from '../../utils/image'
const route = useRoute()
const router = useRouter()
const courseStore=useCourseStore()


const modalTitle=ref('');
//0 加入、1：创建、2：修改
const modalType=ref(0);
const addModalVisible = ref(false)
const stuAddInfo = reactive({
    code: ""
})
const teaAddInfoState={
        cover:"",
        id:0,
        introduce:"",
        isPublic:"0",
        name:"",
        status:"0"
}
const teaAddInfo = reactive({...teaAddInfoState})
//选择标签
const defaultTag = ref(route.params.role)
// 是否结课
const isEnd = ref(0)
const currPage = ref(1)
const total = ref(0)
const loading = ref(false)
//课程列表
const courseList = ref([])
// 确定角色内容
const checkRole = () => {
    switch (defaultTag.value) {
        case 'teacher':
            defaultTag.value = 'teacher'
            break;
        case 'student':
        default:
            defaultTag.value = 'student'
    }
}
const customRequest = (options) => {
    return imageUploadHandle(options,uploadCourseCover,(res)=>{
      teaAddInfo.cover=res.data.data;
    })
};
//标签改变
const tagChange = () => {
    checkRole();
    router.push({
        name: "MyCourse",
        params: {
            role: defaultTag.value
        }
    })
    getCourseList()
    console.log(defaultTag.value)
}
//筛选改变
const statusChange = (value) => {
    isEnd.value = value;
    getCourseList();
}
const showAddModal = (type,data) => {
    //重置状态
    if(type==0){
        modalTitle.value="添加课程"
        modalType.value=0
        stuAddInfo.code=""
    }else if(type==1){
        modalTitle.value="创建课程"
        modalType.value=1
        Object.assign(teaAddInfo,teaAddInfoState)
    }else{
        modalTitle.value="修改课程"
        modalType.value=2
        Object.assign(teaAddInfo,data)
    }
    addModalVisible.value = !addModalVisible.value

}
const getCourseList = () => {
    loading.value = true
    courseListRequest(defaultTag.value, currPage.value, isEnd.value)
        .then(({ data }) => {
            console.log(data)
            const result=data.data;
            courseList.value =result.list
            currPage.value = result.current
            total.value = result.total
            loading.value = false
        }).catch(err => {
            loading.value = false
        })
}
const courseOk=()=>{
    if(modalType.value==0){
        stuAddCourseRequest(stuAddInfo.code).then(()=>{
            getCourseList()
        })
        return
    }else if(modalType.value==1){
        delete teaAddInfo.id
    }
    teaCreateCourseRequest(teaAddInfo).then(()=>{
        getCourseList()
    })
}
const toCourse=(data)=>{
    courseStore.courseInfo=data
    router.push({
        name:'Classroom',
        params:{
            courseId:data.id
        }
    })
}
checkRole()
getCourseList()

</script>
<style lang="less">
.my-course {

    .course-operation {
        display: flex;
        justify-content: space-between;
        padding-bottom: 20px;
    }

    .course-list {
        .course-item {
            border-radius: 6px;
            overflow: hidden;
            cursor: pointer;
            box-sizing: border-box;
            border: 1px solid var(--color-border-2);
            transition: all .3s;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
            .course-picture{
                img{
                    transition: all .3s;
                    width: 100%;
                    height: 100%;
                    aspect-ratio: 2 / 1; 
                }
            }
            &:hover {
                box-shadow:0 0 20px rgba(0, 0, 0, 0.1);
                .course-picture {
                    .course-opera {
                        height: 100%;
                    }
                    img{
                        transform: scale(1.05);
                        filter: blur(2px);
                    }
                }

            }

            .course-picture {
                height: 160px;
                position: relative;
                .course-opera {
                    position: absolute;
                    top: 0px;
                    right: 0px;
                    height: 0;
                    left: 0;
                    bottom: 0;
                    overflow: hidden;
                    transition: height .3s;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    span{
                        font-size: 14px;
                        display: inline-block;
                        height: 50px;
                        width: 50px;
                        text-align: center;
                        line-height: 50px;
                        border-radius: 30px;
                        color: var(--color-text-1);
                        background-color: var(--color-bg-1);
                        font-weight: bold;
                        margin: 0 5px;
                        &:hover{
                            background-color: var(--color-fill-2);
                        }
                    }
                }
            }
            .course-info{
                padding: 10px;
                .title {
                    margin: 10px 0;
                    color: var(--color-text-1);
                }

                .author {
                    color: var(--color-text-2);
                }
            }

           
        }
    }
    .course-end{
        .course-item{
            filter: grayscale(1);
        }
    }
}
.info-avatar{
        height:100px;
        width:150px;
        .arco-avatar-text{
            overflow: hidden;
            border-radius: var(--border-radius-medium);
            width: 100%;
            height: 100%;
            position: relative;
            text-align: center;
            line-height: 100%;
            transform:none!important;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        img{
            width: 100%;
            height: 100%;
        }
    }
</style>