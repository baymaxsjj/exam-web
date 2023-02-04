<template>
  <a-form
    ref="formRef"
    :model="formData"
    class="form"
    :label-col-props="{ span: 8 }"
    :wrapper-col-props="{ span: 16 }"
  >
  <a-form-item
      field="username"
      label="用户名"
      :rules="[
        {
          required: true,
          message: '用户名不能为空',
        },
      ]"
    >
      <a-input
        v-model="formData.username"
        placeholder="请输入用户名"
      />
    </a-form-item>
    <a-form-item
      field="nickname"
      label="昵称"
      :rules="[
        {
          required: true,
          message: '昵称不能为空',
        },
      ]"
    >
      <a-input
        v-model="formData.nickname"
        placeholder="请输入昵称"
      />
    </a-form-item>
    <a-form-item
      field="email"
      label="邮箱"
      :rules="[
        {
          required: true,
          message: '邮箱',
        },
      ]"
    >
      <a-input
        v-model="formData.email"
        placeholder="邮箱"
      />
    </a-form-item>
    
  </a-form>
</template>

<script setup>
  import { ref } from 'vue';

  const formRef = ref();
  const formData = ref({
    email: '',
    nickname: '',
    countryRegion: '',
    area: '',
    address: '',
    profile: '',
  });
  const validate = async () => {
    const res = await formRef.value?.validate();
    if (!res) {
      // do some thing
      // you also can use html-type to submit
    }
  };
  const reset = async () => {
    await formRef.value?.resetFields();
  };
</script>

<style scoped lang="less">
  .form {
    width: 540px;
    margin: 0 auto;
  }
</style>