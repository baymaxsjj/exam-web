<template>
    <a-spin :loading="loading" dot  class="exam-container">
        <div class="left">
            <div class="result_desc common-style">
                <div class="user-info">
                    <a-avatar shape="square" class="avatar">
                        <img alt="avatar" :src="studentInfo.picture" />
                    </a-avatar>
                    <div class="desc">
                        <div>
                            <a-tag color="orange">{{ studentInfo.nickname }}</a-tag>
                            <span class="real-name">({{ studentInfo.realName ?? '未认证' }})</span>
                        </div>
                        <div>
                            <a-tag color="blue">{{ studentInfo.schoolName ?? '未认证' }}</a-tag>
                        </div>
                    </div>
                </div>
                <div class="number-desc ">
                    <span class="number"> 得分：<a-tag color="green">{{ score }}</a-tag></span>
                    <span class="number"> 正确题数：<a-tag color="orangered">{{ correctNumber }}</a-tag></span>
                </div>
            </div>

            <div class="numbers common-style">
                <QuestionNumber title="批阅状态" :statusList="reviewStatus" :status-visible="statusVisible" scroll-container=".question-list" :number-list="getNumberInfo"
                    group-class="common-style" />
            </div>
        </div>
        <div class="question-list common-style">
            <BaseQuestionPreview :id="`question-${index}`" v-for="(item, index) of answerResults" mode="review"
                :showArea="true" :number="index + 1" :question="item.questionInfo" :topic-type="item.questionInfo.type"
                :options="item.questionInfo.options" :my-options="item.answerResult">
                <template #body>
                    <div v-if="item.answerResult.length != 0">
                        <div class="result-info" v-if="statusVisible">
                            <a-tag color="blue" style="margin-top: 5px" class="title">评分：</a-tag>
                            <a-input-number mode="button" :default-value="item.scoreRecord.score" :min="0"
                                :max="item.questionInfo.score" style="width: 200px;" />
                        </div>
                        <div class="result-info">
                            <a-tag color="blue" class="title"> 得分：</a-tag>
                            <a-tag color="cyan">{{ item.scoreRecord.score }}</a-tag>
                        </div>
                        <div class="result-info">
                            <a-tag color="blue" class="title">结果：</a-tag>
                            <a-tag color="red">{{ getResultType(item.scoreRecord.resultType).label }}</a-tag>
                        </div>
                        <div class="result-info" v-if="statusVisible">
                            <a-tag color="blue" class="title">批阅类型：</a-tag>
                            <a-tag color="#ff7d00">{{ getReviewType(item.scoreRecord.reviewType).label }}</a-tag>
                        </div>
                    </div>
                    <div v-else class="result-info">
                        <a-tag color="blue" class="title">结果：</a-tag>
                        <a-tag color="red">未作答</a-tag>
                    </div>

                </template>
            </BaseQuestionPreview>
        </div>
    </a-spin>
    <QuestionImagePreview click-area=".question-list"/>
</template>
<script setup>
import { examStudentAnswerResultRequest } from '@/apis/exam-center-api.js';
import { useRoute } from 'vue-router';
import { ref, shallowRef, computed } from 'vue'
import { getQuestionType } from "../../utils/question-config";
import QuestionNumber from "../../components/QuestionNumber.vue";
import BaseQuestionPreview from '../../components/BaseQuestionPreview.vue'
import { getResultType, getReviewType } from '../../utils/review-info.js'
import QuestionImagePreview from '../../components/QuestionImagePreview.vue';

const route = useRoute()
const examInfoId = route.params['examInfoId']
const studentId = route.params['studentId']

const studentInfo = ref({})
const score = ref(0)
const correctNumber = ref(0)
const numberGroup = ref({})
const answerResults = shallowRef([]);
const statusVisible = ref(true)
const loading=ref(true)

const getQuestionList = (qList) => {
    Object.keys(qList).forEach((key) => {
        console.log(qList[key]);
        answerResults.value.push(...qList[key]);
        numberGroup.value[key] = qList[key].length;
    });
};

//获取序号选项
const getNumberInfo = computed(() => {
    const numberInfo = []
    const results = answerResults.value
    let i = 0;
    for (const key in numberGroup.value) {
        const name = getQuestionType(key).simpleName
        const info = []
        const length = (i + numberGroup.value[key]);
        for (; i < length; i++) {
            let color = 'NONE'
            const result = results[i];
            if (statusVisible.value&&result.scoreRecord) {
                color = result.scoreRecord.reviewType
            }
            info.push({
                key: i,
                number: i + 1,
                href: `question-${i}`,
                statusKey: color
            })
        }
        numberInfo.push({
            title: name,
            list: info
        })
    }
    return numberInfo
})
examStudentAnswerResultRequest(examInfoId, studentId).then(res => {
    const data = res.data.data
    studentInfo.value = data.studentInfo
    score.value = data.score
    correctNumber.value = data.correctNumber
    getQuestionList(data.answerResults)
    loading.value=false
    console.log(data)
})
const reviewStatus=[
    {
        key:'NONE',
        status:'未作答',
        style:{backgroundColor:'var(--color-fill-1)'}
    },
    {
        key:'ROBOT',
        status:'机器批阅',
        style:{backgroundColor:'rgba(var(--orange-4), 8)',color:'var(--color-white)'}
    },
    {
        key:'TEACHER',
        status:'教师批阅',
        style:{backgroundColor:'rgba(var(--green-4), 8)',color:'var(--color-white)'}
    }
]
</script>
<style lang="less" scoped>
.common-style {
    background-color: #fff;
    border-radius: 10px;
    padding: 20px;
    margin: 15px 0;
}

.exam-container {
    padding: 0 10px;
    padding-top: 72px;
    height: 100vh;
    min-height: 500px;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    background-color: var(--color-fill-1);

    .left {
        width: 300px;
        height: 100%;
        overflow-y: auto;
        overflow-y: overlay;

        .avatar {
            margin-right: 10px;
        }

        .result_desc {
            position: sticky;
            top: 0;
            margin-top: 0;
            z-index: 10;
        }

        .user-info {
            display: flex;
            justify-content: center;
            align-items: center;

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

        .numbers {
            margin-bottom: 0;
        }
    }

    .question-list {
        overflow-y: auto;
        flex: 1;
        margin: 0 10px;
        margin-right: 0;

        .result-info {
            margin: 10px 0;
            // background-color: var(--color-fill-1);
            border-radius: 5px;
            overflow: hidden;
            .title {
                font-weight: bold;
                width: 70px;
                margin-right: 10px;
                float: left;
            }
        }
    }
}
</style>