<template>
    <div class="">
        <a-textarea :default-value="props.defaultValue" v-if="props.mode=='simple'"/>
        <div v-else :id="props.vditorId"></div>
    </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
const props=defineProps({
    defaultValue:{
        type:String,
        default: '',
    },
    vditorId:{
        type:String,
        default: 'vditor',
    },
    mode:{
        type:String,
        default: 'simple',
        validator(value) {
            // The value must match one of these strings
            return ['simple', 'rich'].includes(value)
        }
    }
})
const vditor = ref(null);
const value=ref("")
const loadVditor=()=>{
    vditor.value = new Vditor(props.vditorId, {
    after: () => {
      // vditor.value is a instance of Vditor now and thus can be safely used here
      vditor.value?.setValue(props.defaultValue);
    },
  });
}
onMounted(() => {
    if(props.mode=='rich'){
        loadVditor()
    }
});
</script>