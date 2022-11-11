<template>
    <span class="wysiwyg" @click="imageChange($event)" v-html="saftHtml"></span>
    <a-image-preview-group v-if="imgList.length != 0" v-model:visible="visible" v-model:current="current"
        :srcList="imgList" />
</template>
  
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { computed, ref } from 'vue';
import DOMPurify from 'dompurify';
const props = defineProps({
    initialValue: {
        type: String,
        defalut: ''
    }
})
const visible = ref(false)
const current = ref(0)
const saftHtml=computed(()=>{
    return  DOMPurify.sanitize(props.initialValue)
})
const imageChange = (e) => {
    const src = e.target.currentSrc
    if (src) {
        for (let i = 0; i < imgList.value.length; i++) {
            if (imgList.value[i] == src) {
                current.value = i
                visible.value = true
                break;
            }
        }
    }
}
const imgList = computed(() => {
    // 使用正则表达式匹配所有图片
    let list = []
    if (props.initialValue) {
        let imgReg = /<img.*?(?:>|\/>)/gi //匹配图片中的img标签
        let match = props.initialValue.match(imgReg)  //筛选出所有的img
        if (match) {
            // 循环图片数组
            list = match.map(url => {
                return url.match(/\ssrc=['"](.*?)['"]/)[1]
            })
        }
    }
    return list;
})

</script>
<style>
@import '../assets/styles/wysiwyg.css';

.vditor {
    margin: 10px 0;
}
</style>