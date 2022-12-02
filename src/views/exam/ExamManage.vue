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
            <a-button type="primary" v-if="isTeacher" @click="examVisible = true">创建考试</a-button>
        </template>
    </a-page-header>
        <ul class="exam-list">
            <li class="exam-item ebutton-hover" v-for="item in list" :key="item.id">
                <div class="exam-info-wrap">
                    <a-avatar class="avatar" shape="square">考试</a-avatar>
                    <div class="exam-info">
                        <p class="title">{{ item.title }}</p>
                        <p class="date">{{ item.startTime }} ~ {{ item.endTime }}</p>
                    </div>
                </div>
                <div class="table-edit" v-if="isTeacher">
                    <a-button status="danger" @click="delExamInfo(item.id)" style="margin-right: 10px;">
                        <template #icon>
                            <icon-delete />
                        </template>
                    </a-button>
                    <a-button type="primary" @click="getExamInfoDetail(item.id)" style="margin-right: 10px;">
                        <template #icon>
                            <icon-edit />
                        </template>
                    </a-button>
                    <router-link :to="`/exam/${item.id}/console`">
                        <a-button type="primary">
                            控制台
                        </a-button>
                    </router-link>
                </div>
                <ExamInfoButton v-else :item="item"></ExamInfoButton>
            </li>
        </ul>
        <a-empty v-if="list.length == 0"></a-empty>
    <a-modal v-model:visible="examVisible" @ok="updateExamInfo" :footer="false" title="创建考试" simple width="600px"
        :body-style="{ overflow: 'hidden' }">
        <a-form :model="form" ref="formRef" @submit-success="updateExamInfo">
            <a-form-item field="title" label="考试标题" label-col-flex="80px" :rules="[{ required: true, message: '必填' }]">
                <a-input v-model="form.title" placeholder="输入考试标题" />
            </a-form-item>
            <a-form-item field="paper" label="考试试卷" label-col-flex="80px" :rules="[{ required: true, message: '必填' }]">
                <a-input-tag v-model:model-value="form.paper" :max-tag-count="1" @click="examPaperVisible = true"
                    placeholder="选择考试试卷" allow-clear />
            </a-form-item>
            <a-form-item field="classList" label="考试班级" label-col-flex="80px"
                :rules="[{ required: true, message: '必填' }]">
                <a-input-tag v-model:model-value="form.classList" @click="classesVisible = true" placeholder="选择考试班级"
                    allow-clear />
            </a-form-item>
            <a-row>
                <a-col :span="12">
                    <a-form-item field="startTime" label="开始时间" label-col-flex="80px"
                        :rules="[{ required: true, message: '必填' }]">
                        <a-date-picker v-model:model-value="form.startTime" show-time
                            :disabledDate="(current) => dayjs(current).isBefore(dayjs().hour(-12))"
                            :disabled-time="getDisabledRangeTime" format="YYYY-MM-DD HH:mm" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item field="endTime" label="考试时长" label-col-flex="80px"
                        :rules="[{ required: true, message: '必填' }]">
                        <a-input-number v-model="form.endTime" placeholder="输入考试时长" mode="button" class="input-demo" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item field="questionDisorder" label="考试监控" label-col-flex="80px">
                        <a-switch v-model:model-value="form.isMonitor" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item field="optionDisorder" label="允许复制" label-col-flex="80px">
                        <a-switch v-model:model-value="form.isCopyPaste" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item field="endTime" label="提交时长" label-col-flex="80px">
                        <a-input-number v-model="form.submitTime" placeholder="可以交卷时长" mode="button"
                            class="input-demo" />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row>
                <a-col :span="6">
                    <a-form-item field="questionDisorder" label="题目乱序" label-col-flex="80px">
                        <a-switch v-model:model-value="form.questionDisorder" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item field="optionDisorder" label="选项乱序" label-col-flex="80px">
                        <a-switch v-model:model-value="form.optionDisorder" />
                    </a-form-item>
                </a-col>
                <a-col :span="6">
                    <a-form-item field="endVisible" label="批阅可见" label-col-flex="80px">
                        <a-switch v-model:model-value="form.endVisible" />
                    </a-form-item>
                </a-col>

            </a-row>

            <a-row :gutter="24">
                <a-col :span="12">
                    <a-button long @click="examVisible = false">取消</a-button>
                </a-col>
                <a-col :span="12">
                    <a-button long html-type="submit" type="primary">发布</a-button>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
    <a-modal v-model:visible="classesVisible" simple title="选择班级">
        <MyClasses v-model:select-key="form.classList" :select-mode="true"></MyClasses>
    </a-modal>
    <a-modal v-model:visible="examPaperVisible" title="选择试卷" simple>
        <ExamPaperManger v-model:select-key="form.paper" :select-mode="true"></ExamPaperManger>
    </a-modal>
