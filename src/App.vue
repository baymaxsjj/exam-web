

<template>
  <header-nav v-if="headerVisible"></header-nav>
  <router-view></router-view>
</template>
<script setup>
import { computed, watch, watchEffect, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import HeaderNav from './components/HeaderNav.vue';
import useUserStore from './sotre/user-store';
import SocketService from './utils/web-stocket-service.js'
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const headerVisible = ref(true)
if (userStore.isLogin) {
  userStore.getUserInfo()
  userStore.getBaseUserInfo()
}

//登录成功后连接
watchEffect(() => {
  console.log(userStore.isLogin)
  if (userStore.isLogin) {
    const socketServe = SocketService.Instance;
    socketServe.route = route
    socketServe.router = router;
    socketServe.connect()
    console.log("已登录：连接webstock")
  }
})
watch(() => route.name, () => {
  const meta = route.meta
  let title = meta['title']
  let header = meta['header']
  if (header != undefined) {
    headerVisible.value = header
  } else {
    headerVisible.value = true;
  }

  if (title != undefined) {
    title = "-" + title;
  }
  document.title = "为考" + (title ?? "")

})
</script>
<style lang="less">
body,
textarea {
  font-family: Helvetica Neue, Helvetica, PingFang SC, Microsoft YaHei, Source Han Sans SC, Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
}

.ebutton-hover {
  transition: all .3s;
  border-radius: 5px;
  cursor: pointer;
  padding: 15px;

  &:hover {
    background-color: var(--color-fill-2);
  }
}

.arco-page-header-wrapper {
  padding-left: 0px !important;
}

.arco-modal-simple .arco-modal-body {
  overflow: hidden;
}

.arco-avatar-image img {
  object-fit: cover;
}

div::-webkit-scrollbar,
body::-webkit-scrollbar,
ul::-webkit-scrollbar {
  /*滚动条整体样式*/
  width: 5px;
  /* 高宽分别对应横竖滚动条的尺寸 */
  height: 1px;
}

div::-webkit-scrollbar-thumb,
body::-webkit-scrollbar-thumb,
ul::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow: inset 0 0 5px rgba(219, 219, 219, 0.5);
  background: #d6d6d6;
}

div::-webkit-scrollbar-track,
body::-webkit-scrollbar-track,
ul::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  background: #ffffff;
}

@media only screen and (max-width: 600px) {
  .arco-modal-simple {
    width: 100% !important;
    box-sizing: border-box;
  }
}</style>