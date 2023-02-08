<template>
    <div class="exam-header">
        <a-button type="primary" class="exam-preview" v-if="isPreview" @click="sumbit">交卷</a-button>
        <a-button type="primary" class="exam-preview" @click="isPreview = true" v-else>整卷预览</a-button>
        <a-button v-if="isPreview" class="back-preview" shape="round" @click="isPreview = false">
            <template #icon><icon-left /></template>
            返回</a-button>
        <p class="exam-title">考试</p>
    </div>
    <div class="exam-start">
        <div class="exam-info">
            <div class=" common-style">
                <div class="user-info">
                    <a-avatar shape="square" class="avatar" v-loadImg :image-url="userStore.userInfo.picture">
                    </a-avatar>
                    <div class="desc">
                        <div>
                            <a-tag color="orange">{{ userStore.userInfo.nickname }}</a-tag>
                            <span class="real-name">({{ userStore.userInfo.realName ?? '未认证' }})</span>
                        </div>
                        <div>
                            <a-tag color="blue">{{ userStore.userInfo.schoolName ?? '未认证' }}</a-tag>
                            <a-tag color="blue">{{ userStore.userInfo.jobNo ?? '未认证' }}</a-tag>
                        </div>
                    </div>
                </div>
                <div class="number-desc ">
                    <span class="number"> 已答：<a-tag color="green">{{ 10 }}</a-tag></span>
                    <span class="number"> 题数：<a-tag color="orangered">{{ questionList.length }}</a-tag></span>
                </div>
            </div>

            <div class="common-style">
                <a-countdown ref="countDownRef" :value="dayjs(examInfo.endTime).valueOf()"
                    :start="examInfo.endTime != null" :now="Date.now()" format="HH:mm:ss">
                    <template #title>
                        <h1>{{ examInfo.title ?? "loading" }}</h1>
                    </template>
                </a-countdown>
                <a-tag class="exam-stat-time" style="margin:10px 0">开始时间：{{ examInfo.startTime }}</a-tag>
                <a-tag class="exam-end-time">结束时间：{{ examInfo.endTime }}</a-tag>
            </div>
            <div class="common-style">
                <QuestionNumber  :status-visible="true" title="标记区" @numberClick="numberChange"
                scroll-container=".exam-list" :number-list="markNumberList" group-class="common-style" >
                <template #title>
                    <div style="display:flex;align-items: center;">
                        <h5>标记区</h5>
                    <p style="margin-left: 10px;font-size:12px;color:var(--color-text-2)">答案不确定，点击题目序号进行标记</p>
                    </div>
                </template>
            </QuestionNumber>
            <AEmpty v-if="markNumberList[0].list.length==0" description="暂无标记题目"/>
            </div>
        </div>
        <div class="exam-list">
            <div>
                <div class="question-pre-next" style="display: flex; justify-content: space-around" v-if="!isPreview">
                    <a-button-group>
                        <a-button long :disabled="currQuestIndex == 0" @click="switchQuestion(currQuestIndex - 1)">上一题
                            <template #icon>
                                <icon-left />
                            </template>
                        </a-button>
                        <a-button class="nextquestBtn" long type="primary"
                            :disabled="currQuestIndex == questionList.length - 1"
                            @click="switchQuestion(currQuestIndex + 1)">
                            <template #icon>
                                <icon-right />
                            </template>
                            下一题</a-button>
                    </a-button-group>
                </div>
                <a-spin dot :loading="loading" v-if="questionList.length != 0" style="width: 100%; min-height: 200px">
                    <a-list :data="getExamQuestion" :bordered="false">
                        <template #item="{ item, index }">
                            <a-list-item :id="`question-${item.id}`">
                                
                                <BaseQuestionPreview @editorBlur="submitAnswer(item.id)" :key="item.id"
                                    @choiceCorrect="choiceCorrect(item.id, $event)" mode="answer"
                                    @markQuestion="markQuestion"
                                    :show-area="false" :topic-type="item.type"
                                    :question="item" :number="isPreview ? (index + 1) : (currQuestIndex + 1)"
                                    v-model:options="item.options" :lazy="isPreview">
                                    <template #question="{ question, options, type }">
                                        <!-- {{question}} -->
                                        <Transition name="fade">
                                            <span class="sub-info" v-if="question['subInfo'] != undefined">{{
                                                    showSubInfo(question["subInfo"], options.length, type)
                                            }}</span>
                                        </Transition>
                                    </template>
                                </BaseQuestionPreview>
                            </a-list-item>
                        </template>
                    </a-list>
                </a-spin>
                <a-empty v-else></a-empty>
            </div>
        </div>
        <div class="exam-number common-style">
            <QuestionNumber :status-list="answerStatus" :status-visible="true" title="作答状态" @numberClick="numberChange"
                scroll-container=".exam-list" :number-list="getNumberInfo" group-class="common-style" />

        </div>
    </div>
    <QuestionImagePreview click-area=".exam-list" />
