<template>
    <editor style="width: 100%;margin:10px 0"  :init="initConfig" :api-key="apiKey" v-model="content" />
</template>
<script setup>
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
    toolbar_mode: 'floating',
    ...props.config
}
onMounted(() => {
    // tinymce.init({});
});
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