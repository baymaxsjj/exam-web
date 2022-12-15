

<template>
  <header-nav v-if="headerVisible"></header-nav>
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

div::-webkit-scrollbar {
  /*滚动条整体样式*/
  width : 5px;  /* 高宽分别对应横竖滚动条的尺寸 */
  height: 1px;
}
div::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius: 10px;
  box-shadow   : inset 0 0 5px rgba(219, 219, 219, 0.5);
  background   : #d6d6d6;
}
div::-webkit-scrollbar-track {
  /*滚动条里面轨道*/
  box-shadow   : inset 0 0 5px rgba(255, 255, 255, 0.8);
  border-radius: 10px;
  background   : #ffffff;
}

@media only screen and (max-width: 600px) {
  .arco-modal-simple{
    width: 100%!important;
    box-sizing: border-box;
  }
}
</style>