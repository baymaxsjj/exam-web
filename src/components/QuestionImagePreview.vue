<template>
     <!-- 一个组件及够了，没有必要每个都 -->
     <a-image-preview-group v-model:visible="visible" :current="0"
            :srcList="srcList" />
</template>
<script setup>
import {ref} from 'vue'
const props=defineProps({
    clickArea:String,
})
const visible=ref(false)
const srcList=ref([])
if(props.clickArea){
    document.querySelector(props.clickArea).onclick=(e)=>{
        imageChange(e)
    }
}
const imageChange = (e) => {
    const src = e.target.currentSrc
    if (src) {
        srcList.value=[src]
        setTimeout(() => {
            visible.value = true
        }, 100);
    }
}
</script>