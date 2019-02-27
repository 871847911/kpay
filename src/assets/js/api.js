/* eslint-disable */
import api from 'fetch/api'
export function initQiniu(idName, size, type, callback, callback1, token) {
  api.getUpToken(token).then(res => {
    let newToken = res.uptoken
    let newDomain = res.tempDomain

    if (newToken) {
      Qiniu.uploader({
        runtimes: 'html5,flash,html4',
        browse_button: idName,
        flash_swf_url: 'https://cdn.bootcss.com/plupload/2.1.1/Moxie.swf',
        chunk_size: '4mb',
        uptoken: newToken,
        //uptoken_url: `${variable}/backend/mgt/cloud/uploadToken`,
        // domain: 'http://qiniu-plupload.qiniudn.com/',
        domain: newDomain,
        get_new_uptoken: false,
        auto_start: true,
        max_retries: 2,
        filters: {
          max_file_size: 10 * size + 'mb',
          prevent_duplicates: false
          // Specify what files to browse for
          // mime_types: [
          //     {title : 'apk files', extensions : 'apk'} // 限定apk后缀上传格式上传
          // ]
        },
        init: {
          'FilesAdded': (up, files) => {
            plupload.each(files, file => {
              // Firefox
              if(navigator.userAgent.indexOf('Firefox') !== -1 && file.type === "audio/mpeg"){
                if (((file.size / 1024) / 1024) < size) {
                  file.isUpload = 1
                  return
                } else {
                  up.removeFile(file)
                  file.isUpload = 2
                  callback1(file)
                  return
                }
              }else if (type.indexOf(file.type) > -1) {
                if (((file.size / 1024) / 1024) < size) {
                  file.isUpload = 1
                  return
                } else {
                  up.removeFile(file)
                  file.isUpload = 2
                  callback1(file)
                  return
                }
              } else {
                up.removeFile(file)
                file.isUpload = 3
                callback1(file)
                return
              }
            })
          },
          BeforeUpload: (up, file) => {
            // console.log('上传之前', file)
          },
          UploadProgress: (up, file) => {
            // console.log('上传中 file', file.percent)
            callback1(file)
          },
          FileUploaded: (up, file, info) => {
            callback(file, info)
          },
          Error: (up, err, errTip) => {
            // console.log('上传失败', err)
          },
          Key: (up, file) => {
            let fileTime = new Date()

            function Appendzero(obj) {
              if (obj < 10) {
                return '0' + '' + obj
              } else {
                return obj
              }
            }
            let newTime = fileTime.getFullYear() + Appendzero(fileTime.getMonth() + 1) + Appendzero(fileTime.getDate())

            let uploadType = file.type

            if(navigator.userAgent.indexOf('Firefox') !== -1 && uploadType === "audio/mpeg"){
              uploadType = "audio/mp3"
            }

            let key = 'temp/' + uploadType + '/' + newTime + '/' + file.id

            if (uploadType && uploadType.indexOf('/') !== -1) {
              key += `.${uploadType.split('/')[1]}`
            }

            return key
          }
        }
      })
    }
  })
}

export function conver(limit) {
  var size = "";
  if (limit < 0.1 * 1024) { //如果小于0.1KB转化成B  
    size = limit.toFixed(2) + "B";
  } else if (limit < 0.1 * 1024 * 1024) { //如果小于0.1MB转化成KB  
    size = (limit / 1024).toFixed(2) + "KB";
  } else if (limit < 0.1 * 1024 * 1024 * 1024) { //如果小于0.1GB转化成MB  
    size = (limit / (1024 * 1024)).toFixed(2) + "MB";
  } else { //其他转化成GB  
    size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB";
  }

  var sizestr = size + "";
  var len = sizestr.indexOf("\.");
  var dec = sizestr.substr(len + 1, 2);
  if (dec == "00") { //当小数点后为00时 去掉小数部分  
    return sizestr.substring(0, len) + sizestr.substr(len + 3, 2);
  }
  return sizestr;
}
