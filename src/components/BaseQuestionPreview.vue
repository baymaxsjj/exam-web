<template>
    <!-- 怎么说能，前几个要么过于复杂，要么简单，所以综合之间 -->
    <!-- 本组件用户编辑，显示，作答，不提供逻辑，只提供事件 -->
    <div class="preview">
        <!-- 题目区 -->
        <div class="question-info">
            <div class="info">
                <span class="number" v-if="props.number">{{ props.number }}. </span>
                <span class="type-name"> ({{ type.simpleName }} {{ question.score }}分)：</span>
            </div>
            <TextEditor @blur="$emit('editorBlur','question')" :mode="getEditMode()" v-model="question.content"></TextEditor>
            <slot name="question" :question="question" :options="options" :type="type">
            </slot>
        </div>
        <!-- 作题区 -->
        <ul class="options">
            <!-- 单选 -->
            <li v-if="type.enumName == 'SIGNAL_CHOICE' || type.enumName == 'JUDGMENTAL'">
                <a-radio-group v-model="choiceCorrect" direction="vertical">
                    <a-radio :value="index" style="margin:5px" class="option-item" v-for="(item, index) in options" :key="item.id">
                        <template #radio="{ checked }">
                            <div>
                                <span class="letter" :class="{ 'letter-active': checked }">
                                    {{ letterList[index] }}
                                </span>
                                <slot name="option" :option="item" :index="index" :type="type">
                                </slot>
                            </div>
                            <TextEditor  @blur="$emit('editorBlur','option',index)" :mode="getEditMode(type.itemsConfig.editMode)" v-model="item.content">
                            </TextEditor>
                        </template>
                    </a-radio>
                </a-radio-group>
            </li>
            <!-- 多选 -->
            <li v-else-if="type.enumName == 'MULTIPLE_CHOICE'">
                <a-checkbox-group v-model="choiceCorrect" direction="vertical">
                    <a-checkbox :value="index" style="margin:5px" class="option-item"
                        v-for="(item, index) in options" :key="item.id">
                        <template #checkbox="{ checked }">
                            <div>
                                <span class="letter " style="border-radius:10px" :class="{ 'letter-active': checked }">
                                    {{ letterList[index] }}
                                </span>
                                <slot name="option" :option="item" :index="index" :type="type">
                                </slot>
                            </div>
                            <TextEditor @blur="$emit('editorBlur','option',index)" :mode="getEditMode(type.itemsConfig.editMode)" v-model="item.content">
                            </TextEditor>
                        </template>
                    </a-checkbox>
                </a-checkbox-group>
            </li>

            <!-- 填空题 -->
            <template v-else-if="type.enumName == 'COMPLETION'">
                <li class="option-item" v-for="(item, index) in options" :key="item.id" :class="type.enumName">
                    <div>
                        <span class="number">
                            第{{ index + 1 }}空：
                        </span>
                        <slot name="option" :option="item" :index="index" :type="type">
                        </slot>
                    </div>
                    <TextEditor :lazy="props.lazy" @blur="$emit('editorBlur','option',index)" mode="editor" v-model="item.answer"></TextEditor>
                </li>
                <!-- 选项底部 -->
            </template>

            <!-- 主观题 -->
            <li v-else-if="type.enumName == 'SUBJECTIVE'">
                <span class="number">答：</span>
                <slot name="subject" :option="options[0]">
                    <TextEditor :lazy="props.lazy" @blur="$emit('editorBlur','subject')" :key="options[0].id" :mode="getEditMode(type.itemsConfig.editMode)" v-model="options[0].answer">
                    </TextEditor>
                </slot>
            </li>
            <li v-else-if="type.enumName == 'FILE'">
                <slot name="file" :option="options[0]">
                    <a-button>下载</a-button>
                    <a-button>预览</a-button>
                </slot>
            </li>
            <li v-else-if="type.enumName == 'CODE'">
                <slot name="code" :option="options[0]">
                    <a-button>下载</a-button>
                    <a-button>预览</a-button>
                </slot>
            </li>
            <li>
                <slot name="option_footer">
                </slot>
            </li>
        </ul>
        <slot name="body"></slot>
        <!-- 答案区 -->
        <div class="answer" v-if="showArea.answer">
            <span class="title">答案：</span>
            <TextEditor :lazy="props.lazy" mode="preview" v-model="getCorrect"></TextEditor>
        </div>
        <!-- 解析区 -->
        <div class="analysis" v-if="showArea.analysis">
            <span class="title">解析：</span>
            <slot name="analysis">
                <TextEditor :lazy="props.lazy" @blur="$emit('editorBlur','analysis')" :mode="getEditMode()" v-model="question.analysis"></TextEditor>
            </slot>
        </div>
        <!-- 难易程度  -->
        <div class="public" v-if="showArea.difficulty">
            <span class="title">难易程度：</span>
            <slot name="difficulty">
                <a-rate v-model:model-value="question['difficulty']" @change="$emit('editorBlur','difficulty',$event)" :readonly="props.mode!='editor'" />
            </slot>
        </div>
        <slot name="footer"></slot>

    </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { getQuestionType, letterList } from '../utils/question-config';
