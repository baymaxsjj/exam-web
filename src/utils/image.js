export const getImageUrl=(src)=>{
  src=src??""
  const basePath=import.meta.env.VITE_FILE_PATH;
  if(!src.startsWith(basePath)&&!src.startsWith("http")){
      src=basePath+src
  }
  return src;
}
export const imageUploadHandle = (options,request,callback) => {
    // docs: https://axios-http.com/docs/cancellation
    const controller = new AbortController();
    (async function requestWrap() {
      const {
        onProgress,
        onError,
        onSuccess,
        fileItem,
        name = 'file',
      } = options;
      onProgress(20);
      const formData = new FormData();
      formData.append(name  , fileItem.file );
      const onUploadProgress = (event) => {
        let percent;
        if (event.total > 0) {
          percent = (event.loaded / event.total) * 100;
        }
        onProgress(parseInt(String(percent), 10), event);
      };

      try {
        // https://github.com/axios/axios/issues/1630
        // https://github.com/nuysoft/Mock/issues/127

        const res = await request(formData, {
          controller,
          onUploadProgress,
        });
        callback(res)
        onSuccess(res);
      } catch (error) {
        onError(error);
      }
    })();
    return {
      abort() {
        controller.abort();
      },
    };
}