<template>
    <a-page-header title="试卷预览" :subtitle="title" @back="$router.back">
    </a-page-header>
    <QuestionPreview v-for="(item,index) in list" mode="display" :topic-type="item.type" :number="index+1" :question="item" :options="item.topicItems"></QuestionPreview>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import {getExamPaperQuestionRequest} from '../../apis/exam-api';
import QuestionPreview from '../../components/QuestionEditView.vue';
const route=useRoute()
const examId=route.params['examId']
const title=route.query["title"]
const list=ref([])
getExamPaperQuestionRequest(examId).then(res=>{
    list.value=res.data.data
})
</script>

<style lang="less" scoped>
</style>