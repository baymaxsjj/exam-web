<template>
    <a-page-header title="考试中心" @back="$router.back">
        <template #extra>
            <a-radio-group type="button" @change="getExamInfoList" v-model:model-value="status"
                style="margin-right:10px">
                <a-radio :value="0">全部</a-radio>
                <a-radio :value="1">未开始</a-radio>
                <a-radio :value="2">进行中</a-radio>
                <a-radio :value="3">已完成</a-radio>
            </a-radio-group>
            <a-button type="primary" @click="examVisible = true">创建考试</a-button>
        </template>
    </a-page-header>
    <a-table :data="list" :columns="columns">
        <template #edit="{ record }">
            <a-button status="danger"  style="margin-right: 10px;">
                <template #icon>
                    <icon-delete />
                </template>
            </a-button>
            <a-button style="margin-right: 10px;" >
                <template #icon>
                    <icon-search />
                </template>
            </a-button>
            <a-button type="primary">
                <template #icon>
                    <icon-edit />
                </template>
            </a-button>
        </template>
    </a-table>

    <a-modal v-model:visible="examVisible" @ok="updateExamInfo" title="创建考试" simple width="600px"
        :body-style="{ overflow: 'hidden' }">
        <a-form :model="form">
            <a-form-item field="name" label="考试标题" label-col-flex="80px">
                <a-input v-model="form.title" placeholder="输入考试标题" />
            </a-form-item>
            <a-form-item field="name" label="考试试卷" label-col-flex="80px">
                <a-input-tag v-model:model-value="paper" :max-tag-count="1" @click="examPaperVisible = true"
                    placeholder="选择考试试卷" allow-clear />
            </a-form-item>
            <a-form-item field="name" label="考试班级" label-col-flex="80px">
                <a-input-tag v-model:model-value="classList" @click="classesVisible = true" placeholder="选择考试班级"
                    allow-clear />
            </a-form-item>
            <a-row>
                <a-col :span="12">
                    <a-form-item field="post" label="开始时间" label-col-flex="80px">
                        <a-date-picker v-model:model-value="form.startTime" show-time
                            :time-picker-props="{ defaultValue: '08:30:00' }" format="YYYY-MM-DD HH:mm:ss" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item field="post" label="考试时长" label-col-flex="80px">
                        <a-input-number v-model="form.endTime" placeholder="输入考试时长" mode="button" class="input-demo" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="8">
                    <a-form-item field="post" label="题目乱序" label-col-flex="80px">
                        <a-switch v-model:model-value="form.questionDisorder" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item field="post" label="选项乱序" label-col-flex="80px">
                        <a-switch v-model:model-value="form.optionDisorder" />
                    </a-form-item>
                </a-col>
                <a-col :span="8">
                    <a-form-item field="post" label="批阅可见" label-col-flex="80px">
                        <a-switch v-model:model-value="form.endVisible" />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
    <a-modal v-model:visible="classesVisible" simple title="选择班级">
        <MyClasses v-model:select-key="classList" :select-mode="true"></MyClasses>
    </a-modal>
    <a-modal v-model:visible="examPaperVisible" title="选择试卷" simple>
        <ExamPaperManger v-model:select-key="paper" :select-mode="true"></ExamPaperManger>
    </a-modal>
</template>
<script setup>
import { ref } from 'vue';
import ExamPaperManger from './ExamPaperManger.vue';
import MyClasses from '../course/MyClasses.vue';
import { updateExamInfoRequest, getExamInfoListRequest } from '../../apis/exam-api.js'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router';

const route = useRoute()
const courseId = route.params['courseId']

const examVisible = ref(false)
const classesVisible = ref(false)
const examPaperVisible = ref(false)

const form = ref({
    startTime: "",
    endTime: 90,
    optionDisorder: false,
    questionDisorder: false,
    endVisible: false,
    title: '',

})
/** */
const currpage = ref(1);
const total = ref(1)
const pageSize = ref(10)
const status = ref(0)
const classList = ref([])
const paper = ref([])
const list = ref([])
const updateExamInfo = () => {
    const info = { ...form.value }
    info['examId'] = paper.value[0];
    info.endTime = dayjs(info.startTime).minute(info.endTime).format('YYYY-MM-DD HH:mm:ss')
    info['courseId'] = courseId;
    console.log(info.startTime)
    console.log(info.endTime)
    updateExamInfoRequest(info, classList.value).then(res => {

    })
}
const getExamInfoList = () => {
    getExamInfoListRequest(courseId, status.value, currpage.value, pageSize.value).then(res => {
        const data = res.data.data
        list.value = data.list
        currpage.value = data.current
        total.value = data.total
    })
}
getExamInfoList()
const columns = [
    {
        title: '考试名称',
        dataIndex: 'title',
        ellipsis: true,
        slotName: 'title',
    },
    {
        title: '开始时间',
        dataIndex: 'startTime',
        slotName: 'startTime',
    },
    {
        title: '结束时间',
        dataIndex: 'endTime',
        slotName: 'endTime',
    },
    {
        title: '编辑',
        dataIndex: 'edit',
        slotName: 'edit',
    },
]
</script>