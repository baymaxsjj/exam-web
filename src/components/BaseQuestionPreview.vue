<template>
    <!-- 怎么说能，前几个要么过于复杂，要么简单，所以综合之间 -->
    <!-- 本组件用户编辑，显示，作答，不提供逻辑，只提供事件 -->
    <div class="preview" :class="props.mode">
        <!-- 题目区 -->
        <div class="question-info">
            <div class="info" @click="$emit('markQuestion',props.number,question)">
                <slot name="number"></slot>
                <span class="number" v-if="props.number">{{ props.number }}. </span>
                <span class="type-name"> ({{ type.simpleName }} {{ question.score }}分)：</span>
            </div>
            <TextEditor @blur="$emit('editorBlur', 'question')" :mode="getEditMode()" v-model="question.content">
            </TextEditor>
            <slot name="question" :question="question" :options="options" :type="type">
            </slot>
        </div>
        <!-- 作题区 -->
        <ul class="options">
            <!-- 单选 -->
            <li v-if="type.enumName == 'SIGNAL_CHOICE' || type.enumName == 'JUDGMENTAL'">
                <a-radio-group v-model="choiceCorrect" direction="vertical">
                    <a-radio :value="index" style="margin:5px" class="option-item" v-for="(item, index) in options"
                        :key="item.id">
                        <template #radio="{ checked }">
                            <div>
                                <span class="letter" :class="{ 'letter-active': checked }">
                                    {{ letterList[index] }}
                                </span>
                                <slot name="option" :option="item" :index="index" :type="type">
                                </slot>
                            </div>
                            <TextEditor @blur="$emit('editorBlur', 'option', index)"
                                :mode="getEditMode(type.itemsConfig.editMode)" v-model="item.content">
                            </TextEditor>
                        </template>
                    </a-radio>
                </a-radio-group>
            </li>
            <!-- 多选 -->
            <li v-else-if="type.enumName == 'MULTIPLE_CHOICE'">
                <a-checkbox-group v-model="choiceCorrect" direction="vertical">
                    <a-checkbox :value="index" style="margin:5px" class="option-item" v-for="(item, index) in options"
                        :key="item.id">
                        <template #checkbox="{ checked }">
                            <div>
                                <span class="letter " style="border-radius:10px" :class="{ 'letter-active': checked }">
                                    {{ letterList[index] }}
                                </span>
                                <slot name="option" :option="item" :index="index" :type="type">
                                </slot>
                            </div>
                            <TextEditor @blur="$emit('editorBlur', 'option', index)"
                                :mode="getEditMode(type.itemsConfig.editMode)" v-model="item.content">
                            </TextEditor>
                        </template>
                    </a-checkbox>
                </a-checkbox-group>
            </li>

            <!-- 填空题 -->
            <template v-else-if="type.enumName == 'COMPLETION'">
                <li class="option-item" v-for="(item, index) in options" :key="item.id" :class="type.enumName">
                    <div class="number">
                        <span>
                            第{{ index + 1 }}空：
                        </span>
                        <slot name="option" :option="item" :index="index" :type="type">
                        </slot>
                    </div>
                    <TextEditor :lazy="props.lazy" @blur="$emit('editorBlur', 'option', index)"
                        :mode="getEditMode(type.itemsConfig.editMode)" v-model="item.answer"></TextEditor>
                </li>
                <!-- 选项底部 -->
            </template>

            <!-- 主观题 -->
            <li v-else-if="type.enumName == 'SUBJECTIVE'" class="SUBJECTIVE">
                <div class="number">
                    <span>答：</span>
                </div>
                <slot name="subject" :option="options[0]">
                    <TextEditor :lazy="props.lazy" @blur="$emit('editorBlur', 'subject')" :key="options[0].id"
                        :mode="getEditMode(type.itemsConfig.editMode)" v-model="options[0].answer">
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
        <!-- 难易程度  -->
        <div class="public" v-if="showArea.difficulty">
            <a-tag color="orangered" style="margin-top: 5px" class="title">难易程度：</a-tag>
            <slot name="difficulty">
                <a-rate v-model:model-value="question['difficulty']" @change="$emit('editorBlur', 'difficulty', $event)"
                    :readonly="props.mode != 'editor'" />
            </slot>
        </div>
        <!-- 答案区 -->
        <div class="answer" v-if="showArea.answer">
            <a-tag color="green" class="title">答案：</a-tag>
            <TextEditor :lazy="props.lazy" mode="preview" v-model="getCorrect"></TextEditor>
        </div>
        <!-- 解析区 -->
        <div class="analysis" v-if="showArea.analysis">
            <a-tag color="blue" class="title">解析：</a-tag>
            <slot name="analysis">
                <TextEditor :lazy="props.lazy" @blur="$emit('editorBlur','analysis')" :mode="getEditMode()"
                    v-model="question.analysis"></TextEditor>
            </slot>
        </div>

        <slot name="footer"></slot>

    </div>
</template>
<script setup>
import { computed } from 'vue';
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
            return ['preview', 'answer', 'editor', 'review'].includes(value)
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
    ['choiceCorrect','markQuestion', 'editorBlur', 'update:question', 'update:options']
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
    } else if (['preview', 'review'].includes(props.mode)) {
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
        return corrects[0] ?? -1
    },
    // setter
    set(newValue) {
        console.log(newValue)
        emit('choiceCorrect', newValue)
    }
})
const type = computed(() => {
    return getQuestionType(props.topicType)
})

//如果 myoption存在->合并到option
const options = computed({
    get() {
        //引用的数据，会直接修改props
        let temOptions = props.options
        if (props.mode == 'review') {
            temOptions = JSON.parse(JSON.stringify(props.options))
            for (const option of temOptions) {
                //去除答案
                option.answer = null
                for (const myOption of props.myOptions) {
                    //添加自己的答案
                    if (myOption.optionId == option.id) {
                        option.answer = myOption.answer;
                    }
                }
            }
        } else if (type.value.enumName == 'SUBJECTIVE' && temOptions[0] == undefined) {
            temOptions[0] = [{ content: '' }]
        }
        return temOptions
    },
    set(newValue) {
        console.log(newValue)
        emit("update:options", newValue)
    }
})
//获取答案内容
const getCorrect = computed(() => {
    const answer = []
    props.options.forEach((option, index) => {
        if (option.answer) {
            // 单、多、判断
            if (type.value.itemsConfig.prexType == 'letter') {
                answer.push(letterList[index]);
            } else {
                answer.push(option.answer)
            }
        }
    })

    if (answer.length == 0) {
        answer.push('无')
    }
    return answer.join('；')
})
</script>
<style lang="less" scoped>
:deep(.arco-radio-group) {
    display: block;
}

:deep(.arco-checkbox-group) {
    display: block;
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
        overflow: hidden;

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
            color: var(--color-text-1);
        }

        .letter-active {
            border: 1px solid rgb(var(--primary-6));
            background-color: rgb(var(--primary-1));
            color: rgb(var(--primary-6));
        }

        .SUBJECTIVE,
        .COMPLETION {
            .number {
                color: var(--color-text-3);
                float: left;
                line-height: 25px;
            }
        }

        .underline {
            display: block;
            border-bottom: 1.5px solid var(--color-text-4);
            flex: 1;
            height: 15px;
        }
    }

    .analysis,
    .answer,
    .public {
        margin: 10px 0;
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

.answer,
.editor {
    .options {
        .SUBJECTIVE,
        .COMPLETION {
            .number {
                float: none;
                line-height: normal;
            }
        }
    }
}
.answer{
    .question-info {
        .info {
            cursor: pointer;
        }
    }
}
</style>
