<template>
    <div v-if="(props.mode == 'preview') || lazy" :class="{lazy}" @click="loadEdit">
        <span class="wysiwyg" v-html="DOMPurify.sanitize(modelValue)"></span>
    </div>
    <BaseTextEditor v-else @blur="$emit('blur')" :config="config" v-model="content" />
</template>
<script setup>
import BaseTextEditor from './BaseTextEditor.vue';
import { computed,ref,watch } from 'vue'
import DOMPurify from 'dompurify';
import '../assets/styles/wysiwyg.css'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    mode: {
        type: String,
        default: 'preview'
    },
    lazy: {
        type: Boolean,
        default: false
    },
    config: {
        type: Object,
        default: () => { 
        }
    }
})
const lazy=ref(props.lazy)
const content = computed({
    // getter
    get() {
        return props.modelValue;
    },
    // setter
    set(newValue) {
        // 注意：我们这里使用的是解构赋值语法
        emit('update:modelValue', newValue)
    }
})
watch(()=>props.lazy,(value)=>{
    lazy.value=value;
})
const emit = defineEmits([
    'update:modelValue',
    'blur'
]);

const loadEdit = () => {
    lazy.value=false
}
</script>
<style lang="less" scoped>
.lazy{
    border: 2px solid var(--color-fill-2);
    padding: 10px;
    border-radius: 10px;
    min-height: 50px;
}
.vditor {
    margin: 10px 0;
}
</style>