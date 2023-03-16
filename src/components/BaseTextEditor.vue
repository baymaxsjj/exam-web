<template>
    <editor @blur="$emit('blur')" @contextmenu.prevent="()=>{}" style="width: 100%;margin:10px 0"  :init="initConfig" :api-key="apiKey" v-model="content" />
</template>
<script setup>
import tinymce from 'tinymce/tinymce'
import 'tinymce/themes/silver'
import 'tinymce/themes/silver/theme'
import 'tinymce/icons/default'; //引入编辑器图标icon，不引入则不显示对应图标
import 'tinymce/models/dom' // 这里是个坑 一定要引入
import 'tinymce/plugins/table'; //表格
import 'tinymce/plugins/image'; //表格

import Editor from '@tinymce/tinymce-vue';
import { onBeforeUnmount, ref, shallowRef, onMounted, computed, watch } from 'vue'

const props = defineProps({
    config: {
        type: Object,
        default: {}
    },
    modelValue: {
        type: String,
        default: '',
    },
    editHight: {
        type: Number,
        default: 150
    }
})
const apiKey = "qagffr3pkuv17a8on1afax661irst1hbr4e6tbv888sz91jc";

const initConfig = {
    language_url: '/tinymce/zh_CN.js',
    language: 'zh_CN',
    branding: false,
    elementpath: false,
    promotion: false,
    plugins: ['table','image'],
    toolbar_mode: 'floating',
    skin_url: "/tinymce/skins/ui/oxide",
    content_css: '/tinymce/skins/content/default/content.css',
    images_upload_handler: function (blobInfo, succFun, failFun) {
        var xhr, formData;
        var file = blobInfo.blob();//转化为易于理解的file对象
        formData = new FormData();
        formData.append('file', file, file.name );//此处与源文档不一样
        
    },
    ...props.config
}
onBeforeUnmount(()=>{
})
console.log(initConfig)
const content = ref(props.modelValue)
const emit = defineEmits([
    'update:modelValue',
    'blur'
]);
watch(() => content.value, () => {
    emit('update:modelValue', content.value)
})
watch(() => props.modelValue, (value) => {
    content.value = value;
})

const blur = () => {
    emit('blur', valueHtml.value)
}
</script>
<style lang="less" scoped>

</style>