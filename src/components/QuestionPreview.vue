<template>
    <div class="question-preview" :class="props.mode">
        <!-- <a-spin dot :loading="loading"> -->

        <!-- 题目 -->
        <p class="question-header" :class="{'question-flex':editMode.question=='preview'}">
            <!-- 删除按钮 编辑模式显示 -->
            <a-button v-if="isEdit&&questionInfo.id" @click="delQuestion" status="danger" class="delete-btn">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button>
            <!-- 序号 -->
            <span class="number">
                <slot name="number">
                </slot>
            </span>
            <!-- 类型 -->
            <span class="type-name">({{type.simpleName}})</span>
            <!-- 内容 -->
            <QuestionEditor @blur="updateQuestion" :mode="editMode.question" v-model:model-value="questionInfo.content" />
        </p>
        <!-- 答题/类别 -->
        <div class="question-body">
            <!-- 展示模式下 不显示填空题 -->
            <ul v-if="type.enumName!='SUBJECTIVE'&&(props.mode!='display'||type.enumName!='COMPLETION')">
                <li v-for="(item,index) in questionInfo.topicItems" :key="item.id">
                    <!-- 单、多、判 -->
                    <!-- 填空题 -->
                    <div class="option" :class="{'option-latter':type.itemsConfig.prexType=='letter'}">
                        <!-- 删除按钮 编辑模式下 有选择项的显示 -->
                        <a-button v-if="isEdit&&item.id" @click="delItemOption(item.id)" status="danger"
                            class="delete-btn">
                            <template #icon>
                                <icon-delete />
                            </template>
                        </a-button>
                        <span v-if="type.itemsConfig.prexType=='letter'" class="letter" @click="updateCorrect(item.id)"
                            :class="{'letter-active':item.correct!=null}">{{letterList[index]+(props.mode=='display'?".":"")}}</span>
                        <span class="number"
                            v-if="type.itemsConfig.prexType=='number'">{{props.mode=='display'?(index+1)+".":`第${index+1}空`}}</span>
                        <QuestionEditor  @blur="updateQuestionItem" :mode="editMode.option"
                            v-model:model-value="questionInfo.topicItems[index].content" />
                    </div>
                </li>
                <!--添加选项 编辑模式显示 -->
                <a-button @click="addOption" v-if="isEdit&&type.enumName!='SUBJECTIVE'" long size="large"
                    style="margin:10px 0">添加选项</a-button>
            </ul>
            <!-- 主观题答题区  非展示模式显示-->
            <span class="subjective" v-if="props.mode!='display'&&type.enumName=='SUBJECTIVE'">
                <span class="analyis-name">答：</span>
                <QuestionEditor  @blur="updateQuestionItem" :mode="editMode.option" v-model:model-value="questionInfo.topicItems[0].content" />
            </span>
        </div>
        <!-- 答案 展示模式显示 -->
        <div v-if="props.mode=='display'" class="question-footer">
            <span class="analyis-name">答案：</span>{{getCorrect}}
        </div>
        <!-- 解析 非作答模式显示-->
        <div class="question-footer" v-if="props.mode!='answer'">
            <!-- <span></span> -->
            <span class="analyis-name">解析：</span>
            <QuestionEditor  @blur="updateAnalysit" v-if="questionInfo.analysis||isEdit" :mode="editMode.analysis"
                v-model:model-value="questionInfo.analysis" />
            <span v-else>无</span>
        </div>
        <!-- 保存按钮 创建模式显示 -->
        <div v-if="isEdit&&questionInfo.id==null">
            <a-button type="primary" long size="large" style="margin:10px 0">保存题目</a-button>
        </div>
        <!-- </a-spin> -->
    </div>
