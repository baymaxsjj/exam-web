<template>
    <div class="exam-console">
        <a-page-header @back="$router.back()" :style="{ background: 'var(--color-bg-2)' }"
            :title="getTabTitle" :subtitle="examInfo.title??'loading'">
        </a-page-header>
        <HaederOutline :exam-info="examInfo" :class-list="classList"></HaederOutline>
        <a-tabs v-model:active-key="pageKey">
            <template #extra>
                <a-select v-if="pageKey == 'outline'" v-model="answerStatus" default-value="ALL"
                    style="width:150px;margin-right: 5px;" placeholder="选择班级">
                    <a-option value="ALL">全部</a-option>
                    <a-option value="NOT_START">未开始</a-option>
                    <a-option value="START">已开始</a-option>
                    <a-option value="SUBMIT">已交卷</a-option>
                </a-select>
                <a-select v-if="pageKey == 'review'" default-value="1" style="width:150px;margin-right: 5px;"
                    placeholder="选择班级">
                    <a-option value="1">全部</a-option>
                    <a-option value="2">未批阅</a-option>
                    <a-option value="3">已批阅</a-option>
                </a-select>
                <a-select v-model="currClassId" style="width:150px;margin-right: 5px;" :default-value="-1"
                    placeholder="选择班级">
                    <a-option :value="-1">全部班级</a-option>
                    <a-option v-for="item in classList" :value="item.id" :key="item.id">{{ item.name }}</a-option>
                </a-select>
                <a-button type="primary" v-if="pageKey =='outline'" style="margin-right: 5px;">
                    全部收卷
                </a-button>
                <a-button type="primary" v-if="(pageKey == 'review')">
                    重新评阅
                </a-button>
            </template>
            <a-tab-pane :key="item.key" :title="item.name" v-for="(item, index) in pageView">
            </a-tab-pane>
        </a-tabs>
        <div v-show="pageKey=='outline'">
            <Outline  :exam-info="examInfo" :class-ids="classIds" :answer-status="answerStatus" :curr-class-id="currClassId"></Outline>
        </div>
        <!-- 答题数目/作答情况，应该在考试期间显示，结束后就不显示了 -->
    </div>

</template>
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getExamInfoDetailRequest, } from '../../../apis/exam-api';
import { getClassListRequest } from '../../../apis/course-api';

import Outline from './Outline.vue';
import HaederOutline from './HaederOutline.vue';
const pageKey = ref("outline")
//考试相关
const examInfo = ref({})

const classList = ref([])
let classIds = []

//考试学生
const currClassId = ref(-1);
const answerStatus = ref("ALL")

const route = useRoute();
const examInfoId = route.params['examInfoId']

const getExamInfo = () => {
    getExamInfoDetailRequest(examInfoId).then(res => {
        examInfo.value = res.data.data['examInfo']
        classIds = res.data.data['classList']
        getClassList()
    })
}

const getClassList = () => {
    getClassListRequest(examInfo.value?.courseId).then(res => {
        classList.value = res.data.data
    })
}
getExamInfo()
const getTabTitle=computed(()=>{
    for (const page of pageView) {
        if(page.key==pageKey.value){
            return page.name;
        }
    }
    return "loading"
})

const pageView = [
    {
        name: '考试总览',
        key:'outline',
        icon: '',
        path: ''
    },
    {
        name: '数据统计',
        key:'statistic',
        icon: '',
        path: ''
    },
    {
        name: '试卷批阅',
        key:'review',
        icon: '',
        path: ''
    }
]
</script>
<style lang="less" scoped>
.exam-console {
    margin: 20px;
    :deep(.arco-list-item) {
        align-items: center;
    }
}
</style>