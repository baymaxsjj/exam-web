<template>
    <div style="border: 1px solid #ccc">
        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
            />
        <Editor style="height: 500px; overflow-y: hidden;" v-model="content" :defaultConfig="editorConfig"
             @onCreated="handleCreated" @blur="$emit('blur')"/>
    </div>
</template>
<script setup>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import { onBeforeUnmount, ref, shallowRef, onMounted, watch} from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

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

// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef()


const toolbarConfig = {}
const editorConfig = { placeholder: '请输入答案...' }

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