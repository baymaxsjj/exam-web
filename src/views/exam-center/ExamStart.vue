<template>
    <div class="exam-header">
        <a-button type="primary" class="exam-preview">整卷预览</a-button>
        <p class="exam-title">考试</p>
    </div>
    <div class="exam-start">
        <div class="exam-info">
            <h1 class="exam-name common-style">{{ examInfo.title }}</h1>
            <p class="exam-count-down common-style">
                <icon-history style="font-size: 25px;margin-right: 10px;" /><span>{{ time }}</span>
            </p>
            <div class="common-style">
                <p class="user-name">姓名：{{ userStore.userInfo.username }}</p>
                <p class="school-number">学号</p>
                <p class="school-name">学校</p>
            </div>
            <div class="common-style">
                <p class="question-count">题目数量：{{ questionList.length }}</p>
                <p class="exam-stat-time">开始时间：{{ examInfo.startTime }}</p>
                <p class="exam-end-time">结束时间：{{ examInfo.endTime }}</p>
            </div>
        </div>
        <div class="exam-list">
            <div v-if="!isPreview">
                <div style="display:flex;justify-content: space-around;">
                   <a-button-group>
                    <a-button long :disabled="currQuestIndex == 0" @click="switchQuestion(currQuestIndex - 1)">上一题
                        <template #icon>
                            <icon-left />
                        </template>
                    </a-button>
                    <a-button class="nextquestBtn" long type="primary" :disabled="currQuestIndex == questionList.length - 1"
                        @click="switchQuestion(currQuestIndex + 1)">
                        <template #icon>
                            <icon-right />
                        </template>
                        下一题</a-button>
                   </a-button-group>
                </div>
                <a-spin dot :loading="loading" v-if="questionList.length != 0" style="width: 100%;min-height: 200px;">
                    <BaseQuestionPreview @editorBlur="submitAnswer(currQuestIndex)" @choiceCorrect="choiceCorrect(currQuestIndex,$event)" mode="answer" @optionClick="saveAnswer" :show-area="false" :number="currQuestIndex + 1" :topic-type="questionList[currQuestIndex]['type']"
                        :question="questionList[currQuestIndex]" :options="questionList[currQuestIndex]['option']">
                        <template #question="{question,options,type}" >
                            <!-- {{question}} -->
                            <Transition name="fade">
                                <span class="sub-info" v-if="question['subInfo']!=undefined">{{showSubInfo(question['subInfo'],options.length,type)}}</span>
                            </Transition>
                        </template>
                    </BaseQuestionPreview>

                </a-spin>
                <a-empty v-else></a-empty>
            </div>
        </div>
        <div class="exam-number">
            <div v-for="(item, key) of questionInfo" :key="key" class="common-style">
                <h5>{{ getQuestionType(key).simpleName }}</h5>
                <ul class="number-wrap">
                    <li class="number-item" @click="switchQuestion(getNumber(key, index) - 1)"
                        :class="{ 'number-active': (currQuestIndex + 1) == getNumber(key, index) }"
                        v-for="(info, index) of item">{{
        getNumber(key, index)
                        }}</li>
                </ul>
            </div>

        </div>
    </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import BaseQuestionPreview from '../../components/BaseQuestionPreview.vue';
import { examStartRequest, examQuestionOptionRequest,saveExamAnswerRequestion ,answerActionRequestion} from '../../apis/exam-center-api';
import { useRoute } from 'vue-router';
import dayjs from 'dayjs';
import { getQuestionType } from '../../utils/question-config';
import useUserStore from '../../sotre/user-store';
import TextEditor from '../../components/TextEditor.vue';
import { Message } from '@arco-design/web-vue';
const userStore = useUserStore()
const route = useRoute()
const examInfoId = route.params['examInfoId']
const time = ref(0)
const currQuestIndex = ref(0)
//临时编号
let temNumber = 0
const isPreview = ref(false)
//题目信息
const questionInfo = ref({})
const questionList = ref([])
const options = ref([])
//考试信息
const examInfo = ref({})
const loading = ref(false)
let interval;
examStartRequest(examInfoId).then(res => {
    const data = res.data.data
    questionInfo.value = data['questionList']
    examInfo.value = data['examInfo']
    interval = setInterval(statrCountDown(data['systemTime']), 1000)
    getQuestionList()
    console.log(questionList.value[currQuestIndex.value])
    //加载第一天选项
    switchQuestion(0)
    if(examInfo.value.isMonitor){
        monitorAction()
    }
})

