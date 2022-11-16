<template>
    <div class="exam-console">
        <a-page-header @back="$router.back()" :style="{ background: 'var(--color-bg-2)' }"
            :title="pageView[pageIndex].name" :subtitle="examInfo['title']">
        </a-page-header>
        <a-row v-if="pageIndex == 0" align="stretch">
            <a-col :span="6">
                <a-card hoverable title="考试信息" :bordered="false" style="background-color: rgb(var(--blue-1));" class="statistic-card">
                    <div class="desc">
                        <a-countdown ref="countDownRef" :title="examInfo['title']" 
                            :value="getExamProgress.time"
                            @finish="countdownFinish"
                            :start="startTime!=null"
                            :now="Date.now()" format="HH:mm:ss"/>
                        <a-typography-text style="margin-left: 5px;">
                            {{ getExamProgress.info }}
                        </a-typography-text>
                        <a-typography-paragraph>
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
            <a-col :span="6">
                <a-card hoverable title="试卷信息" :bordered="false" style="background-color:rgb(var(--orange-1));" class="statistic-card">
                    <a-row class="desc">
                       <a-col :span="12">
                            <a-statistic animation :title="paperStatstics?.examPaper?.title" :value="paperStatstics?.questionCount">
                                <template #suffix>
                                    题
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="试卷总分" :value="paperStatstics['totalScore']">
                                <template #suffix>
                                    分
                                </template>
                            </a-statistic>
                       </a-col>
                       <a-col :span="12">
                        <div class="chart">
                            <a-typography-paragraph v-for="(item,key) of paperStatstics?.questionStatistics">
                                <a-tag color="cyan">{{key}}：{{item}}</a-tag>
                            </a-typography-paragraph>
                        </div>
                       </a-col>
                    </a-row>
                    
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card hoverable title="统计信息" :bordered="false" style="background-color:rgb(var(--green-1));" class="statistic-card">
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
                            <a-statistic animation title="交卷人数" :value="paperStatstics?.questionCount">
                                <template #suffix>
                                    人
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="答题人数" :value="paperStatstics['totalScore']">
                                <template #suffix>
                                    人
                                </template>
                            </a-statistic>
                        </div>
                       </a-col>
                    </a-row>
                    
                </a-card>
            </a-col>
            <a-col :span="6">
                <a-card hoverable title="考试监控" :bordered="false" style="background-color:rgb(var(--red-1));" class="statistic-card">
                    <a-row class="desc">
                       <a-col :span="12">
                            <a-statistic animation title="行为次数" :value="stuTotal">
                                <template #suffix>
                                    次数
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="复制次数" :value="classList.length">
                                <template #suffix>
                                    个班级
                                </template>
                            </a-statistic>
                       </a-col>
                       <a-col :span="12">
                        <div class="chart">
                            <a-statistic animation title="后台次数" :value="paperStatstics?.questionCount">
                                <template #suffix>
                                    人
                                </template>
                            </a-statistic>
                            <br />
                            <a-statistic animation title="答题人数" :value="paperStatstics['totalScore']">
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
            <a-tab-pane :key="index" :title="item.name" v-for="(item, index) in pageView">

            </a-tab-pane>
        </a-tabs>
    </div>

</template>
<script setup>
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs'
import { getExamInfoDetailRequest, getExamPaperStatisticsRequest } from '../../apis/exam-api';
import { getBatchClassUsersRequest } from '../../apis/course-api';

const pageIndex = ref(0)
//考试相关
const examInfo = ref({})
const classList = ref([])
const startTime=ref(null)
const countDownRef = ref(null);
//试卷相关
const paperStatstics = ref({})
const startCountdown=ref(false)

//考试学生
const studentList=ref([])
const stuPage=ref(1);
const stuTotal=ref(1)

const route = useRoute();
const examInfoId = route.params['examInfoId']

const getExamProgress = computed(() => {
    const sysTime = dayjs()
    const endTime=examInfo.value['endTime'];
    if (dayjs(sysTime).isBefore(startTime.value)) {
        return {
            info:"未开始",
            time:dayjs(startTime.value).valueOf()
        }
    } else if (dayjs(sysTime).isAfter(endTime)) {
        return {
            info:'已结束',
            time:dayjs(endTime).valueOf()
        }
    } else {
        return {
            info:'进行中',
            time:dayjs(endTime).valueOf()
        }
    }
})
const countdownFinish=()=>{
    startTime.value=null;
    setTimeout(() => {
        startTime.value=0
    }, 100);
}

const getExamInfo = () => {
    getExamInfoDetailRequest(examInfoId).then(res => {
        examInfo.value = res.data.data['examInfo']
        classList.value = res.data.data['classList']
        startTime.value=examInfo.value['startTime'];
        getExamPaperStatistics(examInfo.value.examId)
        getExamUser()
        startCountdown.value=true
    })
}
const getExamPaperStatistics = (paperId) => {
    getExamPaperStatisticsRequest(paperId).then(res => {
        paperStatstics.value = res.data.data
    })
}
const getExamUser=(classId)=>{
    let calssIds;
    if(classId){
        classId=[classId]
    }else{
        calssIds=classList.value
    }
    getBatchClassUsersRequest(calssIds,stuPage.value).then(res=>{
        const data=res.data.data
        studentList.value=data.record;
        stuTotal.value=data.total
    })
}
getExamInfo()
const pageView = [
    {
        name: '考试总览',
        icon: '',
        path: ''
    },
    {
        name: '考试监控',
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
<style lang="less">
.exam-console {
    margin: 0 20px;
    .statistic-card{
        margin: 5px;
        height: 100%;
    }
}
</style>