</template>
<script setup>
import { computed, h, onMounted, ref } from "vue";
import BaseQuestionPreview from "../../components/BaseQuestionPreview.vue";
import {
    examStartRequest,
    examSubmitRequest,
    examQuestionOptionRequest,
    saveExamAnswerRequestion,
    answerActionRequestion,
} from "../../apis/exam-center-api";
import { useRoute, useRouter } from "vue-router";
import dayjs from "dayjs";
import { getQuestionType } from "../../utils/question-config";
import useUserStore from "../../sotre/user-store";
import { Message, Modal } from "@arco-design/web-vue";
import QuestionNumber from "../../components/QuestionNumber.vue";
import QuestionImagePreview from "../../components/QuestionImagePreview.vue";

const userStore = useUserStore();
const route = useRoute();
const router = useRouter()
const examInfoId = route.params["examInfoId"];
const time = ref(0);
const currQuestIndex = ref(0);
//临时编号
let temNumber = 0;
const isPreview = ref(false);
//题目信息
const numberGroup = ref({})
const questionList = ref([]);
const options = ref([]);
//考试信息
const examInfo = ref({});
const loading = ref(false);
//标记列表
const markNumberList=ref([{list:[]}])
const getExamQuestion = computed(() => {
    const list = questionList.value
    if (isPreview.value) {
        //FIXME:可以重新同步下数据
        return list;
    } else {
        return [list[currQuestIndex.value]]
    }
})



examStartRequest(examInfoId).then((res) => {
    const data = res.data.data;
    const qlist = data["questionList"];
    examInfo.value = data["examInfo"];
    getQuestionList(qlist);
    console.log(questionList.value[currQuestIndex.value]);
    //加载第一个选项
    switchQuestion(0);
    if (examInfo.value.isMonitor) {
        monitorAction();
    }
}).catch(() => {
    router.back()
});
const markQuestion=(number,question)=>{
    const qId=question.id;
    let i=0;
    for(let item of markNumberList.value[0].list){
        if(item.key==qId){
            markNumberList.value[0].list.splice(i,1)
            return
        }
        i++;
    }
    markNumberList.value[0].list.push({
        key: qId,
        number: number,
        href: `question-${qId}`
    })
}

const sumbit = () => {
    const submitTime = examInfo.value.submitTime;
    if (submitTime==null || dayjs().isAfter(dayjs(submitTime))) {
        examSubmitRequest(examInfoId).then(res => {
            Message.success("提交成功~")
            router.push({
                name: 'ExamSuccess'
            })
        }).catch(e=>{
            Message.success("提交失败，请联系老师")
        })
    } else {
        Modal.info({
            title: '未到提交时间',
            content: h('h1', [
                h('span', `老师设置了提交时间，未到`),
                h('a-tag', dayjs(submitTime).format('YYYY-MM-DD HH: mm: ss')),
                h('span', '不可以提交试卷！'),
            ])
        });
    }
}

