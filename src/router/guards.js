import useCourseStore from "../sotre/course-store"

export const courseGuard=async (to,from)=>{
    // 获取课程学习
  if (to.path.startsWith("/course/")) {
    const courseStore=useCourseStore()
    const courseId = to.params["courseId"]
    const courseInfo = courseStore.courseInfo
    //获取课程和班级列表
    if (courseInfo.id != courseId) {
      await courseStore.getCourseInfo(courseId)
    //   await courseStore.getClassList(courseId)
    }
  }
}
