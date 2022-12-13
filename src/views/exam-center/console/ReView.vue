<template>
    <a-table row-key="id"  :columns="columns" :data="studentList" :loading="loading" :pagination="{total,current:page}" page-position="bottom" @page-change="pageChange">
        <template #userInfo="{ record }">
            <div class="user-info">
                <a-avatar shape="square" class="avatar">
                    <img alt="avatar" :src="record.user.picture" />
                </a-avatar>
                <div>
                    <h3>{{ record.user.nickname }}</h3>
                    <a-tag color="gray" >{{ `工号：${record.user.personalId ?? '未认证'}` }}</a-tag>
                </div>
            </div>

        </template>
        <template #score="{ record }">
            <div>
                <a-tag  color="green">{{record.score}}</a-tag>
            </div>
        </template>
        <template #status="{ record }">
            <a-badge status="normal" :text="record.reviewType?.action ?? '未参加'" />
        </template>
        <template #correctNumber="{ record }">
            <a-tag color="orange" >{{record.correctNumber}}</a-tag>
        </template>
        <template #totalTime="{ record }">
            <a-tag color="cyan" >{{getTotalTime(record.startTime,record.submitTime)}}</a-tag>
        </template>
        <template #operate="{ record }">
            <a-button type="primary" @click="toReviewPage(record.user.id)" :disabled="record.reviewType?.value == 11 || record.reviewType == null"
                style="margin-left: 10px;">
                查看/批阅
            </a-button>
            <a-button type="primary" :disabled="record.reviewType?.value != 11" style="margin-left: 10px;">
                交卷
            </a-button>
        </template>
    </a-table>
</template>
<script setup>
import { ref, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { examAnswerReviewRequest } from '@/apis/exam-center-api';
import { examConsoleInfoKey } from '@/utils/keys.js'
import  dayjs from 'dayjs'
const { currClassId, classIds, reviewType } = inject(examConsoleInfoKey)
const route = useRoute();
const router=useRouter()
const examInfoId = route.params['examInfoId']
const studentList = ref([])
const loading = ref(true)
const page = ref(1)
const total = ref(1)
const pageChange=(current)=>{
    page.value=current
    console.log(current)
    getReviewList()
}
const getReviewList = () => {
    let claIds = [];
    if (currClassId.value > 0) {
        claIds.push(currClassId.value)
    } else {
        claIds = classIds.value;
    }
    loading.value = true
    examAnswerReviewRequest(examInfoId, claIds, reviewType.value, page.value).then(res => {
        const data = res.data.data;
        studentList.value = data.list;
        total.value = data.total;
        loading.value = false
    })
}
if (classIds.value.length != 0) {
    getReviewList()
}
const toReviewPage=(studentId)=>{
    router.push({
        name:'ExamReview',
        params:{
            studentId
        }
    })
}
const getTotalTime=(startTime,endTime)=>{
    if(startTime&&endTime){
        return dayjs(endTime).diff(startTime,'minute')+" 分钟"
    }
    return "暂无时间"
}
watch([() => classIds.value, () => currClassId.value, () => reviewType.value], () => {
    page.value = 1
    getReviewList()
})
const columns = [
    {
        title: '个人信息',
        slotName: 'userInfo'
    },
    {
        title: '得分',
        dataIndex: 'score',
        slotName: 'score'
    },
    {
        title: '题目对错',
        dataIndex: 'correctNumber',
        slotName: 'correctNumber'

    },
    {
        title: '耗时',
        slotName: 'totalTime'

    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        slotName: 'startTime'

    },
    {
        title: '提交时间',
        dataIndex: 'submitTime',
        slotName: 'submitTime'

    },
    {
        title: '状态',
        slotName: 'status'
    },
    {
        title: '操作',
        slotName: 'operate'
    },
]
</script>
<style lang="less" scoped>
.user-info{
    display: flex;
    align-items: center;
    .avatar{
        margin-right: 10px;
    }
}
</style>