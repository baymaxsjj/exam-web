<template>
    <a-table row-key="id" :columns="columns" :data="studentList" :loading="loading" :pagination="{ total, current: page }"
        page-position="bottom" @page-change="pageChange">
        <template #userInfo="{ record }">
            <div class="user-info">
                <a-avatar shape="square" class="avatar">
                    <img alt="avatar" :src="record.userAuthInfo.picture" />
                </a-avatar>
                <div>
                    <h3 style="text-overflow: ellipsis;white-space: nowrap;max-width: 120px;overflow: hidden;">{{
                            record.userAuthInfo.nickname
                    }}</h3>
                    <a-tag style="font-weight:bold" color="gray">{{
                            record.userAuthInfo.realName ?? '未认证'
                    }}</a-tag>
                </div>
            </div>
        </template>
        <template #time="{ record }">
            <div class="time">
                <a-tag>{{ record.startTime ?? '未开始' }}</a-tag>
                <a-tag>{{ record.submitTime ?? '未提交' }}</a-tag>
            </div>
        </template>
        <template #authInfo="{ record }">
            <a-trigger>
                <div class="authInfo">
                    <a-tag color="orangered">{{
                        record.userAuthInfo.jobNo ?? '信息未认证'
                    }}</a-tag>
                    <a-tag color="blue" v-if="record.userAuthInfo.schoolName">{{
                        record.userAuthInfo.schoolName
                    }}</a-tag>
                </div>
                <template #content>
                    <AuthCard :userAuthInfo="record.userAuthInfo">
                        <template #notCertified>
                            <h1 style="color:var(--color-white)">学生未认证！</h1>
                        </template>
                    </AuthCard>
                </template>
            </a-trigger>

        </template>
        <template #score="{ record }">
            <div>
                <a-tag color="green">{{ record.score }}</a-tag>
            </div>
        </template>
        <template #status="{ record }">
            <a-badge status="normal" :text="record.answerStatus?.action ?? '未参加'" />
        </template>
        <template #correctNumber="{ record }">
            <a-tag color="orange">{{ record.correctNumber }}</a-tag>
        </template>
        <template #totalTime="{ record }">
            <a-tag color="cyan">{{ getTotalTime(record.startTime, record.submitTime) }}</a-tag>
        </template>
        <template #reviewStatus="{record}">
            <a-tag>{{record.reviewCount}}/{{record.reviewTotal}}</a-tag>
        </template>
        <template #operate="{ record }">
            <div class="operate">
                <a-button type="primary" @click="toReviewPage(record.userAuthInfo.userId)"
                    :disabled="record.answerStatus?.value == 11 || record.answerStatus == null"
                    style="margin-left: 10px;">
                    查看/批阅
                </a-button>
                <a-button type="primary" :disabled="record.answerStatus?.value != 11" style="margin-left: 10px;">
                    交卷
                </a-button>
            </div>
        </template>
    </a-table>
</template>
<script setup>
import { ref, watch, inject } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { examAnswerReviewRequest } from '@/apis/exam-center-api';
import { examConsoleInfoKey } from '@/utils/keys.js'
import dayjs from 'dayjs'
import AuthCard from '../../../components/auth/AuthCard.vue';

const { currClassId, classIds, reviewType } = inject(examConsoleInfoKey)
const route = useRoute();
const router = useRouter()
const examInfoId = route.params['examInfoId']
const studentList = ref([])
const loading = ref(true)
const page = ref(1)
const total = ref(1)
const pageChange = (current) => {
    page.value = current
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
const toReviewPage = (studentId) => {
    router.push({
        name: 'ExamReview',
        params: {
            studentId
        }
    })
}
const getTotalTime = (startTime, endTime) => {
    if (startTime && endTime) {
        return dayjs(endTime).diff(startTime, 'minute') + " 分钟"
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
        slotName: 'userInfo',
        width: 200,
    },
    {
        title: '认证信息',
        slotName: 'authInfo',
        width: 150,
    },
    {
        title: '得分',
        dataIndex: 'score',
        slotName: 'score',
    },
    {
        title: '题目对错',
        dataIndex: 'correctNumber',
        slotName: 'correctNumber',

    },
    {
        title: '耗时',
        slotName: 'totalTime',

    },
    {
        title: '作答时间',
        dataIndex: 'time',
        slotName: 'time',

    },
    {
        title: '批阅题数',
        slotName: 'reviewStatus',
        width: 100,
    },
    {
        title: '状态',
        slotName: 'status',
        width: 100,
    },
    {
        width: 200,
        title: '操作',
        slotName: 'operate'
    },
]
</script>
<style lang="less" scoped>
.user-info {
    display: flex;
    align-items: center;

    .avatar {
        margin-right: 10px;
    }
}

.operate {
    display: flex;
}

.authInfo {
    display: flex;
    flex-direction: column;

    span {
        margin: 4px;
        justify-content: center;
        font-weight: bold;
    }
}

.time {
    display: flex;
    flex-direction: column;

    // align-items: center;
    span {
        margin: 4px 0;
        justify-content: center;
    }
}
</style>