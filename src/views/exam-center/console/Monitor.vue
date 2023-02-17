<template>
    <div class="monitor" v-if="examing&&examInfo.isMonitor">
        <a-row :gutter="[15, 15]" v-if="list.length!=0">
            <TransitionGroup name="list">

                <a-col :xs="24" :sm="12" :xl="8" :xxl="4" v-for="item of list" :key="item.id">
                        <a-comment
                            :author="item.info.user.nickname"
                            :content="item.data.status.action"
                            :datetime="item.time"
                            class="info"
                            :style="{'background-color': item.bg}"
                        >
                            <template #avatar>
                            <a-avatar shape="square" v-loadImg :image-url="item.info.user.picture">
                            </a-avatar>
                            </template>
                        </a-comment>
                </a-col>
            </TransitionGroup>
        </a-row>
        <a-empty description="暂无实时信息" v-else/>
    </div>
    <a-empty :description="examing?'未开启考试监控':'未在考试期间'" v-else/>
</template>
<script setup>
import {inject,ref,watch} from 'vue'
import { examConsoleInfoKey } from '@/utils/keys.js'
import dayjs from 'dayjs';
import SocketService from '../../../utils/web-stocket-service.js'

const { examInfo } = inject(examConsoleInfoKey)
const examing=ref(false)
let id=0
const list=ref([

])
SocketService.Instance.registerCallBack("EXAM_CONSOLE_STATISTICS",(data)=>{
    data['time']=dayjs().format('HH:mm:ss')
    data['id']=id++;
    data['bg']=rgb()
    list.value.unshift(data)
})

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
function rgb(){//rgb颜色随机
  const r = Math.floor(Math.random()*256);
  const g = Math.floor(Math.random()*256);
  const b = Math.floor(Math.random()*256);
  return `rgba(${r},${g},${b},.1)`;
}
</script>
<style lang="less" scoped>
.monitor{
    .info{
        padding: 20px;
        border: 1px solid var(--color-fill-2);
        border-radius: 6px;
    }
}
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: scale(.1);
}
</style>