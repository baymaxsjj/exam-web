<template>
    <div class="monitor" v-if="examing&&examInfo.isMonitor">
        考试实时监控中……(开发中)
    </div>
    <a-empty :description="examing?'未开启考试监控':'未在考试期间'" v-else/>
</template>
<script setup>
import {inject,ref,watch} from 'vue'
import { examConsoleInfoKey } from '@/utils/keys.js'
import dayjs from 'dayjs';
const { examInfo } = inject(examConsoleInfoKey)
const examing=ref(false)
const initFlag=()=>{
    const startTime=examInfo.value.startTime;
    const endTime=examInfo.value.endTime;
    if(dayjs().isAfter(startTime)&&dayjs().isBefore(endTime)){
        examing.value=true;
    }
}
if(examInfo.value){
    initFlag()
}
watch(()=>examInfo.value,()=>{
    initFlag()
})
</script>
<style lang="less" scoped>
</style>