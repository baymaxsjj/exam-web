<template>
    <a-page-header title="班级成员"  @back="$router.back">
    </a-page-header>
    <ASpin :loading="loading" style="width: 100%;">
        <div v-if="userList.length!=0">
            <ul>
                <li v-for="item in userList" class="ebutton-hover user-item">
                    <Avatar shape="square" :image-url="item.picture" />
                    <span class="user-item-name">{{item.nickname}}</span>
                </li>
            </ul>
            <a-pagination style="justify-content: center;margin:10px 0" v-model:current="currentPage" :total="total" @change="getUsreList" :current="currentPage" :page-size="9" />
        </div>
        <a-empty v-else />
    </ASpin>
    
</template>
<script setup>
import { Avatar } from '@arco-design/web-vue';
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getClassUsersRequest } from '../../apis/course-api';
const userList = ref([])
const route = useRoute()
const currentPage = ref(1)
const total = ref(0)
const loading=ref(false)
const getUsreList = () => {
    loading.value=true
    getClassUsersRequest(route.params['classId'], currentPage.value).then(res => {
        const data = res.data.data;
        userList.value = data.list
        currentPage.value = data.current
        total.value = data.total
        loading.value=false
    })
}
getUsreList()

</script>
<style lang="less" scoped>
.user-item{
    padding:10px;
    margin: 5px;
    .user-item-name{
        margin-left: 10px;
    }
}
</style>