import TextEditor from './TextEditor.vue'

// 该组件只提供题目预览，课通过插槽修改默认内容
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
    mode: {
        type: String,
        default: "preview",
        validator(value) {
            // The value must match one of these strings
            return ['preview', 'answer', 'editor'].includes(value)
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
    lazy: {
        type: Boolean,
        default: false
    },
    showArea: {
        type: [Object, Boolean],
    }
})
const emit = defineEmits(
    ['choiceCorrect','editorBlur', 'update:question']
)
const question = computed({
    get() {
        return props.question;
    },
    // setter
    set(newValue) {
        // 注意：我们这里使用的是解构赋值语法
        emit('update:question', newValue)
    }
})



const getEditMode = (initMode = 'preview') => {
    // type.value.itemsConfig.editMode
    if (props.mode == 'editor') {
        return 'editor'
    } else if (props.mode == 'preview') {
        return 'preview'
    }
    return initMode;
}

const showArea = computed(() => {
    const def = {
        answer: false,
        analysis: false,
        difficulty: false
    }
    if (typeof props.showArea == 'boolean') {
        Object.keys(def).forEach(key => {
            def[key] = props.showArea
        })
    }
    return def
})

// 单选/多选答案,
const choiceCorrect = computed({
    get() {
        const corrects = []
        options.value.forEach((value, index) => {
            if (value.answer != null) {
                corrects.push(index)
            }
        })
        //填空题返回数组
        if (type.value.enumName == 'MULTIPLE_CHOICE') {
            return corrects
        }
        return corrects[0]??-1
    },
    // setter
    set(newValue) {
        console.log(newValue)
        emit('choiceCorrect',newValue)
    }
})
const type = computed(() => {
    return getQuestionType(props.topicType)
})

//如果 myoption存在->合并到option
const options = computed(() => {
    const option = [...props.options]
    if (type.value.enumName == 'SUBJECTIVE' && option[0] == undefined) {
        option[0] = [{ content: '' }]
    }
    if (props.myOptions) {

    }
    return option
})
//获取答案内容
const getCorrect = computed(() => {
    const answer = []
    for (let i = 0; i < options.value.length; i++) {
        if (options.value[i].answer) {
            // 单、多、判断
            if (type.value.itemsConfig.prexType == 'letter') {
                answer.push(letterList[i]);
            } else {
                answer.push(options.value[i].content)
            }
        }
    }
    if (answer.length == 0) {
        answer.push('无')
    }
    return answer.join('；')
})
</script>
<style lang="less" scoped>
:deep(.arco-radio-group){
    display:block;
}
:deep(.arco-checkbox-group){
    display:block;
}
.preview {
    padding: 10px;


    .question-info {
        margin-right: 5px;
        line-height: 25px;

        .info {
            float: left;
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
        margin-left: 0;

        .option-item {
            padding: 10px;
            cursor: pointer;
            border-radius: 10px;
            transition: all .5s;
            overflow: hidden;

            &:hover {
                .letter {
                    border: 1px solid rgb(var(--primary-5));
                }

                background-color: rgb(var(--primary-1), 0.8);
            }

        }

        .letter {
            height: 35px;
            width: 35px;
            text-align: center;
            border: 1px solid var(--color-fill-3);
            border-radius: 50%;
            line-height: 35px;
            transition: all .3s;
            margin: 0 5px;
            float: left;
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
    .answer {
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
</style>
