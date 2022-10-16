<template>
    <div class="login">
        <div class="login-wrap">
            <div class="login-left" >
                <div v-html="slogan"></div>
            </div>
            <div class="login-right">
                <div class="login-right-wrap">
                    <h3 class="title">{{title}}</h3>
                    <!-- 标签选项 -->
                    <Tabs style="margin-bottom:10px" v-model:tag="loginType" :tagList="tagList" @tab-click="taggleTag"/>
                    <!-- 操作表单 -->
                    <tags-form :loginType="loginType" :tagList="tagList"></tags-form>
                    <a-divider orientation="center" class="half-divider">
                        <span style="color:var(--color-text-3)">其他方式登录</span>
                    </a-divider>
                    <!-- 第三方登录 -->
                    <div class="tripa_login">
                        <a href="/w_api/login/qq/render" class="tripa" style="flex:3" title="QQ">
                            <img src="@/assets/img/login_qq.png"/>
                        </a>
                         <a href="/w_api/login/gitee/render" class="tripa" style="flex:2" title="Gitee">
                            <img src="@/assets/img/login_gitee.png"/>
                        </a>
                         <a href="/w_api/login/github/render" class="tripa" style="flex:1" title="GitHub">
                            <img src="@/assets/img/login_github.png"/>
                        </a>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, watch} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import useUserStore from '../../sotre/user-store';
import TagsForm from './TagsForm.vue';
import Tabs from '@/components/Tabs.vue'

const title=ref("")
const app_name=import.meta.env.VITE_APP_NAME
const slogan=import.meta.env.VITE_APP_LOGIN_SLOGAN
// 登录类型：0：登录，1：注册，2：找回密码
const loginType=ref(0)
const tagList=[
    {
        name:'登录',
        loginType:0,
        title:`${app_name}`
    },
    {
        name:'注册',
        loginType:1,
        title:`${app_name}`
    },
    {
        name:'找回密码',
        loginType:2,
        title:`${app_name}`
    }
]
const route=useRoute()
const router=useRouter();
const userStore=useUserStore();
// 第三方登录跳转后保存
const token=route.query.token;
console.log(token)
if(token){
    userStore.token=token;
    const prePageName=localStorage.getItem("prePageName")
    if(prePageName){
        localStorage.clear("prePageName")
        router.push()
    }
}
// 确认标签
const checkTag=(type)=>{
    type=parseInt(type)
    switch(type){
        case 0:
            loginType.value=0
            break
        case 1:
            loginType.value=1
            break
        case 2:
            loginType.value=2
            break
        default:loginType.value=0
    }
    title.value=tagList[loginType.value].title
}
checkTag(route.query.type)
watch(()=>route.query.type,(type)=>{    
    checkTag(type)
})
// 选择标签
const taggleTag=(val)=>{
    router.push({
        name:"Login",
        query:{
            type:val
        }
    })
}
console.log(app_name)

</script>
<style lang="less" scoped>
.login{
    background-image:  url('@/assets/img/login_bg.jpg');
    background-size: cover;
    background-attachment:fixed;
    .login-wrap{
        min-height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        .login-left,.login-right{
            flex:1;
        }
        .login-left{
            font-size: 2rem;
            font-weight: 500;
            margin-bottom: 24px;
            line-height: 1.4;
            color: var(--color-bg-1);
            display: flex;
            justify-content: center;
        }
        .login-right{
            display: flex;
            justify-content: center;
            box-sizing: border-box;
            width: 100%;
            .login-right-wrap{
                border-radius: 10px;
                padding: 40px 30px;
                margin: 60px 0;
                background: var(--color-bg-1);
                border-radius: 1px solid #000;
                box-shadow: var(--shadow-3);
                width: 400px;
                // min-width: 300px;
                box-sizing: border-box;
                .title{
                    font-size: 30px;
                    margin-bottom: 40px;
                    color: var(--color-text-1);
                    font-family: SourceHanSansCN_Bold
                }
                .tripa_login{
                    display: flex;
                    height: 40px;
                    width: 100%;
                    align-items: center;
                    .tripa{
                        margin:0 5px;
                        height: 100%;
                        border-radius:  1px solid #000;
                        border: 1px solid var(--color-fill-1);
                        box-shadow: -4px 4px 10px rgba(0, 0, 0, 0.1);
                        transition: all .3s;
                        display: flex;
                        justify-content: center;
                        align-items:center;
                        background: var(--color-bg-4) url(@/assets/img/login_btn_bg.svg);
                        background-size:contain;
                        background-repeat:no-repeat;
                        background-position:center;

                        img{
                            height: 60%;
                        }
                        &:hover{
                            box-shadow: -4px 4px 20px rgba(0, 0, 0, 0.1);
                        }
                    }
                }
            }
            
        }
    }

}
@media screen and(max-width: 600) {
    .login{
         .login-wrap{
             .login-left{
                 display: none;
             }
             .login-right{
                 background: rgba()var(--color-bg-1);
             }
         }
    }
}

</style>
