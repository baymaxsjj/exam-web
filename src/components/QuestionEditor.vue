<template>
    <div style="border: 1px solid #ccc">
        <Toolbar v-if="props.mode=='rich'" style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            :mode="mode" />
        <Editor v-if="props.mode=='rich'" v-model="valueHtml"
            style="height: 200px; overflow-y: hidden;"
            @onBlur="handleBlur"
            @onChange="handChange"
            :defaultConfig="editorConfig"
            :mode="mode" @onCreated="handleCreated" />
        <p v-if="props.mode=='simple'" v-html="valueHtml"></p>
    </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, ref, shallowRef, onMounted } from 'vue'
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
const handleBlur=(editor)=>{
    emit('blur',editor)
}
const handChange=(editor)=>{
    emit('update:modelValue',valueHtml)
}
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()

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


</script>
<style>
.vditor {
    margin: 10px 0;
}
</style>