<template>
    <div class="preview" :class="mode">
        <!-- 题目区 -->
        <div class="question">
            <!-- <a-button v-if="isEdit&&mode!='create'" @click="delQuestion" status="danger">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button> -->
            <div class="question-info">
                <span class="number" v-if="props.number">{{props.number}}.</span>
                <span class="type-name">({{type.simpleName}})</span>
            </div>
            <TextEditor @blur="saveQuestion('content')" v-model:model-value="question.content"
                :mode="getEditMode('preview','question')" />
        </div>
        <!-- 作题区 -->
        <ul class="options">
            <li class="option-item" v-for="(item,index) in options" :class="type.enumName">
                <a-button @click="delOption(index)" v-if="isEdit&&type.enumName!='JUDGMENTAL'" status="danger">
                    <template #icon>
                        <icon-delete />
                    </template>
                </a-button>
                <span class="letter" @click="saveCorrect(index)" v-if="type.itemsConfig.prexType=='letter'"
                    :class="{'letter-active':item.correct!=null}">
                    {{letterList[index]}}
                </span>
                <span class="number" v-if="type.itemsConfig.prexType=='number'">
                    第{{index+1}}空：
                </span>
                <span class="number" v-if="type.enumName=='SUBJECTIVE'">
                    答：
                </span>
                <span v-if="(mode=='display'&&(type.enumName=='SUBJECTIVE'||type.enumName=='COMPLETION'))"
                    class="underline"></span>
                <TextEditor @blur="saveOption(item)" v-else v-model:model-value="item.content"
                    :mode="getEditMode(type.itemsConfig.editMode,'option')" />
            </li>
        </ul>
        <div class="add-option" v-if="isEdit&&type.enumName!='SUBJECTIVE'&&type.enumName!='JUDGMENTAL'">
            <a-button long @click="addOption">添加选项</a-button>
        </div>
        <!-- 答案区 -->
        <div class="correct" v-if="!isEdit&&mode!='answer'">
            <span class="title">答案：</span>
            <TextEditor mode="preview" :model-value="getCorrect" />
        </div>
        <!-- 解析区 -->
        <div class="analysis" v-if="mode!='answer'">
            <span class="title">解析：</span>
            <TextEditor @blur="saveQuestion('analysis')" v-if="question.analysis||isEdit"
                v-model:model-value="question.analysis" :mode="getEditMode('preview','analysis')" />
            <span v-else>无</span>
        </div>
        <!-- 公开区 -->
        <div class="public" v-if="isEdit">
            <span class="title">可见状态：</span>
            <a-radio-group type="button" @change="saveQuestion('isPublic')" default-value="self"
                v-model:model-value="question.isPublic">
                <a-radio value="self">自己</a-radio>
                <a-radio value="course">课程</a-radio>
                <a-radio value="overt">公开</a-radio>
            </a-radio-group>
        </div>
        <div class="public" v-if="isEdit">
            <span class="title">难易程度：</span>
            <a-rate v-model:model-value="question['difficulty']" @change="saveQuestion('difficulty')"
                :default-value="2.5" allow-half />
        </div>

        <!-- 保存区 -->
        <div class="create-save" v-if="mode=='create'">
            <a-button long type="primary" size="large" @click="createQuestion">保存</a-button>
        </div>
    </div>
</template>
<script setup>
import { Message } from '@arco-design/web-vue';
import { reactive, ref, computed, watch } from 'vue';
import { addQuestionRequest, delQuestionItemRequest, delQuestionRequest, updateQuestionItemRequest, updateQuestionCorrectRequest, updateQuestionRequest } from '../apis/question-api';
import { getQuestionType, letterList } from '../utils/question-config';
import TextEditor from './TextEditor.vue';
const props = defineProps({
    number: Number,
    //题目类型
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
    myOptions: {
        type: Array,
        default: []
    },
    mode: {
        type: String,
        default: 'editor',
        validator(value) {
            // The value must match one of these strings
            return ['display', 'answer', 'answer-display', 'editor', 'create'].includes(value)
        }
    }
})
const emit = defineEmits(
    ['delete']
)
watch(() => props.mode, (value) => {
    console.log(value)
    mode.value = value
})
//更新课程id /分组id
watch(() => props.question, (value) => {
    Object.assign(question,value)
    if(value['courseId']){
        question['courseId']=value['courseId']
    }
    if(value['tagId']){
        question['tagId']=value['tagId']
    }
})
//更新题目类型
watch(() => props.topicType, (value) => {
    console.log(value)
    type.value = getQuestionType(value)
    options.splice(0,options.length)
    init()
})
const mode = ref(props.mode)
//类型
const type = ref(getQuestionType(props.topicType))
//题目
const question = reactive({
    ...props.question
})
//选项
const options = reactive([...props.options])

