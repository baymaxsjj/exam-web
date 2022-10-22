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
                <a-dropdown :popup-max-height="false"  trigger="hover">
                    <a-button type="primary">
                        <icon-plus />
                        创建题目
                    </a-button>
                    <template #content>
                        <a-doption v-for="item of questionType"><span
                                style="padding: 0 15px;">{{item.simpleName}}</span></a-doption>

                    </template>
                </a-dropdown>
                <a-button status="success">
                    <icon-upload />导入题库
                </a-button>
            </div>
            <!-- 题目列表 -->
            <div>
                <a-radio-group type="button" default-value="display" v-model:model-value="editMode">
                    <a-radio value="display">展示模式</a-radio>
                    <a-radio value="answer">作答模式</a-radio>
                    <a-radio value="answer-display">作答浏览模式</a-radio>
                    <a-radio value="editor">编辑模式</a-radio>
                    <a-radio value="create">新建模式</a-radio>
                </a-radio-group>
                <template v-if="questionList.length!=0">
                    <!-- <QuestionPreview v-for="item of questionList" :question-info="item"/> -->
                    <QuestionTest :mode="editMode" v-for="(item,index) in questionList" :number="index+1" :question="item" :topic-type="item['type']" :options="item['topicItems']"/>
                </template>
                <a-empty v-else/>
            </div>
        </div>
    </div>
</template>
<script setup>
import useCourseStore from '../../sotre/course-store';
import QuestionTagTree from '../../components/QuestionTagTree.vue';
import { ref } from 'vue';
import { questionType } from '../../utils/question-config.js'
import { questionInfoListRequest } from '../../apis/question-api';
import { useRoute } from 'vue-router';
import QuestionPreview from '../../components/QuestionPreview.vue';
import QuestionTest from '../../components/QuestionTest.vue';

const courseStore = useCourseStore()
const navList = ref([])
const route=useRoute();
const courseId=route.params['courseId']
const page=ref(1);
const total=ref(1);
const questionList=ref([])

const editMode=ref('display')
let tagId="";
const select = (nodeData,tree) => {
    navList.value = tree;
    tagId=nodeData?.tagId;
    getQuestList(nodeData.tagId)
    console.log("获取标签树",nodeData)
}
const getQuestList=(tagId="")=>{
    questionInfoListRequest(courseId,page.value,tagId).then(res=>{
        const data=res.data.data
        console.log(data)
        questionList.value=data.list;
        total.value=data.total;
        page.value=data.current
    })
}
getQuestList()
</script>
<style lang="less" scoped>
.question-wrap {
    display: flex;

    .tag-tree {
        width: 240px;
        min-height: 600px;
        padding-right: 10px;
        margin-right: 10px;
        border-right: 2px solid var(--color-fill-2);
    }
    .question-detail{
        flex: 1;
        .opearte_area{
            padding: 10px 0;
        }
    }
}
</style>