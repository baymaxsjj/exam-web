<template>
    <!-- 输入区 -->
    <APageHeader @back="$router.back()" title="自动组卷">
        <template #extra>
            <div>
                <AButton :loading="loading" status="danger" @click="submit" style="margin:0 10px ;">开始组卷</AButton>
                <ATooltip :default-popup-visible="getQuestionIds.length == 0" content="点击自动组卷后可用">
                    <AButton type="primary" :disabled="getQuestionIds.length == 0" @click="visible = true">创建试卷</AButton>
                </ATooltip>
            </div>
        </template>
    </APageHeader>
    <ARow :gutter="10">
        <ACol :span="8">
            <a-list>
                <template #header>
                    <h1>组卷配置</h1>
                </template>
                <a-list-item>
                    <!-- 分析区 -->
                    <AForm :model="form">
                        <AFormItem label="分组">
                            <a-tree-select v-model="form.tags" :multiple="true" :allow-clear="true" :allow-search="true"
                                :data="tags" :load-more="loadMore" placeholder="选择题目分组/不会选择子分组下的题目"></a-tree-select>
                        </AFormItem>
                        <AFormItem tooltip="期望题型占比：1:1就是个各50%,题型题目不够时，将均匀分配到其他题型上" label="期望题型">
                            <a-checkbox-group v-model="form.questionType" @change="cancelType">
                                <template v-for="item of questionType" :key="item.enumName">
                                    <div style="display: flex;">
                                        <a-checkbox style="flex-shrink: 0;" :value="item.enumName">
                                            {{ item.simpleName }}:
                                        </a-checkbox>
                                        <AInputNumber style="margin: 5px 0;" mode="button"
                                            v-model="form.percentage[item.enumName]"
                                            :disabled="!form.questionType.includes(item.enumName)" :placeholder="`题型占比`" />
                                    </div>
                                </template>
                            </a-checkbox-group>
                        </AFormItem>
                        <AFormItem label="期望难度">
                            <a-slider :format-tooltip="formatter" :step="1" :min="0" :max="5" v-model="form.difficulty" />
                        </AFormItem>

                        <AFormItem label="期望题量">
                            <AInputNumber v-model="form.totalNumber" :parser="(value) => parseInt(value) + ''" :min="1"
                                mode="button" />
                        </AFormItem>

                    </AForm>
                </a-list-item>
            </a-list>
        </ACol>

        <ACol :span="9">
            <!-- 结果区 -->
            <div class="paper-result">
                <ASpin :loading="loading" style="width:100%;">
                    <a-list :max-height="600">
                        <template #header>
                            <h1>组卷详情</h1>
                        </template>
                        <a-list-item v-for="item of result.questionList" :key="item.id">
                            <!-- <TextEditor :model-value="item.content" />  -->
                            <BaseQuestionPreview :topic-type="item.type" :question="item" :options="[]" />
                        </a-list-item>
                    </a-list>
                </ASpin>
            </div>
        </ACol>
        <ACol :span="7">
            <a-list :max-height="600">
                <template #header>
                    <h1>组卷分析</h1>
                </template>
                <a-list-item>
                    <!-- <TextEditor :model-value="item.content" />  -->
                    <a-statistic title="组卷分数" :value="result.totalScore" :precision="2" :value-from="0" 
                        animation>
                        <template #prefix>
                            <icon-arrow-rise />
                        </template>
                        <template #suffix>分</template>
                    </a-statistic>
                    <v-chart class="chart" :loading="loading" :option="getExpectOption" autoresize />
                    <v-chart class="chart" :loading="loading" :option="getRealOption" autoresize />
                </a-list-item>
            </a-list>

        </ACol>
    </ARow>
    <AModal v-model:visible="visible" title="创建试卷" :footer="false">
        <ExamPaper :keys="getQuestionIds" />
    </AModal>
</template>
<script setup>
import { questionType } from '../../utils/question-config.js'
import { ref, computed } from 'vue'
import useCourseStore from '../../sotre/course-store';
import { tagsListRequest } from '../../apis/question-api'
import { automaticPaperRequest } from '../../apis/exam-api'
import BaseQuestionPreview from '../../components/BaseQuestionPreview.vue';
import ExamPaper from './ExamPaper.vue'

