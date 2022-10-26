<template>
    <div class="home-wrap">
        <!-- 介绍区 -->
        <!-- <div class="home-introduce">
            <img src="@/assets/img/home-introduce-bg.png"/>
        </div> -->
        <div class="home-function">
            <!-- 侧边栏 -->
            <a-menu class="home-list home-list-info" mode="pop" show-collapse-button breakpoint="xl">
                <router-link :to="item.url" v-for="item of navList" :key="item.url">
                    <a-menu-item>
                        <template #icon>
                            <component v-if="item.icon" :is="item.icon"></component>
                        </template>
                        {{ item.name }}
                    </a-menu-item>
                </router-link>
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
const route = useRoute()
const homeList = [
    {
        name: "我的课程",
        icon: "icon-apps",
        url: "/home/course/student"
    },
    {
        name: "我的作业",
        icon: "icon-select-all",
        url: "/home/work"
    },
    {
        name: "我的考试",
        icon: "icon-bookmark",
        url: "/home/exam"
    },
    {
        name: "我的笔记",
        icon: "icon-storage",
        url: "/home/note"
    }, {
        name: "消息",
        icon: "icon-notification",
        url: "/home/message"
    },
]
const getCourseList = () => {
    const id=route.params['courseId'];
    return [
        {
            name: "课堂",
            icon: "icon-apps",
            url: `/course/${id}/classroom`
        },
        {
            name: "作业",
            icon: "icon-select-all",
            url: `/course/${id}/work`
        },
        {
            name: "考试",
            icon: "icon-at",
            url: `/course/${id}/exam`
        },
        {
            name: "题库",
            icon: "icon-bookmark",
            url: `/course/${id}/question`
        },
        {
            name: "班级",
            icon: "icon-command",
            url: `/course/${id}/classes`
        },

    ]
}
const navList = ref([]);
let path = route.path;

const checkNav = () => {
    if (path.startsWith("/home")) {
        navList.value = homeList;
    } else {
        console.log()
        navList.value = getCourseList();
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