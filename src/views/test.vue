<template>
    <div style="padding-top:100px">
        <Tabs :tagList="list" v-model:tag="tag" direction="vertical" style="height:200px"></Tabs>
    </div>
</template>
<script setup>
import Tabs from '@/components/tabs.vue'
import { ref } from 'vue';
const tag=ref(0)
const list =[
    {
        name:'主页',
    }, {
        name:'blog',
    }, {
        name:'hello',
    }
]
</script>