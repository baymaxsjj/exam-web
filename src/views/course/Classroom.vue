<template>
    <div class="room" ref="roomRef">
        <div class="room-header">
            <a-page-header :title="courseStore.courseInfo.name" :subtitle="courseStore.courseInfo.teacher.nickname">
                <template #extra>
                    <div class="header-operate-area">
                        <ASelect :disabled="!courseStore.isTeacher" :model-value="currClassId" @change="getRoomMessage"
                            style="width: 150px;">
                            <AOption v-for="item of classList" :value="item.id">{{ item.name }}</AOption>
                        </ASelect>
                        <AButton @click="$router.push({ name: 'ClassUser', params: { classId: currClassId } })">
                            <icon-user />
                        </AButton>
                        <AButton>
                            <icon-settings />
                        </AButton>
                        <a-tooltip :content="
                            isFullscreen
                                ? '点击退出全屏模式'
                                : '点击切换全屏模式'
                        ">
                            <a-button class="nav-btn" @click="toggleFullScreen">
                                <template #icon>
                                    <icon-fullscreen-exit v-if="isFullscreen" />
                                    <icon-fullscreen v-else />
                                </template>
                            </a-button>
                        </a-tooltip>
                    </div>
                </template>
            </a-page-header>
        </div>
        <div class="room-body">
            <a-spin :loading="loading" class="loading">
                <span></span>
            </a-spin>
            <ul class="message-list" ref="roomBodyRef">
                <li v-for="(item, index) of messagelist" :key="item.id" :id="item.id">
                    <div class="message-tip">
                        <a-tag v-if="showMessageTime(index)">{{ item.createdAt }}</a-tag>
                    </div>
                    <div class="message-details" :class="{ 'my-message': isMyMessage(item.user) }">
                        <AAvatar shape="square" :image-url="getImageUrl(item.user.picture)" class="user-avatar">
                            <!-- <AImage :src="getImageUrl(item.user.picture)" fit="cover"/> -->
                        </AAvatar>
                        <div class="message-info">
                            <div class="user-info">
                                <ATag :color="getUserRole(item.user) ? 'green' : 'gray'">{{
                                    getUserRole(item.user)?"老师": "学生"
                                }}</ATag>
                                <span>{{ item.user.nickname }}</span>
                            </div>
                            <div class="message-info-status">
                                <MesssageCard :message-info="item" />
                                <APopover :title="item.status ? '发送中' : '发送失败点击重新发送'">
                                    <a-button :status="item.status ? '' : 'danger'" v-if="item.status != undefined"
                                        shape="circle" style="margin: 0 5px;flex-shrink: 0;">
                                        <icon-loading v-if="item.status" />
                                        <icon-exclamation-circle-fill v-else />
                                    </a-button>
                                </APopover>
                            </div>
                        </div>
                    </div>

                </li>
            </ul>
            <a-badge v-if="newMessNum != 0" :count="newMessNum" class="new-message">
                <a-button @click="toNewMessPositon">
                    有新消息~
                    <template #icon>
                        <icon-double-down />
                    </template>
                </a-button>
            </a-badge>

        </div>
        <div class="room-footer">
            <TextEditor mode="editor" v-model="messageContent" :config="config" />
            <div class="message-send">
                <a-button type="dashed">取消</a-button>
                <a-button type="primary" @keyup.enter="sendMessage" @click="sendMessage">发送</a-button>
            </div>
        </div>
    </div>
</template>
<script setup>
import MesssageCard from '../../components/message/MesssageCard.vue';
import TextEditor from '../../components/TextEditor.vue';
import useCourseStore from '../../sotre/course-store';
import { getClassroomMessageListRequest, sendClassroomMessageRequest } from '../../apis/message-api'
import { getClassListRequest } from '../../apis/course-api';
import { useRoute, useRouter } from 'vue-router';
import { ref, nextTick } from 'vue'
import useUserStore from '../../sotre/user-store';
import dayjs from 'dayjs';
import {
    isFUllScreenEnabled,
    exitFullScreen, setFullScreen, hasFullScreenElement
} from '../../utils/screen';
import { useDark, useToggle, useFullscreen } from '@vueuse/core';
import SocketService from '../../utils/web-stocket-service.js'
import { getImageUrl } from '../../utils/image.js'
import { Message } from '@arco-design/web-vue';
const userStore = useUserStore()
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore();
const courseId = route.params['courseId'];
const roomBodyRef = ref(null)
const roomRef = ref(null)
const { isFullscreen, toggle: toggleFullScreen } = useFullscreen(roomRef);
const config = {
    height: 120,
    menubar: false,
    statusbar: false
}
const loading = ref(false)
const messagelist = ref([])
const currClassId = ref()
const classList = ref([])
const page = ref(1);
const pageTotal = ref(1)
const pageSize = ref(10)

const messageContent = ref("");
const newMessNum = ref(0)
const newMessId = ref(null)

