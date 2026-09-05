now i want make p
we have mapped object on chrome it mapped according to `processPriority`in settings with all section and  actions methods  

```js
this.mappedActions
 {
    signIn: {priority:3, startDelay:300, endDelay:0 , <method that do this action>},
    cookies: {priority:1, startDelay:300, endDelay:0 , <method that do this action>},
    captcha: {priority:2, startDelay:300, endDelay:0 , <method that do this action>},
    injection: {priority:4, startDelay:300, endDelay:0 , <method that do this action>},

}
```
in chrome class wil Add object dor currant  `array` for currant section VFS pager 

so bot is driven by many  things 
A- so domScanner() will read all Dome element/sections  
which  element  exist or which location  on VFS webpage then adjust  array of actions names  sorted by   Priority`this.courantOdoredDom` like for example `[signIn, cookies, captcha]`  then sort them like 
for example`[cookies, captcha, signIn]` 
 founded  sections and it selectors on vsf 
B- then then actions bigan to be executed according to this.courantOdoredDom


do you understand me ?
