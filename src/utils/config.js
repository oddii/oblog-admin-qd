const config = {
  baseUrl: 'http://localhost:8081/api',
  ctxJsonHeader: {
    'Content-Type': 'application/json;charset=UTF-8'
  },
  ctxFormDataHeader: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
  },
  ctxMultipartHeader: {
    'Content-Type': 'multipart/form-data;charset=UTF-8'
  }
}

export default config
