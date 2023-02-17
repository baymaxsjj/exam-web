<template>
    <div class="empty">
        <a-result status="404" subtitle="页面不存在~">
            <template #extra>
            <a-space>
                <a-button type="primary" @click="$router.push({name:'MyCourse',params:{role:'student'}})">回到首页</a-button>
            </a-space>
            </template>
        </a-result>
    </div>
</template>
<style lang="less" scoped>
    .empty{
        height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>