const getQuestionList = () => {
    Object.keys(questionInfo.value).forEach(key => {
        console.log(questionInfo.value[key])
        questionList.value.push(...questionInfo.value[key])
    })
}
const statrCountDown = (sysTime) => {
    const diffTime = dayjs(examInfo.value.endTime).diff(dayjs(sysTime), 'second');
    let hour = parseInt(diffTime / 3600)
    let minute = parseInt(diffTime / 60 % 60)
    let second = diffTime % 60
    hour=hour<10?'0'+hour:hour
    minute=minute<10?'0'+minute:minute
    second=second<10?'0'+second:second
    time.value = `${hour} : ${minute} : ${second}`
    return statrCountDown
}
const getNumber = computed(() => {
    return (key, index) => {
        let length = 0;
        for (const tKey in questionInfo.value) {
            if (tKey != key) {
                length += questionInfo.value[tKey].length;
            } else {
                break;
            }
        }
        return length + index + 1;
    }
})
const choiceCorrect=(index,selects)=>{
    const answerMap={}
    const question=questionList.value[index];
    const options=question['option']
    // 统一按数组处理
    if(!(selects instanceof Array)){
        selects=[selects]
    }
    options.forEach((value,index)=>{
        if(selects.includes(index)){
            value['answer']=1
            answerMap[value.id]=1
        }else{
            value['answer']=null
        }
    })
    question['subInfo']=null
    saveExamAnswerRequestion(examInfo.value.id, question.id,answerMap).then(res=>{
        const count=res.data.data
        question['subInfo']=count
    })

}
const submitAnswer=(index)=>{
    const answerMap={}
    const question=questionList.value[index];
    const options=question['option']
    let flag=false
    options.forEach(value=>{
        console.log(value)
        if(value.answer!=null){
            answerMap[value.id]=value.answer
            flag=true
        }
    })
    // 没有答案不提交
    if(!flag){
        return
    }
    question['subInfo']=null
    saveExamAnswerRequestion(examInfo.value.id, question.id,answerMap).then(res=>{
        const count=res.data.data
        question['subInfo']=count
    })

}
//显示提交信息
const showSubInfo=(count,total,type)=>{
    let subCount=type.subCount;
    if(subCount==0){
        subCount=total;
    }else if(subCount==-1){
        subCount=count
    }
    return count==subCount?"已提交":`${count}/${subCount}题`
}
const switchQuestion = (index) => {
    //预览模式滚动到改题目
    if (isPreview.value) {

    } else {
        if(loading.value){
            Message.error("请求过快~")
            return
        }
        loading.value = true
        //获取题目项
        examQuestionOptionRequest(examInfoId, questionList.value[index].id).then(res => {
            questionList.value[index]['option'] = res.data.data;
            console.log(questionList.value[index])
            currQuestIndex.value = index
            loading.value = false
        }).catch(err=>{
            loading.value=false
        })
    }
}
// 上传该题的所有答案
const saveAnswer=(option)=>{

}
const monitorAction=()=>{
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState != "visible") {
           answerAction({
                status:"PAUSE",
                info:""
           })
        }
    })
    document.addEventListener('paste', (e) => {
        console.log(e)
        answerAction({
            status:"PASTE",
            info:""
        })
    })
}
setInterval(()=>{
    document.addEventListener('contextmenu',function(e){
     e.preventDefault();  // 阻止默认事件
    });
    document.addEventListener('selectstart',function(e){
        e.preventDefault();  
    });
},1000)
// document.addEventListener('keydown',function(e){
//     if(e.key == 'F12'){
//         e.preventDefault(); // 如果按下键F12,阻止事件
//     }
// });
const answerAction=(actions)=>{
    answerActionRequestion(examInfoId,actions).then(res=>{
        console.log(res.data)
    })
}
onMounted(() => {
    clearInterval(interval)
})
</script>
<style lang="less" scoped>
.fade-enter-active {
  transition: transform 0.6s ease;
}
.fade-enter-from{
    transform: scale(1.5);
}
.exam-header {
    height: 40px;
    background-color: var(--color-text-2);
    text-align: center;
    line-height: 40px;
    position: fixed;
    left: 0;
    right: 0;
    top: 0;

    .exam-title {
        font-size: 20px;
        color: #fff;
    }

    .exam-preview {
        float: right;
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        font-size: 16px;
        right: 0;
        height: 40px;
        width: 120px;
        top: 0px;
        bottom: 0px;
    }
}

.common-style {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin: 15px 0;
}

.exam-start {
    display: flex;
    box-sizing: border-box;
    height: 100vh;
    overflow-y: hidden;
    padding: 0px;
    padding-top: 40px;
    background-color: var(--color-fill-1);

    .exam-info {
        width: 300px;
        height: 100%;
        padding: 10px;
        padding-top: 0;
        overflow-y: auto;

        .exam-name {
            text-align: center;
            font-size: 20px;
            line-height: 30px;
            position: relative;
            z-index: 1;
        }

        .exam-count-down {
            padding: 20px 30px;
            text-align: center;
            color: rgba(var(--primary-6));
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        p {
            color: var(--color-text-2);
            margin: 10px 0;
        }
    }

    .exam-list {
        flex: 1;
        height: 100%;
        border-radius: 10px;
        background-color: #fff;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        .nextquestBtn{
            :deep(.arco-btn-icon){
                order: 1;
                margin-left: 8px;
                margin-right: 0;
            }
        }
        .sub-info{
            background-color: rgb(var(--green-1));
            position:absolute;
            display: inline-block;
            height: 25px;
            line-height: 25px;
            padding: 2px 10px;
            border-radius: 20px;
            color: rgb(var(--green-6));
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            animation: dropdown .3;
            opacity: .8;
            right: -25px;
            bottom: -20px;
            z-index: 10;
            // animation: dropdown 0.3s

        }
        @keyframes dropdown {
            0% {
                top: 0px;
            }
            100% {
                bottom:-20px
            }
        }

        :deep(.question-info){
            position: relative;
        }
    }

    .exam-number {
        width: 320px;
        background-color: var(--color-fill-1);
        height: 100%;
        padding: 10px;
        padding-top: 0;
        overflow-y:auto;
        .number-wrap {
            margin: 10px 0;
            display: flex;
            flex-wrap: wrap;

            .number-item {
                width: 42px;
                height: 42px;
                box-sizing: content-box;
                border: 2px solid var(--color-fill-2);
                border-radius: 5px;
                margin: 5px;
                text-align: center;
                line-height: 42px;
                transition: all .3s;
                cursor: pointer;

                &:hover {
                    border: 2px solid rgba(var(--primary-4));
                }
            }

            .number-active {
                border: 2px solid rgba(var(--primary-6));
                background-color: rgba(var(--primary-4));
                color: #fff;
            }
        }
    }
}
</style>