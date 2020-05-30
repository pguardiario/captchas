# captchas
Solve hCaptcha / reCaptcha v2 for Puppeteer / Selenium (2captcha.com account required)

## Selenium
```python
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import time

opts = Options()
opts.add_argument("--disable-web-security")
driver = webdriver.Chrome(options=opts)
driver.get('https://www.site-with-captcha.com/')

from requests import get
body = get("https://raw.githubusercontent.com/pguardiario/captchas/master/captchas.js").content.decode('utf8')
driver.set_script_timeout(120)
api_key = 'Your 2captcha API key'
status = driver.execute_async_script(body, api_key)
print(status)
time.sleep(1)
```
