const weatherUtils = {
  weatherInit () {
    const scriptWIDGET = document.createElement('script')
    scriptWIDGET.type = 'text/javascript'
    scriptWIDGET.innerHTML = `
      WIDGET = {
        CONFIG: {
          "layout": 1,
          "width": "430",
          "height": "140",
          "background": 5,
          "dataColor": "4A4A4A",
          "language": "zh",
          "borderRadius": "13",
          "key": "f4d96baf32754f9a85a62f7b015616c4"
        }
      }`

    const scriptSRC = document.createElement('script')
    scriptSRC.src = 'https://widget.heweather.net/standard/static/js/he-standard-common.js?v=1.1'

    const body = document.body
    body.appendChild(scriptWIDGET)
    body.appendChild(scriptSRC)
  }
}

export default weatherUtils
