<template>
    <div class="message-card">
            <!-- 用户消息 -->
            <div class="card-container" v-if="cardType==0">
                <TextEditor mode="preview" :model-value="props.messageInfo.introduce"></TextEditor>
            </div>
            <!-- 课程通知/超链接 -->
            <RouterLink to="/" v-else-if="cardType==1">
                <div class="card-container">
                    <AAvatar  shape="square">{{ props.messageInfo.type.info }}</AAvatar>
                    <div style="margin: 0 5px">
                        <h2>{{ props.messageInfo.title }}</h2>
                        <p>{{ props.messageInfo.introduce }}</p>
                    </div>
                </div>
            </RouterLink>
            <!-- 图片 -->
            <div class="card-picture" v-else-if="cardType==2">

            </div>
             <!--视频 -->
            <div class="card-picture" v-else-if="cardType==3">
            </div>

</div>
</template>
<script setup>
import TextEditor from '../TextEditor.vue';

const props=defineProps({
    messageInfo:Object,
})
const cardType=(props.messageInfo.type.value+"").charAt(2)
console.log(cardType)
</script>
<style lang="less" scoped>
.card-container{
    padding: 10px;
    border-radius: 5px;
    display: flex;
}
</style>