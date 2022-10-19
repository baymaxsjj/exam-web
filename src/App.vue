<script setup>
import HeaderNav from './components/HeaderNav.vue';

</script>

<template>
  <header-nav></header-nav>
  <router-view class="router-view"></router-view>
</template>
<style lang="less">
.router-view{
  // margin-top: 72px;
  padding-top: 72px;
  box-sizing: border-box;
}
.ebutton-hover{
  transition: all .3s;
  border-radius: 5px;
  cursor: pointer;
  padding: 15px;
  &:hover{
    background-color: var(--color-fill-2);
  }
}
.arco-page-header-wrapper {
  padding-left:0px!important;
}

@media only screen and (max-width: 600px) {
  .arco-modal-simple{
    width: 100%!important;
    box-sizing: border-box;
  }
}
</style>