const getQuestionList = (qList) => {
    Object.keys(qList).forEach((key) => {
        console.log(qList[key]);
        questionList.value.push(...qList[key]);
        numberGroup.value[key] = qList[key].length;
    });
};
//获取序号选项
const getNumberInfo = computed(() => {
    const numberInfo = []
    const questions = questionList.value
    let i = 0;
    for (const key in numberGroup.value) {
        const name = getQuestionType(key).simpleName
        const info = []
        const length = (i + numberGroup.value[key]);
        for (; i < length; i++) {
            const question = questions[i]
            info.push({
                key: question.id,
                number: i + 1,
                href: `question-${question.id}`,
                statusKey: getQuestionAnswerStatus(question)
            })
        }
        numberInfo.push({
            title: name,
            list: info
        })
    }
    return numberInfo
})
//获取题目作答情况
const getQuestionAnswerStatus = (question) => {
    let status = 'none'
    const type = question.type;
    let answerCount = 0;
    question.options.forEach(option => {
        if (option.answer) {
            answerCount++;
        }
    })
    if (type == 'SIGNAL_CHOICE' || type == 'MULTIPLE_CHOICE' || type == 'JUDGMENTAL') {
        if (answerCount > 0) {
            status = 'end'
        }
    } else {
        if (answerCount == question.options.length) {
            status = 'end'
        } else if (answerCount > 0) {
            status = 'start'
        }
    }
    return status;
}
const numberChange = (info) => {
    console.log(info)
    switchQuestion(info.number - 1)
}
//选择答案
const choiceCorrect = (id, selects) => {
    const answerMap = {};
    const question = getQuestionById(id);
    const options = question.options;
    // 统一按数组处理
    if (!(selects instanceof Array)) {
        selects = [selects];
    }
    options.forEach((value, index) => {
        if (selects.includes(index)) {
            value["answer"] = 1;
            answerMap[value.id] = 1;
        } else {
            value["answer"] = null;
        }
    });
    question["subInfo"] = null;
    saveExamAnswerRequestion(examInfo.value.id, question.id, answerMap).then(
        (res) => {
            const count = res.data.data;
            question["subInfo"] = count;
        }
    );
};
const getQuestionIndex = (id) => {
    const list = questionList.value
    for (let i = 0; i < list.length; i++) {
        if (list[i].id == id) {
            return i;
        }
    }
    return 0;
}
const getQuestionById = (id) => {
    const list = questionList.value
    return list[getQuestionIndex(id)]
}

const submitAnswer = (id) => {
    const answerMap = {};
    const question = getQuestionById(id);
    const options = question.options;
    let flag = false;
    options.forEach((value) => {
        console.log(value);
        if (value.answer != null) {
            answerMap[value.id] = value.answer;
            flag = true;
        }
    });
    console.log(options)
    // 没有答案不提交
    if (!flag) {
        return;
    }
    question["subInfo"] = null;
    saveExamAnswerRequestion(examInfo.value.id, question.id, answerMap).then(
        (res) => {
            const count = res.data.data;
            question["subInfo"] = count;
        }
    );
};
//显示提交信息
const showSubInfo = (count, total, type) => {
    let subCount = type.subCount;
    if (subCount == 0) {
        subCount = total;
    } else if (subCount == -1) {
        subCount = count;
    }
    return count == subCount ? "已提交" : `${count}/${subCount}题`;
};

