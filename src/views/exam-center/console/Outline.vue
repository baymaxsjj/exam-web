<template>
    <a-list :bordered="false" class="answer-info-list" :loading="stuLoading">
        <a-list-item v-for="item in studentList" :key="item.id">
            <a-list-item-meta :title="item.user.username">
                <template #avatar>
                    <a-avatar shape="square">
                        <img alt="avatar" :src="item.user.picture" />
                    </a-avatar>
                </template>
                <template #description>
                    <a-tag color="gray">{{ `工号：${item.user.personalId ?? '未认证'}` }}</a-tag>
                </template>
            </a-list-item-meta>
            <template #actions>
                <template v-if="item.actionPage">
                    <a-popover v-for="action of item.actionPage.list">
                        <a-tag :color="action.status.value > 50 ? 'red' : 'green'" style="margin:0 5px">{{
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

            </template>
            <template #extra>
                <div style="white-space: nowrap">
                    <a-badge :count="(item.actionPage?.total ?? 0)">
                        <a-button type="primary" :disabled="(item.actionPage == null)" style="margin-left: 10px;"
                            @click="showStudnetLog(item.user)">
                            查看日志
                        </a-button>
                    </a-badge>
                    <a-badge :status="getanswerStatus(item.actionPage?.list).statusColor"
                        :text="getanswerStatus(item.actionPage?.list).statusText"
                        style="width:80px;margin-left: 20px;" />
                </div>
            </template>
        </a-list-item>
    </a-list>
    <APagination style="display:flex;justify-content: center;" v-model:current="stuPage" :total="stuTotal"
        @change="getOutlineUser()"></APagination>
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
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { examExamAnswerInfoRequest, examExamStudentLogRequest } from '../../../apis/exam-center-api';

const route = useRoute();
const examInfoId = route.params['examInfoId']

const props = defineProps({
    classIds: Array,
    currClassId: Number,
    answerStatus: String,
    examInfo: Object,
})

const studentList = ref([])
const stuPage = ref(1);
const stuTotal = ref(1)
const showLog = ref(false)
const stuInfo = ref({})
const stuLoading = ref(false)

const stuLog = ref([])
const stuLogPage = ref(1)
const stuLogTotal = ref(1)
const logLoading = ref(false)
const getOutlineUser = () => {
    let claIds = [];
    if (props.currClassId > 0) {
        claIds.push(props.currClassId)
    } else {
        claIds = props.classIds;
    }
    stuLoading.value = true
    examExamAnswerInfoRequest(examInfoId, claIds, props.answerStatus, stuPage.value).then(res => {
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
    examExamStudentLogRequest(examInfoId, stuInfo.value.id, stuLogPage.value, 5).then(res => {
        const data = res.data.data;
        stuLog.value = data.list;
        stuLogTotal.value = data.total;
        logLoading.value = false
    })
}

const getanswerStatus = (actions) => {
    let statusText = "未开始"
    let statusColor = "normal"
    const isfinish = dayjs().isAfter(dayjs(props.examInfo?.endTime))
    if (actions) {
        statusText = "开始答题"
        statusColor = 'processing'
        let isSubmit = false;
        for (const item of actions) {
            if (item.status.value == 12) {
                isSubmit = true
            }
        }
        if (isSubmit) {
            statusText = '已交卷'
            statusColor = 'success'
        } else if (isfinish) {
            //考试结束，没有交卷
            statusText = "未交卷"
            statusColor = 'warning'
        }

    } else if (isfinish) {
        //考试结束，没有行为，
        statusText = "未参加"
        statusColor = 'danger'
    }
    return {
        statusText,
        statusColor
    };
}
watch([() => props.classIds, () => props.currClassId, () => props.answerStatus], () => {
    stuPage.value = 1
    getOutlineUser()
})
</script>
<style lang="less" scoped>
.student-log {
    position: relative;

    .student-info {
        position: absolute;
        right: 0px;
        top: 0px;
        z-index: 80;

        span {
            display: block;
            margin: 5px 0;
        }

        .avatar {
            margin-right: 20px;
        }
    }
}
</style>