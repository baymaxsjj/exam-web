<template>
    <div>
        <a-button style="width: 150px;" @click="handleClick" :disabled="disabled" :status="btnStatus" :type="btnType">{{
                btnText
        }}</a-button>

        <a-modal :visible="visible" simple title="考试说明" :footer="false">
            <a-typography-paragraph>1、离开或退出考试界面答题计时不停止，请不要中途离开考试界面。</a-typography-paragraph>
            <a-typography-paragraph>2、保持座位前的桌面干净，不要有与考试无关的内容。</a-typography-paragraph>
            <a-typography-paragraph>3、考试时间截止或答题时间结束，如果处于答题页面，将自动提交试卷。</a-typography-paragraph>
            <a-typography-paragraph >4、本次考试答题时长为<a-typography-text code>{{dayjs(endTime).diff(startTime,'minute')}}</a-typography-text>分钟，进入考试后开始计时，中途退出或离开考试界面会继续计时</a-typography-paragraph>
            <a-checkbox v-model="isAgree">
                <h6>我已阅读</h6>
            </a-checkbox>
            <a-button :disabled="!isAgree" @click="startExam" type="primary" style="margin-top:20px" long>开始考试
            </a-button>
        </a-modal>
    </div>
</template>
<script setup>
import { onUnmounted, ref } from 'vue';
import dayjs from 'dayjs'
import { useRouter } from 'vue-router';
import { Message } from '@arco-design/web-vue';
const router = useRouter()
const props = defineProps({
    item: {
        type: Object,
        defalut: {}
    }
})
const visible = ref(false)
const isAgree = ref(false)

const btnType = ref("dashed")
const btnText = ref("猜猜是啥~")
const disabled = ref(false)
const startTime = props.item.startTime
const endTime = props.item.endTime
const btnStatus = ref('')
const status = ref("none")

let interval;
const startExam = () => {
    router.push({
        name: 'ExamStart',
        params: {
            examInfoId: props.item.id
        }
    })
}

const handleClick = () => {
    switch (status.value) {
        case 'start':
            visible.value = true
            break;
        case 'not-start':
            Message.info('考试未开始~')
            break
        case 'end':
            Message.warning('考试已结束，禁止查看')
            break
        case 'view':
            router.push({
                name:'ExamView',
                params:{
                    examInfoId: props.item.id
                }
            })
            break;
    }
}
//未开始
const initData = () => {
    if (dayjs(startTime).isAfter(dayjs())) {
        // btnType.value = "primary"
        status.value = 'not-start'
        interval = setInterval(refreshStartTime(), 1000)
        //已结束
    } else if (dayjs(endTime).isBefore(dayjs())) {
        if (props.item.endVisible) {
            btnText.value = "查看"
            btnStatus.value = 'success'
            status.value = 'view'
        } else {
            btnText.value = "已结束"
            disabled.value = true;
            status.value = 'end'
        }
    } else {
        btnText.value = "开始考试"
        btnType.value = "primary"
        status.value = 'start'
    }
}
const refreshStartTime = () => {
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