<template>
    <div class="">
        <a-textarea v-model:model-value="content" @blur="blur" v-if="props.mode=='simple'" />
        <div v-else ref="editorRef"></div>
    </div>
</template>
<script setup>
import { onMounted, ref, watch, toRaw, onUnmounted, unref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';

const props = defineProps({
    vditorOptions: {
        type: Object,
        default: {}
    },
    previewOptions:{
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

const contentEditor = ref();
const editorRef = ref();
const content = ref(props.modelValue)

onMounted(() => {
    loadVditor()
});
const loadVditor = () => {
    const options = Object.assign({
        minHeight: 200,
        cache: {
            enable: false,
        }
    }, props.vditorOptions)
    if(props.mode=='rich'){
        contentEditor.value = new Vditor(editorRef.value, {
        ...options,
        value:content.value,
        input(value) {
            content.value = value;
        },
        blur() {
            blur();
        }
    });
    }else if(props.mode=='preview'){
        Vditor.preview(editorRef.value,content.value,props.previewOptions)
    }
   
}

watch(
    () => props.modelValue,
    (newVal) => {
        content.value = newVal;
        if (newVal !== contentEditor.value?.getValue()) {
            contentEditor.value?.setValue(newVal);
        }

    }
);
watch(
    () => content.value,
    (value) => {
        emit('update:modelValue', value);
    }
);
onUnmounted(() => {
    const editorInstance = unref(contentEditor);
    if (!editorInstance) return;
    try {
        editorInstance?.destroy?.();
    } catch (error) {
        console.log(error);
    }
});
const blur = () => {
    emit('blur', content.value)
}
</script>