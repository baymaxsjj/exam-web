<template>
    <a-page-header title="导入题库" @back="$router.back">
        <template #extra>
            <a-button-group>
                <a-button @click="configModal = true">
                    <template #icon>
                        <icon-sort />
                    </template>
                    题目配置
                </a-button>
                <a-button  @click="tagModal = true">
                    <template #icon>
                        <icon-star />
                    </template>
                    选择标签
                </a-button>
                <a-button status="success" @click="analyzeText">
                    <template #icon>
                        <icon-search />
                    </template>
                    预览
                </a-button>
                <a-button type="primary"><template #icon>
                        <icon-share-external />
                    </template>导入</a-button>
            </a-button-group>
        </template>
    </a-page-header>
    <div class="batch-import">
        <TextEditor :config="config" v-model:model-value="text" :edit-hight="300" class="editor"></TextEditor>
        <ul v-if="list.length != 0" class="preview">
            <li v-for="(item, index) in list" :key="index">
                <BaseQuestionPreview :number="index + 1" :topic-type="item['type']" :question="item"
                    :options="item['topicItems']"></BaseQuestionPreview>
            </li>
        </ul>
        <a-empty class="empty" v-else />
    </div>
    <a-modal simple v-model:visible="configModal" title="题目配置">
        <!-- 难易程度  -->
        <a-form>
            <a-form-item  v-for="item in questionType">
                <template #label>
                    <span style="font-size: 16px;font-weight:bold;">{{item.simpleName}}</span>
                </template>
                <a-row :gutter="24">
                <a-col :span="24">
                    <a-form-item field="value1" label="难度" >
                        <a-rate />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item field="value1" label="分值" >
                        <a-input-number  @blur="saveQuestion('score')"
                    placeholder="输入分值" :default-value="5" mode="button" class="input-demo" />
                    </a-form-item>
                </a-col>
                </a-row>
                   
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal simple v-model:visible="tagModal" title="选择导入分组">
        <QuestionTagTree />
    </a-modal>
</template>
<script setup>
import TextEditor from '../../components/TextEditor.vue';
import BaseQuestionPreview from '../../components/BaseQuestionPreview.vue';
import { analyzeQuestionTextRequest } from '../../apis/question-api';
import { ref } from 'vue';
import QuestionTagTree from '../../components/QuestionTagTree.vue';
import { questionType } from '../../utils/question-config';
const list = ref([])
const text = ref("")
const configModal = ref(false)
const tagModal = ref(false)
const config = {

}

const analyzeText = () => {
    analyzeQuestionTextRequest(text.value).then(res => {
        list.value = res.data.data
    })
}
const showConfigModal = () => {

}
const showTagModal = () => {

}

</script>
<style lang="less" scoped>
.batch-import {
    display: flex;

    .editor,
    .empty,
    .preview {
        flex: 1;
    }
}
</style>