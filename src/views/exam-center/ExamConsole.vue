<template>
    <div class="exam-console">
        <a-page-header @back="$router.back()" :style="{ background: 'var(--color-bg-2)' }" title="考试控制台"
            :subtitle="examInfo.title ?? 'loading'">
        </a-page-header>
        <HaederOutline :exam-info="examInfo" :class-list="classList"></HaederOutline>
        <a-tabs v-model:active-key="pageKey" @change="toView">
            <template #extra>
                <a-select v-if="pageKey == 'ConsoleOutline'" v-model="answerStatus" default-value="ALL"
                    style="width:150px;margin-right: 5px;" placeholder="选择班级">
                    <a-option value="ALL">全部</a-option>
                    <a-option value="NOT_START">未开始</a-option>
                    <a-option value="START">已开始</a-option>
                    <a-option value="SUBMIT">已交卷</a-option>
                </a-select>
                <a-select v-if="pageKey == 'ConsoleReview'" v-model="reviewType" default-value="all"
                    style="width:150px;margin-right: 5px;" placeholder="选择班级">
                    <a-option value="all">全部</a-option>
                    <a-option value="none">未交卷</a-option>
                    <a-option value="robot">未批阅</a-option>
                    <a-option value="teacher">已批阅</a-option>
                </a-select>
                <a-select v-model="currClassId" style="width:150px;margin-right: 5px;" :default-value="-1"
                    placeholder="选择班级">
                    <a-option value="">全部班级</a-option>
                    <a-option v-for="item in classList" :value="item.id" :key="item.id">{{ item.name }}</a-option>
                </a-select>
                <a-button type="primary" v-if="pageKey == 'ConsoleOutline'" style="margin-right: 5px;">
                    全部收卷
                </a-button>
                <a-button type="primary" status="danger" v-if="(pageKey == 'ConsoleReview')" style="margin-right: 5px;">
                    重新评阅
                </a-button>
                <a-button type="primary" v-if="(pageKey == 'ConsoleReview')" @click="exportExecl">
                    导出成绩
                </a-button>
            </template>
            <a-tab-pane :key="item.key" :title="item.name" v-for="(item, index) in pageView">
            </a-tab-pane>
        </a-tabs>
        <router-view></router-view>
        <!-- <div v-if="pageKey=='Outline'">
            <Outline  :exam-info="examInfo" :class-ids="classIds" :answer-status="answerStatus" :curr-class-id="currClassId"></Outline>
        </div>
        <div v-if="pageKey=='review'">
            <ReView  :exam-info="examInfo" :class-ids="classIds" :review-type="reviewType" :curr-class-id="currClassId"></ReView>
        </div> -->
        <!-- 答题数目/作答情况，应该在考试期间显示，结束后就不显示了 -->
    </div>
</template>
<script setup>
import { computed, ref, provide } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getExamInfoDetailRequest } from '@/apis/exam-api';
import { examAnswerReviewExportRequest } from '../../apis/exam-center-api.js';
import HaederOutline from './console/HaederOutline.vue';
import { examConsoleInfoKey } from '@/utils/keys.js'
import { Message } from '@arco-design/web-vue';
const router = useRouter()
const pageKey = ref("Outline")
//考试相关
const examInfo = ref({})

const classList = ref([])
const classIds = computed(() => {
    return classList.value.map(item => item.id)
})


//考试学生
const currClassId = ref("");
const answerStatus = ref("ALL")
const reviewType = ref("all")
const route = useRoute();
const examInfoId = route.params['examInfoId']

const getExamInfo = () => {
    getExamInfoDetailRequest(examInfoId).then(res => {
        examInfo.value = res.data.data['examInfo']
        classList.value = res.data.data['classList']
    })
}

getExamInfo()
const toView = () => {
    router.replace({
        name: pageKey.value
    })
}
//导出文档
const exportExecl = () => {
    const msgId = Message.loading("正在导出成绩，请稍候...")
    examAnswerReviewExportRequest(examInfoId, currClassId.value, reviewType.value).then(res => {
        Message.clear(msgId)
        if (!res.data) {
            return
        }
        var blob = res.data;           // FileReader主要用于将文件内容读入内存
        var reader = new FileReader();
        reader.readAsDataURL(blob);            // onload当读取操作成功完成时调用
        reader.onload = function(e) {             
            var a = document.createElement('a');              // 获取文件名fileName
            var fileName = res.headers["content-disposition"].split("=");
            fileName = fileName[fileName.length - 1];
            fileName = fileName.replace(/"/g, "");
            a.download =decodeURI(fileName);
            a.href = e.target.result;              
            document.body.appendChild(a);
            a.click();             
            document.body.removeChild(a);
        }
    })
}
provide(examConsoleInfoKey, {
    examInfo, classIds, currClassId, answerStatus, reviewType, examInfoId
})

const pageView = [
    {
        name: '考试总览',
        key: 'ConsoleOutline',
        icon: '',
    },
    {
        name: '实时监控',
        key: 'ConsoleMonitor',
        icon: '',
    },
    {
        name: '数据统计',
        key: 'ConsoleStatistic',
        icon: '',
    },
    {
        name: '试卷批阅',
        key: 'ConsoleReview',
        icon: '',
    }
]
const name = route.name;
const isInPageView = pageView.map(view => view.key).includes(name)
if (isInPageView) {
    pageKey.value = name
}
</script>
<style lang="less" scoped>
.exam-console {
    margin: 20px;

    :deep(.arco-list-item) {
        align-items: center;
    }
}
</style>