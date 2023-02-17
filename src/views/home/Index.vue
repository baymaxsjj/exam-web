<template>
    <div class="home-wrap">
        <!-- 介绍区 -->
        <!-- <div class="home-introduce">
            <img src="@/assets/img/home-introduce-bg.png"/>
        </div> -->
        <div class="home-function">
            <!-- 侧边栏 -->
            <a-menu class="home-list home-list-info" mode="pop" v-model:selected-keys="selectedKeys"
                show-collapse-button breakpoint="xl">
                <template v-for="item of navList" :key="item.key">
                        <a-menu-item @click="toLink(item)"  v-if="item.visble" :key="item.key">
                            <template #icon  v-if="item.icon">
                                <component :is="item.icon"/>
                            </template>
                            {{ item.name }}
                        </a-menu-item>
                </template>
            </a-menu>
            <!-- 课程 -->
            <div class="home-content home-common">
                <router-view></router-view>
                <div style="text-align: center;color:var(--color-text-3);font-size: 16px;">
                    <p>
                        <a href="https://gitee.com/baymaxsjj">&copy; 2022 Baymax 版权所有<br /></a>
                    </p>
                    <p style="font-size:12px;margin:5px 0;">
                        <a href="https://gitee.com/baymaxsjj/sqlmock">数据填充由 SqlMock 提供</a>
                    </p>
                </div>

            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watchEffect,h} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCourseStore from '../../sotre/course-store';
import useUserStore from '../../sotre/user-store';
import {IconApps,IconSelectAll,IconAt,IconBookmark,IconCommand} from "@arco-design/web-vue/es/icon";

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const selectedKeys = ref([])
if (!userStore.token) {
    router.push({
        name: "Login"
    })
}
const toLink=(item)=>{
    router.push({
        name:item.key,
        params:item.params
    })
}
const homeList = [
    {
        name: "我的课程",
        icon: "icon-apps",
        key: "MyCourse",
        params: {
            role: 'student'
        },
        visble: true
    },
    {
        name: "我的作业",
        icon: "icon-select-all",
        key: "MyHomeWrok",
        params: {},
        visble: true
    },
    {
        name: "我的考试",
        icon: "icon-bookmark",
        key: "MyExams",
        params: {},
        visble: true
    },
    {
        name: "我的笔记",
        icon: "icon-storage",
        key: "MyNotes",
        params: {},
        visble: true
    }, {
        name: "消息",
        icon: "icon-notification",
        key: "Message",
        params: {},
        visble: true
    },
]
const navList = ref([]);
let path = route.path;
const courseStore = useCourseStore()
const checkNav = () => {
    if (path.startsWith("/home")) {
        navList.value = homeList;
    } else if(path.startsWith("/course")){
        console.log()
        navList.value = courseStore.menu;
    }else if(path.startsWith("/user")){
        navList.value = userStore.menu;
    }
}
checkNav();
console.log(route)
watchEffect(() => {
    path = route.path;
    checkNav()
    selectedKeys.value = [route.name]
})

</script>
<style lang="less" scoped>
:deep(.arco-menu .arco-menu-collapse-button) {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}

:deep(.arco-page-header) {
    position: sticky;
    top: -20px;
    background-color: var(--color-menu-light-bg);
    z-index: 1;
}

:deep(.arco-menu) {
    margin: 0 10px;
    background-color: var(--color-menu-light-bg);
    border-radius: 10px;
    padding: 20px;
}

:deep(.arco-menu-collapsed) {
    padding: 0;
}

.home-wrap {
    padding-top: 72px;
    box-sizing: border-box;
    height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: var(--color-border-1);
    overflow-y: hidden;

    .home-common {
        margin: 0 10px;
        background-color: var(--color-menu-light-bg);
        border-radius: 10px;
        padding: 20px;
    }

    .home-introduce {
        height: 150px;

        img {
            display: block;
            width: 100%;
            height: 100%;
            object-fit: inherit;
        }
    }

    .home-function {
        flex-grow: 1;
        display: flex;
        padding: 10px 0;
        overflow: hidden;
    }

    .home-list {
        max-width: 200px;
        transition: all .3s;
        height: 100%;
        box-sizing: border-box;

        .home-list-info {
            overflow-y: auto;
        }
    }

    .home-content {
        overflow-y: auto;
        width: 100%;
        margin-left: 0;
    }

}
</style>