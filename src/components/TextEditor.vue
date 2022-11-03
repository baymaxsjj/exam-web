<template>
    <div class="editor">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            mode="simple" />
        <Editor style="height: 150px; overflow-y: hidden;" v-model="valueHtml" :defaultConfig="editorConfig"
            mode="simple" @onCreated="handleCreated" @onChange="handleChange" @onBlur="blur" />
    </div>
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
<style lang="less" scoped>
@import '../assets/styles/wysiwyg.css';
.editor {
    margin: 10px 0;
    border: 1px solid #ccc;
    border-radius: 5px;
    overflow: hidden;
}
</style>