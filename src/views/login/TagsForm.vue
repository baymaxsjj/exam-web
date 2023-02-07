<template>
  <div class="tags_from">
    <!-- 登录表单 -->
    <div class="tag_login" v-if="loginType == 0">
      <a-form :model="loginForm"  @submit-success="submit">
        <a-form-item
          field="username"
          :hide-label="true"
          :rules="form_rules.verfiName"
        >
          <a-input
            size="large"
            v-model="loginForm.username"
            placeholder="输入用户名/邮箱地址"
          />
        </a-form-item>
        <a-form-item field="password" :hide-label="true" :rules="form_rules.password">
          <a-input-password
            size="large"
            v-model="loginForm.password"
            placeholder="输入密码（6~18个字符）"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="sumbit"
          style="height: 44px; font-size: 16px"
          size="large"
          :loading="loading"
          >{{ tagList[loginType].name }}</a-button
        >
      </a-form>
    </div>
    <!-- 注册表单 -->
    <div class="tag_login" v-if="loginType == 1">
      <a-form :model="registerForm" ref="register" @submit-success="submit">
        <a-form-item
          field="email"
          :hide-label="true"
          :rules="form_rules.email"
        >
          <a-input
            size="large"
            v-model="registerForm.email"
            placeholder="输入邮箱地址"
          />
        </a-form-item>
        <a-form-item
          field="verifiCode"
          :hide-label="true"
          :rules="form_rules.verifiCode"
        >
          <a-input
            size="large"
            v-model="registerForm.verifiCode"
            placeholder="输入验证码（4个字符）"
          >
           <template #append>
              <a-button type="primary" :loading="emailLoading" style="height:100%;width:125px" @click="sendEmailCode('registerForm')">{{send_btn_text}}</a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item
          field="nickname"
          :hide-label="true"
        >
          <a-input
            size="large"
            v-model="registerForm.nickname"
            placeholder="输入昵称"
          >
          </a-input>
        </a-form-item>
        <a-form-item
          field="username"
          :hide-label="true"
          :rules="form_rules.username"
        >
          <a-input
            size="large"
            v-model="registerForm.username"
            placeholder="输入个人用户名/登录名"
          >
          </a-input>
        </a-form-item>
        <a-form-item field="password" :hide-label="true" :rules="form_rules.password">
          <a-input-password
            size="large"
            v-model="registerForm.password"
            placeholder="输入密码（6~18个字符）"
          />
        </a-form-item>
        <a-form-item field="checkPass" :hide-label="true" :rules="form_rules.checkPass">
          <a-input-password
            size="large"
            v-model="registerForm.checkPass"
            placeholder="确认密码（6~18个字符）"
          />
        </a-form-item>
        
        <a-button
          type="primary"
          html-type="sumbit"
          style="height: 44px; font-size: 16px"
          size="large"
          :loading="loading"
          >{{ tagList[loginType].name }}</a-button
        >
      </a-form>
    </div>
    <!-- 找回密码表单 -->
    <div class="tag_login" v-if="loginType == 2" >
      <a-form :model="forgetForm" ref="forget" @submit-success="submit">
        <a-form-item
          field="email"
          :hide-label="true"
          :rules="form_rules.email"
        >
          <a-input
            size="large"
            v-model="forgetForm.email"
            placeholder="输入邮箱地址"
          />
        </a-form-item>
        <a-form-item
          field="verifiCode"
          :hide-label="true"
          :rules="form_rules.verifiCode"
        >
          <a-input
            size="large"
            v-model="forgetForm.verifiCode"
            placeholder="输入验证码（4个字符）"
          >
           <template #append>
              <a-button type="primary" :loading="emailLoading" style="height:100%;width:125px" @click="sendEmailCode('forgetForm')">{{send_btn_text}}</a-button>
            </template>
          </a-input>
        </a-form-item>
        <a-form-item field="password" :hide-label="true" :rules="form_rules.password">
          <a-input-password
            size="large"
            v-model="forgetForm.password"
            placeholder="输入密码（6~18个字符）"
          />
        </a-form-item>
        <a-button
          type="primary"
          html-type="sumbit"
          style="height: 44px; font-size: 16px"
          size="large"
          :loading="loading"
          >{{ tagList[loginType].name }}</a-button
        >
      </a-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import {Message} from '@arco-design/web-vue'
