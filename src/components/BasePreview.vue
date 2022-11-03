<template>
    <div class="preview">
        <!-- 题目区 -->
        <div class="question-info">
           <div class="info">
                <span class="number" v-if="props.number">{{ props.number }}. </span>
                <span class="type-name"> ({{ type.simpleName }} {{ question.score }}分)：</span>
           </div>
            <slot name="question">
                <BaseEditor :initialValue="question.content"></BaseEditor>
            </slot>
        </div>
        <!-- 作题区 -->
        <ul class="options">
            <template v-if="type.enumName != 'SUBJECTIVE'">
                <li class="option-item" v-for="(item, index) in options" :class="type.enumName"
                    @click="optionClick(item)">
                    <span class="letter" v-if="type.itemsConfig.prexType == 'letter'"
                        :class="{ 'letter-active': item.correct != null }">
                        {{ letterList[index] }}
                    </span>
                    <span class="number" v-if="type.itemsConfig.prexType == 'number'">
                        第{{ index + 1 }}空：
                    </span>
                    <slot name="option" :option="item" :index="index" :type="type">
                        <BaseEditor :initialValue="item.content"></BaseEditor>
                    </slot>
                </li>
            </template>
            <li v-else>
                <span class="number">答：</span>
                <slot name="subject" :option="options[0]">
                    <BaseEditor :initial-value="options[0].content"></BaseEditor>
                </slot>
            </li>
        </ul>
        <slot name="body"></slot>
        <!-- 答案区 -->
        <div class="correct" v-if="showArea.correct">
            <span class="title">答案：</span>
            <BaseEditor :initialValue="getCorrect"></BaseEditor>
        </div>
        <!-- 解析区 -->
        <div class="analysis" v-if="showArea.analysis">
            <span class="title">解析：</span>
            <slot name="analysis">
                <BaseEditor :initialValue="question.analysis"></BaseEditor>
            </slot>
        </div>
        <!-- 难易程度  -->
        <div class="public" v-if="showArea.difficulty">
            <span class="title">难易程度：</span>
            <slot name="difficulty">
                <a-rate v-model:model-value="question['difficulty']" readonly />
            </slot>

        </div>
        <slot name="footer"></slot>

    </div>
</template>
<script setup>
import { reactive, ref, computed, watch } from 'vue';
import { getQuestionType, letterList } from '../utils/question-config';
import BaseEditor from './BaseEditor.vue'
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
    options: {
        type: Array,
        default: []
    },
    myOptions: {
        type: Array,
        default: []
    },
    showArea: {
        type: [Object , Boolean],
    }
})

const emit = defineEmits(
    ['optionClick']
)
const showArea = computed(() => {
    const def = {
        correct: false,
        analysis: false,
        difficulty: false
    }
    if(typeof props.showArea=='boolean'){
        Object.keys(def).forEach(key=>{
            def[key]=true
        })
    }
    return def
})
const type = computed(() => {
    return getQuestionType(props.topicType)
})

//如果 myoption存在->合并到option
const options = computed(() => {
    const option = [...props.options]
    console.log(type.enumName )
    if (type.value.enumName == 'SUBJECTIVE' && option[0] == undefined) {
        option[0] = [{ content: '' }]
    }
    console.log(option)
    if (props.myOptions) {

    }
    return option
})
//选项点击
const optionClick = (item) => {
    emit("optionClick", item)
}
//获取答案内容
const getCorrect = computed(() => {
    const correct = []
    for (let i = 0; i < options.value.length; i++) {
        if (options.value[i].correct) {
            // 单、多、判断
            if (type.value.itemsConfig.prexType == 'letter') {
                correct.push(letterList[i]);
            } else {
                correct.push(options.value[i].content)
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


    .question-info {
        margin-right: 5px;
        line-height: 25px;
        .info{
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
            display: flex;
            align-items: center;
            border-radius: 10px;
            transition: all .5s;

            &:hover {
                .letter {
                    border: 1px solid rgb(var(--primary-5));
                }

                background-color: rgb(var(--primary-1), 0.8);
            }

        }

        .COMPLETION,
        .SUBJECTIVE {
            display: block;
        }

        .MULTIPLE_CHOICE {
            .letter {
                border-radius: 10px
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
</style>
