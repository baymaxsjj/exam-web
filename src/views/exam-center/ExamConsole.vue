<template>
    <div class="exam-console">
        <a-page-header @back="$router.back()" :style="{ background: 'var(--color-bg-2)' }"
            :title="pageView[pageIndex].name" :subtitle="examInfo['title']">
        </a-page-header>
        <a-row v-if="pageIndex == 0" align="stretch" class="info-wrap">
            <a-col :lg="6" :sm="12" :xs="24">
                <a-card hoverable title="考试信息" :bordered="false" style="background-color: rgb(var(--blue-1));"
                    class="statistic-card exam-info">
                    <div class="desc">
                        <a-countdown ref="countDownRef" :title="examInfo['title'] ?? 'loading'"
                            :value="getExamProgress.time" @finish="countdownFinish" :start="startTime != null"
                            :now="Date.now()" format="HH:mm:ss" />
                        <a-tag  :color="getExamProgress.color" style="margin-left: 5px;font-weight: bold;">{{ getExamProgress.info }}</a-tag>
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
                            <a-statistic animation title="行为次数" :value="answerLog.total ?? 0">
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


        <a-tabs v-model:active-key="pageIndex">
            <template #extra>
                <a-select v-if="pageIndex == 0"
                    @change="getOutlineUser" 
                    v-model="answerStatus"
                    default-value="ALL" style="width:150px;margin-right: 5px;"
                    placeholder="选择班级">
                    <a-option value="ALL">全部</a-option>
                    <a-option value="NOT_START">未开始</a-option>
                    <a-option value="START">已开始</a-option>
                    <a-option value="SUBMIT">已交卷</a-option>
                </a-select>
                <a-select v-if="pageIndex == 3" default-value="1" style="width:150px;margin-right: 5px;" @change=""
                    placeholder="选择班级">
                    <a-option value="1">全部</a-option>
                    <a-option value="2">未批阅</a-option>
                    <a-option value="3">已批阅</a-option>
                </a-select>
                <a-select v-model="currClassId" style="width:150px;margin-right: 5px;" :default-value="-1"
                    @change="getOutlineUser('ALL')" placeholder="选择班级">
                    <a-option :value="-1">全部班级</a-option>
                    <a-option v-for="item in classList" :value="item.id" :key="item.id">{{ item.name }}</a-option>
                </a-select>
                <a-button type="primary" v-if="pageIndex == 2 || pageIndex == 0" style="margin-right: 5px;">
                    全部收卷
                </a-button>
                <a-button type="primary" v-if="(pageIndex == 2)">
                    重新评阅
                </a-button>
            </template>
            <a-tab-pane :key="index" :title="item.name" v-for="(item, index) in pageView">
            </a-tab-pane>
        </a-tabs>
        <!-- 答题数目/作答情况，应该在考试期间显示，结束后就不显示了 -->
        <a-list :bordered="false" v-if="(pageIndex ==0)" class="answer-info-list">
            <a-list-item v-for="item in studentList" :key="item.id">
                <a-list-item-meta :title="item.user.username">
                    <template #avatar>
                        <a-avatar shape="square">
                            <img alt="avatar"
                                :src="item.user.picture" />
                        </a-avatar>
                    </template>
                </a-list-item-meta>
                <template #actions>
                        <ul class="actions">
                            <li v-for="action of item.actions" :class="action.status.value>50?'red':'green'">
                                <span>{{dayjs(action.createdAt).format("MM-DD HH:mm:ss")}}</span>
                                <span >{{action.status.action}}</span>
                                <span>{{action.info}}</span>
                            </li>
                        </ul>
                </template>
                <template #extra>
                    <a-button shape="round" type="primary">
                        {{getanswerStatus(item.actions)}}
                    </a-button>
                </template>
            </a-list-item>
        </a-list>
    </div>

</template>
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs'
import { getExamInfoDetailRequest, getExamPaperStatisticsRequest } from '../../apis/exam-api';
import { getClassListRequest } from '../../apis/course-api';
import { examAnswerLogRequest ,examExamAnswerInfoRequest} from '../../apis/exam-center-api';
import SocketService from '../../utils/web-stocket-service.js'
const pageIndex = ref(0)
//考试相关
const examInfo = ref({})
const classList = ref([])
let classIds = []
const startTime = ref(null)
const countDownRef = ref(null);
//试卷相关
const paperStatstics = ref({})
const startCountdown = ref(false)

//考试学生
const currClassId=ref(-1);
const answerStatus=ref("ALL")

