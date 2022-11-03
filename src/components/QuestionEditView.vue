<template>
    <BasePreview :question="question" :show-area="true" :topic-type="props.topicType" :options="options">
        <!-- 题目区 -->
        <template #question>
            <TextEditor @blur="saveQuestion('content')" v-model:model-value="question.content" />
        </template>
        <!-- 作题区 -->
        <template #option="{ index }">
            <a-button @click="delOption(index)" status="danger" style="margin-right: 5px;">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button>
            <a-button class="letter" @click="saveCorrect(index)">
                选择
            </a-button>
            <TextEditor @blur="saveOption(options[index])" v-model:model-value="options[index].content" />
        </template>
        <template #body v-if="type.enumName != 'SUBJECTIVE' && type.enumName != 'JUDGMENTAL'">
            <a-button long @click="addOption">添加选项</a-button>
        </template>
        <template #subject="{ option }">
            <TextEditor mode="preview" @blur="saveOption(options[0])" v-model:model-value="options[0].content" />
        </template>
        <!-- 答案区 -->
        <template #correct>
            <TextEditor mode="preview" :model-value="question.correct" />
        </template>
        <!-- 解析区 -->
        <template #analysis>
            <TextEditor @blur="saveQuestion('analysis')" v-model:model-value="question.analysis" />
        </template>
        <template #difficulty>
            <a-rate v-model:model-value="question['difficulty']" @change="saveQuestion('difficulty')" />
        </template>

        <!-- 保存区 -->
        <template #footer>
            <div class="public">
                <span class="title">可见状态：</span>
                <a-radio-group type="button" @change="saveQuestion('isPublic')" default-value="self"
                    v-model:model-value="question.isPublic">
                    <a-radio value="self">自己</a-radio>
                    <a-radio value="course">课程</a-radio>
                    <a-radio value="overt">公开</a-radio>
                </a-radio-group>
            </div>
            <div class="public">
                <span class="title">题目分值：</span>
                <a-input-number :style="{ width: '170px' }" v-model="question.score" @blur="saveQuestion('score')"
                    placeholder="输入分值" :default-value="5" mode="button" class="input-demo" />
            </div>
            <a-button v-if="isCreate" long type="primary" size="large" @click="createQuestion">保存</a-button>
        </template>
    </BasePreview>
</template>
<script setup>
import { Message } from '@arco-design/web-vue';
import { reactive, ref, computed, watch } from 'vue';
import { addQuestionRequest, delQuestionItemRequest, delQuestionRequest, updateQuestionItemRequest, updateQuestionCorrectRequest, updateQuestionRequest } from '../apis/question-api';
import { getQuestionType, letterList } from '../utils/question-config';
import TextEditor from './TextEditor.vue';
import BasePreview from './BasePreview.vue';
const props = defineProps({
    topicType: String,
    question: {
        type: Object,
        default: {
            "content": "",
            "courseId": "",
            "difficulty": "",
            "analysis": "",
        }
    },
    options: {
        type: Array,
        default: []
    },
})
//类型
const type = ref(getQuestionType(props.topicType))
//题目
const question = reactive(props.question)
const isCreate = question.id == undefined
//选项
const options = ref(props.options)
watch(() => props.options, (value) => {
    options.value = value
    init()
})
//解答区，
const init = () => {
    if (type.value.enumName == "SUBJECTIVE") {
        if (options.value.length == 0) {
            options.value.push({
                content: ""
            })
        }
    }
    if (type.value.enumName == "JUDGMENTAL") {
        if (options.value.length == 0) {
            options.value.push({
                content: "对"
            })
            options.value.push({
                content: "错"
            })
        }
    }
}
//添加选项
const addOption = () => {
    if (question['id'] == undefined || options.value.length == 0 || (options.value[options.value.length - 1].id != undefined)) {
        options.value.push({
            "content": "",
        })
    } else {
        Message.info("请完成当前选择后，在添加~")
    }
}

//删除选项
const delOption = (index) => {

    delQuestionItemRequest(options.value[index].id).then(() => {
        options.value.splice(index, 1);
    })
}

//创建题目
const createQuestion = () => {
    if (question.content && question.content == '') {
        Message.info('题目不能为空~')
        return
    }
    const params = {
        ...question,
        'topicItems': options.value
    }
    params['type'] = props.topicType
    addQuestionRequest(params).then(res => {

    })
}
// 更新题目/jiex 
const saveQuestion = (info) => {
    if (isCreate) {
        return
    }
    const params = {
        id: question.id,
        courseId: question.courseId
    }
    console.log(question[info])
    console.log(props.question[info])
    // 内容没有更改不更新
    if ((question[info] == null)) {
        return
    }

    console.log(question[info])
    params[info] = question[info]

    updateQuestionRequest(params).then(res => [
    ])
}
// 添加/修改选项
const saveOption = (item) => {
    if (isCreate) {
        return
    }
    //编辑下修改答案
    item['questionId'] = question.id
    updateQuestionItemRequest(item).then(res => {
        //添加选项会返回id
        const data = res.data.data
        if (data) {
            item.id = data
        }
    })

}
//更改单/多正确选项
const saveCorrect = (index) => {
    if (isCreate) {
        updateCorrect(index)
        return
    }
    updateQuestionCorrectRequest(options.value[index].id).then(res => {
        updateCorrect(index)
    })

}
const updateCorrect = (index) => {
    if (isCreate) {
        return
    }
    for (let i = 0; i < options.value.length; i++) {
        const item = options.value[i];
        if (i == index) {
            if (type.value.enumName == 'MULTIPLE_CHOICE') {
                if (item['correct'] != null) {
                    item['correct'] = null
                } else {
                    item['correct'] = 1
                }
            } else {
                item['correct'] = 1
            }
        } else {
            if (type.value.enumName != 'MULTIPLE_CHOICE') {
                item['correct'] = null
            }
        }
    }
}
</script>
<style lang="less" scoped>
:deep(.option-item) {
    flex-wrap: wrap;
}

:deep(.option-item:hover) {
    background-color: #fff !important;
}

:deep(.question-info .info) {
    float: none!important;
}

.public {
    display: flex;
    align-items: center;
    margin: 10px;

    .title {
        color: var(--color-text-3);
    }
}
</style>
