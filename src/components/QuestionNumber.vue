<template>
    <div v-if="props.statusVisible">
        <slot name="title">
            <h5 style="margin-bottom: 10px;color:var(--color-text-1)">{{props.title}}</h5>
        </slot>
        <ul class="status-desc">
            <li v-for="item of props.statusList">{{item.status}}<span class="status-color" :style="item.style"></span></li>
        </ul>
        <a-divider/>
    </div>
    <a-anchor ref="anchorRef" line-less :change-hash="false" :scroll-container="scrollContainer" class="group-number">
        <li v-for="item of numberList" :key="item.title" :class="groupClass">
            <h5 v-if="item.title" style="margin: 10px 0;color:var(--color-text-1)">{{ item.title }}</h5>
            <ul style="display:flex;flex-wrap:wrap">
                <a-anchor-link @click="$emit('numberClick',info)" :style="getStuatsItem(info.statusKey)?.style"
                    :href="`#${info.href}`" :key="info.key" v-for="info of item.list">{{ info.number }}</a-anchor-link>
            </ul>
        </li>
    </a-anchor>
</template>
<script setup>
import {ref} from 'vue'
const props = defineProps({
    numberList: {
        type: Array,
        default: () => [
            {
                title: "标题",
                list: [
                    {
                        key: 111,
                        number: 1,
                        color: 'red',
                        class: 'hello'
                    }
                ]

            }
        ]
    },
    title:{
        type:String,
        default:""
        
    },
    statusList:{
        type:Array,
        default:()=>[]
    },
    statusVisible:{
        type:Boolean,
        default:false
    },
    groupClass: {
        type: String,
        default: ""
    },
    scrollContainer: {
        type:String,
        default:() => Window
    }
})
defineEmits(["numberClick"])
const anchorRef=ref(null)


const getStuatsItem=(key)=>{
    for (const item of props.statusList) {
        if(item.key==key){
            return item
        }
    }
}
</script>
<style lang="less" scoped>
 .status-desc{
    display: flex;
    color: var(--color-text-1);
    justify-content: space-around;
    font-size: 14px;
    font-weight: bold;

    li {
        display: flex;
        align-items: center;
    }
    .status-color {
        display: inline-block;
        height: 20px;
        width: 20px;
        border-radius: 4px;
        margin: 5px;
        border: 1px solid var(--color-fill-2);
    }
}
.group-number {
    width: 100%;
    :deep(.arco-anchor-list){
        .arco-anchor-link-item {
                width: 42px;
                height: 42px;
                box-sizing: border-box;
                border: 2px solid var(--color-fill-3);
                border-radius: 5px;
                margin: 5px;
                text-align: center;
                line-height: 38px;
                transition: all 0.3s;
                cursor: pointer;
                color: var(--color-text-1);
                &:hover {
                    border: 2px solid rgba(var(--primary-5));
                    background-color: rgba(var(--primary-3));
                    color: rgba(var(--primary-6))
                }

            }

            .arco-anchor-link-item .arco-anchor-link {
                padding: 0;
                color: inherit;
                line-height: inherit;
                border-radius: initial;

                &:hover {
                    background-color: transparent;
                }
            }

            .arco-anchor-link-active {
                border: 2px solid rgba(var(--primary-6));
                background-color: rgba(var(--primary-4))!important;
                color: #fff;
            }

            .arco-anchor-link-active>.arco-anchor-link {
                background-color: transparent;
            }
    }
}
</style>