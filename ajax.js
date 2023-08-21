/**
 * Ajax request component
 *
 * @constructor
 * @this {ajax}
 */

const
  appendPath = (path, data) => {
    const pathArr = []
    for (let key in data) {
      pathArr.push(`${key}=${data[key]}`);
    }
    return path + '?' + pathArr.join('&');
  },

  createRequest = () => {
    if (window.XMLHttpRequest) {
      return new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      let xhr;
      try {
        xhr = new ActiveXObject('Msxml2.XMLHTTP');
      } catch (e) {}
      try {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
      } catch (e) {
        return null;
      }
      return xhr;
    }
    return null;
  },
  /**
   * @param {array} params
   * @return {Promise}
   */
  sendRequest = (params) => {
    return new Promise(function (resolve, reject) {
      const xhr = createRequest();
      if (!xhr) {
        alert('Browser doesn`t support ajax');
        return;
      }
      let
        sendData,
        path = params.path,
        requestType = params.type,
        data = params.data || {},
        respType = params.respType || 'json',
        contentType = params.contentType || 'application/x-www-form-urlencoded'
      ;
      if (requestType === 'GET') {
        path = appendPath(path, data);
      } else if (contentType === 'multipart/form-data') {
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
          sendData.push(key + '=' + data[key]);
        }
        sendData = sendData.join('&');
      }
      xhr.open(requestType, path, true);
      xhr.setRequestHeader('Content-Type', contentType);
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
          let respData = xhr.responseText;
          if (respType === 'json') {
            if (respData === 'true') {
              resolve({ success: true });
            }
            if (respData === 'false') {
              resolve({ success: false });
            }
            const eData = !(/[^,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t]/.test(respData.replace(/"(\\.|[^"\\])*"/g, ''))) && eval('(' + respData + ')');
            resolve(new Object(eData));
          } else {
            resolve(respData);
          }
        } else {
          reject(new Error(`Request error`))
        }
      };
      // The request body is ready, send it
      xhr.send(sendData);
    });
  };

const ajax = {
  /**
   * Sending a get request
   *
   * @param {string} path
   * @param {mixed} data request parameters
   * @param {string} respType
   * @param {string} contentType
   * @return {Promise}
   */
  get: (path, data, respType, contentType) => {
    return new Promise(function (resolve, reject) {
      sendRequest({
        type: 'GET',
        path: path,
        data: data,
        respType: respType,
        contentType: contentType,
      })
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e);
        });
    });
  },
  /**
   * Sending a post request
   *
   * @param {string} path
   * @param {mixed} data request parameters
   * @param {string} respType
   * @param {string} contentType
   * @return {Promise}
   */
  post: (path, data, respType, contentType) => {
    return new Promise(function (resolve, reject) {
      sendRequest({
        type: 'POST',
        path: path,
        data: data,
        respType: respType,
        contentType: contentType,
      })
        .then(result => {
          resolve(result)
        })
        .catch(e => {
          reject(e);
        });
    });
  },
};

export default ajax;