const isEdit = computed(() => {
    return ['editor', 'create'].includes(mode.value)
})
//解答区，
const init = () => {
    if (type.value.enumName == "SUBJECTIVE") {
        if (options.length == 0) {
            options.push({
                content: ""
            })
        }
    }
    if (type.value.enumName == "JUDGMENTAL") {
        if (options.length == 0) {
            options.push({
                content: "对"
            })
            options.push({
                content: "错"
            })
        }
    }
}
init()
//添加选项
const addOption = () => {
    if (mode.value == 'create' || options.length == 0 || (options[options.length - 1].id != undefined)) {
        options.push({
            "content": "",
        })
    } else {
        Message.info("请完成当前选择后，在添加~")
    }
}
//获取编辑器模式
const getEditMode = computed(() => {
    return (defalutMode,area) => {
        if (isEdit.value) {
            defalutMode = 'rich'
        }
        //判断题不能编辑
        if(area=='option'&&type.value.enumName=='JUDGMENTAL'){
            defalutMode = 'preview'
        }
        return defalutMode
    }
})


//获取答案内容
const getCorrect = computed(() => {
    const correct = []
    for (let i = 0; i < options.length; i++) {
        if (options[i].correct) {
            // 单、多、判断
            if (type.value.itemsConfig.prexType == 'letter') {
                correct.push(letterList[i]);
            } else {
                correct.push(options[i].content)
            }
        }
    }
    if (correct.length == 0) {
        correct.push('无')
    }
    return correct.join('；')
})
//删除选项
const delOption = (index) => {
    if(mode.value=='create'){
        options.splice(index, 1);
        return
    }
    delQuestionItemRequest(options[index].id).then(() => {
        options.splice(index, 1);
    })
}
// 删除问题
const delQuestion = () => {
    delQuestionRequest(question.id).then(res => {
        emit('delete', question.id)
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
        'topicItems': options
    }
    params['type'] = props.topicType
    addQuestionRequest(params).then(res => {

    })
}
// 更新题目/jiex 
const saveQuestion = (info) => {
    if (mode.value == 'create') {
        return
    }
    const params = {
        id: question.id,
        courseId: question.courseId
    }
    console.log(question[info])
    console.log(props.question[info])
    // 内容没有更改不更新
    if((question[info]==null)){
        return
    }

    console.log(question[info])
    params[info] = question[info]
    
    updateQuestionRequest(params).then(res => [
    ])
}
// 添加/修改选项
const saveOption = (item) => {
    if (isEdit.value && mode.value != 'create') {
        //编辑下修改答案
        item['questionId'] = question.id
        updateQuestionItemRequest(item).then(res => {
            //添加选项会返回id
            const data = res.data.data
            if (data) {
                item.id = data
            }
        })
    } else {
        //保存答案
    }
}
//更改单/多正确选项
const saveCorrect = (index) => {
    if (isEdit.value && mode.value != 'create') {
        updateQuestionCorrectRequest(options[index].id).then(res => {
            updateCorrect(index)
        })
    } else if (mode.value == 'create') {
        updateCorrect(index)
    }

}
const updateCorrect = (index) => {
    for (let i = 0; i < options.length; i++) {
        const item = options[i];
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
.preview {
    padding: 10px;


    .question {
        margin: 5px 0;
        display: flex;
        .question-info{
            display: flex;
            margin-right: 5px;
            line-height: 25px;
            height: 25px;
            align-items: center;
        }
        .number {
            color: var(--color-text-2);
        }

        .type-name {
            color: var(--color-text-3);
            white-space: nowrap;

        }


    }

    .options {
        margin: 10px;

        .option-item {
            margin: 10px 0;
            cursor: pointer;
            display: flex;
            align-items: center;

            &:hover {
                .letter {
                    border: 1px solid rgb(var(--primary-5));
                }
            }

        }

        .COMPLETION,
        .SUBJECTIVE {
            display: block;
        }
        .MULTIPLE_CHOICE{
            .letter{
                border-radius:10px
            }
        }

        .letter {
            display: inline-block;
            height: 35px;
            width: 35px;
            text-align: center;
            border: 1px solid var(--color-fill-3);
            border-radius: 50%;
            line-height: 35px;
            transition: all .3s;
            margin: 0 5px;
        }

        .letter-active {
            border: 1px solid rgb(var(--primary-6));
            background-color: rgb(var(--primary-1));
            color: rgb(var(--primary-6));
        }

        .number {
            margin: 10px 0;
            color: var(--color-text-3);
        }

        .underline {
            display: block;
            border-bottom: 1.5px solid var(--color-text-4);
            flex: 1;
            height: 15px;
        }
    }

    .public {
        display: flex;
        align-items: center;
        margin: 10px;

        .title {
            color: var(--color-text-3);
        }
    }

    .analysis,
    .correct {
        margin: 10px;
        background-color: var(--color-fill-1);
        padding: 15px;
        border-radius: 5px;
        display: flex;
        align-items: center;
        flex-wrap: wrap;

        .title {
            color: var(--color-text-3);
        }
    }
}

// 编辑模式下，编辑器和序号换行显示
.editor,
.create {
    .question {
        display: block;
    }

    .options {
        .option-item {
            display: block;
        }
        .JUDGMENTAL{
            display: flex;
        }
    }
}

.display {
    .options {

        .COMPLETION,
        .SUBJECTIVE {
            display: flex;
        }
    }
}
</style>