import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    MarkPointComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
use([
    CanvasRenderer,
    PieChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    MarkPointComponent,
]);
const courseStore = useCourseStore()
const courseId = courseStore.courseInfo.id
const loading = ref(false)
const visible = ref(false)
const form = ref({
    tags: [],
    difficulty: 2,
    totalNumber: 10,
    questionType: [],
    percentage: {}
})
const result = ref({
    questionList: [],
    totalScore: 0
})
const tags = ref([{
    key: 0,
    title: courseStore.courseInfo.name,
}])
const getQuestionIds = computed(() => {
    return result.value.questionList.map(q => q.id)
})
const loadMore = (nodeData) => {
    let tagId = nodeData.key
    if (nodeData.key == 0) {
        tagId = ''
    }
    return tagsListRequest(courseId, tagId).then(res => {
        const data = res.data.data;
        nodeData['children'] = data.map(tag => {
            return {
                key: tag.id,
                title: tag.tag
            }
        })
    })
}
const submit = () => {
    loading.value = true
    automaticPaperRequest(courseId, form.value).then(res => {
        result.value = res.data.data;
        loading.value = false
    }).catch(e => {
        loading.value = false
    })
}
const getExpectOption=computed(()=>{
    let data=[]=questionType.map(type=>{
       return {
            name:type.simpleName,
            value:form.value.percentage[type.enumName]??0
        }
    })
    return getEchartOption("预期题型占比",data)
})
const getRealOption=computed(()=>{
    const percent={}
    result.value.questionList.forEach(element => {
        if(percent[element.type]){
            percent[element.type]++;
        }else{
            percent[element.type]=1;
        }
    });;
    const data = questionType.map((type) => {
        return {
            name: type.simpleName,
            value: percent[type.enumName]??0,
        };
    });
    return getEchartOption("组卷题型占比",data)
})

const getEchartOption=(title,data)=>{
    return  {
        title: {
            text: title,
            left: "center",
        },
        tooltip: {
            trigger: "item",
            formatter: "{a} <br/>{b} : {c} ({d}%)",
        },
        legend: {
            orient: "vertical",
            left: "left",
            data: questionType.map((q) => q.simpleName),
        },
        series: [
            {
                name: "题型百分比",
                type: "pie",
                radius: ["40%", "70%"],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: "#fff",
                    borderWidth: 2,
                },
                label: {
                    show: false,
                    position: "center",
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: "bold",
                    },
                },
                labelLine: {
                    show: false,
                },
                data: data,
            },
        ],
    };
}
// const typePercentChange=(type,value)=>{
//     //剩余的占比这时已经把自己的值算进去了
//     if(value>(getAvailablePercent.value+value)){
//         form.value.percentage[type]=0;
//     }
// }
// const getAvailablePercent=computed(()=>{
//     let available=100;
//     let typePercent;
//     form.value.questionType.forEach((type)=>{
//         typePercent=form.value.percentage[type]
//         if(typePercent){
//             available=available-typePercent
//         }
//     })
//     return available
// })
const cancelType = (value) => {
    questionType.forEach(type => {
        if (!value.includes(type.enumName)) {
            form.value.percentage[type.enumName] = 0;
        }
    })
}
const marks = {
    0: "不限",
    1: '容易',
    2: '较容',
    3: '中等',
    4: '较难',
    5: '难',
}
loadMore(tags.value[0])
const formatter = (value) => {
    return marks[value]
};

// const tagCheck=(keys,data)=>{
//     console.log(keys,data)
//     const tagData=[]
//     const ignoreIds=new Set()
//     for(let item of data){
//         //如果存在父元素，删了他
//         const parentId=item.parentId;
//         if(keys.includes(parentId)){
//             ignoreIds.add(parentId)
//         }
//         tagData.push({
//             value:item.id,
//             label:item.tag
//         })
//     }
//     // 删除忽略结点
//     console.log("忽略",ignoreIds)
//     let i;
//     for(let id of ignoreIds){
//         for(i=0;i<tagData.length;i++){
//             if(id==tagData[i].value){
//                 tagData.splice(i,1)
//                 break;
//             }
//         }
//     }
//     tags.value=tagData
// }
</script>
<style lang="less" scoped>
.border {
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-medium);
    padding: 10px;
    box-sizing: content-box;
}
.chart{
    height: 300px;
}
</style>