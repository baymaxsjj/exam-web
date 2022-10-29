<template>
    <a-button :disabled="disabled" :status="btnStatus" :type="btnType">{{ btnText }}</a-button>
</template>
<script setup>
import { onUnmounted, ref } from 'vue';
import dayjs from 'dayjs'

const props = defineProps({
    item: {
        type: Object,
        defalut: {}
    }
})
const btnType = ref("dashed")
const btnText = ref("")
const disabled = ref(false)
const startTime = props.item.startTime
const endTime = props.item.endTime
const btnStatus=ref('')
let interval;
//未开始
const initData = () => {
    if (dayjs(startTime).isAfter(dayjs())) {
        btnType.value = "primary"
        interval = setInterval(refreshStartTime(), 1000)
        //已结束
    } else if (dayjs(endTime).isBefore(dayjs())) {
        if (props.item.endVisible) {
            btnText.value = "查看"
            btnStatus.value='success'
        } else {
            btnText.value = "已结束"
            disabled.value = true;

        }
    } else {
        btnText.value = "开始考试"
        btnType.value = "primary"
    }
}
const refreshStartTime=() => {
    if (dayjs(startTime).isBefore(dayjs())) {
        initData()
    } else {
        const diffTime = dayjs(startTime).diff(dayjs(), 'second');
        const hour = parseInt(diffTime / 3600)
        const minute = parseInt(diffTime / 60 % 60)
        const second = diffTime % 60
        btnText.value = `${hour}:${minute}:${second}`
    }
    return refreshStartTime
}
onUnmounted(() => {
    clearInterval(interval)
})
initData()
</script>