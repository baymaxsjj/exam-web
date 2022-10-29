<template>
    <a-page-header title="班级列表" @back="$router.back" v-if="!props.selectMode">
        <template #extra v-if="isTeacher">
            <a-button type="primary" @click="showAddModal(false)">创建班级</a-button>
        </template>
    </a-page-header>
    <a-table :bordered="false" :columns="columns" v-model:selected-keys="selectKey" @row-click="toUserListPage" :data="list" row-key="id" :row-selection="rowSelection"
        @selection-change="selectChange">
        <template #edit="{ record }" v-if="isTeacher">
            <a-button @click.stop="showAddModal(true, record)" style="margin-right: 10px;">
                <template #icon>
                    <icon-edit />
                </template>
            </a-button>
            <a-popconfirm content="确认删除班级吗?" @ok="delClass(record.id)">
                <a-button status="danger" @click.stop style="margin-right: 10px;">
                    <template #icon>
                        <icon-delete />
                    </template>
                </a-button>
            </a-popconfirm>

            <a-button type="primary" @click.stop="getClassCode(record, false)">
                <template #icon>
                    <icon-share-alt />
                </template>
            </a-button>
        </template>
    </a-table>
    <a-modal simple v-model:visible="addModalVisible" @ok="addClassInfo" :title="isUpdate ? '更新班级' : '创建班级'">
        <a-form :model="classInfo">
            <a-input v-model="classInfo.name" placeholder="输入班级名称" />
        </a-form>
    </a-modal>
    <a-modal body-class="share-code" modal-class="share-code-modal" :modal-style="{ overflow: 'hidden', width: 'auto' }"
        simple v-model:visible="codeModalVisible" @ok="addClassInfo" :header="false" :footer="false">
        <a-spin dot :loading="codeLoading">
            <div class="course-info">
                <h1>课程：{{ courseStore.courseInfo.name }}</h1>
                <p>老师：{{ courseStore.courseInfo.teacher.nickname }}</p>
                <p>班级：{{ className }}</p>
            </div>
            <div class="class-code-info">
                <qrcode-vue :value="classCode.code" style="width: 150px;height:150px"></qrcode-vue>
                <h1 class="class-code">班级码：{{ classCode.code }}</h1>
                <p class="class-code-expiry">失效时间:{{ classCode.expirationTime }}</p>
            </div>

            <a-button type="primary" size="large" shape="round" long>分享班级码</a-button>
        </a-spin>
    </a-modal>
</template>
<script setup>
import { reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import QrcodeVue from 'qrcode.vue'
import { getClassListRequest, teaAddClassRequest, teaDelClassRequest, teaGetClassCodeRequest } from '../../apis/course-api';
import useCourseStore from '../../sotre/course-store';
const props = defineProps({
    selectMode: {
        type: Boolean,
        defalut: false
    },
    selectKey: {
        type: Array,
        defalut: ()=>[]
    }
})
const emit = defineEmits(['update:selectKey'])
const selectKey = ref([])
watch(() => props.selectKey, (key) => {
    selectKey.value = key
})
let rowSelection = null;
if (props.selectMode) {
    rowSelection = {
        type: 'checkbox'
    }
}
const selectChange = (data) => {
    console.log(data)
    emit('update:selectKey', data)
}

const isUpdate = ref(false);
const addModalVisible = ref(false);
const codeModalVisible = ref(false)
const codeLoading = ref(true)
const list = ref([])
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()
const isTeacher = courseStore.isTeacher
const courseId = route.params['courseId'];
const classInfo = reactive({
    courseId: 0,
    name: "",
    id: 0,
})
const classCode = reactive({
    "code": "",
    "expirationTime": ""
})
const className = ref("")
const getList = () => {
    let id = courseId;
    getClassListRequest(id).then(res => {
        list.value = res.data.data;
    })
}
const showAddModal = (type, data) => {
    if (data) {
        classInfo.name = data.name
        classInfo.id = data.id
    }
    isUpdate.value = type
    addModalVisible.value = true
}
const addClassInfo = () => {
    if (!isUpdate.value) {
        delete classInfo.id
    }
    classInfo.courseId = courseId;
    teaAddClassRequest(classInfo).then(() => {
        getList();
    })
}

const delClass = (id) => {
    teaDelClassRequest(id).then(() => {
        getList();
    })
}
const getClassCode = (data, anew) => {
    codeModalVisible.value = true
    className.value = data.name
    codeLoading.value = true
    classCode.code = ""
    classCode.expirationTime = ""
    teaGetClassCodeRequest(data.id, anew).then(res => {
        Object.assign(classCode, res.data.data)
        codeLoading.value = false
    })
}
const toUserListPage = (record) => {
    if(props.selectMode){
        return
    }
    router.push({
        name: "ClassUser",
        params: {
            classId:record.id
        }
    })
}
getList()
const columns = [
    {
        title: '班级',
        dataIndex: 'name',
        ellipsis: true,
        slotName: 'name',
    },
]
if (!props.selectMode && isTeacher) {
    columns.push(
        {
            title: '操作',
            dataIndex: 'edit',
            slotName: 'edit',
            width: 160
        },)
}
</script>
<style lang="less" scoped>
.class-header {
    display: flex;
    align-items: center;
}

.class-list {
    .class-item {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 26px;
        margin-top: 5px;
        transition: all .3s;

        .class-name {
            color: var(--color-text-1);
        }

        .class-info-opera {
            button {
                margin: 0 5px;
            }
        }
    }
}
</style>
<style lang="less">
.share-code-modal {
    position: relative;
    width: auto !important;

    &::after {
        content: "为考";
        position: absolute;
        top: 0px;
        right: 50px;
        font-weight: bold;
        opacity: .4;
        font-size: 18px;
        transform: rotate(35deg);
        color: rgb(var(--primary-5)); //字体颜色设置为透明
        animation: logo-scale 2s;
    }

    &::before {
        content: '';
        height: 100%;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        // filter: blur(1px);
        background-image: url(../../assets/img/share-code-bg.png);
        background-repeat: no-repeat;
        background-size: contain;
        animation: code-bg-ru 2s;
    }

    @keyframes logo-scale {
        0% {
            transform: scale(0) rotate(0);
        }

        100% {
            transform: scale(1) rotate(35deg);
        }
    }

    @keyframes code-bg-ru {
        0% {
            width: 0%;
            height: 0%;
        }

        100% {
            width: 100%;
            height: 100%;
        }
    }

    .arco-modal-header {
        display: none;
    }

    .share-code {
        width: 200px;
        background-color: rgba(255, 255, 255, .8);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 20px 40px !important;


        .course-info {
            margin-bottom: 10px;

            h1 {
                font-size: 16px;
            }

            p {
                color: var(--color-text-2)
            }

            img {
                height: 50px;
                width: 100px;
            }
        }

        .class-code-info {
            display: flex;
            flex-direction: column;
            align-items: center;

            .class-code {
                color: rgb(var(--primary-6));
                font-size: 20px;
                margin-top: 10px;
            }

            .class-code-expiry {
                color: var(--color-text-2);
                margin: 10px 0;
            }
        }
    }
}
</style>