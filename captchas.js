const solve = async (arguments) => {
  const delay = async (ms) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), ms)
    })
  }

  const get = async (url) => {
    return new Promise((resolve, reject) => {
      fetch(url).then(res => {
        resolve(res.json())
      })
    })
  }

  const waitForCaptcha = async (sitekey, method) => {
    let key = method === 'hcaptcha' ? 'sitekey' : 'googlekey'
    let api_url = `https://2captcha.com/in.php?key=${api_key}&method=${method}&${key}=${sitekey}&json=1&pageurl=${document.location.href}`

    let {status, request} = await get(api_url)
    if(status) {
      let result_url = `https://2captcha.com/res.php?key=${api_key}&action=get&id=${request}&json=1&soft_id=7996404`;
      await delay(20000)

      while(true){
        response = await get(result_url)

        console.log(response)

        if(response.request === 'CAPCHA_NOT_READY'){

        } else if (response.status === 1) {
          break
        } else {
          return callback(response)
        }
        await delay(10000)
      }

      [...document.querySelectorAll('[name="h-captcha-response"],[name="g-recaptcha-response"]')].map(el => {
        el.innerHTML = response.request;
      })

      setTimeout(() => {
        let div = document.querySelector('[data-callback]')
        if(div){
          console.log('callback found')
          window[div.getAttribute('data-callback')](response.request)
        }

        let form = method === 'hcaptcha' ?
          document.querySelector('form#challenge-form') :
          [...document.querySelectorAll('form')].find(f => f.querySelector('.g-recaptcha'))
        if(form){
          console.log('form found')
          form.submit()
        }
      },100)

      return callback('ok')

    } else {
      return callback(request)
    }
  }

  const solveHcaptcha = async () => {
    console.log('hcaptcha')
    let sitekey = document.querySelector('[data-sitekey]').getAttribute('data-sitekey')
    console.log(sitekey)

    await waitForCaptcha(sitekey, 'hcaptcha')
  }

  const solveRecaptcha = async () => {
    console.log('recaptcha')
    let sitekey = document.querySelector('[data-sitekey]').getAttribute('data-sitekey')

    for(var iframe of document.querySelectorAll('iframe[src*=api2]')){
      iframe.style.border = 'solid 3px green'
    }

    console.log(sitekey)

    await waitForCaptcha(sitekey, 'userrecaptcha')
  }

  const solveCaptchas = async () => {
    // look for hcaptcha / recaptcha
    let form = document.querySelector('#challenge-form')
    if(form){
      return await solveHcaptcha()
    }
    let div = document.querySelector('.g-recaptcha')
    if(div){
      return await solveRecaptcha()
    }
    callback('NO_CAPTCHAS')
   }

  const [api_key, callback] = arguments
  console.log(api_key, callback)

  await solveCaptchas()
}

if(typeof arguments !== 'undefined'){
  solve(arguments)
}
