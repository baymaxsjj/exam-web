<template>
    <a-row align="stretch" class="header-outline">
            <a-col :lg="6" :sm="12" :xs="24">
                <a-card hoverable title="考试信息" :bordered="false" style="background-color: rgb(var(--blue-1));"
                    class="statistic-card exam-info">
                    <div class="desc">
                        <a-countdown ref="countDownRef" :title="examInfo['title'] ?? 'loading'"
                            :value="getExamProgress.time" @finish="countdownFinish" :start="startTime != null"
                            :now="Date.now()" format="HH:mm:ss" />
                        <a-tag :color="getExamProgress.color" style="margin-left: 5px;font-weight: bold;">{{
                                getExamProgress.info
                        }}</a-tag>
                        <a-typography-paragraph style="margin-top: 8px;">
                            <span>开始时间：{{ examInfo['startTime'] }}</span><br />
                        </a-typography-paragraph>
                        <a-typography-paragraph>
                            <span>结束时间：{{ examInfo['endTime'] }}</span>
                        </a-typography-paragraph>
                    </div>
                    <div class="chart">
                    </div>
                </a-card>
            </a-col>
            <a-col :lg="6" :sm="12" :xs="24">
                <a-card hoverable title="试卷信息" :bordered="false" style="background-color:rgb(var(--orange-1));"
                    class="statistic-card paper-info">
                    <a-row class="desc">
                        <a-col :span="12">
                            <a-statistic animation :title="(paperStatstics?.examPaper?.title) ?? 'loading'"
                                :value="paperStatstics?.questionCount ?? 0">
                                <template #suffix>
                                    题
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="试卷总分" :value="paperStatstics['totalScore'] ?? 0">
                                <template #suffix>
                                    分
                                </template>
                            </a-statistic>
                        </a-col>
                        <a-col :span="12">
                            <div class="chart">
                                <a-typography-paragraph v-for="(item, key) of paperStatstics?.questionStatistics">
                                    <a-tag color="cyan">{{ key }}：{{ item }}</a-tag>
                                </a-typography-paragraph>
                            </div>
                        </a-col>
                    </a-row>

                </a-card>
            </a-col>
            <a-col :lg="6" :sm="12" :xs="24">
                <a-card hoverable title="考试统计" :bordered="false" style="background-color:rgb(var(--green-1));"
                    class="statistic-card statistic-info">
                    <a-row class="desc">
                        <a-col :span="12">
                            <a-statistic animation title="考试人数" :value="stuTotal">
                                <template #suffix>
                                    人
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="班级个数" :value="classList.length">
                                <template #suffix>
                                    个班级
                                </template>
                            </a-statistic>
                        </a-col>
                        <a-col :span="12">
                            <div class="chart">
                                <a-statistic animation title="交卷人数" :value="(answerLog?.normal?.SUBMIT?.length) ?? 0">
                                    <template #suffix>
                                        人
                                    </template>
                                </a-statistic>
                                <br />
                                <a-statistic animation title="答题人数" :value="(answerLog?.normal?.START?.length) ?? 0">
                                    <template #suffix>
                                        人
                                    </template>
                                </a-statistic>
                            </div>
                        </a-col>
                    </a-row>

                </a-card>
            </a-col>
            <a-col :lg="6" :sm="12" :xs="24">
                <a-card hoverable title="考试监控" :bordered="false" style="background-color:rgb(var(--red-1));"
                    class="statistic-card monitor-info">
                    <a-row class="desc">
                        <a-col :span="12">
                            <a-statistic animation title="行为次数" :value="answerLog.abnormalCount ?? 0">
                                <template #suffix>
                                    次数
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="复制次数" :value="(answerLog?.abnormal?.PASTE) ?? 0">
                                <template #suffix>
                                    次
                                </template>
                            </a-statistic>
                        </a-col>
                        <a-col :span="12">
                            <div class="chart">
                                <a-statistic animation title="后台次数" :value="(answerLog?.abnormal?.PAUSE) ?? 0">
                                    <template #suffix>
                                        次
                                    </template>
                                </a-statistic>
                                <br />
                                <a-statistic animation title="IP异常" :value="0">
                                    <template #suffix>
                                        人
                                    </template>
                                </a-statistic>
                            </div>
                        </a-col>
                    </a-row>

                </a-card>
            </a-col>
        </a-row>