const studentList = ref([])
const stuPage = ref(1);
const stuTotal = ref(1)
//统计相关
const answerLog = ref({})

const route = useRoute();
const examInfoId = route.params['examInfoId']

const socketServe = SocketService.Instance;
socketServe.connect()
socketServe.registerCallBack('EXAM_CONSOLE_STATISTICS', (data)=>{
    console.log(data)
    answerLog.value.total+=1
    const result=data.data;
    let action;
    const studentId=result.studentId;
    switch(result.status){
        case "START":
            action=answerLog.value['normal']['START']
            if(!action.includes(studentId)){
                action.push(studentId)
            }
            break;
        case 'SUBMIT':
            action=answerLog.value['normal']['SUBMIT']
            if(!action.includes(studentId)){
                action.push(studentId)
            }
            break;
        case 'PAUSE':
        break;
    }

});

const getExamProgress = computed(() => {
    const sysTime = dayjs()
    const endTime = examInfo.value['endTime'];
    const progressInfo={
        info: "进行中",
        status:"progress",
        color:'orange',
        time:dayjs(endTime).valueOf()
    }
    if (dayjs(sysTime).isBefore(startTime.value)) {
            progressInfo.info= "未开始",
            progressInfo.status="start",
            progressInfo.color='cyan',
            progressInfo.time= dayjs(startTime.value).valueOf()
    } else if (dayjs(sysTime).isAfter(endTime)) {
            progressInfo.info='已结束',
            progressInfo.status="end",
            progressInfo.color='magenta',
            progressInfo.time= dayjs(endTime).valueOf()
    }
    return progressInfo
})
const getanswerStatus=(actions)=>{
    let status="未开始"
    return status;
}
const countdownFinish = () => {
    startTime.value = null;
    setTimeout(() => {
        startTime.value = 0
    }, 100);
}

const getExamInfo = () => {
    getExamInfoDetailRequest(examInfoId).then(res => {
        examInfo.value = res.data.data['examInfo']
        classIds = res.data.data['classList']
        startTime.value = examInfo.value['startTime'];
        getExamPaperStatistics(examInfo.value.examId)
        getClassList()
        getOutlineUser()
        startCountdown.value = true
    })
}
const getExamPaperStatistics = (paperId) => {
    getExamPaperStatisticsRequest(paperId).then(res => {
        paperStatstics.value = res.data.data
    })
}
const getClassList = () => {
    getClassListRequest(examInfo.value?.courseId).then(res => {
        classList.value = res.data.data
    })
}
const getAnswerLog = () => {
    examAnswerLogRequest(examInfoId).then(res => {
        answerLog.value = res.data.data
    })
}
const getOutlineUser = () => {
    let claIds = [];
    if (currClassId.value > 0) {
        claIds.push(currClassId.value)
    } else {
        claIds = classIds
    }
    examExamAnswerInfoRequest(examInfoId,claIds,answerStatus.value,stuPage.value).then(res => {
        const data = res.data.data
        studentList.value = data.list;
        stuTotal.value = data.total
    })
}
getExamInfo()
getAnswerLog()

const pageView = [
    {
        name: '考试总览',
        icon: '',
        path: ''
    },
    {
        name: '数据统计',
        icon: '',
        path: ''
    },
    {
        name: '试卷批阅',
        icon: '',
        path: ''
    }
]
</script>
<style lang="less" scoped>
.exam-console {
    margin: 0 20px;

    .info-wrap {
        padding: 10px;
        overflow: hidden;
    }

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
            filter: blur(5px) ;
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
            background-image: url(../../assets/img/console/console_gradient_bg.svg);
        }
    }

    .monitor-info {
        &::before {
            background-image: url(../../assets/img/console/console_gradient_bg4.svg);
        }
    }

    .statistic-info {
        &::before {
            background-image: url(../../assets/img/console/console_gradient_bg3.svg);
        }

    }

    .paper-info {
        &::before {
            background-image: url(../../assets/img/console/console_gradient_bg2.svg);

        }
    }
    .answer-info-list{
        .actions{
            display: flex;
            flex-grow: 1;
            overflow-x: auto;
            li{
                margin: 5px;
                border-radius: 5px;
                color: var(--color-text-1);
                padding: 10px;
                span{
                    display: block;
                    margin: 2px 0;
                }
            }
            .green{
                background-color:rgba( var(--green-1));
                color: rgba( var(--green-6));
            }
            .red{
                background-color:rgba(var(--red-1));
                color: rgba( var(--red-6));
            }
        }
    }
}
</style>