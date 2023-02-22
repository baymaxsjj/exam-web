<template>
    <div class="header-wrap">
        <div class="header">
            <!-- logo -->
            <div style="height: 100%;display:flex;">
                <router-link to="/" class="header-logo">
                    <img src="../assets/svg/logo.svg" style="height: 20px;"/>
                    <h1 class="name">为考</h1>
                </router-link>
                <!-- 导航区 -->
                <ul class="header-nav">
                    <li>
                        <router-link to="/home">
                            首页
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/home/course/student">
                            课程中心
                        </router-link>
                    </li>
                    <li>
                        <router-link to="/home">
                            题库查询
                        </router-link>
                    </li>
                </ul>
            </div>
            <!-- 信息区 -->
            <ul class="header-info">
                <li class="header-search">
                    <!-- <a-input-search :style="{width:'320px'}" placeholder="搜索一下吧~~~" search-button /> -->
                </li>
                <li>
                    <a-tooltip
                    :content="
                        theme === 'light'
                        ? '点击切换为暗黑模式'
                        :'点击切换为亮色模式'
                    "
                    >
                    <a-button
                        class="nav-btn"
                        type="outline"
                        :shape="'circle'"
                        @click="handleToggleTheme"
                    >
                        <template #icon>
                        <icon-moon-fill v-if="theme === 'dark'" />
                        <icon-sun-fill v-else />
                        </template>
                    </a-button>
                    </a-tooltip>
                </li>
                <li>
                    <a-tooltip
                    :content="
                        isFullscreen
                        ? '点击退出全屏模式'
                            :'点击切换全屏模式'
                        "
                        >
                        <a-button
                            class="nav-btn"
                            type="outline"
                            :shape="'circle'"
                            @click="toggleFullScreen"
                        >
                            <template #icon>
                            <icon-fullscreen-exit v-if="isFullscreen" />
                            <icon-fullscreen v-else />
                            </template>
                        </a-button>
                        </a-tooltip>
                </li>
                <li>
                    <a-trigger>
                        <a-button type="primary">{{userInfo?.schoolName??'学校认证'}}</a-button>
                        <template #content>
                            <AuthCard style="margin-top:20px" :userAuthInfo="userInfo"/>
                        </template>
                    </a-trigger>
                </li>

                <li>
                    <a-dropdown trigger="hover">
                        <div class="user-info">
                            <AAvatar class="avatar" :image-url="userInfo?.picture">
                                
                            </AAvatar>
                            <p class="user-name">{{userInfo?.nickname??"未登录"}}</p>
                        </div>
                        <template #content>
                            <a-doption>
                            <a-space @click="$router.push({ name: 'SettingIndex' })">
                                <icon-user />
                                <span>
                                    用户中心
                                </span>
                            </a-space>
                            </a-doption>
                            <a-doption>
                            <a-space @click="logout">
                                <icon-export />
                                <span>
                                    退出登录
                                </span>
                            </a-space>
                            </a-doption>
                        </template>
                        </a-dropdown>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import { useRouter } from 'vue-router';
import useUserStore from '../sotre/user-store';
import AuthCard from './auth/AuthCard.vue';
import {computed} from 'vue'
import { useDark, useToggle, useFullscreen} from '@vueuse/core';
const { isFullscreen,  toggle:toggleFullScreen } = useFullscreen();

const userStore=useUserStore();
const userInfo=userStore.userInfo;
const router=useRouter()

const theme = computed(() => {
    return userStore.theme;
});
const logout=()=>{
    userStore.logOut()
    router.push({name:"Login"})
}
const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark) {
      // overridden default behavior
      userStore.toggleTheme(dark)
    },
  });
const toggleTheme = useToggle(isDark);
const handleToggleTheme = () => {
    toggleTheme();
};
</script>
<style lang="less" scope>
:deep(.arco-trigger-popup){
    padding: 10px;
}
.arco-dropdown-open .arco-icon-down {
  transform: rotate(180deg);
}
a {
    text-decoration: none;
    color: inherit;
}
.header-wrap {
    background-color: var(--color-bg-1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    color: var(--color-text-2);
    padding: 0 30px;
    z-index: 99;
    .header {
        display: flex;
        height: 100%;
        justify-content: space-between;

        .header-logo {
           display: flex;
           align-items: center;
           margin-right: 20px;
           .name{
            text-align: center;
            font-weight: bold;
            font-size: 18px;
            margin-left: 10px;
            color: var(--color-text-2);
           }
        }

        .header-nav {
            display: flex;
            align-items: center;
            
            li {
                padding: 10px 15px;
                margin: 0 2px;
                border-radius: 4px;
                transition: all .3s;

                &:hover {
                    background-color: var(--color-fill-2);
                    ;
                }

               
            }
        }

        .header-info {
            display: flex;
            align-items: center;
            .nav-btn {
                border-color: rgb(var(--gray-2));
                color: rgb(var(--gray-8));
                font-size: 16px;
                }
            li {
                margin: 0 10px;
            }
            .user-info{
                display: flex;
                align-items: center;
                .avatar{
                    flex-shrink: 0;
                }
                .user-name{
                    margin-left: 4px;
                    overflow: hidden;   
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
            }
        }
    }
}
</style>