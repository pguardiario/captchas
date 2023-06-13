function getRecaptchaWidgets() {
  let widgets = Object.values(window.___grecaptcha_cfg?.clients || {}).map(widget => {
    let info = {
      captchaType: "recaptcha",
      widgetId: widget.id,
      version: "v2",
      sitekey: null,
      callback: null,
      url: location.href
    };

    if (Object.values(widget).map(o2 => Object.values(o2 || {})).flat().find(el => el?.classList?.contains("grecaptcha-badge"))) {
      info.version = "v3";      
    }

    for (let k in widget) {
      if (widget[k] && widget[k].nodeType) {
        info.textarea = info.textarea || widget[k].querySelector('textarea')        
      }
    }

    let props = Object.values(widget).reduce((acc, o) => {
      return acc || Object.values(o).find(o2 => o2.sitekey)
    }, null)

    let { sitekey, action, s, callback, bind } = props
    info = { ...info, sitekey, action, s, callback, bind }

    return info
  })
  return widgets
}

async function waitForCaptcha(params) {
  let url = 'https://2captcha.com/in.php'
  params['soft_id'] = 2974
  params['json'] = 1
  params['header_acao'] = 1
  let qs = Object.keys(params).map(k => `${k}=${params[k]}`).join('&')

  let response = await fetch(`${url}?${qs}`).then(r => r.json()).catch(e => {
    alert(e.message)
  })

  let {status, request} = response
  if(status !== 1){
    alert("bad 2captcha status")
  }

  url = 'https://2captcha.com/res.php'

  params = {
    key: params.key,
    json: 1,
    header_acao: 1
  }
  params['action'] = 'get'
  params['id'] = request
  qs = Object.keys(params).map(k => `${k}=${params[k]}`).join('&')

  while(true){
    await new Promise(resolve => setTimeout(resolve, 10000))
    response = await fetch(`${url}?${qs}`).then(r => r.json()).catch(e => {
      alert(e.message)
    })

    let {status, request} = response
    if(status === 0){
      // waiting
    } else if(status === 1){
      return request
    } else {
      alert("bad 2captcha status")
      break
    }
  }
}

window.solve = async (api_key, resolve) => {
  let widgets = getRecaptchaWidgets() || []
  let [widget] = widgets
  if (widget) {
    let captcha = await waitForCaptcha({
      key: api_key,
      method: 'userrecaptcha',
      googlekey: widget.sitekey,
      pageurl: window.location,
      version: widget.version
    })

    widget.textarea.innerText = captcha
    if(widget.callback){
      widget.callback()
    }

    setTimeout(resolve, 1000)
  }
}
