<template>
    <a-list :bordered="false" class="answer-info-list" :loading="stuLoading">
        <a-list-item v-for="item in studentList" :key="item.id">
            <a-list-item-meta>
                <template #avatar>
                    <a-avatar shape="square">
                        <img alt="avatar" :src="item.user.picture" />
                    </a-avatar>
                </template>
                <template #title>
                    <h3>{{item.user.username}}</h3>
                </template>
                <template #description>
                    <a-tag color="gray" style="margin:5px">{{ `工号：${item.user.personalId ?? '未认证'}` }}</a-tag>
                    <template v-if="item.actionPage">
                    <a-popover v-for="action of item.actionPage.list">
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
                </template>
            </a-list-item-meta>
            <template #extra>
                <div style="white-space: nowrap">
                    <a-badge :status="getAnswerStatus(item.answerStatus).statusColor"
                        :text="getAnswerStatus(item.answerStatus).statusText"
                        style="width:70px;margin-left: 20px;" />
                    <a-button type="primary" :disabled="item.answerStatus!='START'" style="margin-left: 10px;">
                        交卷
                    </a-button>
                    <a-badge :count="(item.actionPage?.total ?? 0)">
                        <a-button type="primary" :disabled="(item.actionPage == null)" style="margin-left: 10px;"
                            @click="showStudnetLog(item.user)">
                            查看日志
                        </a-button>
                    </a-badge>
                    
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
        stuLog.value.forEach(log=>{
            
        })
        stuLogTotal.value = data.total;
        logLoading.value = false
    })
}

const getAnswerStatus = (status) => {
    let statusText = "未开始"
    let statusColor = "normal"
    const isfinish = dayjs().isAfter(dayjs(props.examInfo?.endTime))
    switch(status){
        case "START":
            statusText = "开始答题"
            statusColor = 'processing'
            break
        case "SUBMIT":
            statusText = '已交卷'
            statusColor = 'success'
    }
    if(isfinish){
        switch(status){
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
watch([() => props.classIds, () => props.currClassId, () => props.answerStatus], () => {
    stuPage.value = 1
    getOutlineUser()
})
</script>
<style lang="less" scoped>
.answer-info-list{
   
}
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