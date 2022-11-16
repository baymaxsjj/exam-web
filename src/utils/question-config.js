const letterList = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
const questionType = [
  {
    name: "单项选择题",
    simpleName:"单选题",
    enumName: "SIGNAL_CHOICE",
    value:0,
    subCount:1,
    itemsConfig: {
      min: 2,
      max: 26,
      prexType:'letter',
      editMode:'preview'
    },
  },
  {
    name: "多项选择题",
    simpleName:"多选题",
    enumName: "MULTIPLE_CHOICE",
    value:1,
    subCount:-1,
    itemsConfig: {
      min: 2,
      max: 26,
      prexType:'letter',
      editMode:'preview'
    },
  },
  {
    name: "判断题",
    simpleName:"判断题",
    enumName: "JUDGMENTAL",
    value:2,
    subCount:1,
    itemsConfig: {
      min: 2,
      max: 2,
      prexType:'letter',
      editMode:'preview'
    },
  },
  {
    name: "填空题",
    simpleName:"填空题",
    enumName: "COMPLETION",
    value:3,
    subCount:0,
    itemsConfig: {
      min: 1,
      prexType:'number',
      editMode:'editor'
    },
  },
  {
    name: "主观题",
    simpleName:"主观题",
    enumName: "SUBJECTIVE",
    value:4,
    subCount:1,
    itemsConfig: {
      min: 1,
      max: 1,
      prexType:'none',
      editMode:'editor'
    },
  },
  {
    name: "文件题",
    simpleName:"文件题",
    enumName: "FILE",
    value:5,
    subCount:1,
    itemsConfig: {
      min: 1,
      max: 10,
      prexType:'none',
      editMode:'none'
    },
  },
  {
    name: "代码题",
    simpleName:"代码题",
    enumName: "CODE",
    value:6,
    subCount:1,
    itemsConfig: {
      min: 1,
      max: 10,
      prexType:'none',
      editMode:'none'
    },
  },
  
];
const questionVisble=[
  {
    name:'自己',
    value:0,
    enumName:'self'
  },
  {
    name:'课程',
    value:1,
    enumName:'course'
  },
  {
    name:'公开',
    value:2,
    enumName:'overt'
  }
]
//获取题目类型
const getQuestionType=(enumName)=>{
    for(let i=0;i<questionType.length;i++){
        if(questionType[i].enumName==enumName){
            return questionType[i];
        }
    }
    return questionType[0]
}
//获取题目可见度
const getQuestionVisble=(enumName)=>{
  for(let i=0;i<questionVisble.length;i++){
      if(questionVisble[i].enumName==enumName){
          return questionVisble[i];
      }
  }
  return questionType[0]
}
export {
    questionType,
    letterList,
    getQuestionType,
    getQuestionVisble
}