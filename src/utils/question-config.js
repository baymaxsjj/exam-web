const letterList = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ]
const questionType = [
  {
    name: "单项选择题",
    simpleName:"单选题",
    enumName: "SIGNAL_CHOICE",
    value:0,
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
    itemsConfig: {
      min: 1,
      prexType:'number',
      editMode:'rich'
    },
  },
  {
    name: "主观题",
    simpleName:"主观题",
    enumName: "SUBJECTIVE",
    value:4,
    itemsConfig: {
      min: 1,
      max: 1,
      prexType:'none',
      editMode:'rich'
    },
  },
];
const getQuestionType=(enumName,isEnum=true)=>{
    for(let i=0;i<questionType.length;i++){
        if(questionType[i].enumName==enumName){
            return questionType[i];
        }
    }
}
export {
    questionType,
    letterList,
    getQuestionType
}