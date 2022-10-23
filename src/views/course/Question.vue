<template>
    <a-page-header title="题库中心" @back="$router.back">
        <template #breadcrumb>
            <a-breadcrumb>
                <a-breadcrumb-item>
                    <icon-lark-color style="margin-right: 8px;" />{{courseStore.courseInfo.name}}
                </a-breadcrumb-item>
                <template v-for="item of navList">
                    <a-breadcrumb-item v-if="item.id!=''">{{item.name}}</a-breadcrumb-item>
                </template>
            </a-breadcrumb>
        </template>
    </a-page-header>
    <div class="question-wrap">
        <QuestionTagTree @select="select" class="tag-tree"></QuestionTagTree>
        <div class="question-detail">
            <div class="opearte_area">
                <a-dropdown :popup-max-height="false">
                    <a-button type="primary">
                        <icon-plus />
                        显示范围
                    </a-button>
                    <template #content>
                        <a-doption><span style="padding: 0 15px;">仅当前目录</span></a-doption>
                        <a-doption><span style="padding: 0 15px;">目录下所有</span></a-doption>
                    </template>


                </a-dropdown>
                <a-dropdown :popup-max-height="false" trigger="hover">
                    <a-button type="primary">
                        <icon-plus />
                        创建题目
                    </a-button>
                    <template #content>
                        <a-doption v-for="item of questionType" @click="saveQuestion(item.enumName)"><span
                                style="padding: 0 15px;">{{item.simpleName}}</span></a-doption>

                    </template>
                </a-dropdown>
                <a-button status="success">
                    <icon-upload />导入题库
                </a-button>
            </div>
            <!-- 创建/更新区 -->
            <div v-if="visible">
                <a-page-header title="返回列表" @back="visible=false">
                </a-page-header>
                <QuestionPreview :mode="editMode" :topic-type="questType"/>

            </div>
            <!-- 题目列表 -->
            <div v-else>
                <a-table :columns="columns" :data="questionList" :loading="loading" column-resizable :pagination="{total:total,current:page}">
                    <template #content="{ record, rowIndex }">
                        <p class="arco-table-text-ellipsis" v-html="record.content"></p>
                    </template>
                    <template #type="{ record, rowIndex }">
                        <a-tag>{{getQuestionType(record.type).simpleName}}</a-tag>
                    </template>
                    <template #difficulty="{ record, rowIndex }">
                        <a-rate :default-value="record.difficulty/20" readonly allow-half />
                    </template>
                    <template #isPublic="{ record, rowIndex }">
                        <a-tag>{{getQuestionVisble(record.isPublic).name}}</a-tag>
                    </template>
                    <template #edit="{ record, rowIndex }">
                        <a-button status="danger" @click="delQuestion(record.id)" style="margin-right: 10px;">
                            <template #icon>
                                <icon-delete />
                            </template>
                        </a-button>
                        <a-button style="margin-right: 10px;">
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
            </div>
        </div>
    </div>
</template>
<script setup>
import { useRoute } from 'vue-router';
import { ref } from 'vue';
import useCourseStore from '../../sotre/course-store';
import QuestionTagTree from '../../components/QuestionTagTree.vue';
import {questionType, getQuestionType ,getQuestionVisble} from '../../utils/question-config.js'
import { questionListRequest,delQuestionRequest } from '../../apis/question-api';
import QuestionPreview from '../../components/QuestionPreview.vue';

const courseStore = useCourseStore()
const navList = ref([])
const route = useRoute();
const courseId = route.params['courseId']

const page = ref(1);
const total = ref(1);

const loading=ref(false)
const visible=ref(false)

const questionList = ref([])
const editMode=ref('create')
const questType=ref("SIGNAL_CHOICE")
const quest=ref("")

//选择目录
const select = (nodeData, tree) => {
    navList.value = tree;
    tagId = nodeData?.tagId;
    getQuestList(nodeData.tagId)
    console.log("获取标签树", nodeData)
}
// 删除问题
const delQuestion = (id) => {
    delQuestionRequest(id).then(res => {
        getQuestList()
    })
}
const getQuestList = (tagId = "") => {
    loading.value=true
    questionListRequest(courseId, page.value, tagId).then(res => {
        const data = res.data.data
        console.log(data)
        questionList.value = data.list;
        total.value = data.total;
        page.value = data.current
        loading.value=false
    })
}
const saveQuestion=(type,quest)=>{
    console.log(type)
    questType.value=type
    if(quest){
        question.value=quest
    }
    visible.value=true;
}
getQuestList()
const columns = [
    {
        title: '题目',
        dataIndex: 'content',
        ellipsis: true,
        slotName: 'content',
        // tooltip: true,
    },
   
    {
        title: '难度',
        dataIndex: 'difficulty',
        slotName: 'difficulty',
        width:160,


    },
    {
        title: '类别',
        dataIndex: 'type',
        slotName: 'type',
        width:80,

    },
    {
        title: '可见度',
        dataIndex: 'isPublic',
        slotName: 'isPublic',
        width:80,

    },
    {
        title: '编辑',
        dataIndex: 'edit',
        width:170,
        slotName: 'edit'
    },
];
</script>
<style lang="less" scoped>
:deep(.arco-rate-character) {
    margin: 0;
    // font-size: 20px;
    // line-height: 20px;
}

.question-wrap {
    display: flex;

    .tag-tree {
        width: 240px;
        min-height: 600px;
        padding-right: 10px;
        margin-right: 10px;
        border-right: 2px solid var(--color-fill-2);
    }

    .question-detail {
        flex: 1;

        .opearte_area {
            padding: 10px 0;
        }
    }
}
</style>