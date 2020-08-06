# captchas
Solve hCaptcha / reCaptcha v2 for Puppeteer / Selenium (2captcha.com account required)

### Selenium
```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

driver = webdriver.Chrome()
driver.get('https://www.site-with-captcha.com/')

from requests import get
body = get("https://raw.githubusercontent.com/pguardiario/captchas/master/captchas.js").content.decode('utf8')
driver.set_script_timeout(120)
api_key = 'Your 2captcha API key'
status = driver.execute_async_script(body, api_key, {})
print(status)
time.sleep(1)
```
### Puppeteer
```javascript
const puppeteer = require('puppeteer')

; (async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto('https://www.site-with-captcha.com/')
  await page.addScriptTag({url: "https://cdn.jsdelivr.net/gh/pguardiario/captchas/captchas.js"})
  let status = await page.evaluate(async () => {
    return new Promise((resolve, reject) => {
      solve([your_api_key, {}, resolve])
    })
  })

  switch(status){
    case 'NO_CAPTCHAS':
    case 'OK':
      break
    case 'ERROR_ZERO_BALANCE':
      console.log('no captcha balance!!!!!')
    case 'ERROR_CAPTCHA_UNSOLVABLE':
      console.log('retrying')
      // try again ?
    default:
      debugger
  }

  // evaluate returns before the submit / captcha callback so wait 1 second.
  await page.waitFor(1000)
})()
```
