/**
 * Ajax request component
 *
 * @constructor
 * @this {ajax}
 */

const
  appendPath = (path, data) => {
    for (let key in data) {
      path += "&" + key + "=" + data[key];
    }
    return path;
  },

  createRequest = () => {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      let xhr;
      try {
        xhr = new ActiveXObject("Msxml2.XMLHTTP");
      } catch (e) {
      }
      try {
        xhr = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        return null;
      }
      return xhr;
    }
    return null;
  },
  /**
   * @param {array} params
   * @return {void}
   */
  sendRequest = (params) => {
    const xhr = createRequest();
    if (!xhr) {
      alert("Browser does not support ajax");
      return;
    }
    let
      sendData,
      path = params["path"] + "?ajax=true",
      callback = params.callback,
      requestType = params["type"],
      data = params["data"] || {},
      respType = params["respType"] || "json",
      contentType = params["contentType"] || "application/x-www-form-urlencoded"
    ;

    if (requestType === "GET") {
      path = appendPath(path, data);
    } else if (contentType === "multipart/form-data") {
      let boundary = String(Math.random()).slice(2);
      contentType += '; boundary=' + boundary;
      sendData = '\r\n--' + boundary + '\r\nContent-Disposition: form-data; name="data"; filename="' + data.fileName + '"\r\nContent-Type: ' + data.fileType + '\r\n\r\n' + data.data + '\r\n--' + boundary + '--\r\n';
      delete data.fileName;
      delete data.fileType;
      delete data.data;
      path = appendPath(path, data);
    } else {
      sendData = [];
      for (let key in data) {
        sendData.push(key + "=" + data[key]);
      }
      sendData = sendData.join("&");
    }
    xhr.open(requestType, path, true);
    xhr.setRequestHeader("Content-Type", contentType);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          let rData = xhr.responseText;
          if (respType === "json") {
            if (rData === "true") {
              return { success: true };
            }
            if (rData === "false") {
              return { success: false };
            }
            const eData = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(rData.replace(/"(\\.|[^"\\])*"/g, ""))) && eval("(" + rData + ")");
            const eArray = new Object(eData);
            callback(eArray);
          } else {
            callback(rData);
          }
        }
      }
    };
    // The request body is ready, send it
    xhr.send(sendData);
  }
;
const ajax = {
  /**
   * Sending a get request
   *
   * @param {string} path
   * @param {mixed} data параметры запроса
   * @param {function} callback
   * @param {string} respType
   * @param {string} contentType
   * @return {void}
   */
  get: (path, data, callback, respType, contentType) => {
    if (typeof data === "function") {
      respType = callback;
      callback = data;
      data = {};
    }
    sendRequest({
      type: "GET",
      path: path,
      data: data,
      callback: callback,
      respType: respType,
      contentType: contentType,
    });
  },
  /**
   * Sending a post request
   *
   * @param {string} path
   * @param {mixed} data параметры запроса
   * @param {function} callback
   * @param {string} respType
   * @param {string} contentType
   * @return {void}
   */
  post: (path, data, callback, respType, contentType) => {
    sendRequest({
      type: "POST",
      path: path,
      data: data,
      callback: callback,
      respType: respType,
      contentType: contentType,
    });
  },
};

export default ajax;
