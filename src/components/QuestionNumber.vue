<template>
    <a-anchor line-less :change-hash="false" :scroll-container="scrollContainer" class="group-number">
        <li v-for="item of numberList" :key="item.title" :class="groupClass">
            <h5 style="margin-bottom: 10px;">{{ item.title }}</h5>
            <ul style="display:flex;flex-wrap:wrap">
                <a-anchor-link @click="$emit('numberClick',info)" :class="info.class" :style="{ color: info.color }"
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
    groupClass: {
        type: String,
        default: ""
    },
    scrollContainer: {
        type:String,
        default:() => Window
    }
})
</script>
<style lang="less" scoped>
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

                &:hover {
                    border: 2px solid rgba(var(--primary-5));
                    background-color: rgba(var(--primary-3));
                    color: #fff;
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