</template>
<script setup>
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs'
import { getExamPaperStatisticsRequest } from '../../../apis/exam-api';
import { examAnswerLogRequest } from '../../../apis/exam-center-api';
import SocketService from '../../../utils/web-stocket-service.js'

const props=defineProps({
    examInfo:Object,
    classList:Array,
})


const route = useRoute();
const examInfoId = route.params['examInfoId']

const startTime = ref(null)
const countDownRef = ref(null);
//试卷相关
const paperStatstics = ref({})
//统计相关
const answerLog = ref({})
const stuTotal=ref(0)

const socketServe = SocketService.Instance;
socketServe.connect()
socketServe.registerCallBack('EXAM_CONSOLE_STATISTICS', (data) => {
    console.log(data)
    answerLog.value.total += 1
    const result = data.data;
    let action;
    const studentId = result.studentId;
    switch (result.status) {
        case "START":
            action = answerLog.value['normal']['START']
            if (!action.includes(studentId)) {
                action.push(studentId)
            }
            break;
        case 'SUBMIT':
            action = answerLog.value['normal']['SUBMIT']
            if (!action.includes(studentId)) {
                action.push(studentId)
            }
            break;
        case 'PAUSE':
            break;
    }

});

const getExamPaperStatistics = (paperId) => {
    getExamPaperStatisticsRequest(paperId).then(res => {
        paperStatstics.value = res.data.data
    })
}
const getAnswerLog = () => {
    examAnswerLogRequest(examInfoId).then(res => {
        answerLog.value = res.data.data
    })
}

const getExamProgress = computed(() => {
    const sysTime = dayjs()
    const endTime = props.examInfo['endTime'];
    const progressInfo = {
        info: "进行中",
        status: "progress",
        color: 'orange',
        time: dayjs(endTime).valueOf()
    }
    if (dayjs(sysTime).isBefore(startTime.value)) {
        progressInfo.info = "未开始",
            progressInfo.status = "start",
            progressInfo.color = 'cyan',
            progressInfo.time = dayjs(startTime.value).valueOf()
    } else if (dayjs(sysTime).isAfter(endTime)) {
        progressInfo.info = '已结束',
            progressInfo.status = "end",
            progressInfo.color = 'magenta',
            progressInfo.time = dayjs(endTime).valueOf()
    }
    return progressInfo
})


const countdownFinish = () => {
    startTime.value = null;
    setTimeout(() => {
        startTime.value = 0
    }, 100);
}
getAnswerLog()
watch(()=>props.examInfo,(examInfo)=>{
    getExamPaperStatistics(examInfo.examId)
    startTime.value = examInfo.startTime;
})
</script>
<style lang="less" scoped>
.header-outline{
    padding: 10px;
    overflow: hidden;
    .statistic-card {
        margin: 5px;
        height: 100%;
        background-position: center;
        background-size: cover;
        background-repeat: no-repeat;
        height: 220px;

        :deep(.arco-card-body) {
            position: absolute;
            z-index: 10;
            width: 100%;

        }

        :deep(.arco-card-header) {
            z-index: 10;

            .arco-card-header-title {
                color: var(--color-text-2);
                font-weight: bold;
            }
        }

        :deep(.arco-statistic-title) {
            opacity: 0.8;
            font-weight: bold;
        }

        &:hover {
            &::before {
                filter: blur(2px);
                transform: scale(1.04);
                color: var(--color-text-1);
            }
        }

        &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-position: center;
            background-size: cover;
            background-repeat: no-repeat;
            filter: blur(5px);
            background-color: #fff;
            transition: all .5s;
        }

        // 增加对比度
        &::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(255, 255, 255, .5);
            z-index: 5;
        }
    }

    .exam-info {
        &::before {
            background-image: url(@/assets/img/console/console_gradient_bg.svg);
        }
    }

    .monitor-info {
        &::before {
            background-image: url(@/assets/img/console/console_gradient_bg4.svg);
        }
    }

    .statistic-info {
        &::before {
            background-image: url(@/assets/img/console/console_gradient_bg3.svg);
        }

    }

    .paper-info {
        &::before {
            background-image: url(@/assets/img/console/console_gradient_bg2.svg);

        }
    }
}
</style>