</template>
<script setup>
import { ref } from 'vue';
import ExamPaperManger from './ExamPaperManger.vue';
import MyClasses from '../course/MyClasses.vue';
import { updateExamInfoRequest, getExamInfoListRequest, delExamInfoRequest, getExamInfoDetailRequest } from '../../apis/exam-api.js'
import dayjs from 'dayjs'
import { useRoute } from 'vue-router';
import useCourseStore from '../../sotre/course-store';
import ExamInfoButton from '../../components/ExamInfoButton.vue'

const route = useRoute()
const courseId = route.params['courseId']
const courseStore = useCourseStore()
const isTeacher = courseStore.isTeacher

const examVisible = ref(false)
const classesVisible = ref(false)
const examPaperVisible = ref(false)
const formRef = ref()
const loading=ref(false)
const form = ref({
    startTime: "",
    endTime: 90,
    submitTime: null,
    optionDisorder: false,
    questionDisorder: false,
    endVisible: false,
    isMonitor: false,
    isCopyPaste: false,
    title: '',
    classList: [],
    paper: []
})
/** */
const currpage = ref(1);
const total = ref(1)
const pageSize = ref(10)
const status = ref(0)
const list = ref([])
const updateExamInfo = () => {
    const info = { ...form.value }
    info['examId'] = info.paper[0]
    console.log(form.value.endTime)
    info.endTime = dayjs(info.startTime).add(info.endTime, 'minute').format('YYYY-MM-DD HH:mm:ss')
    if (info.submitTime) {
        info.submitTime = dayjs(info.startTime).add(info.submitTime, 'minute').format('YYYY-MM-DD HH:mm:ss')
    }
    info.startTime = dayjs(info.startTime).format('YYYY-MM-DD HH:mm:ss')
    info['courseId'] = courseId;
    console.log(info)
    delete info.paper
    delete info.classList
    updateExamInfoRequest(info, form.value.classList).then(res => {
        examVisible.value = false
        getExamInfoList()
    })
}
const getExamInfoList = () => {
    loading.value=true
    getExamInfoListRequest(courseId, status.value, currpage.value, pageSize.value).then(res => {
        const data = res.data.data
        list.value = data.list
        currpage.value = data.current
        total.value = data.total
        loading.value=false
    })
}
const getExamInfoDetail = (id) => {
    getExamInfoDetailRequest(id).then(res => {
        const data = res.data.data
        form.value = data['examInfo']
        form.value.paper = [form.value['examId']]
        form.value.endTime = dayjs(form.value.endTime).diff(dayjs(form.value.startTime), "minute")
        if (form.value.submitTime) {
            form.value.submitTime = dayjs(form.value.submitTime).diff(dayjs(form.value.startTime), "minute")
        }
        form.value.classList = data['classList']
        examVisible.value = true;
    })
}
const delExamInfo = (examInfoId) => {
    delExamInfoRequest(examInfoId).then(res => {
        getExamInfoList()
    })
}


const range = (start, end) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}
const getDisabledRangeTime = (date, type) => {
    let currHour = 0
    let minute = 0
    if (dayjs().isAfter(dayjs(date).format("YYYY-MM-DD"))) {
        const temHour = dayjs(date).hour();
        currHour = dayjs().hour()
        minute = temHour > currHour ? 0 : dayjs().minute()
    }
    return {
        disabledHours: () => type === 'start' ? range(currHour, 24) : range(0, currHour),
        disabledMinutes: () => type === 'end' ? range(minute, 60) : range(0, minute),
    };
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
<style lang="less" scoped>
.exam-list {
    .exam-item {
        display: flex;
        align-items: center;
        justify-content: space-between;

        .exam-info-wrap {
            display: flex;

            .avatar {
                margin-right: 10px;
            }

            .exam-info {
                display: flex;
                flex-direction: column;
                justify-content: center;

                .title {
                    color: var(--color-text-1);
                    font-weight: bold;
                }

                .date {
                    color: var(--color-text-3);
                    font-size: 14px;
                    margin-top: 6px;
                }
            }


        }
    }
}
</style>