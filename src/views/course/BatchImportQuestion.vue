<template>
    <a-page-header title="导入题库" @back="$router.back">
        <template #extra>
            <a-select placeholder="匹配规则" v-model="defalutRule" style="margin-right:10px;width: 150px;">
                <a-option v-for="(item, key) in batchRules" :value="key">{{ item }}</a-option>
                <a-option @click="rulesMode = true" value="custom">自定义</a-option>
            </a-select>
            <a-button-group style="margin-right:10px;">
                <a-button @click="configModal = true">
                    <template #icon>
                        <icon-sort />
                    </template>
                    题目配置
                </a-button>
                <a-button @click="tagModal = true">
                    <template #icon>
                        <icon-star />
                    </template>
                    选择标签
                </a-button>
            </a-button-group>
            <a-button-group>
                <a-button status="success" @click="analyzeText">
                    <template #icon>
                        <icon-search />
                    </template>
                    预览
                </a-button>
                <a-button type="primary" @click="batchQuestion"><template #icon>
                        <icon-share-external />
                    </template>导入</a-button>
            </a-button-group>
        </template>
    </a-page-header>
    <a-spin dot :loading="loading" style="display:block">
        <div class="batch-import">
        <BaseTextEditor :config="editorConfig" v-model:model-value="text" :edit-hight="300" class="editor"></BaseTextEditor>
        <ul v-if="list.length != 0" class="preview">
            <li v-for="(item, index) in list" :key="index">
                <BaseQuestionPreview :number="index + 1" :topic-type="item['type']" :question="item"
                    :options="item['topicItems']"></BaseQuestionPreview>
            </li>
        </ul>
        <a-empty class="empty" v-else />
    </div>
    </a-spin>
   
    <a-modal simple v-model:visible="configModal" title="题目配置">
        <!-- 难易程度  -->
        <a-form>
            <a-form-item v-for="item in questionType">
                <template #label>
                    <span style="font-size: 16px;font-weight:bold;">{{ item.simpleName }}</span>
                </template>
                <a-row :gutter="24">
                    <a-col :span="24">
                        <a-form-item field="value1" label="难度">
                            <a-rate />
                        </a-form-item>
                    </a-col>
                    <a-col :span="24">
                        <a-form-item field="value1" label="分值">
                            <a-input-number @blur="saveQuestion('score')" placeholder="输入分值" :default-value="5"
                                mode="button" class="input-demo" />
                        </a-form-item>
                    </a-col>
                </a-row>

            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal simple v-model:visible="tagModal" title="选择导入分组">
        <QuestionTagTree @select="" />
    </a-modal>
    <a-modal simple v-model:visible="rulesMode" title="匹配规则">
        <a-form :model="customRule" auto-label-width>
            <a-form-item field="value1" label="题目分割规则">
                <a-input v-model="customRule.divisionRule" placeholder="请输入正则规则" />
            </a-form-item>
            <a-form-item field="value1" label="题目匹配规则">
                <a-input v-model="customRule.questionRule" placeholder="请输入正则规则" />
            </a-form-item>
            <a-form-item field="value1" label="题目选项规则">
                <a-input v-model="customRule.optionRule" placeholder="请输入正则规则" />
            </a-form-item>
            <a-form-item field="value1" label="答案匹配规则">
                <a-input v-model="customRule.answerRule" placeholder="请输入正则规则" />
            </a-form-item>
            <a-form-item field="value1" label="答案分割规则">
                <a-input v-model="customRule.answerSplit" placeholder="请输入正则规则" />
            </a-form-item>
        </a-form>
    </a-modal>
    <a-modal simple v-model:visible="resultMode" title="导入结果">
        <div class="batchResult">
            <a-statistic class="success" title="成功个数" :value="batchSuccesCount" :value-from="0" animation>
                <template #prefix>
                    <icon-arrow-rise />
                </template>
                <template #suffix>题</template>
            </a-statistic>

            <a-statistic class="failed" title="失败个数" :value="batchResult.length - batchSuccesCount" :value-from="0"
                animation>
                <template #prefix>
                    <icon-arrow-rise />
                </template>
                <template #suffix>题</template>
            </a-statistic>
        </div>
        <a-list :max-height="300">
            <a-list-item v-for="(item, index) of list">
                <a-tag :color="getBatchResult(index) ? 'green' : 'red'">
                    {{ getBatchResult(index) ? "成功" : `失败：${batchResult[index]}` }}</a-tag>
                {{ item.content }}
            </a-list-item>
        </a-list>
    </a-modal>
</template>
<script setup>
import BaseTextEditor from '../../components/BaseTextEditor.vue';
import BaseQuestionPreview from '../../components/BaseQuestionPreview.vue';
import { parseQuestionTextRequest, batchQuestionRequest, questionRulesRequest } from '../../apis/question-api';
import { computed, ref } from 'vue';
import QuestionTagTree from '../../components/QuestionTagTree.vue';
import { questionType } from '../../utils/question-config';
import { useRoute } from 'vue-router';
import { Message } from '@arco-design/web-vue';
const route = useRoute()
const tagId = ref(route.query["tagId"])
const courseId = route.params['courseId']
const loading=ref(false)
const list = ref([])
const text = ref("")
// 对话框显示
const configModal = ref(false)
const tagModal = ref(false)
const resultMode = ref(false)
const rulesMode = ref(false)
// 匹配结果
const batchResult = ref([])
// 匹配规则
const batchRules = ref({})
// 题目配置
const config = ref([])
//编辑器配置
const editorConfig = ref({
    plugins: "autoresize"
})
const defalutRule = ref(null)
const customRule = ref({
    divisionRule: "",
    questionRule: "",
    answerRule: "",
    answerSplit: "",
    optionRule: ""
})

const analyzeText = () => {
    let customRu = null;
    let defalutRu = defalutRule.value
    if (defalutRule.value == 'custom') {
        customRu = customRule.value;
        defalutRu = null
    }
    loading.value=true
    parseQuestionTextRequest(text.value, defalutRu, customRu).then(res => {
        list.value = res.data.data
        loading.value=false
    }).catch(()=>{
        loading.value=false
    })
}
const batchSuccesCount = computed(() => {
    return batchResult.value.filter(value => value == "").length;
})
const getBatchResult = (index) => {
    const result = batchResult.value[index];
    if (result == "") {
        return true;
    }
    return false;
}
const getBatchRules = () => {
    questionRulesRequest().then(res => {
        batchRules.value = res.data.data;
    })
}
const batchQuestion = () => {
    if (list.value.length == 0) {
        Message.info("请先预览后导入")
        return
    }
    loading.value=true
    batchQuestionRequest(courseId, tagId.value, list.value, config.value).then(res => {
        batchResult.value = res.data.data
        resultMode.value = true;
        loading.value=false
    }).catch(err=>{
        loading.value=false
    })
}
getBatchRules()
</script>
<style lang="less" scoped>
.batch-import {
    display: flex;
    border: 2px solid var(--color-fill-3);
    border-radius: 10px;

    .editor,
    .empty,
    .preview {
        flex-grow:1;
        width: 100%;
    }
}

.batchResult {
    display: flex;
    justify-content: center;

    .success,
    .failed {
        margin: 10px;
        padding: 10px 30px;
        flex: 1;
        border: 1px solid var(--color-fill-1);
        border-radius: 5px;
    }

    .success {
        background-color: rgb(var(--green-1));

        :deep(.arco-statistic-title) {
            color: rgb(var(--green-6));
        }
    }

    .failed {
        background-color: rgb(var(--red-1));

        :deep(.arco-statistic-title) {
            color: rgb(var(--red-6));
        }
    }

}
</style>