import {loginRequest,registerRequest,forgetPassRequest,sendEmailCodeRequest} from '@/apis/auth-api.js'
import useUserStore from "../../sotre/user-store";
import { useRouter } from "vue-router";
const app_url=location.origin;
const emailLoading=ref(false)
const props = defineProps({
  loginType: Number,
  tagList: Array,
});
const loading=ref(false)
const register=ref(null)
const forget=ref(null)
const loginForm = reactive({
  username: "",
  password: "",
});
const registerForm=reactive({
  email:"",
  username:'',
  password:'',
  checkPass:'',
  verifiCode:''
})
const forgetForm=reactive({
  email:"",
  password:'',
  verifiCode:''
})
const userStore=useUserStore();
const router=useRouter();
const submit=()=>{
  loading.value=true;
  let loginType=props.loginType;
  if(loginType==0){
    loginRequest(loginForm.username,loginForm.password).then(res=>{
      userStore.token="Bearer "+res.data.access_token;
      userStore.getUserInfo().then(()=>{
        Message.success("登录成功")
        loading.value=false;
        router.push({
          name:"MyCourse",
          params:{
            role:"student"
          }
        })
      })
      userStore.getBaseUserInfo()
    }).catch(err=>{
      Message.info(err.data.error_description)
      loading.value=false;
    })
  }else if(loginType==1){
    registerRequest(registerForm,registerForm.verifiCode)
    .then(res=>{
      loading.value=false;
    })
    .catch(e=>{
      loading.value=false
    })
  }else{
    forgetPassRequest(forgetForm.email,forgetForm.verifiCode,forgetForm.password)
    .then(res=>{
      loading.value=false;
    })
    .catch(e=>{
      loading.value=false;
    })
  }

}
const send_btn_text=ref('获取验证码')
let interval_time=60;

const sendEmailCode=(refName)=>{
    let form;
    if(refName=="forgetForm"){
      form=forget.value
    }else{
      form=register.value
    }
    form.validateField('email',errors=>{
      emailLoading.value=true
      if(errors==undefined){
        if(interval_time==60){
          sendEmailCodeRequest(
            props.loginType==1?"register":"forget",
            props.loginType==1?registerForm.email:forgetForm.email,
          ).then((res)=>{
            emailLoading.value=false
            intervalCharge();
          }).catch(err=>{
            console.log(err)
            emailLoading.value=false
          })
        }
      }else{
        Message.error(errors.email.message)
      }
    })
}
const intervalCharge=()=>{
  send_btn_text.value=interval_time+'s后重新获取'
  const interId=setInterval(()=>{
    if(interval_time>0){
      interval_time--;
      send_btn_text.value=interval_time+'s后重新获取'
    }else{
      interval_time=60;
      send_btn_text.value="发送验证码"
      clearInterval(interId)
    }
  },1000)
}
const valiPass=(field,callback)=>{
  console.log(field)
}
const form_rules = {
  username: [
    { required: true, message: "用户名不能为空~" },
    { maxLength: 16, message: "用户名不能超过16个字符~"},
    { minLength: 5, message: "用户名地址至少5个字符~" },
    { match: /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/, message: "用户名必须以字母开头，只允许字母数字下划线~" },
  ],
  password: [
    { required: true, message: "密码不能为空~" },
    { maxLength: 18, message: "密码不能超过18个字符~"},
    { minLength: 6, message: "密码至少6个字符~" },
    // { match: /^[a-zA-Z]\w{5,17}$/, message: "密码以字母开头，只能包含字母、数字和下划线" },
  ],
  checkPass:[
    { required: true, message: "确认密码不能为空~" },
    { maxLength: 18, message: "确认密码不能超过18个字符~"},
    { minLength: 6, message: "确认密码至少6个字符~" },
    // { match: /^[a-zA-Z]\w{5,17}$/, message: "密码以字母开头，只能包含字母、数字和下划线" },
    { validator:(val,callback)=>{
      if(val!=registerForm.password){
        callback("两次密码不一致~")
      }
    }},
  ],
  email: [
    { required: true, message: "邮箱不能为空~" },
    { match: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/, message: "邮箱格式不正确~" },
  ],
  verifiCode: [
    { required: true, message: "验证码不能为空~" },
    { maxLength:4, message: "验证码长度为4个字符~" },
    { minLength:4, message: "验证码长度为4个字符~" },
  ],
  verfiName:[
    { required: true, message: "个人博客地址/邮箱不能为空~" },
    {validator:(val,callback)=>{
      let reg;
      if(val.indexOf('@')>0){
        reg=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        if(!reg.test(val)){
          callback("邮箱格式不正确~")
        }
      }else{
        reg=/^[a-zA-Z][a-zA-Z0-9_ ]{4,15}$/
        if(!reg.test(val)){
          callback("必须以字母开头，只允许字母数字下划线~")
        }
      }
      return false
    }}
    // { maxLength: 16, message: "个人博客地址/邮箱不能超过16个字符~"},
    // { minLength: 5, message: "个人博客地址/邮箱至少5个字符~" },
    // { match: /^\w+([-+.]\w+)*(@\w+([-.]\w+)*\.\w+([-.]\w+)*)?$/, message: "邮箱格式不正确~" },
  ]
};
</script>
<style lang="less" scoped>
:deep(.arco-input-prepend),:deep(.arco-input-append)  {
    padding: 0;
}
 
</style>