<template>
    <div class="user">
        <Tabs class="tabs" :tagList="list" v-model:tag="tag"  direction="vertical" :style="{height:list.length*40+'px'}"/>
        <router-view></router-view>
    </div>
    
</template>
<script setup>
import Tabs from "@/components/tabs.vue"
import { ref } from "vue";
const tag=ref(0)
const list=[
    {
        name:"个人信息",
        key:'info'
    },
    {
        name:'账号安全',
        key:'security'
    }
]
</script>
<style lang="less" scoped>
.user{
    margin-top: 70px;
    .tabs{
        width: 200px;
    }
}
</style>
