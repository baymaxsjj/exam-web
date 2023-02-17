<template>
    <div class="message-card-wrap">
            <!-- 用户消息 -->
            <div class="user-message" v-if="cardType==0">
                <TextEditor mode="preview" :model-value="props.messageInfo.introduce"></TextEditor>
            </div>
            <!-- 课程通知/超链接 -->
            <div class="card-message" @click="toLink" v-else-if="cardType==1">
                <AAvatar :size="50" style="background-color: var(--color-primary-light-4) "  shape="square">{{ props.messageInfo.type.info }}</AAvatar>
                <div class="voice-warp">
                    <h1 style="margin-bottom: 5px;">{{ props.messageInfo.title }}</h1>
                    <p>{{ props.messageInfo.introduce }}</p>
                </div>
            </div>
            <!-- 图片 -->
            <div class="card-picture" v-else-if="cardType==2">

            </div>
             <!--视频 -->
            <div class="card-picture" v-else-if="cardType==3">
            </div>

</div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import TextEditor from '../TextEditor.vue';

const props=defineProps({
    messageInfo:Object,
})
const cardType=(props.messageInfo.type.value+"").charAt(2)
console.log(cardType)
const router=useRouter()
const toLink=()=>{
    router.push(JSON.parse(props.messageInfo.path))
}
</script>
<style lang="less" scoped>
.user-message{
    padding: 10px;
    border-radius: 5px;
    display: flex;
}
.card-message{
    padding: 15px 10px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    background-color: var(--color-fill-2);
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    cursor: pointer;
    :first-child{
        flex-shrink: 0;
    }
    .voice-warp{
        margin: 0 10px;
        :first-child{
            line-height: 1.5;
            color: var(--color-text-1);
        }
        :last-child{
            font-size: 14px;
            color: var(--color-text-2);
        }
    }
}
</style>