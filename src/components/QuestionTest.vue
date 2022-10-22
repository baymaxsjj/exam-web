<template>
    <div class="preview" :class="mode">
        <!-- 题目区 -->
        <div class="question">
            <a-button v-if="isEdit&&mode!='create'" status="danger">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button>
            <span class="number" v-if="props.number">{{props.number}}.</span>
            <span class="type-name">({{type.simpleName}})</span>
            <QuestionEditor v-model:model-value="question.content" :mode="getEditMode('preview')" />
        </div>
        <!-- 作题区 -->
        <ul class="options">
            <li class="option-item" v-for="(item,index) in options" :class="type.enumName">
                <a-button v-if="isEdit&&mode!='create'&&item.id" status="danger">
                    <template #icon>
                        <icon-delete />
                    </template>
                </a-button>
                <span class="letter" v-if="type.itemsConfig.prexType=='letter'"
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
                <QuestionEditor v-else v-model:model-value="item.content"
                    :mode="getEditMode(type.itemsConfig.editMode)" />
            </li>
        </ul>
        <div class="add-option" v-if="isEdit&&type.enumName!='SUBJECTIVE'">
            <a-button long @click="addOption">添加选项</a-button>
        </div>
        <!-- 答案区 -->
        <div class="correct" v-if="!isEdit&&mode!='answer'">
            <span class="title">答案：</span>
            <QuestionEditor mode="preview" :model-value="getCorrect" />
        </div>
        <!-- 解析区 -->
        <div class="analysis" v-if="mode!='answer'">
            <span class="title">解析：</span>
            <QuestionEditor v-if="question.analysis||isEdit" v-model:model-value="question.analysis"
                :mode="getEditMode('preview')" />
            <span v-else>无</span>
        </div>
        <!-- 公开区 -->
        <div class="public" v-if="isEdit">
            <span class="title">可见状态：</span>
            <a-radio-group type="button" default-value="self" v-model:model-value="question.isPublic">
                <a-radio value="self">自己</a-radio>
                <a-radio value="courlse">课程</a-radio>
                <a-radio value="public">公开</a-radio>
            </a-radio-group>
        </div>
        <!-- 保存区 -->
        <div class="create-save" v-if="mode=='create'">
            <a-button long>保存</a-button>
        </div>
    </div>
</template>
<script setup>
import { Message } from '@arco-design/web-vue';
import { reactive, ref, computed, watch } from 'vue';
import { delQuestionItemRequest, delQuestionRequest, updateQuestionItemRequest, updateQuestionCorrectRequest, updateQuestionRequest } from '../apis/question-api';
import { getQuestionType, letterList } from '../utils/question-config';
import QuestionEditor from './QuestionEditor.vue';
const props = defineProps({
    number: Number,
    //题目类型
    topicType: String,
    question: {
        type: Object,
        default: {

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
watch(() => props.mode, (value) => {
    console.log(value)
    mode.value = value
})
const mode = ref(props.mode)
//类型
const type = getQuestionType(props.topicType)
//题目
const question = reactive(props.question)
//选项
const options = reactive(props.options)

const isEdit = computed(() => {
    return ['editor', 'create'].includes(mode.value)
})
//解答区，
if (type.enumName == "SUBJECTIVE") {
    if (options.length == 0) {
        options.push({
            correct: ""
        })
    }
}
//添加选项
const addOption = () => {
    if (options.length == 0 || options[options.length - 1].id != undefined) {
        options.push({
            "content": "",
        })
    } else {
        Message.info("请完成当前选择后，在添加~")
    }
}
//获取编辑器模式
const getEditMode = computed(() => {
    return (defalutMode) => {
        if (isEdit.value) {
            defalutMode = 'rich'
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
            if (type.itemsConfig.prexType == 'letter') {
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
</script>
<style lang="less" scoped>
.preview {
    padding: 10px;


    .question {
        margin: 5px 0;
        display: flex;
        align-items: center;

        .number {
            color: var(--color-text-2);
        }

        .type-name {
            color: var(--color-text-3);
            margin: 0 5px;
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
                    border: 2px solid rgb(var(--primary-5));
                }
            }

        }

        .COMPLETION,
        .SUBJECTIVE {
            display: block;
        }

        .letter {
            display: inline-block;
            height: 35px;
            width: 35px;
            text-align: center;
            border: 2px solid var(--color-fill-3);
            border-radius: 50%;
            line-height: 35px;
            transition: all .3s;
            margin: 0 5px;
        }

        .letter-active {
            border: 2px solid rgb(var(--primary-6));
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
        background-color: var(--color-fill-2);
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
    }
}
.display{
    .options {
        .COMPLETION,.SUBJECTIVE{
            display: flex;
        }
    }
}
</style>
