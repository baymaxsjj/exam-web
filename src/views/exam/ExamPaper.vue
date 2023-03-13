<template>
    <div class="exam-paper">
        <div>
            <a-form :model="form">
                <a-form-item field="name" label="试卷名称" label-col-flex="80px">
                    <a-input v-model="form.title" placeholder="输入试卷名称" />
                </a-form-item>
                <a-form-item field="post" label="试卷介绍" label-col-flex="80px">
                    <a-input v-model="form.introduce" placeholder="输入试卷介绍" />
                </a-form-item>
                <!-- <a-row>
                        <a-col :span="4">
                            <a-form-item field="post" label="题目乱序" label-col-flex="80px">
                                <a-switch />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item field="post" label="选项乱序" label-col-flex="80px">
                                <a-switch />
                            </a-form-item>
                        </a-col>
                        <a-col :span="4">
                            <a-form-item field="post" label="批阅可见" label-col-flex="80px">
                                <a-switch />
                            </a-form-item>
                        </a-col>
                    </a-row> -->
                <a-form-item label-col-flex="80px">
                    <template #label>
                        <span class="select-info">
                            已选择:<span class="count">{{ questionKey.length }}</span>
                        </span>
                    </template>
                    <ARow style="width:100%" :gutter="10">
                        <ACol :span="12">
                            <a-button long @click="visible = true">添加题目</a-button>
                        </ACol>
                        <ACol :span="12">
                            <a-button long type="primary" @click="save">保存试卷</a-button>
                        </ACol>
                    </ARow>
                </a-form-item>
            </a-form>
        </div>
        <a-modal v-model:visible="visible" simple width="800px" :body-style="{ overflow: 'hidden' }">
            <Question v-model:select-kes="questionKey" :select-mode="true"></Question>
        </a-modal>
    </div>
</template>
<script setup>
import { ref ,watch} from 'vue';
import Question from '../course/Question.vue'
import { updateExamPaperRequest, getExamPaperDetailRequest } from '../../apis/exam-api'
import { useRoute, useRouter } from 'vue-router';
const form = ref({
    introduce: "",
    title: ""
})
const props = defineProps({
    keys: {
        type: Array,
        default: () => []
    }
})
const route = useRoute()
const router = useRouter()
const examId = route.params['examId']
const courseId = route.params['courseId']
const visible = ref(false)
const questionKey = ref([])
const save = () => {
    if (examId) {
        form.value['id'] = examId
    }
    form.value['courseId'] = courseId
    updateExamPaperRequest(form.value, questionKey.value).then(() => {
        router.back()
    })
}
if (examId) {
    getExamPaperDetailRequest(examId).then(res => {
        console.log(res.data.data)
        form.value = res.data.data['examPaper'];
        questionKey.value = res.data.data['questions'];
    })
}
watch(()=>props.keys,(value)=>{
 questionKey.value=value
})
</script>
<style lang="less" scoped>
.operate {
    display: flex;
    align-items: center;
    position: sticky;
}

.select-info {
    font-weight: bold;
    font-size: 16px;
    color: var(--color-text-4);

    .count {
        color: rgba(var(--primary-4));
        font-style: oblique;
        font-size: 18px;
    }
}
</style>