</template>
<script setup>
import { Message } from '@arco-design/web-vue';
import { reactive, ref, computed } from 'vue';
import { delQuestionItemRequest, delQuestionRequest, updateQuestionItemRequest, updateQuestionCorrectRequest, updateQuestionRequest } from '../apis/question-api';
import { getQuestionType, letterList } from '../utils/question-config';
import QuestionEditor from './QuestionEditor.vue';
const props = defineProps({
    questionInfo: {
        type: Object,
        default: {
            "content": "",
            "type": "MULTIPLE_CHOICE",
            "analysis": "",
            "isPublic": "course",
            "tagId": 4,
            "topicItems": []
        }
    },
    mode: {
        type: String,
        default: 'simple-editor',
        validator(value) {
            // The value must match one of these strings
            return ['display', 'answer', 'simple-editor', 'editor',].includes(value)
        }
    }
})
const questionInfo = reactive(props.questionInfo)
const type = getQuestionType(questionInfo.type)
const loading = ref(false)
const editMode = computed(() => {
    let mode = getMode('preview')
    switch (props.mode) {
        case 'simple-editor':
            mode = getMode('simple')
            break
        case 'editor':
            mode = getMode('rich')
            break
        case 'answer':
            mode.question = 'preview'
            if (type.enumName == 'COMPLETION' || type.enumName == 'SUBJECTIVE') {
                mode.option = 'rich'
            } else {
                mode.option = 'preview'
            }
            break;
    }
    return mode;
})
const getMode = (mode) => {
    return {
        question: mode,
        option: mode,
        analysis: mode
    }
}
const isEdit = computed(() => {
    return ['simple-editor', 'editor',].includes(props.mode)
})

const addOption = () => {
    const item = questionInfo['topicItems'];
    if (item.length == 0 || item[item.length - 1].id != undefined) {
        questionInfo['topicItems'].push({
            "content": "",
        })
    } else {
        Message.info("请完成当前选择后，在添加~")
    }

}
const delItemOption = (itemId) => {
    delQuestionItemRequest(itemId).then(() => {
        const topicItems = questionInfo['topicItems'];
        for (let i = 0; i < topicItems.length; i++) {
            console.log(topicItems[i]['id'])
            if (topicItems[i]['id'] == itemId) {
                topicItems.splice(i, 1);
                break
            }
        }
    })
}
const delQuestion = () => {
    delQuestionRequest(questionInfo.id).then(res => {

    })
}
const updateCorrect = (id) => {
    if (!isEdit.value) {
        return
    }
    if (id == undefined) {
        Message.info('该选项未保存');
        return
    }

    loading.value = true;
    updateQuestionCorrectRequest(id).then(res => {
        loading.value = false;
        const topicItems = questionInfo['topicItems'];
        for (let i = 0; i < topicItems.length; i++) {
            const item = topicItems[i];
            if (item['id'] == id) {
                if (type.enumName == 'MULTIPLE_CHOICE') {
                    if (item['correct'] != null) {
                        item['correct'] = null
                    } else {
                        item['correct'] = 1
                    }
                } else {
                    item['correct'] = 1
                }
            } else {
                if (type.enumName != 'MULTIPLE_CHOICE') {
                    item['correct'] = null
                }
            }
        }
    })
}
//获取答案内容
const getCorrect = computed(() => {
    const topicItems = questionInfo['topicItems']
    const correct = []
    for (let i = 0; i < topicItems.length; i++) {
        // 单、多、判断
        if (type.itemsConfig.prexType == 'letter') {
            correct.push(letterList[i]);
        } else {
            console.log()
            correct.push(topicItems[i].content)
        }
    }
    return correct.join('；')
})
const updateAnalysit = (value) => {
    if(isEdit){

    }
}
const updateQuestion = (value) => {
    if(isEdit){
        
    }
}
const updateQuestionItem = (value) => {
    if(isEdit){
        
    }
}
</script>
<style lang="less" scoped>
.question-preview {
    color: var(--color-text-1);
    line-height: 25px;
    padding: 10px 0;

    .delete-btn {
        margin: 5px;
    }

    .question-header {
        margin-bottom: 20px;

        .type-name {
            color: var(--color-text-3);
            margin: 0 5px;
        }

    }

    .question-body {
        margin: 0 10px;
        margin-bottom: 20px;

        .option {
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;

            .letter {
                margin-right: 5px;
                font-size: 16px;
            }

            .number {
                margin: 10px 0;
                color: var(--color-text-3);
            }
        }

    }
    .subjective {
        color: var(--color-text-3);
    }
    .question-footer{
        background-color: var(--color-fill-2);
        padding: 15px;
        border-radius: 5px;
        margin: 10px;

        .analyis-name {
            color: var(--color-text-3);
        }
    }
}

.display,
.answer {
    .option-latter {
        display: flex;
        align-items: center;
    }

    .question-flex {
        display: flex;
        align-items: center;
    }

}


.editor,
.simple-editor,
.answer {
    .question-body {
        .option {
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

            .letter-active {
                border: 1px solid rgb(var(--primary-6));
                background-color: rgb(var(--primary-1));
                color: rgb(var(--primary-6));
            }
        }
    }

}

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
        }
    }
}
</style>