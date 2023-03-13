<template>
    <div class="paper">
        <a-page-header title="试卷管理" @back="$router.back" v-if="!selectMode">
            <template #extra>
                <a-button style="margin-right: 10px;" @click="$router.push({name:'AutomaticPaper'})">自动组卷</a-button>
                <a-button type="primary" @click="visible=true">创建试卷</a-button>
            </template>
        </a-page-header>
        <div class="manage">
            <a-table v-model:selected-keys="selectKey" :row-selection="rowSelection" @selection-change="selectChange"
                row-key="id" :columns="columns" :data="examList" page-position="bottom">
                <template #edit="{ record }">
                    <a-button status="danger" @click="delExamPaper(record.id)" style="margin-right: 10px;">
                        <template #icon>
                            <icon-delete />
                        </template>
                    </a-button>
                    <a-button style="margin-right: 10px;" @click="paperPreview(record.id,record.title)">
                        <template #icon>
                            <icon-search />
                        </template>
                    </a-button>
                    <a-button type="primary" @click="toExamPaper(record.id)" style="margin-right: 10px;">
                        <template #icon>
                            <icon-edit />
                        </template>
                    </a-button>
                    <a-button type="primary" @click="toExamPaper(record.id)">
                        <template #icon>
                            <icon-export />
                        </template>
                    </a-button>
                </template>
            </a-table>
        </div>
    </div>
    <AModal v-model:visible="visible" title="创建试卷" :footer="false">
        <ExamPaper/>
    </AModal>
</template>
<script setup>
import { getExamPaperListRequest, delExamPaperRequest } from '../../apis/exam-api.js'
import { useRoute, useRouter } from 'vue-router';
import { ref, watch } from 'vue';
import ExamPaper from './ExamPaper.vue'
const props = defineProps({
    selectMode: {
        type: Boolean,
        defalut: false
    },
    selectKey: {
        type: Array,
        defalut: ()=>[]
    }
})
const visible=ref(false)
const emit = defineEmits(['selectData'])
const selectKey = ref([])
watch(() => props.selectKey, (key) => {
    selectKey.value = key
})
const rowSelection = {
    type: props.selectMode ? 'radio' : 'checkbox'
};

const selectChange = (keys) => {
    const data=examList.value.filter(item=>keys.includes(item.id))
    console.log(data)
    emit('selectData', keys,data)
}

const route = useRoute();
const router = useRouter();

const courseId = route.params['courseId']
const examList = ref([])
const currpage = ref(1);
const total = ref(1)
const pageSize = ref(10)
//为创建考试提供试卷的组件


// 获取试卷列表
const getExamPaperList = () => {
    getExamPaperListRequest(courseId, currpage.value, pageSize.value).then(res => {
        const data = res.data.data
        examList.value = data.list
        currpage.value = data.current
        total.value = data.total
    })
}
const delExamPaper = (id) => {
    delExamPaperRequest(id).then(() => {
        getExamPaperList()
    })
}
const paperPreview = (examId,title) => {
    router.push({
        name: 'ExamPaperPreView',
        params: {
            examId
        },
        query:{
            title
        }
    })
}
const toExamPaper = (examId) => {
    const examPaperPage = {
        name: 'ExamPaper'
    }
    if (examId) {
        examPaperPage['params'] = {
            examId
        }
    }
    console.log(examPaperPage)
    router.push(examPaperPage)

}
getExamPaperList()
const columns = [
    {
        title: '试卷名称',
        dataIndex: 'title',
        ellipsis: true,
        slotName: 'title',
    },

    {
        title: '试卷介绍',
        dataIndex: 'introduce',
        slotName: 'introduce',
    },
];
if (!props.selectMode) {
    columns.push({
        title: '创建时间',
        dataIndex: 'createdAt',
        slotName: 'createdAt',
    },
    {
        title: '修改时间',
        dataIndex: 'updatedAt',
        slotName: 'updatedAt',
    },
    {
        title: '编辑',
        slotName: 'edit',
        width:250
    })
}
</script>
<style lang="less" scoped>
:deep(.arco-modal-body) {
    overflow: hidden;
}

.paper {
    .operate {
        display: flex;
        align-items: center;
    }

    .manage {
        display: flex;

        .exam-paper {
            flex: 1;
        }
    }
}
</style>