const switchQuestion = (index) => {
    if (isPreview.value) {
        return
    }
    const question = questionList.value[index]
    //预览模式滚动到改题目
    currQuestIndex.value = index;
    //获取题目项
    examQuestionOptionRequest(examInfoId, question.id)
        .then((res) => {
            const answers = res.data.data ?? [];
            const options = question.options;
            //合并答案
            for (let i = 0; i < options.length; i++) {
                const id = options[i].id;
                const answer = answers[id];
                if (answer) {
                    options[i].answer = answer;
                }
            }
        })
        .catch((err) => {
            console.log(err);
            // loading.value = false
            Message.error("服务器错误");
        });
}
// 上传该题的所有答案
const saveAnswer = (option) => { };
const monitorAction = () => {
    if (import.meta.env.DEV) {
        return
    }
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState != "visible") {
            answerAction({
                status: "PAUSE",
                info: "",
            });
        }
    });
    document.addEventListener("paste", (e) => {
        console.log(e);
        answerAction({
            status: "PASTE",
            info: "",
        });
    });
};
if (import.meta.env.PROD) {
    document.addEventListener("contextmenu", function (e) {
        e.preventDefault(); // 阻止默认事件
    });
    document.addEventListener("selectstart", function (e) {
        e.preventDefault();
    });
    document.addEventListener('keydown', function (e) {
        if (e.key == 'F12') {
            e.preventDefault(); // 如果按下键F12,阻止事件
        }
    });
}


const answerAction = (actions) => {
    answerActionRequestion(examInfoId, actions).then((res) => {
        console.log(res.data);
    });
};
onMounted(() => { });
const answerStatus = [
    {
        key: 'none',
        status: '未作答',
        style: { backgroundColor: 'var(--color-fill-1)' }
    },
    {
        key: 'start',
        status: '未答完',
        style: { backgroundColor: 'rgba(var(--orange-4), 8)', color: 'var(--color-white)' }
    },
    {
        key: 'end',
        status: '已作答',
        style: { backgroundColor: 'rgba(var(--green-4), 8)', color: 'var(--color-white)' }
    }
]
</script>
<style lang="less" scoped>
.fade-enter-active {
    transition: transform 0.6s ease;
}

.fade-enter-from {
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
    z-index: 99;

    .exam-title {
        font-size: 20px;
        color: #fff;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .exam-preview {
        border-bottom-right-radius: 0;
        border-top-right-radius: 0;
        font-size: 16px;
        position: absolute;
        right: 0;
        height: 40px;
        width: 120px;
        top: 0px;
        bottom: 0px;
    }

    .back-preview {
        position: absolute;
        left: 0;
        top: 0px;
        bottom: 0;
        height: 40px;
        background-color: transparent;
        color: #fff;
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
        overflow-y: overlay;

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

        .user-info {
            display: flex;
            justify-content: center;
            align-items: center;

            .avatar {
                margin-right: 10px;
            }

            .desc {
                display: flex;
                flex-direction: column;
                justify-content: center;
                flex: 1;

                span {
                    margin: 2px;
                    font-weight: bold;
                }

                .real-name {
                    font-size: 14px;
                    color: var(--color-text-3);
                }
            }
        }
        .number-desc {
            display: flex;
            justify-content: center;

            .number {
                font-size: 14px;
                font-weight: bold;
                color: var(--color-text-3);
                margin: 10px;

                span {
                    font-weight: bold;
                }
            }
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

        .nextquestBtn {
            :deep(.arco-btn-icon) {
                order: 1;
                margin-left: 8px;
                margin-right: 0;
            }
        }

        .sub-info {
            background-color: rgb(var(--green-1));
            position: absolute;
            display: inline-block;
            height: 25px;
            line-height: 25px;
            padding: 2px 10px;
            border-radius: 20px;
            color: rgb(var(--green-6));
            font-size: 12px;
            font-weight: bold;
            position: absolute;
            animation: dropdown 0.3;
            opacity: 0.8;
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
                bottom: -20px;
            }
        }

        :deep(.question-info) {
            position: relative;
        }
    }

    .exam-number {
        width: 320px;
        height: 100%;
        overflow-y: auto;
        overflow-y: overlay;
        box-sizing: border-box;
        margin: 10px;
    }
}
</style>
