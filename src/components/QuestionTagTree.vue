<template>
    <div>
        <a-tree class="tags-tree"  ref="tagTreeRef" @select="selectTag" :data="tagTreeList" blockNode style="padding-left: 10px;" :fieldNames="{
          key: 'id',
          title: 'tag',
          children: 'items',
          icon: 'customIcon'
        }" :default-expanded-keys="['']" @check="tagCheck" :checkable="props.checkable" size="large" :load-more="getTagList">
            <template #icon>
                <icon-folder />
            </template>
            <template #extra="nodeData" v-if="props.operate">
                <a-tooltip content="创建分组" v-if="nodeData.id==''">
                    <a-button shape="circle" @click="showTagModel(false,nodeData)">
                        <icon-plus />
                    </a-button>
                </a-tooltip>
                <ADropdown v-else trigger="hover" :popup-max-height="false">
                    <a-button shape="circle">
                        <icon-more />
                    </a-button>
                    <template #content>
                        <a-doption @click="showTagModel(false,nodeData)">
                            添加子分组
                        </a-doption>
                        <a-doption  @click="showTagModel(true,nodeData)">
                            重命名
                        </a-doption>
                        <a-doption  @click="delTag(nodeData)">删除</a-doption>
                    </template>
                </ADropdown>
            </template>
        </a-tree>
        <a-modal v-model:visible="visible" :simple="true" @ok="updateTag" :title="isUpdate?'更新分组':'创建分组'">
            <a-form :model="tagModel">
                <a-form-item field="name" label="题目分组">
                    <a-input v-model="tagModel.tag" placeholder="输入题目分组" />
                </a-form-item>
            </a-form>
        </a-modal>
    </div>
</template>
<script setup>
import { ref } from 'vue';
import useCourseStore from '../sotre/course-store';
import { tagsListRequest,updateTagRequest ,deleteTagRequest} from '../apis/question-api';
import { useRoute } from 'vue-router';
const route = useRoute()
const courseId = route.params['courseId']
const courseStore = useCourseStore()
//临时保存当前的更新标签
let temTag=null
const props = defineProps({
    operate: {
        type: Boolean,
        default: true
    },
    checkable: {
        type: Boolean,
        default: false
    }
})
const tagTreeRef=ref(null)
const emits=defineEmits(['select','tagCheck'])
const visible=ref(false)
const isUpdate=ref(false)
const tagTreeList = ref([
    {
        id: "",
        parentId: "",
        tag: courseStore.courseInfo.name
    }
])
const tagModel=ref({
    id:"",
    tag:"",
    courseId:courseId
})
const tagCheck=(checkedKeys,data)=>{
    emits("tagCheck",checkedKeys,data.checkedNodes);
}
const showTagModel=(type,data)=>{
    visible.value=true;
    isUpdate.value=type;
    temTag=data
    if(type){
       Object.assign(tagModel.value,data)
    }else{
        tagModel.value.tag=""
        tagModel.value['parentId']=data.id;
    }
}
const selectTag=(selectedKeys,data)=>{
    const selectTree=[]
    const parentTree=getTagParentList(tagTreeList.value,selectedKeys[0]);
    emits('select',data.node,parentTree)
}
const updateTag=()=>{
    if(!isUpdate.value){
        delete tagModel.value.id
    }
    delete tagModel.value['items']
    updateTagRequest(tagModel.value).then(()=>{
        //局部更新数据
        if(isUpdate.value){
            temTag['tag']=tagModel.value.tag
        }else{
            getTagList(temTag)
        }
    })
}
const delTag=(nodeData)=>{
    deleteTagRequest(nodeData.id).then(()=>{
        removeTagItem(tagTreeList.value,nodeData.id)
    })
}
//删除树中的项
const removeTagItem=(arr,id)=>{
    for(let i=0;i<arr.length;i++){
        let items=arr[i]['items'];
        if(arr[i]['id']==id){
            delete arr[i]
            break
        }
        if(items){
            removeTagItem(items,id)
        }
    }
}
//获取节点父节点列表
const getTagParentList=(arr,id)=>{
    console.log(arr,id)
    for(let i=0;i<arr.length;i++){
        let item=arr[i];
        const data={
            id:item['id'],
            name:item['tag']
        }
        if(item['id']==id){
            console.log(item)
            return [data]
        }
        let children=item['items'];
        if(children){
            let childrenList=getTagParentList(children,id)
            if(childrenList){
                childrenList.unshift(data)
                return childrenList
            }
        }
    }
}
const getTagListByIds=(ids)=>{
    for(let id of ids){
        
    }
}
const getTagList = (nodeData) => {
    console.log(nodeData)
    //不是根节点、如果有子节点不重新获取
    if (nodeData?.items&&nodeData?.id!='') {
        return
    }
    return tagsListRequest(courseId, nodeData?.id).then(res => {
        const data = res.data.data;
        if (nodeData) {
            nodeData['items'] = data;
        } else {
            tagTreeList.value[0]['items'] = data;
        }
    })
}
getTagList()
</script>
<style lang="less" scoped>
:deep(.arco-btn-secondary) {
    background-color: transparent;
}
.tags-tree{
    .tree-title{
        text-overflow: ellipsis;
        white-space: nowrap;
    }
}
</style>