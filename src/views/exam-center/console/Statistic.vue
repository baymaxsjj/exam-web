<template>
    <div class="chart-list">
        <ARow>
            <ACol :xs="24" :sm="12">
                <v-chart class="chart" :loading="loading" :option="questionTypeChartOption" autoresize />
                <v-chart class="chart" :loading="loading" :option="scoreChartoption" autoresize />
            </ACol>
            <ACol :xs="24" :sm="12">
                <ASpin :loading="loading">
                    <a-list :max-height="750">
                        <template #header>
                            <h1>答题详情</h1>
                        </template>
                        <a-list-item v-for="(item, key) in statisticData.questionStatistic" :key="key">
                            <TextEditor :model-value="key" />
                            <a-progress :percent="item.correctNumber / item.totalNumber">
                                <template v-slot:text="scope">
                                    {{ item.correctNumber }}/{{ item.totalNumber }}人
                                </template>
                            </a-progress>
                        </a-list-item>
                    </a-list>
                </ASpin>
            </ACol>
        </ARow>

    </div>
</template>
<script setup>
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { LineChart, PieChart } from "echarts/charts";
import {
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    MarkPointComponent,
    MarkLineComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, inject, watch, computed } from "vue";
import useUserStore from "../../../sotre/user-store";
import { examResultStatisticRequest } from "../../../apis/exam-center-api.js";
import { examConsoleInfoKey } from "@/utils/keys.js";
import {
    questionType,
} from "../../../utils/question-config.js";
import { useRoute } from "vue-router";
import { getImageUrl } from "../../../utils/image.js";
import TextEditor from '../../../components/TextEditor.vue'

const { examInfo, currClassId } = inject(examConsoleInfoKey);
const isStart = ref(false);
const route = useRoute();
const userStore = useUserStore();
const loading = ref(true);
const examId = route.params["examInfoId"];
const statisticData = ref({
    maxScoreInfo: {
        score: 55,
        user: {},
    },
    questionStatistic: {},
    questionTypeStatistic: {},
    averageScore: 0,
    minScoreInfo: {
        score: 0,
        user: {},
    },
});

use([
    CanvasRenderer,
    PieChart,
    LineChart,
    TitleComponent,
    TooltipComponent,
    LegendComponent,
    ToolboxComponent,
    GridComponent,
    MarkPointComponent,
    MarkLineComponent,
]);
watch(
    () => currClassId.value,
    () => {
        getStatistic();
    }
);
provide(THEME_KEY, userStore.theme);
const getStatistic = () => {
    loading.value = true;
    examResultStatisticRequest(examId, currClassId.value).then((res) => {
        loading.value = false;
        statisticData.value = res.data.data;
    });
};
getStatistic();

const scoreChartoption = computed(() => {
    const data = statisticData.value;
    const minInfo = data.minScoreInfo;
    const maxInfo = data.maxScoreInfo;

    return {
        title: {
            text: "成绩分析",
        },
        tooltip: {
            trigger: "axis",
        },
        legend: {},
        toolbox: {
            show: true,
            feature: {
                dataZoom: {
                    yAxisIndex: "none",
                },
                dataView: { readOnly: false },
                magicType: { type: ["line", "bar"] },
                restore: {},
                saveAsImage: {},
            },
        },
        xAxis: {
            type: "category",
            data: ["最低分", "平均分", "最高分"],
        },
        yAxis: {
            type: "value",
            axisLabel: {
                formatter: "{value} 分",
            },
        },
        series: [
            {
                name: "得分",
                type: "line",
                smooth: 1,
                smoothMonotone:'x',
                // 改变线条的颜色和粗细
                lineStyle: {
                    color: '#32c5e9',
                    width: 4
                },
                // areaStyle: {},
                data: [minInfo.score, data.averageScore, maxInfo.score],
                markPoint: {
                    data: [
                        {
                            type: "max",
                            name: "最高分",
                            label: {
                                color: 'inherit',  // 文字颜色
                                position: 'bottom', // 可用padding调整图片内文字距离
                                show: true,
                                fontWeight: 'bold',
                                formatter: maxInfo.user.nickname  // 自定义文字内容
                            },
                            symbol: `image://${getImageUrl(maxInfo.user.picture)}`,
                            symbolSize: 40,
                            symbolOffset: [0, "-100%"]
                        },
                        {
                            type: "min",
                            name: "最低分",
                            label: {
                                color: 'inherit',  // 文字颜色
                                position: 'bottom', // 可用padding调整图片内文字距离
                                show: true,
                                fontWeight: 'bold',
                                formatter: minInfo.user.nickname  // 自定义文字内容
                            },
                            symbol: `image://${getImageUrl(minInfo.user.picture)}`,
                            symbolSize: 40,
                            symbolOffset: [0, "-100%"]
                        },
                    ],
                },
                markLine: {
                    data: [{ name: "平均分", yAxis: data.averageScore }],
                },
            },
        ],
    };
});

const questionTypeChartOption = computed(() => {
    const data = questionType.map((type) => {
        const result = statisticData.value.questionTypeStatistic[type.enumName]
        return {
            name: type.simpleName,
            value: result ? result.correctNumber / result.totalNumber : 0,
        };
    });
    console.log(data);
    return {
        title: {
            text: "题型正确率",
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
                name: "正确率",
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
});
</script>
<style lang="less" scoped>
.chart {
    height: 400px;
    width: 100%;
}
</style>
