const reviewType = [
  {
    value: "NONE",
    label: "未批阅",
  },
  {
    value: "ROBOT",
    label: "机器批阅",
  },
  {
    value: "TEACHER",
    label: "老师批阅",
  },
];
const resultType=[
    {
        value: "NONE",
        label: "未批阅",
    }, {
        value: "ERROR",
        label: "错误",
    }, {
        value: "WRONG",
        label: "半错",
    }, {
        value: "CORRECT",
        label: "正确",
    },
]
const getTypeInfo=(value,arr)=>{
    for (const item of arr) {
        if(item.value==value){
            return item;
        }
    }
}
export const getReviewType=(value)=>getTypeInfo(value,reviewType);
export const getResultType=(value)=>getTypeInfo(value,resultType);
