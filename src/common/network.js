

   let serviceUrl = "http://118.190.134.0/client";
   //let serviceUrl = "http://20o609b535.imwork.net/client";

 // import token from '@/common/globalData';
//get方法的封装
function _get(requestHandler) {

  let token = uni.getStorageSync('token');
      //getApp().globalData.token;
  uni.showLoading({
    title: '加载中...',
    mask: true,
  })
  var that = this
  var header = {
    'content-type': 'application/json',
    "authorization": requestHandler.url.indexOf('anon')=== -1?token:''
   };
  uni.request({
    url: serviceUrl + requestHandler.url,
    method: "GET",
    header: header,
    success: function (res) {
      uni.hideLoading();
      if (res.statusCode == '401') {//401用户未登录，需马上登录
        that.userLogin('get', requestHandler);
      }
      if (res.data.code == '000000') {//状态码000000，请求成功返回相关数据
        requestHandler.success(res);
      } else {
        // if (requestHandler.fail) {//根据requestHandler.fail是否存在给返回相关内容，并需要在调用的地方做相关的失败的提示说明
        //   requestHandler.fail(res);
        //   return
        // }
        if (res.data.message == '' ) {
          uni.showToast({
            title: res.data.message,
            icon: 'none'
          });

        } else {
          uni.showModal({
            title: '提示',
            content: res.data.message,
            confirmColor: "#ff1d1d"
          })
        }
      }
    },
    fail: function (res) {
      // requestHandler.fail(res);

        uni.showModal({
          title: '提示',
          content: res.data.message,
          confirmColor: "#EFB134"
        })

      uni.hideLoading();

    }
  });
}
//post方法的封装
function _post(requestHandler) {
  //let token = getApp().globalData.token;
  let token = uni.getStorageSync('token');

  uni.showLoading({
    title: '加载中...',
    mask: true,
  })
  var that = this
  var header = {
    'content-type': requestHandler.dataType ?'application/x-www-form-urlencoded':'application/json',
    "authorization": requestHandler.url.indexOf('anon')=== -1?token:''
  };

  uni.request({
    url: serviceUrl + requestHandler.url,
    method: "POST",
    header: header,
    data: requestHandler.data,
    success: function (res) {
      uni.hideLoading();
      if (res.statusCode == '401') {
        that.userLogin('post', requestHandler);
      }
      if (res.data.code == '000000') {
        requestHandler.success(res);
      } else {
        if (res.data.message == '') {
          uni.showToast({
            title: res.data.message,
            icon: 'none'
          })
        } else {
          uni.showModal({
            title: '提示',
            content: res.data.message,
            confirmColor: "#EFB134"
          })
          // console.log(requestHandler.fail);
          if (requestHandler.fail) {
            requestHandler.fail(res);
            return
          }
        }

      }
    },
    fail: function (res) {
      // console.log(res);
      uni.hideLoading();
      uni.showModal({
        title: '提示',
        content: '网络异常',
        confirmColor: "#EFB134"
      })
    }
  });
}
//用户登录
function userLogin(method, requestHandler) {
  var that = this
  //调用登录接口
  uni.login({
    success: function (res) {
      var code = res.code;


    }
  });
}
module.exports = {
  _get: _get,
  _post: _post,
  userLogin: userLogin
}
