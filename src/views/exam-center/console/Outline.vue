<template>
    <a-table row-key="id" :columns="columns" :data="studentList" :loading="stuLoading"
        :pagination="{ total:stuTotal, current: stuPage }" page-position="bottom" @page-change="pageChange">
        <template #userInfo="{ record }">
            <div class="user-info">
                <a-avatar shape="square" class="avatar">
                    <img alt="avatar" :src="record.user.picture" />
                </a-avatar>
                <div>
                    <h3>{{ record.user.nickname }}</h3>
                    <a-tag color="gray">{{ `工号：${record.user.personalId ?? '未认证'}` }}</a-tag>
                </div>
            </div>
        </template>
        <template #status="{ record }">
            <a-badge :status="getAnswerStatus(record.answerStatus).statusColor"
                :text="getAnswerStatus(record.answerStatus).statusText" style="white-space: nowrap;"/>
        </template>
        <template #actions="{ record }">
            <a-popover v-for="action of record.actionPage.list">
                <a-tag :color="action.status.value > 50 ? 'red' : 'green'" style="margin:5px">{{
                        action.status.action
                }}</a-tag>
                <template #content>
                    <a-tag style="display: block;" color="cyan">时间：{{
                            dayjs(action.createdAt).format("MM-DD HH:mm: ss")
                    }}</a-tag>
                    <a-tag style="display: block;margin-top: 2px;" color="grey" v-if="action.info">IP:{{
                            action.info
                    }}</a-tag>
                </template>
            </a-popover>
        </template>
        <template #operate="{ record }">
            <div class="operate">
                <a-button type="primary" :disabled="record.answerStatus != 'START'" style="margin-left: 10px;">
                交卷
                </a-button>
                <a-badge :count="(record.actionPage?.total ?? 0)">
                    <a-button type="primary" :disabled="(record.actionPage == null)" style="margin-left: 10px;"
                        @click="showStudnetLog(record.user)">
                        查看日志
                    </a-button>
                </a-badge>
            </div>
           
        </template>
    </a-table>
    <a-modal simple v-model:visible="showLog" class="student-log" title="学生答题日志">
        <div class="student-info">
            <a-badge status="processing" :text="'姓名：' + stuInfo.nickname" />
            <a-badge status="normal" :text="`工号：${stuInfo.schoolId ?? '未认证'}`" />
            <a-badge :status="(stuLogTotal > 10 ? 'danger' : 'warning')" :text="`共${stuLogTotal}条日志`" />
        </div>
        <div class="log-timeline">
            <a-timeline>
                <a-spin :loading="logLoading">
                    <a-timeline-item v-for="item of stuLog" :key="item.id"
                        :label="dayjs(item.createdAt).format('YY-MM-DD HH: mm: ss')">
                        {{ item.status.action }}
                        <a-tag v-if="item.info">{{ item.info }}</a-tag>
                    </a-timeline-item>
                </a-spin>
            </a-timeline>
            <APagination v-model:current="stuLogPage" :page-size="5" :total="stuLogTotal" @change="getStudentLog()">
            </APagination>
        </div>
    </a-modal>
</template>
<script setup>
import dayjs from 'dayjs';
import { ref, watch, inject } from 'vue';
import { useRoute } from 'vue-router';
import { examAnswerInfoRequest, examStudentLogRequest } from '../../../apis/exam-center-api';
import { examConsoleInfoKey } from '@/utils/keys.js'
const { currClassId, classIds, answerStatus, examInfo } = inject(examConsoleInfoKey)

const route = useRoute();
const examInfoId = route.params['examInfoId']

const studentList = ref([])
const stuPage = ref(1);
const stuTotal = ref(1)
const showLog = ref(false)
const stuInfo = ref({})
const stuLoading = ref(false)

const stuLog = ref([])
const stuLogPage = ref(1)
const stuLogTotal = ref(1)
const logLoading = ref(true)
const getOutlineUser = () => {
    let claIds = [];
    if (currClassId.value > 0) {
        claIds.push(currClassId.value)
    } else {
        claIds = classIds.value;
    }
    stuLoading.value = true
    examAnswerInfoRequest(examInfoId, claIds, answerStatus.value, stuPage.value).then(res => {
        const data = res.data.data
        studentList.value = data.list;
        stuTotal.value = data.total
        stuLoading.value = false
    })
}
const showStudnetLog = (info) => {
    stuInfo.value = info;
    showLog.value = true;
    stuLogPage.value = 1;
    stuLogTotal.value = 1;
    stuLog.value = []
    getStudentLog()
}
const getStudentLog = () => {
    logLoading.value = true
    examStudentLogRequest(examInfoId, stuInfo.value.id, stuLogPage.value, 5).then(res => {
        const data = res.data.data;
        stuLog.value = data.list;
        stuLog.value.forEach(log => {

        })
        stuLogTotal.value = data.total;
        logLoading.value = false
    })
}
const pageChange = (current) => {
    stuPage.value = current
    getOutlineUser()
}
const getAnswerStatus = (status) => {
    let statusText = "未开始"
    let statusColor = "normal"
    const isfinish = dayjs().isAfter(dayjs(examInfo.value?.endTime))
    switch (status) {
        case "START":
            statusText = "开始答题"
            statusColor = 'processing'
            break
        case "SUBMIT":
            statusText = '已交卷'
            statusColor = 'success'
    }
    if (isfinish) {
        switch (status) {
            case "START":
                //考试结束，没有交卷
                statusText = "未交卷"
                statusColor = 'warning'
                break
            case "NOT_START":
                statusText = "未参加"
                statusColor = 'danger'
                break
        }
    }
    return {
        statusText,
        statusColor
    };
}
if (classIds.value.length != 0) {
    getOutlineUser()
}
watch([() => classIds.value, () => currClassId.value, () => answerStatus.value], () => {
    stuPage.value = 1
    getOutlineUser()
})
const columns = [
    {
        title: '个人信息',
        slotName: 'userInfo'
    },
    {
        title: '考试行为',
        slotName: 'actions'
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
.user-info {
    display: flex;
    align-items: center;

    .avatar {
        margin-right: 10px;
    }
}
.operate{
    display: flex;
}
</style>