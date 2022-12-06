<template>
    <BaseQuestionPreview mode="editor" @editorBlur="handleBlur" :question="question" :show-area="true" :topic-type="props.topicType" :options="options">
        <template #option_footer >
            <a-button long @click="addOption">添加选项</a-button>
        </template>
        <template #option="{ index }">
            <a-button @click="delOption(index)" status="danger" style="margin-right: 5px;">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button>
            <a-button class="letter" @click="saveCorrect(index)">
               {{options[index].answer!=null?"取消选择":"选择"}}
            </a-button>
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
    </BaseQuestionPreview>
</template>
<script setup>
import { Message } from '@arco-design/web-vue';
import { reactive, ref, computed, watch } from 'vue';
import { addQuestionRequest, delQuestionItemRequest, delQuestionRequest, updateQuestionItemRequest, updateQuestionCorrectRequest, updateQuestionRequest } from '../apis/question-api';
import { getQuestionType, letterList } from '../utils/question-config';
import BaseQuestionPreview from './BaseQuestionPreview.vue';
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
const delOption =async (index) => {
    if(isCreate){
        
    }else{
       await delQuestionItemRequest(options.value[index].id)
    }
    options.value.splice(index, 1);
}

//创建题目
const createQuestion = () => {
    if (question.content && question.content == '') {
        Message.info('题目不能为空~')
        return
    }
    const params = {
        ...question,
        'options': options.value
    }
    params['type'] = props.topicType
    addQuestionRequest(params).then(res => {

    })
}
const handleBlur=(component,index)=>{
    console.log(component)
    let questField
    switch(component){
        case 'question':
            questField='content'
        case 'analysis':
            questField='analysis'
        case 'difficulty':
            questField='difficulty'
            saveQuestion(questField)
            break;
        case 'option':
            saveOption(options.value[index])
            break
    }
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
    for (let i = 0; i < options.value.length; i++) {
        const item = options.value[i];
        if (i == index) {
            if (type.value.enumName == 'MULTIPLE_CHOICE') {
                if (item['answer'] != null) {
                    item['answer'] = null
                } else {
                    item['answer'] = 1
                }
            } else {
                item['answer'] = 1
            }
        } else {
            if (type.value.enumName != 'MULTIPLE_CHOICE') {
                item['answer'] = null
            }
        }
    }
}
</script>
<style lang="less" scoped>
:deep(.option-item) {
    flex-wrap: wrap;
}
:deep(.arco-radio),:deep(.arco-checkbox){
   display: block;
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
