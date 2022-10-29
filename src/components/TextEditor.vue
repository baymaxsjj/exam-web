<template>
    <div style="border: 1px solid #ccc" v-if="props.mode == 'rich'">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor style="height: 150px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" @onChange="handleChange" @onBlur="blur" />
    </div>
    <div class="wysiwyg" style="flex:1" v-html="props.modelValue" v-else></div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted, computed } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
const props = defineProps({
    vditorOptions: {
        type: Object,
        default: {}
    },
    previewOptions: {
        type: Object,
        default: {}
    },
    modelValue: {
        type: String,
        default: '',
    },
    mode: {
        type: String,
        default: 'simple',
        validator(value) {
            // The value must match one of these strings
            return ['preview', 'simple', 'rich'].includes(value)
        }
    }
})
const emit = defineEmits([
    'update:modelValue',
    'blur'
]);
console.log('文本编辑模式')
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()
const getHtml = computed(() => {
    console.log(editorRef.value?.getHtml())
    return editorRef.value?.getHtml()
})
// 内容 HTML
const valueHtml = ref(props.modelValue)

const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}
const handleChange = (editor) => {
    emit('update:modelValue', valueHtml.value)
}

const blur = () => {
    emit('blur', valueHtml.value)
}
</script>
<style>
@import '../assets/styles/wysiwyg.css';
.vditor {
    margin: 10px 0;
}
</style>