getClassListRequest(courseId).then(res => {
    const data = res.data.data
    classList.value = data;
    console.log(data.length)
    if (data != null && data.length != 0) {
        getRoomMessage(data[0].id)
    } else {
        Message.info("请先创建班级吧~")
        router.push({
            name: 'MyClasses'
        })
    }
})
const socketServe = SocketService.Instance;
socketServe.registerCallBack('COURSE_CLASSROOM_MESSAGE', (data) => {
    if (route.name != "Classroom") {
        return
    }
    console.log(data)
    const messageInfo = data.info;
    if (messageInfo.targetId == currClassId.value) {
        const scrollTop = roomBodyRef.value.scrollTop;
        const scrollHeight = roomBodyRef.value.scrollHeight;
        const clientHeight = roomBodyRef.value.clientHeight;
        messagelist.value.push(data.info)
        nextTick(() => {
            //直接显示
            if (scrollHeight - scrollTop - clientHeight < 150) {
                roomBodyRef.value.scrollTo({ top: roomBodyRef.value.scrollHeight, behavior: "smooth" });
                return
            }
            //显示新消息提示，
            if (newMessNum.value == 0) {
                newMessId.value = data.info.id;
            }
            newMessNum.value++;
        })

    }
})
const toNewMessPositon = () => {
    newMessNum.value = 0;
    const newMessNode = document.getElementById(newMessId.value);
    roomBodyRef.value.scrollTo({ top: newMessNode.offsetTop, behavior: "smooth" });
}
const getRoomMessage = (classId) => {
    let isFirst = false;
    if (classId != currClassId.value) {
        messagelist.value = []
        currClassId.value = classId;
        page.value = 1
        pageTotal.value = 1
        isFirst = true;
    }
    loading.value = true;
    let startId = ""
    if (messagelist.value[0]) {
        startId = messagelist.value[0].id
    }
    getClassroomMessageListRequest(classId, startId, 1, pageSize.value).then(res => {
        const data = res.data.data;
        page.value = data.current
        pageTotal.value = data.pages
        data.list.reverse();
        messagelist.value.unshift(...data.list);
        loading.value = false;
        if (isFirst) {
            nextTick(() => {
                roomBodyRef.value.scrollTo({ top: roomBodyRef.value.scrollHeight });
            })

        }
    })
}
nextTick(() => {
    roomBodyRef.value.addEventListener("scroll", (e) => {
        const scrollTop = e.srcElement.scrollTop;
        const clientHeight = e.srcElement.clientHeight;
        const isLoad = (scrollTop < clientHeight) && (page.value < pageTotal.value) && !loading.value
        console.log(!loading.value)
        if (isLoad) {
            page.value++;
            console.log("第几页数据", page.value)
            getRoomMessage(currClassId.value);
        }
        //清除新消息提示
        if (newMessNum.value != 0) {
            const newMessNode = document.getElementById(newMessId.value);
            const newMessOffsetTop = newMessNode.offsetTop;
            if ((scrollTop + clientHeight) > newMessOffsetTop) {
                newMessNum.value = 0;
            }
        }
    })
})
const sendMessage = () => {
    if (messageContent.value == "") {
        return
    }
    const message = messageContent.value;
    //清空消息列表
    messageContent.value = ""
    const id = Date.now()
    messagelist.value.push({
        id,
        introduce: message,
        type: { value: 3003, info: "用户消息" },
        createdAt: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        status: true,
        user: {
            ...userStore.userInfo,
            id: userStore.userInfo.userId
        }
    })
    nextTick(() => {
        roomBodyRef.value.scrollTo({ top: roomBodyRef.value.scrollHeight, behavior: "smooth" });
    })
    sendClassroomMessageRequest(currClassId.value, message).then(res => {
        delete getMessageById(id)?.status
    }).catch(e => {
        getMessageById(id).status = false
    })
}
const getMessageById = (id) => {
    for (let item of messagelist.value) {
        if (item?.id == id) {
            return item
        }
    }
}
const isMyMessage = (userInfo) => {
    return userInfo.id == userStore.userInfo.userId;
}
const getUserRole = (userInfo) => {
    return userInfo.id == courseStore.courseInfo.userId
}
const showMessageTime = (currMessIndex) => {
    if (currMessIndex == 0) {
        return true
    }
    const currMessTime = messagelist.value[currMessIndex].createdAt;
    const preMessTime = messagelist.value[currMessIndex - 1].createdAt;
    if (dayjs(currMessTime).diff(preMessTime, 'second') >= 60) {
        return true;
    }
    return false
}
</script>
<style lang="less" scoped>
:deep(.tox-tinymce) {
    border: none;
}

.room {
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    background-color: var(--color-menu-light-bg);

    .room-header {
        .header-operate-area {
            display: flex;
            align-items: center;
            column-gap: 10px;
        }
    }

    .room-body {
        flex: 1;
        position: relative;
        overflow: hidden;

        li {
            margin: 10px 0;
        }

        .loading {
            position: absolute;
            top: 5px;
            left: 50%;
            padding: 10px;
            transform: translateX(-50%);
            z-index: 10;
        }

        .message-list {
            overflow-y: auto;
            height: 100%;
            position: relative;

            .message-tip {
                display: flex;
                justify-content: center;
            }

            .message-details {
                margin: 5px;
                display: flex;

                :deep(.user-message) {
                    color: var(--color-text-1);
                    background-color: var(--color-fill-1);
                }

                .user-avatar {
                    margin: 0 10px;
                    overflow: hidden;
                    flex-shrink: 0;
                }

                .user-info {
                    display: flex;
                    margin-bottom: 5px;
                    color: var(--color-text-2);
                    align-items: center;

                    :last-child {
                        margin: 0 5px;
                    }
                }

                .message-info-status {
                    display: flex;
                    align-items: center;
                }
            }

            .my-message {
                flex-direction: row-reverse;

                :deep(.user-message) {
                    background-color: rgb(var(--primary-5));

                    .wysiwyg {
                        color: var(--color-white);
                    }
                }

                .user-info {
                    justify-content: end;
                    flex-direction: row-reverse;
                }

                .message-info-status {
                    flex-direction: row-reverse;
                }
            }
        }

        .new-message {
            position: absolute;
            bottom: 10px;
            left: 10px;
        }
    }

    .room-footer {
        border-top: 1px solid var(--color-fill-4);

        .message-send {
            display: flex;
            justify-content: end;

            button {
                width: 100px;
                margin: 5px;
            }
        }
    }
}
</style>