proecrss proprity hve perpouse .. no precess happens before other one 

if bot curranlty see  many known elemnt for it 
like foe examle  accept cookies  popup and in same time there are captcha and login form
here in this situations bot should check processPriority 
to see which should done firest in this case
like firest thing accepting cookies second path captcha thired login forth injectscript 
```
[7:04:33 PM] [Worker] Browser closed.
PS C:\Users\Active\Desktop\Coding\Gradutaion\CustProjects\Omni-Booking-Automation-Suite\VFS_Portugal> 
:) bun .\Browsers\chrome.js\
[7:04:36 PM] [Worker] Launching browser (Headless: false)...
[7:04:38 PM] [Worker] Navigating to VFS...
[7:04:39 PM] [Worker] Page loaded.
[7:04:39 PM] [Worker] Injecting Tampermonkey polyfills and script...
[7:04:39 PM] [Worker] Script successfully injected.
[7:04:39 PM] [Orchestrator] Automated background loop started.
VFS-bot:) [7:04:40 PM] [Worker] Action triggered: Accept Cookies
[7:04:44 PM] [Worker] ✅ Cookie banner accepted.
[7:04:47 PM] [Worker] Action triggered: Accept Cookies
[7:04:55 PM] ❌ [Error - cookie_banner]: Error clicking cookie banner: Node is either not clickable or not an Element
[7:04:56 PM] [Worker] Action triggered: Accept Cookies
```
we have mapped object on chrome it mapped according to `processPriority`in settings with all section and  actions methods  

```js
this.sectionsAndActions
{
signIn:{method:signIn(), priOrity:3, selectors:{""}}
cookies : {method:acceptCookies(), priOrity:1}
captcha : {method:handleCaptcha(), priOrity:2}
injection: {method:injection(), priOrity:4}
}
```
in chrome class wil Add object dor currant  `array` for currant section VFS pager 

so bot is driven by many  things 
A- so domScanner() will read all Dome element/sections  
which  element  exist or which location  on VFS webpage then adjust  array ordered with Priority`this.courantOdoredDom`  founded  sections and it selectors on vsf 
B - mapDomSelectors()  get currant selector for each element .. using 
you have to coordinate each step .. in selector.js settings  to jeep sme names signIn,cookies, captcha, injection
 
B- then process  should done what foreach one to ret
for example 

4 -signinfrom
do you understand me ?
