const solve = async (arguments) => {
  const delay = async (ms) => {
    await new Promise((resolve, reject) => {
      setTimeout(() => resolve(), ms)
    })
  }

  const get = async (url) => {
    let response = new Promise((resolve, reject) => {
      fetch(url).then(res => {
        resolve(res.json())
      }).catch(() => callback('BAD_FETCH'))
    })
    console.log(response)
    return response
  }

  const waitForCaptcha = async (sitekey, method) => {
    let key = method === 'hcaptcha' ? 'sitekey' : 'googlekey'
    let api_url = `https://2captcha.com/in.php?header_acao=1&key=${api_key}&method=${method}&${key}=${sitekey}&json=1&pageurl=${document.location.href}&soft_id=2974`
    let div = document.querySelector('[data-s]')
    if(div){
      api_url += `&data-s=${div.getAttribute('data-s')}`
    }

    let {status, request} = await get(api_url)
    if(status) {
      let result_url = `https://2captcha.com/res.php?header_acao=1&key=${api_key}&action=get&id=${request}&json=1&soft_id=2974`;
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

        let form
        if(method === 'hcaptcha'){
          let el = document.querySelector('.h-captcha')
          form = el ? el.closest('form') : document.querySelector('#challenge-form')
        } else {
          form = [...document.querySelectorAll('form')].find(f => f.querySelector('.g-recaptcha'))
        }



        if(form && options.submit !== false){
          console.log('form found')
          form.submit()
        }
      },100)

      return callback('OK')

    } else {
      return callback(request)
    }
  }

  const solveHcaptcha = async () => {
    console.log('hcaptcha')

    let sitekey = document.querySelector('[data-sitekey]') ?
      document.querySelector('[data-sitekey]').getAttribute('data-sitekey') :
      document.querySelector('iframe[src*=sitekey]').src.match(/[?&]sitekey=([\w-]+)/)[1]

    console.log(sitekey)

    await waitForCaptcha(sitekey, 'hcaptcha')
  }

  const solveRecaptcha = async () => {
    console.log('recaptcha')
    let sitekey = document.querySelector('[data-sitekey]') ?
      document.querySelector('[data-sitekey]').getAttribute('data-sitekey') :
      document.querySelector('iframe[src*=api2]').src.match(/[?&]k=(\w+)/)[1]

    for(var iframe of document.querySelectorAll('iframe[src*=api2]')){
      iframe.style.border = 'solid 3px green'
    }

    console.log(sitekey)

    await waitForCaptcha(sitekey, 'userrecaptcha')
  }

  const solveCaptchas = async () => {
    // look for hcaptcha / recaptcha\
    // setTimeout(() => callback('Failed'), 60000)
    let el = document.querySelector('.h-captcha')
    let form = el ? el.closest('form') : document.querySelector('#challenge-form')
    if(form){
      return await solveHcaptcha()
    }
    let div = document.querySelector('.g-recaptcha,#g-recaptcha-response')
    if(div){
      return await solveRecaptcha()
    }
    callback('NO_CAPTCHAS')

   }

  const [api_key, options, callback] = arguments

  await solveCaptchas()
}

if(typeof arguments !== 'undefined'){
  solve(arguments)
}
