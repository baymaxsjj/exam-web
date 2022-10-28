<template>
    <div class="home-wrap">
        <!-- 介绍区 -->
        <!-- <div class="home-introduce">
            <img src="@/assets/img/home-introduce-bg.png"/>
        </div> -->
        <div class="home-function">
            <!-- 侧边栏 -->
            <a-menu class="home-list home-list-info" mode="pop" show-collapse-button breakpoint="xl">
                <template v-for="item of navList" :key="item.url">
                    <router-link :to="item.url" v-if="item.visble">
                        <a-menu-item >
                            <template #icon>
                                <component v-if="item.icon" :is="item.icon"></component>
                            </template>
                            {{ item.name }}
                        </a-menu-item>
                    </router-link>
                </template>
            </a-menu>
            <!-- 课程 -->
            <div class="home-content home-common">
                <router-view></router-view>
                <p class="home-common" style="text-align: center;color:var(--color-border-4)">
                    &copy; 2022 Baymax 版权所有
                </p>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useCourseStore from '../../sotre/course-store';
const route = useRoute()
const homeList = [
    {
        name: "我的课程",
        icon: "icon-apps",
        url: "/home/course/student",
        visble:true
    },
    {
        name: "我的作业",
        icon: "icon-select-all",
        url: "/home/work",
        visble:true
    },
    {
        name: "我的考试",
        icon: "icon-bookmark",
        url: "/home/exam",
        visble:true
    },
    {
        name: "我的笔记",
        icon: "icon-storage",
        url: "/home/note",
        visble:true
    }, {
        name: "消息",
        icon: "icon-notification",
        url: "/home/message",
        visble:true
    },
]
const navList = ref([]);
let path = route.path;
const courseStore=useCourseStore()
const checkNav = () => {
    if (path.startsWith("/home")) {
        navList.value = homeList;
    } else {
        console.log()
        navList.value = courseStore.menu;
    }
}
checkNav();
console.log(route)
watch(() => route.path, (newpath, old) => {
    path = newpath;
    checkNav()
})

</script>
<style lang="less" scoped>
:deep(.arco-menu .arco-menu-collapse-button) {
    width: 32px;
    height: 32px;
    border-radius: 50%;
}
:deep(.arco-page-header){
    position: sticky;
    top: -20px;
    background-color: #fff;
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
    }

}
</style>