<template>
    <a-page-header title="班级成员"  @back="$router.back">
    </a-page-header>
    <div v-if="userList.length!=0">
        <ul>
            <li v-for="item in userList" class="ebutton-hover user-item">
                <a-image width="50" height="50" :src="item.picture" />
                <span class="user-item-name">{{item.nickname}}</span>
            </li>
        </ul>
        <a-pagination style="justify-content: center;" :total="total" :current="currentPage" :page-size="9" />
    </div>
    <a-empty v-else />
</template>
<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { getClassUsersRequest } from '../../apis/course-api';
const userList = ref([])
const route = useRoute()
const currentPage = ref(1)
const total = ref(0)
const getUsreList = () => {
    getClassUsersRequest(route.params['classId'], currentPage.value).then(res => {
        const data = res.data.data;
        userList.value = data.list
        currentPage.value = data.current
        total.value = data.total
    })
}
getUsreList()

</script>
<style lang="less" scoped>
.user-item{
    padding: 0 15px;
    .user-item-name{
        margin-left: 10px;
    }
}
</style>