<template>
        <BaseTextPreview v-if="mode=='preview'"  :initialValue="content"/>
        <BaseTextEditor  v-else :config="config"  v-model="content"/>
</template>
<script setup>
import BaseTextEditor from './BaseTextEditor.vue';
import BaseTextPreview from './BaseTextPreview.vue';
import { computed } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: '',
    },
    mode:{
        type:String,
        default:'preview'
    },
    config:{
        type:Object,
        default:()=>{}
    }
})
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
const emit = defineEmits([
    'update:modelValue',
    'blur'
]);
const blur = () => {
    emit('blur',props.modelValue)
}
</script>
<style lang="less" scoped>

</style>