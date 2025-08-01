---
title: axios
date: 2025-08-01 13:43:55
tags:
- axios
---
相比fetch Api, axios 提供了更简洁、更直观的 API，使得发送 HTTP 请求和处理响应更加方便; 自动处理json对象（fetch 可以调用await response.json()）
```
axios.post('/api/submit', this.editForm)
        .then(response => {
          console.log('Form submitted successfully:', response.data);
        })
        .catch(error => {
          console.error('Error submitting form:', error);
        });

      axios.request({
        url: '/api/submit',
        method: 'post',
        data: this.editForm
      }).then(response => {
        console.log('Form submitted successfully:', response.data);
      }).catch(error => {
        console.error('Error submitting form:', error);
      });
```
instance
```
const instance = axios.create({ baseURL: '/api' });

// Works just like axios(config)
instance({
  url: '/users',
  method: 'get'
});
```
拦截器
```
// Add a request interceptor
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
  { synchronous: true, runWhen: () => /* This function returns true */}
);

// Add a response interceptor
axios.interceptors.response.use(function onFulfilled(response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  }, function onRejected(error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  });
```