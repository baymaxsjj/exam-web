export const imageDirective=(el, binding,vnode)=>{
    let imageEl;
    //不是图片
    if(!(el instanceof HTMLImageElement)){
        imageEl=el.querySelector("img")
    }else{
        imageEl=el;
    }
    if(imageEl==null){
        return
    }
    //获取图片地址
    let imageSrc=imageEl.getAttribute("src")
    if(imageSrc==null){
        return
    }
    imageSrc+=""
    console.log("原地址：",imageSrc)
    const basePath=import.meta.env.VITE_FILE_PATH;
    if(!imageSrc.startsWith(basePath)&&!imageSrc.startsWith("http")){
        imageSrc=basePath+imageSrc
        imageEl.setAttribute("src",imageSrc)
        console.log("新地址：",imageSrc)
    }
};