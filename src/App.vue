

<template>
  <header-nav v-show="headerVisible"></header-nav>
  <router-view></router-view>
</template>
<script setup>
import { computed, watch ,ref} from 'vue';
import { useRoute } from 'vue-router';
import HeaderNav from './components/HeaderNav.vue';
const route=useRoute()
const headerVisible=ref(true)
watch(()=>route.name,()=>{
  const meta=route.meta
  let title=meta['title']
  let header=meta['header']
  if(header!=undefined){
    headerVisible.value=header
  }else{
    headerVisible.value=true;
  }

  if(title){
    title="-"+title;
  }
  document.title="为考"+title
  
})
</script>
<style lang="less">
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
.arco-modal-simple .arco-modal-body {
  overflow: hidden;
}
@media only screen and (max-width: 600px) {
  .arco-modal-simple{
    width: 100%!important;
    box-sizing: border-box;
  }
}
</style>