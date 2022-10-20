<template>
    <div class="question-preview" :class="props.mode">
        <!-- 题目 -->
        <p class="question-header">
            <!-- 序号 -->
            <span class="number">
                <slot name="number">
                </slot>
            </span>
            <!-- 类型 -->
            <span class="type-name">({{type.simpleName}})</span>
            <!-- 内容 -->
            <span class="topic" v-if="props.mode!='simple-editor'">{{props.questionInfo.content}}</span>
            <QuestionEditor :vditorId="'question'+props.id" :mode="props.editMode" v-else :default-value="props.questionInfo.content" />
        </p>
        <!-- 答题/类别 -->
        <div class="question-body">
            <ul v-if="type.enumName!='SUBJECTIVE'">
                <li v-for="(item,index) in props.questionInfo.topicItems" :key="item.id">
                    <!-- 单、多、判 -->
                    <p class="option" v-if="type.itemsConfig.prexType=='letter'">
                        <span class="letter">{{letterList[index]}}</span>
                        <span>{{item.content}}</span>
                    </p>
                    <!-- 填空题 -->
                    <div v-if="type.enumName=='COMPLETION'" class="completion">
                        <p class="option" v-if="props.mode=='display'">
                            <span class="letter">{{index+1}}.</span>
                            <span>{{item.content}}</span>
                        </p>
                        <div v-else>
                            <span class="number">第{{index+1}}空</span>
                            <QuestionEditor :vditorId="'completion'+props.id" :mode="props.editMode" :default-value="item.content" />
                        </div>
                    </div>
                </li>
            </ul>
            <!-- 主观题答题区 -->
            <span v-else>

            </span>
        </div>
        <!-- 解析 -->
        <div class="question-footer" v-if="props.mode!='answer'">
            <!-- <span></span> -->
            <p v-if="props.mode=='display'">
                <span class="analyis-name">解析:</span>{{props.questionInfo.analysis}}

            </p>
            <div v-else>
                <span class="analyis-name">解析:</span>
                <QuestionEditor :vditorId="'analyis'+props.id" :mode="props.editMode" :default-value="props.questionInfo.analysis" />
            </div>
        </div>
    </div>
</template>
<script setup>
import { getQuestionType, letterList } from '../utils/question-config';
import QuestionEditor from './QuestionEditor.vue';
const props = defineProps({
    questionInfo: Object,
    editMode: {
        type: String,
        default: 'simple',
        validator(value) {
            // The value must match one of these strings
            return ['simple', 'rich'].includes(value)
        },
    },
    mode: {
        type: String,
        default: 'display',
        validator(value) {
            // The value must match one of these strings
            return ['display', 'simple-editor', 'answer'].includes(value)
        }
    }
})
const type = getQuestionType(props.questionInfo.type)
</script>
<style lang="less" scoped>
.question-preview {
    color: var(--color-text-1);
    line-height: 25px;
    padding: 10px 0;

    .question-header {
        margin-bottom: 20px;

        .type-name {
            color: var(--color-text-3);
            margin: 0 5px;
        }

    }

    .question-body {
        padding-left: 10px;
        margin-bottom: 20px;

        .option {
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;

            .letter {
                margin-right: 5px;
                font-size: 16px;
            }
        }

        .completion {
            .number {
                margin: 10px 0;
                display: block;
                color: var(--color-text-3);
            }
        }
    }

    .question-footer {
        background-color: var(--color-fill-2);
        padding: 15px;
        border-radius: 5px;
        margin-left: 10px;

        .analyis-name {
            color: var(--color-text-3);
        }
    }
}

.simple-editor,
.answer {
    .question-body {
        .option {
            &:hover {
                background-color: var(--color-fill-2);

                .letter {
                    border: 1px solid rgb(var(--primary-6));
                    background-color: rgb(var(--primary-1));
                    color: rgb(var(--primary-6));
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
                margin-right: 15px;
            }
        }
    }

}
</style>