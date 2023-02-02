<template>
    <div class="header-wrap">
        <div class="header">
            <!-- logo -->
            <div style="height: 100%;display:flex;">
                <router-link to="/" class="header-logo">
                    <img src="../assets/svg/logo.svg" style="height: 40px;"/>
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
                        <router-link to="/home">
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
                    <a-input-search :style="{width:'320px'}" placeholder="搜索一下吧~~~" search-button />
                </li>

                <li>
                    <a-button type="text">
                        <template #icon>
                            <icon-plus />
                        </template>
                    </a-button>
                </li>
                <li v-if="!$route.path.startsWith('/home/')">
                    <RouterLink to="/home">
                        <AButton type="text">个人空间</AButton>
                    </RouterLink>
                </li>
                <li>
                    <a-trigger>
                        <a-button type="primary">{{userInfo.schoolName??'学校认证'}}</a-button>
                        <template #content>
                            <AuthCard style="margin-top:20px" :userAuthInfo="userInfo"/>
                        </template>
                    </a-trigger>
                </li>

                <li>
                    <ADropdown  trigger="hover" :popup-max-height="false">
                        <div class="user-info">
                            <AImage class="avatar" height="32" width="32" :src="userInfo.picture">
                                
                            </AImage>
                            <p class="user-name">{{userInfo.nickname??"未登录"}}</p>
                        </div>
                        <template #content>
                            <a-doption>
                                <RouterLink to="">个人信息</RouterLink>
                            </a-doption>
                            <a-doption>退出登录</a-doption>
                        </template>
                    </ADropdown>
                </li>
            </ul>
        </div>
    </div>
</template>
<script setup>
import useUserStore from '../sotre/user-store';
import AuthCard from './auth/AuthCard.vue';
const userStore=useUserStore();
const userInfo=userStore.userInfo;
</script>
<style lang="less" scope>
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
           img{
            animation: loading 3s infinite linear;
           }
           .name{
            text-align: center;
            font-weight: bold;
            opacity: 0.8;
            font-size: 18px;
            margin-left: 10px;
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

            li {
                margin: 0 2px;
            }
            .user-info{
                display: flex;
                align-items: center;
                margin-left: 20px;
                max-width: 120px;
                .avatar{
                    border-radius: 32px;
                    border: 2px solid rgb(var(--primary-3));
                    height: 32px;
                    width: 32px;
                    overflow: hidden;
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