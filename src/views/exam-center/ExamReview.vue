<template>
    <div>
        <div class="left">
            <div class="user-info"></div>
            <div class="answer-result"></div>
            <div class="numbers"></div>
        </div>
        <div>

        </div>
    </div>
</template>
0<script setup>
import { examStudentAnswerResultRequest } from '@/apis/exam-center-api.js';
import { useRoute } from 'vue-router';
const route=useRoute()
const examInfoId=route.params['examInfoId']
const studentId=route.params['studentId']
examStudentAnswerResultRequest(examInfoId,studentId).then(res=>{
    const data=res.data.data
    console.log(data)
})
</script>
<style lang="less" scoped>
</style>