<template>
    <div class="school-card" v-if="isAuth">
        <div class="card-top">
            <h2 class="school-auth">校园认证</h2>
            <h2 class="school-name">{{ userAuthInfo.schoolName }}</h2>
        </div>
        <div class="card-body">
            <div class="user-picture">
                <AAvatar :image-url="getImageUrl(userAuthInfo.picture)">
                </AAvatar>
            </div>
            <div>
                <p class="real-name">{{ userAuthInfo.realName }}</p>
                <p class="job-id">{{ userAuthInfo.jobNo }}</p>
                <p class="department-name">{{ userAuthInfo.departmentName }}</p>
            </div>
        </div>
    </div>
    <div v-else class="not-certified">
        <slot name="notCertified">
            <a-button type="primary">未认证，去认证</a-button>
        </slot>
    </div>
</template>
<script setup>
import useUserStore from '../../sotre/user-store';
import {getImageUrl} from '../../utils/image.js'
const props=defineProps({
    userAuthInfo:Object|null
})
const userStore=useUserStore();
const userAuthInfo=props.userAuthInfo??userStore.userInfo;
const isAuth=userAuthInfo.jobNo!=null;
</script>
<style lang="less">
:deep(.arco-avatar){
    background-color: transparent;
}
.school-card{
    background: url("../../assets/svg/auth-card.svg") no-repeat;
    background-size: cover;
    color: var(--color-bg-1);
    min-width: 300px;
    padding:20px;
    border-radius: 8px;
    .card-top{
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }
    .card-body{
        display: flex;
        align-items: center;
        line-height: 20px;
        font-size: 14px;
        .user-picture{
            margin-right: 20px;
            
        }
    }
}
.not-certified{
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 300px;
    height: 150px;
    background-image: linear-gradient(to right,#8193D6,#B4E6E7);
    border-radius: 15px;
}
</style>