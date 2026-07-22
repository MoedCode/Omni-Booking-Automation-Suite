# Project Context File



## FILE: .\app.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/app.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())
```


## FILE: .\project_context.md

```md

```


## FILE: .\project_context.py

```py
#!/usr/bin/env python3

import os

def create_context_file(output_file="project_context.md"):
    # المجلدات التي سيتم تجاهلها بالكامل
    exclude_dirs = {'.git', '__pycache__', 'venv', 'wenv', '.env', '.idea', '.vscode', 'downloaded_files'}
    
    # الامتدادات التي نريد تضمينها
    include_extensions = ('.py', '.qss', '.md')
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write("# Project Context File\n\n")
        
        for root, dirs, files in os.walk('.'):
            # استبعاد المجلدات المحددة من البحث
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file.endswith(include_extensions):
                    file_path = os.path.join(root, file)
                    
                    # استخراج الامتداد لتحديد نوع الكود في الماركدوان
                    ext = os.path.splitext(file)[1][1:]
                    
                    outfile.write(f"\n\n## FILE: {file_path}\n\n")
                    outfile.write(f"```{ext}\n")
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error reading file: {e}")
                        
                    outfile.write(f"\n```\n")
                    
    print(f"✅ تم إنشاء الملف بنجاح: {output_file}")

if __name__ == "__main__":
    create_context_file()
```


## FILE: .\prompt.md

```md

 bot rech to this point `Select your Visa Application Centre` but did not click continue 
it should chose alexandria and press continue
but it didnt 

```html
<html lang="en-us" dir="ltr" style=""><head><style><!----> <!--?lit$9985173719$-->.osano-cm-window{font-family:Helvetica,Arial,Hiragino Sans GB,STXihei,Microsoft YaHei,WenQuanYi Micro Hei,Hind,MS Gothic,Apple SD Gothic Neo,NanumBarunGothic,sans-serif;font-size:16px;font-smooth:always;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothingz:auto;display:block;left:0;line-height:1;position:absolute;top:0;width:100%;z-index:2147483638;--fade-transition-time:700ms;--slide-transition-time:400ms}.osano-cm-window--context_amp{height:100%}.osano-visually-hidden{height:1px;left:-10000px;margin:-1px;opacity:0;overflow:hidden;position:absolute;width:1px}.osano-cm-button{border-radius:.25em;border-style:solid;border-width:thin;cursor:pointer;flex:1 1 auto;font-size:1em;font-weight:700;line-height:1;margin:.125em;min-width:6em;padding:.5em .75em;transition-duration:.2s;transition-property:background-color;transition-timing-function:ease-out}.osano-cm-button--type_icon{border-radius:50%;height:1em;line-height:0;min-width:1em;width:1em}.osano-cm-button:focus,.osano-cm-button:hover{outline:none}.osano-cm-close{border-radius:50%;border-style:solid;border-width:2px;box-sizing:content-box;cursor:pointer;height:20px;margin:.5em;min-height:20px;min-width:20px;order:0;outline:none;overflow:hidden;padding:0;width:20px;stroke-width:1px;justify-content:center;line-height:normal;text-decoration:none;transform:rotate(0deg);transition-duration:.2s;transition-property:transform,color,background-color,stroke,stroke-width;transition-timing-function:ease-out;z-index:2}.osano-cm-close:focus,.osano-cm-close:hover{transform:rotate(90deg);stroke-width:2px}.ccpa-opt-out-icon{display:flex;flex:1 1 auto}.ccpa-opt-out-icon svg{max-width:40px}.osano-cm-link{cursor:pointer;text-decoration:underline;transition-duration:.2s;transition-property:color;transition-timing-function:ease-out}.osano-cm-link:active,.osano-cm-link:hover{outline:none}.osano-cm-link:focus{font-weight:700;outline:none}.osano-cm-link--type_feature,.osano-cm-link--type_purpose,.osano-cm-link--type_specialFeature,.osano-cm-link--type_specialPurpose{cursor:help;display:block;-webkit-text-decoration:dashed;text-decoration:dashed}.osano-cm-link--type_denyAll{display:block;text-align:right}[dir=rtl] .osano-cm-link--type_denyAll{text-align:left}.osano-cm-link--type_vendor{display:block}.osano-cm-vendor-link{font-size:.75em}.osano-cm-list-item{margin:0}.osano-cm-list-item--type_term{border-top-style:solid;border-top-width:1px;font-size:.875rem;font-weight:400;margin-bottom:.25em;margin-top:.5em;padding:.5em .75rem 0;position:relative;top:-1px}.osano-cm-list-item--type_description{font-size:.75rem;font-weight:lighter;padding:0 .75rem}.osano-cm-list{list-style-position:outside;list-style-type:none;margin:0;padding:0}.osano-cm-list__list-item{text-indent:0}.osano-cm-list--type_description{margin:0 -1em}.osano-cm-list:first-of-type .osano-cm-list__list-item:first-of-type{border-top-width:0;margin-top:0;padding-top:0}.osano-cm-toggle{align-items:center;display:flex;flex-direction:row-reverse;justify-content:flex-start;margin:.25em 0;pointer-events:auto;position:relative}.osano-cm-toggle__label{margin:0 .5em 0 0}[dir=rtl] .osano-cm-toggle__label{margin:0 0 0 .5em}.osano-cm-toggle__switch{border-radius:14px;border-style:solid;border-width:2px;box-sizing:content-box;color:transparent;display:block;flex-shrink:0;height:18px;line-height:0;margin:0;position:relative;text-indent:-9999px;transition-duration:.2s;transition-property:background-color;transition-timing-function:ease-out;width:40px}.osano-cm-toggle__switch:hover{cursor:pointer}.osano-cm-toggle__switch:after{border-radius:9px;border-width:0;height:18px;left:0;top:0;width:18px}.osano-cm-toggle__switch:before{border-radius:16px;border-width:2px;bottom:-6px;box-sizing:border-box;left:-6px;right:-6px;top:-6px}.osano-cm-toggle__switch:after,.osano-cm-toggle__switch:before{border-style:solid;content:"";margin:0;position:absolute;transform:translateX(0);transition-duration:.3s;transition-property:transform,left,border-color;transition-timing-function:ease-out}.osano-cm-toggle__switch:after:active,.osano-cm-toggle__switch:before:active{transition-duration:.1s}.osano-cm-toggle__switch:after:active{width:26px}.osano-cm-toggle__switch:before:active{width:34px}[dir=rtl] .osano-cm-toggle__switch:after{left:100%;transform:translateX(-100%)}.osano-cm-toggle__input{height:1px;left:-10000px;margin:-1px;opacity:0;overflow:hidden;position:absolute;width:1px}[dir=rtl] .osano-cm-toggle__input{left:0;right:-10000px}.osano-cm-toggle__input:disabled{cursor:default}.osano-cm-toggle--type_checkbox .osano-cm-toggle__switch{border-radius:4px;border-style:solid;border-width:1px;height:22px;width:22px}.osano-cm-toggle--type_checkbox .osano-cm-toggle__switch:after{background-color:transparent!important;border-bottom-width:2px;border-left-width:2px;border-radius:0;content:none;height:6px;left:3px;top:3px;transform:rotate(-45deg);transition-property:color;transition-timing-function:ease-out;width:12px}.osano-cm-toggle--type_opt-out .osano-cm-toggle__switch{border-radius:4px;border-style:solid;border-width:1px;height:22px;width:22px}.osano-cm-toggle--type_opt-out .osano-cm-toggle__switch:after,.osano-cm-toggle--type_opt-out .osano-cm-toggle__switch:before{background-color:transparent!important;border-bottom-width:1px;border-radius:0;border-top-width:1px;content:none;height:0;left:-3px;top:7px;transition-property:color;transition-timing-function:ease-out;width:12px}.osano-cm-toggle--type_opt-out .osano-cm-toggle__switch:after{transform:translate(50%,50%) rotate(-45deg)}.osano-cm-toggle--type_opt-out .osano-cm-toggle__switch:before{transform:translate(50%,50%) rotate(45deg)}.osano-cm-toggle__input:checked+.osano-cm-toggle__switch:after{left:100%;transform:translateX(-100%)}[dir=rtl] .osano-cm-toggle__input:checked+.osano-cm-toggle__switch:after{left:0;transform:translateX(0)}.osano-cm-toggle__input:disabled+.osano-cm-toggle__switch{cursor:default}.osano-cm-toggle--type_checkbox .osano-cm-toggle__input:checked+.osano-cm-toggle__switch:after{content:"";left:3px;top:3px;transform:rotate(-45deg)}.osano-cm-toggle--type_opt-out .osano-cm-toggle__input:checked+.osano-cm-toggle__switch:after,.osano-cm-toggle--type_opt-out .osano-cm-toggle__input:checked+.osano-cm-toggle__switch:before{content:"";left:-1px;top:9px}.osano-cm-toggle--type_opt-out .osano-cm-toggle__input:checked+.osano-cm-toggle__switch:after{transform:translate(50%,50%) rotate(-45deg)}.osano-cm-toggle--type_opt-out .osano-cm-toggle__input:checked+.osano-cm-toggle__switch:before{transform:translate(50%,50%) rotate(45deg)}.osano-cm-toggle--type_checkbox .osano-cm-toggle__input:disabled+.osano-cm-toggle__switch,.osano-cm-toggle--type_opt-out .osano-cm-toggle__input:disabled+.osano-cm-toggle__switch{opacity:.3}.osano-cm-widget{background:none;border:none;bottom:12px;cursor:pointer;height:40px;opacity:.9;outline:none;padding:0;position:fixed;transition:transform .1s linear 0s,opacity .2s linear 0ms,visibility 0ms linear 0ms;visibility:visible;width:40px;z-index:2147483636}.osano-cm-widget--position_right{right:12px}.osano-cm-widget--position_left{left:12px}.osano-cm-widget:focus{outline:solid;outline-offset:.2rem}.osano-cm-widget:focus,.osano-cm-widget:hover{opacity:1;transform:scale(1.1)}.osano-cm-widget--hidden{opacity:0;visibility:hidden}.osano-cm-widget--hidden:focus,.osano-cm-widget--hidden:hover{opacity:0;transform:scale(1)}.osano-cm-dialog{align-items:center;box-sizing:border-box;font-size:1em;line-height:1.25;overflow:auto;padding:1.5em;position:fixed;transition-delay:0ms,0ms;transition-duration:.7s,0ms;transition-property:opacity,visibility;visibility:visible;z-index:2147483637}.osano-cm-dialog--hidden{opacity:0;transition-delay:0ms,.7s;visibility:hidden}.osano-cm-dialog--type_bar{box-sizing:border-box;display:flex;flex-direction:column;left:0;right:0}.osano-cm-dialog--type_bar .osano-cm-button{flex:none;margin:.125em auto;width:80%}@media screen and (min-width:768px){.osano-cm-dialog--type_bar{flex-direction:row}.osano-cm-dialog--type_bar .osano-cm-button{flex:1 1 100%;margin:.25em .5em;width:auto}}.osano-cm-dialog--type_box{flex-direction:column;max-height:calc(100vh - 2em);max-width:20em;width:calc(100vw - 2em)}.osano-cm-dialog__close{position:absolute;right:0;top:0}.osano-cm-dialog__list{margin:.5em 0 0;padding:0}.osano-cm-dialog__list .osano-cm-item{display:flex;margin-top:0}.osano-cm-dialog__list .osano-cm-item:last-child{margin-bottom:0}.osano-cm-dialog__list .osano-cm-toggle{flex-direction:row}[dir=rtl] .osano-cm-dialog__list .osano-cm-toggle{flex-direction:row-reverse}.osano-cm-dialog__list .osano-cm-label{white-space:nowrap}[dir=ltr] .osano-cm-dialog__list .osano-cm-label{margin-left:.375em}[dir=rtl] .osano-cm-dialog__list .osano-cm-label{margin-right:.375em}.osano-cm-dialog__buttons{display:flex;flex-wrap:wrap}.osano-cm-dialog--type_bar .osano-cm-dialog__content{flex:5;margin-bottom:.25em;width:100%}.osano-cm-dialog--type_box .osano-cm-dialog__content{display:flex;flex-direction:column;flex-grow:.0001;transition:flex-grow 1s linear}.osano-cm-dialog--type_bar .osano-cm-dialog__list{display:flex;flex-direction:column;flex-wrap:wrap;justify-content:flex-start;margin:.75em auto}@media screen and (min-width:376px){.osano-cm-dialog--type_bar .osano-cm-dialog__list{flex-direction:row}}@media screen and (min-width:768px){.osano-cm-dialog--type_bar .osano-cm-dialog__list{margin:.5em 0 0 auto}[dir=rtl] .osano-cm-dialog--type_bar .osano-cm-dialog__list{margin:.5em auto 0 0}}[dir=ltr] .osano-cm-dialog--type_bar .osano-cm-dialog__list .osano-cm-item{margin-right:.5em}[dir=rtl] .osano-cm-dialog--type_bar .osano-cm-dialog__list .osano-cm-item{margin-left:.5em}.osano-cm-dialog--type_bar .osano-cm-dialog__list .osano-cm-label{padding-top:0}.osano-cm-dialog--type_bar .osano-cm-dialog__buttons{flex:1;justify-content:flex-end;margin:0;width:100%}@media screen and (min-width:768px){.osano-cm-dialog--type_bar .osano-cm-dialog__buttons{margin:0 0 0 .5em;max-width:30vw;min-width:16em;position:sticky;top:0;width:auto}[dir=rtl] .osano-cm-dialog--type_bar .osano-cm-dialog__buttons{margin:0 .5em 0 0}}.osano-cm-dialog--type_box .osano-cm-dialog__buttons{margin:.5em 0 0}.osano-cm-dialog--type_bar.osano-cm-dialog--position_top{top:0}.osano-cm-dialog--type_bar.osano-cm-dialog--position_bottom{bottom:0}.osano-cm-dialog--type_box.osano-cm-dialog--position_top-left{left:1em;top:1em}.osano-cm-dialog--type_box.osano-cm-dialog--position_top-right{right:1em;top:1em}.osano-cm-dialog--type_box.osano-cm-dialog--position_bottom-left{bottom:1em;left:1em}.osano-cm-dialog--type_box.osano-cm-dialog--position_bottom-right{bottom:1em;right:1em}.osano-cm-dialog--type_box.osano-cm-dialog--position_center{left:50%;top:50%;transform:translate(-50%,-50%)}.osano-cm-dialog--type_box.osano-cm-dialog--wide{max-width:50em}@media screen and (max-height:800px)and (max-width:1200px){.osano-cm-dialog--type_box.osano-cm-dialog--wide{max-width:calc(100vw - 4em)}}.osano-cm-dialog--type_box.osano-cm-dialog--wide .osano-cm-dialog__list{display:flex;flex-wrap:wrap}.osano-cm-dialog--context_amp{height:100%;position:relative}.osano-cm-content__message{margin-bottom:1em;word-break:break-word}.osano-cm-drawer-links{margin:.5em 0 0}.osano-cm-drawer-links__link{display:block}.osano-cm-storage-policy{display:inline-block}.osano-cm-usage-list{margin:0 0 .5em}.osano-cm-usage-list__list{list-style-position:inside;list-style-type:disc}:export{fadeTransitionTime:.7s;slideTransitionTime:.4s}.osano-cm-info-dialog{height:100vh;left:0;position:fixed;top:0;transition-delay:0ms,0ms;transition-duration:.2s,0ms;transition-property:opacity,visibility;visibility:visible;width:100vw;z-index:2147483638}.osano-cm-info-dialog--hidden{opacity:0;transition-delay:0ms,.2s;visibility:hidden}.osano-cm-header{margin:0 0 -1em;padding:1em 0;position:sticky;top:0;z-index:1}.osano-cm-info{animation:delay-overflow .4s;bottom:0;box-shadow:0 0 2px 2px #ccc;box-sizing:border-box;max-width:20em;overflow:visible visible;position:fixed;top:0;transition-duration:.4s;transition-property:transform;width:100%}.osano-cm-info--position_left{left:0;transform:translate(-100%)}.osano-cm-info--position_right{right:0;transform:translate(100%)}.osano-cm-info--open{animation:none;overflow:hidden auto;transform:translate(0)}.osano-cm-info--do_not_sell{animation:none;height:-moz-fit-content;height:fit-content;left:50%;position:fixed;right:auto;top:50%;transform:translate(-50%,-50%);transition:none}.osano-cm-info--do_not_sell .osano-cm-close{order:-1}.osano-cm-info--do_not_sell .osano-cm-header{box-sizing:content-box;display:block;flex:none}.osano-cm-info-views{align-items:flex-start;display:flex;flex-direction:row;flex-wrap:nowrap;height:100%;transition-duration:.4s;transition-property:transform;width:100%}[dir=rtl] .osano-cm-info-views{flex-direction:row-reverse}.osano-cm-info-views__view{box-sizing:border-box;flex-shrink:0;width:100%}.osano-cm-info-views--position_0>:not(:first-of-type){max-height:100%;overflow:hidden}.osano-cm-info-views--position_1{transform:translateX(-100%)}.osano-cm-info-views--position_1>:not(:nth-of-type(2)){max-height:100%;overflow:hidden}.osano-cm-info-views--position_2{transform:translateX(-200%)}.osano-cm-info-views--position_2>:not(:nth-of-type(3)){max-height:100%;overflow:hidden}.osano-cm-info--do_not_sell .osano-cm-info-views{height:-moz-fit-content;height:fit-content}.osano-cm-view{height:0;padding:0 .75em 1em;transition-delay:.4s;transition-duration:0ms;transition-property:height,visibility;visibility:hidden;width:100%}.osano-cm-view__button{font-size:.875em;margin:1em 0 0;width:100%}.osano-cm-view--active{height:auto;transition-delay:0ms;visibility:visible}.osano-cm-description{font-size:.75em;font-weight:300;line-height:1.375;margin:1em 0 0}.osano-cm-description:first-child{margin:0}.osano-cm-description:last-of-type{margin-bottom:1em}.osano-cm-drawer-toggle .osano-cm-label{font-size:.875em;line-height:1.375em;margin:0 auto 0 0}[dir=rtl] .osano-cm-drawer-toggle .osano-cm-label{margin:0 0 0 auto}.osano-cm-info-dialog-header{align-items:center;display:flex;flex-direction:row-reverse;left:auto;min-height:3.25em;position:sticky;top:0;width:100%;z-index:1}[dir=rtl] .osano-cm-info-dialog-header{flex-direction:row}.osano-cm-info-dialog-header__header{align-items:center;display:flex;flex:1 1 auto;font-size:1em;justify-content:flex-start;margin:0;order:1;padding:1em .75em}.osano-cm-info-dialog-header__description{font-size:.75em;line-height:1.375}.osano-cm-back,.osano-cm-info-dialog-header__close{position:relative}.osano-cm-back{flex:0 1 auto;margin:0 0 0 .5em;min-width:0;order:2;width:auto;z-index:2}[dir=rtl] .osano-cm-back{margin:0 .5em 0 0}.osano-cm-powered-by{align-items:center;display:flex;flex-direction:column;font-weight:700;justify-content:center;margin:1em 0}.osano-cm-powered-by__link{font-size:.625em;outline:none;text-decoration:none}.osano-cm-powered-by__link:focus,.osano-cm-powered-by__link:hover{text-decoration:underline}@keyframes delay-overflow{0%{overflow:hidden auto}}.osano-cm-drawer-iab-button-container{display:flex;gap:.5em;justify-content:center;margin-bottom:2em}.osano-cm-illustrations__list>.osano-cm-list-item--type_description{padding:.2rem 1rem}.osano-cm-drawer-item.osano-cm-description__list li{padding-top:.75em}.osano-cm-tcf-purpose--label{border-bottom:1px solid rgba(0,0,0,.1);display:block;margin-bottom:.5em;padding:.25em 0 .5em}.osano-cm-link.osano-cm-link--type_purpose{font-weight:400}.osano-cm-tcf-purpose--label input{float:right;margin-right:.5em}.osano-cm-expansion-panel{border-bottom:1px solid rgba(0,0,0,.1);display:block;font-size:.75em;margin:0 -1.5em 1em;padding:1.5em 1.5em 0}.osano-cm-expansion-panel--expanded{border-bottom:none}.osano-cm-expansion-panel--empty,.osano-cm-expansion-panel--empty:not([open]){border-bottom:1px solid rgba(0,0,0,.1);padding-bottom:0}.osano-cm-expansion-panel__body{background-color:rgba(0,0,0,.1);line-height:1.25;list-style:none;margin:0 -1.5em;max-height:0;overflow:hidden;padding:0 1.5em;transition-delay:0ms,0ms,0ms,.3s;transition-duration:.3s,.3s,.3s,0s;transition-property:max-height,padding-top,padding-bottom,visibility;transition-timing-function:ease-out;visibility:hidden}.osano-cm-expansion-panel__toggle{cursor:pointer;display:block;line-height:1.25;margin:0 auto 1em 0;outline:none;position:relative}.osano-cm-expansion-panel__toggle:active,.osano-cm-expansion-panel__toggle:focus,.osano-cm-expansion-panel__toggle:hover{outline:none}[dir=rtl] .osano-cm-expansion-panel__toggle{margin:0 0 1em auto}.osano-cm-expansion-panel--expanded .osano-cm-expansion-panel__body{max-height:none;padding:1.25em 1.5em 1em;transition-delay:0ms,0ms,0ms,0ms;visibility:visible}.osano-cm-cookie-disclosure__title,.osano-cm-script-disclosure__title{border:0;clear:both;display:block;flex:0 1 30%;font-size:1em;font-weight:700;line-height:1.375;margin:0 0 .5em;padding:0}.osano-cm-cookie-disclosure__description,.osano-cm-script-disclosure__description{flex:0 1 70%;font-size:1em;line-height:1.375;margin:0 0 .5em;padding:0}.osano-cm-disclosure{border-bottom:none;display:block;font-size:.75em;margin:0 -1.5em 1em;padding:1.5em 1.5em 0}.osano-cm-disclosure--collapse{border-bottom:1px solid rgba(0,0,0,.1);padding-bottom:1em}.osano-cm-disclosure--empty,.osano-cm-disclosure--empty:not([open]){border-bottom:1px solid rgba(0,0,0,.1);padding-bottom:0}.osano-cm-disclosure__list{background-color:rgba(0,0,0,.1);line-height:1.25;list-style:none;margin:0 -1.5em;padding:1.25em 1.5em 1em}.osano-cm-disclosure__list:empty{border:none;padding:0 1.5em}.osano-cm-disclosure__list:first-of-type{margin-top:1em;padding:1.25em 1.5em 1em}.osano-cm-disclosure__list:first-of-type:empty{padding:1.75em 1.5em .75em}.osano-cm-disclosure__list:not(:first-of-type):not(:empty){border-top:1px solid rgba(0,0,0,.1)}.osano-cm-disclosure__list:empty+.osano-cm-disclosure__list:not(:empty){border:none;padding:0 1.5em}.osano-cm-disclosure__list:not(:empty)~.osano-cm-disclosure__list:empty+.osano-cm-disclosure__list:not(:empty){border-top:1px solid rgba(0,0,0,.1)}.osano-cm-disclosure__list>.osano-cm-list-item{line-height:1.25}.osano-cm-disclosure__list>.osano-cm-list-item:not(:first-of-type){border-top:1px solid rgba(0,0,0,.1);margin:1em -1.25em 0;padding:1em 1.25em 0}.osano-cm-disclosure__toggle{cursor:pointer;display:block;font-weight:700;line-height:1.25;margin:0 auto 0 0;outline:none;position:relative}.osano-cm-disclosure__toggle:focus,.osano-cm-disclosure__toggle:hover{text-decoration:underline}[dir=rtl] .osano-cm-disclosure__toggle{margin:0 0 0 auto}.osano-cm-disclosure--loading .osano-cm-disclosure__list{height:0;line-height:0;max-height:0}.osano-cm-disclosure--loading .osano-cm-disclosure__list>*{display:none}.osano-cm-disclosure--loading .osano-cm-disclosure__list:after{animation-duration:1s;animation-iteration-count:infinite;animation-name:osano-load-scale;animation-timing-function:ease-in-out;border-radius:100%;content:"";display:block;height:1em;position:relative;top:-.125em;transform:translateY(-50%);width:1em}.osano-cm-disclosure--collapse .osano-cm-disclosure__list{display:none}.osano-cm-disclosure--collapse .osano-cm-disclosure__list:after{content:none}.osano-cm-cookie-disclosure,.osano-cm-script-disclosure{display:flex;flex-wrap:wrap;margin:0}.osano-cm-cookie-disclosure__description:last-of-type,.osano-cm-cookie-disclosure__title:last-of-type,.osano-cm-script-disclosure__description:last-of-type,.osano-cm-script-disclosure__title:last-of-type{margin-bottom:0}@keyframes osano-load-scale{0%{transform:translateY(-50%) scale(0)}to{opacity:0;transform:translateY(-50%) scale(1)}} .osano-cm-window { direction: <!--?lit$9985173719$-->ltr; text-align: <!--?lit$9985173719$-->left; } .osano-cm-dialog { background: <!--?lit$9985173719$-->#0a308f; color: <!--?lit$9985173719$-->#ffffff; } .osano-cm-dialog__close { color: <!--?lit$9985173719$-->#ffffff; stroke: <!--?lit$9985173719$-->#ffffff; } .osano-cm-dialog__close:focus { background-color: <!--?lit$9985173719$-->#ffffff; border-color: <!--?lit$9985173719$-->#ffffff; stroke: <!--?lit$9985173719$-->#0a308f; } .osano-cm-dialog__close:hover { stroke: <!--?lit$9985173719$-->#ebebeb; } .osano-cm-dialog__close:focus:hover { stroke: <!--?lit$9985173719$-->#1e44a3; } .osano-cm-info-dialog { background: <!--?lit$9985173719$-->rgba(0,0,0,0.45); } .osano-cm-header, .osano-cm-info-dialog-header { background: <!--?lit$9985173719$-->#0a308f; background: linear-gradient( 180deg, <!--?lit$9985173719$-->#0a308f 2.5em, <!--?lit$9985173719$-->rgba(10,48,143,0) 100% ); } .osano-cm-info { background: <!--?lit$9985173719$-->#0a308f; color: <!--?lit$9985173719$-->#ffffff; } .osano-cm-link-separator::before { content: '|'; padding: 0 0.5em; } .osano-cm-close { display: flex; background-color: transparent; border-color: transparent; } .osano-cm-info-dialog-header__close { color: <!--?lit$9985173719$-->#ffffff; stroke: <!--?lit$9985173719$-->#ffffff; } .osano-cm-info-dialog-header__close:focus { background-color: <!--?lit$9985173719$-->#ffffff; border-color: <!--?lit$9985173719$-->#ffffff; stroke: <!--?lit$9985173719$-->#0a308f; } .osano-cm-info-dialog-header__close:hover { stroke: <!--?lit$9985173719$-->#ebebeb; } .osano-cm-info-dialog-header__close:focus:hover { stroke: <!--?lit$9985173719$-->#1e44a3; } .osano-cm-disclosure__list:first-of-type::after { background-color: <!--?lit$9985173719$-->#eb6000; } .osano-cm-disclosure__toggle, .osano-cm-expansion-panel__toggle { color: <!--?lit$9985173719$-->#eb6000; } .osano-cm-disclosure__toggle:hover, .osano-cm-disclosure__toggle:active, .osano-cm-expansion-panel__toggle:hover, .osano-cm-expansion-panel__toggle:active { color: <!--?lit$9985173719$-->#eb6000; } .osano-cm-disclosure__toggle:focus, .osano-cm-expansion-panel__toggle:focus { color: <!--?lit$9985173719$-->#ff7414; } .osano-cm-button { background-color: <!--?lit$9985173719$-->#eb6000; border-color: <!--?lit$9985173719$-->#ffffff; color: <!--?lit$9985173719$-->#ffffff; } .osano-cm-button--type_deny { background-color: <!--?lit$9985173719$-->#989; border-color: <!--?lit$9985173719$-->#fff; color: <!--?lit$9985173719$-->#fff; } .osano-cm-button:focus, .osano-cm-button:hover { background-color: <!--?lit$9985173719$-->#ff7414; } .osano-cm-button--type_deny:focus, .osano-cm-button--type_deny:hover { background-color: <!--?lit$9985173719$-->#857485; } .osano-cm-link { color: <!--?lit$9985173719$-->#eb6000; } .osano-cm-link:hover, .osano-cm-link:active { color: <!--?lit$9985173719$-->#eb6000; } .osano-cm-link:focus { color: <!--?lit$9985173719$-->#ff7414; } .osano-cm-toggle__switch { background-color: <!--?lit$9985173719$-->#d2cfff; } .osano-cm-toggle__switch::after { background-color: <!--?lit$9985173719$-->#ffffff; border-color: <!--?lit$9985173719$-->#ffffff; } .osano-cm-toggle__switch::before { border-color: transparent; } .osano-cm-toggle__input:checked + .osano-cm-toggle__switch { background-color: <!--?lit$9985173719$-->#eb6000; border-color: <!--?lit$9985173719$-->#eb6000; } .osano-cm-toggle__input:checked + .osano-cm-toggle__switch::after, .osano-cm-toggle__input:checked + .osano-cm-toggle__switch::before { border-color: <!--?lit$9985173719$-->#ffffff; } .osano-cm-toggle__input:focus + .osano-cm-toggle__switch, .osano-cm-toggle__input:hover + .osano-cm-toggle__switch { background-color: <!--?lit$9985173719$-->#bebbeb; border-color: <!--?lit$9985173719$-->#bebbeb; } .osano-cm-toggle__input:focus + .osano-cm-toggle__switch::before { border-color: <!--?lit$9985173719$-->#bebbeb; } .osano-cm-toggle__input:checked:focus + .osano-cm-toggle__switch, .osano-cm-toggle__input:checked:hover + .osano-cm-toggle__switch { background-color: <!--?lit$9985173719$-->#ff7414; border-color: <!--?lit$9985173719$-->#ff7414; } .osano-cm-toggle__input:checked:focus + .osano-cm-toggle__switch::before { border-color: <!--?lit$9985173719$-->#ff7414; } .osano-cm-toggle__input:disabled + .osano-cm-toggle__switch, .osano-cm-toggle__input:disabled:focus + .osano-cm-toggle__switch, .osano-cm-toggle__input:disabled:hover + .osano-cm-toggle__switch { background-color: <!--?lit$9985173719$-->#928fbf; border-color: <!--?lit$9985173719$-->#928fbf; } .osano-cm-toggle__input:disabled + .osano-cm-toggle__switch::after, .osano-cm-toggle__input:disabled:focus + .osano-cm-toggle__switch::after, .osano-cm-toggle__input:disabled:hover + .osano-cm-toggle__switch::after { background-color: <!--?lit$9985173719$-->#bfbfbf; border-color: <!--?lit$9985173719$-->#bfbfbf; } .osano-cm-toggle__input:disabled + .osano-cm-toggle__switch::before, .osano-cm-toggle__input:disabled:focus + .osano-cm-toggle__switch::before, .osano-cm-toggle__input:disabled:hover + .osano-cm-toggle__switch::before { border-color: transparent; } .osano-cm-toggle__input:disabled:checked + .osano-cm-toggle__switch, .osano-cm-toggle__input:disabled:checked:focus + .osano-cm-toggle__switch, .osano-cm-toggle__input:disabled:checked:hover + .osano-cm-toggle__switch { background-color: <!--?lit$9985173719$-->#ffa040; border-color: <!--?lit$9985173719$-->#ffa040; } .osano-cm-toggle__input:disabled:checked + .osano-cm-toggle__switch::after, .osano-cm-toggle__input:disabled:checked:focus + .osano-cm-toggle__switch::after, .osano-cm-toggle__input:disabled:checked:hover + .osano-cm-toggle__switch::after { background-color: <!--?lit$9985173719$-->#bfbfbf; border-color: <!--?lit$9985173719$-->#bfbfbf; } .osano-cm-toggle__input:disabled:checked + .osano-cm-toggle__switch::before, .osano-cm-toggle__input:disabled:checked:focus + .osano-cm-toggle__switch::before, .osano-cm-toggle__input:disabled:checked:hover + .osano-cm-toggle__switch::before { border-color: transparent; } .osano-cm-widget__outline { fill: <!--?lit$9985173719$-->#fff; stroke: <!--?lit$9985173719$-->#29246a; } .osano-cm-widget__dot { fill: <!--?lit$9985173719$-->#37cd8f; } .osano-cm-tcf-purpose--label input { accent-color: <!--?lit$9985173719$-->#eb6000; } </style><meta http-equiv="origin-trial" content="3NNj0GXVktLOmVKwWUDendk4Vq2qgMVDBDX+Sni48ATJl9JBj+zF+9W2HGB3pvt6qowOihTbQgTeBm9SKbdTwYAAABfeyJvcmlnaW4iOiJodHRwczovL3JlY2FwdGNoYS5uZXQ6NDQzIiwiZmVhdHVyZSI6IlRwY2QiLCJleHBpcnkiOjE3MzUzNDM5OTksImlzVGhpcmRQYXJ0eSI6dHJ1ZX0="><meta http-equiv="origin-trial" content="A6iYDRdcg1LVww9DNZEU+JUx2g1IJxSxk4P6F+LimR0ElFa38FydBqtz/AmsKdGr11ZooRgDPCInHJfGzwtR+A4AAACXeyJvcmlnaW4iOiJodHRwczovL3d3dy5yZWNhcHRjaGEubmV0OjQ0MyIsImZlYXR1cmUiOiJEaXNhYmxlVGhpcmRQYXJ0eVN0b3JhZ2VQYXJ0aXRpb25pbmczIiwiZXhwaXJ5IjoxNzU3OTgwODAwLCJpc1N1YmRvbWFpbiI6dHJ1ZSwiaXNUaGlyZFBhcnR5Ijp0cnVlfQ=="><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffb60a0bb-8c69-48ae-8c83-2dffdde46a34&amp;w=256&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffb60a0bb-8c69-48ae-8c83-2dffdde46a34&amp;w=384&amp;q=75 2x"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Fcd59e348-8a25-4698-a93a-6303771fe9e0&amp;w=3840&amp;q=75 3840w" imagesizes="100vw"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=3840&amp;q=75 3840w" imagesizes="200px"><link rel="stylesheet" href="/_next/static/css/4a300a7f839274a6.css" data-precedence="next"><link rel="stylesheet" href="/_next/static/css/f0441552670f7a24.css" data-precedence="next"><link rel="stylesheet" href="/_next/static/css/f547d6e20863a62f.css" data-precedence="next"><link rel="stylesheet" href="/_next/static/css/d97149ddbfd9eb56.css" data-precedence="next"><link rel="stylesheet" href="/_next/static/css/82a4bed7c90b697b.css" data-precedence="next"><link rel="preload" as="script" fetchpriority="low" href="/_next/static/chunks/webpack-30f96451a97e1438.js"><script integrity="sha384-DMJucfgjcmtc4a8x9gFfPgwoWXK+1qozk7K/wTFGVtduYs3wg2BI8Z5lrJXZV+iE" crossorigin="anonymous" charset="utf-8" async="" type="text/javascript" src="https://www.gstatic.com/recaptcha/releases/A7KpaEASfhDcK0nXxgQEyyYv/recaptcha__en.js"></script><script src="/_next/static/chunks/4bd1b696-182b6b13bdad92e3.js" async=""></script><script src="/_next/static/chunks/1255-14274d5037a7a763.js" async=""></script><script src="/_next/static/chunks/main-app-207231610fc2a90c.js" async=""></script><link rel="preload" href="https://cmp.osano.com/AzqL4lT4Pea7o2XE9/c9db9abf-709d-4404-9b82-fbe51b312b5f/osano.js" as="script"><link rel="preload" href="https://recaptcha.net/recaptcha/api.js?render=6LevDoQeAAAAAEVrXcQsTo2zjgSO5oQs-PGf6ZW7" as="script"><script src="/_next/static/chunks/polyfills-42372ed130431b0a.js" nomodule=""></script><link rel="preload" href="/_next/static/media/e807dee2426166ad-s.p.woff2" as="font" crossorigin="" type="font/woff2"><link rel="preload" as="style" href="/_next/static/css/82a4bed7c90b697b.css"><link rel="preload" as="style" href="/_next/static/css/d97149ddbfd9eb56.css"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F4d870d85-366f-4a8d-95ea-2d38550b90b0&amp;w=1920&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F4d870d85-366f-4a8d-95ea-2d38550b90b0&amp;w=3840&amp;q=75 2x"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=3840&amp;q=75 3840w" imagesizes="17rem"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=3840&amp;q=75 3840w" imagesizes="17rem"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=3840&amp;q=75 3840w" imagesizes="17rem"><link rel="preload" as="image" imagesrcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=3840&amp;q=75 3840w" imagesizes="17rem"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="next-size-adjust" content=""><title>Germany Visa Application Centres | TLScontact</title><meta name="description" content="Germany Visa Application Centres | TLScontact"><link rel="icon" href="/favicon.ico" type="image/x-icon" sizes="32x32"></head><body class="__className_2fad4c"><div data-nosnippet="" class="osano-cm-window" dir="ltr"><!----> <!--?lit$9985173719$--><div hidden="" class="osano-visually-hidden"> <span id="osano-cm-aria.newWindow"><!--?lit$9985173719$-->Opens in a new window</span> <span id="osano-cm-aria.external"><!--?lit$9985173719$-->Opens an external website</span> <span id="osano-cm-aria.externalNewWindow"><!--?lit$9985173719$-->Opens an external website in a new window</span> </div> <!--?lit$9985173719$--> <div role="dialog" id="13a2f20c-dede-4340-88f0-27ac8e744f8a" aria-label="Cookie Consent Banner" aria-describedby="13a2f20c-dede-4340-88f0-27ac8e744f8a__label" class=" osano-cm-window__dialog osano-cm-dialog osano-cm-dialog--hidden osano-cm-dialog--position_bottom osano-cm-dialog--type_bar "> <!--?lit$9985173719$--> <button class=" osano-cm-dialog__close osano-cm-close "> <!--?lit$9985173719$--><svg width="20px" height="20px" viewBox="0 0 20 20" role="img" aria-labelledby="5c164cb0-fe09-460a-a593-dda18f41395a"> <title id="5c164cb0-fe09-460a-a593-dda18f41395a"><!---->Close this dialog<!----></title> <line role="presentation" x1="2" y1="2" x2="18" y2="18"></line> <line role="presentation" x1="2" y1="18" x2="18" y2="2"></line> </svg> </button>  <div class=" osano-cm-dialog__content osano-cm-content "> <!--?lit$9985173719$--> <span id="13a2f20c-dede-4340-88f0-27ac8e744f8a__label" class=" osano-cm-content__message osano-cm-message "> <!--?lit$9985173719$-->This website utilizes technologies such as cookies to enable essential site functionality, as well as for analytics, personalization, and targeted advertising. <!--?lit$9985173719$-->To learn more, view the following link: <!--?lit$9985173719$--> </span>  <!--?lit$9985173719$--> <!--?lit$9985173719$--><!--?lit$9985173719$--><a rel="noopener" tabindex="0" href="/cookie-policy/*" target="_blank" class=" osano-cm-storage-policy osano-cm-content__link osano-cm-link " aria-describedby="osano-cm-aria.newWindow"><!--?lit$9985173719$-->Cookie Policy</a><!--?--><!--?lit$9985173719$--> <!--?lit$9985173719$--> <!--?lit$9985173719$--> </div> <!--?lit$9985173719$--> </div>  <!--?lit$9985173719$--> <button id="ce982c0e-f5fe-40b4-be87-f0abf26cf240" class="osano-cm-window__widget osano-cm-widget osano-cm-widget--position_right" title="Cookie Preferences" aria-label="Cookie Preferences"> <svg role="img" width="40" height="40" viewBox="0 0 71.85 72.23" xmlns="http://www.w3.org/2000/svg" aria-labelledby="ce982c0e-f5fe-40b4-be87-f0abf26cf240"> <path d="m67.6 36.73a6.26 6.26 0 0 1 -3.2-2.8 5.86 5.86 0 0 0 -5.2-3.1h-.3a11 11 0 0 1 -11.4-9.5 6 6 0 0 1 -.1-1.4 9.2 9.2 0 0 1 .4-2.9 8.65 8.65 0 0 0 .2-1.6 5.38 5.38 0 0 0 -1.9-4.3 7.3 7.3 0 0 1 -2.5-5.5 3.91 3.91 0 0 0 -3.5-3.9 36.46 36.46 0 0 0 -15 1.5 33.14 33.14 0 0 0 -22.1 22.7 35.62 35.62 0 0 0 -1.5 10.2 34.07 34.07 0 0 0 4.8 17.6.75.75 0 0 0 .07.12c.11.17 1.22 1.39 2.68 3-.36.47 5.18 6.16 5.65 6.52a34.62 34.62 0 0 0 55.6-21.9 4.38 4.38 0 0 0 -2.7-4.74z" stroke-width="3" class=" osano-cm-widget__outline osano-cm-outline "></path> <path d="m68 41.13a32.37 32.37 0 0 1 -52 20.5l-2-1.56c-2.5-3.28-5.62-7.15-5.81-7.44a32 32 0 0 1 -4.5-16.5 34.3 34.3 0 0 1 1.4-9.6 30.56 30.56 0 0 1 20.61-21.13 33.51 33.51 0 0 1 14.1-1.4 1.83 1.83 0 0 1 1.6 1.8 9.38 9.38 0 0 0 3.3 7.1 3.36 3.36 0 0 1 1.2 2.6 3.37 3.37 0 0 1 -.1 1 12.66 12.66 0 0 0 -.5 3.4 9.65 9.65 0 0 0 .1 1.7 13 13 0 0 0 10.5 11.2 16.05 16.05 0 0 0 3.1.2 3.84 3.84 0 0 1 3.5 2 10 10 0 0 0 4.1 3.83 2 2 0 0 1 1.4 2z" stroke-width="3" class=" osano-cm-widget__outline osano-cm-outline "></path> <g class=" osano-cm-widget__dot osano-cm-dot "> <path d="m26.6 31.43a5.4 5.4 0 1 1 5.4-5.43 5.38 5.38 0 0 1 -5.33 5.43z"></path> <path d="m25.2 53.13a5.4 5.4 0 1 1 5.4-5.4 5.44 5.44 0 0 1 -5.4 5.4z"></path> <path d="m47.9 52.33a5.4 5.4 0 1 1 5.4-5.4 5.32 5.32 0 0 1 -5.24 5.4z"></path> </g> </svg> </button>  <!--?lit$9985173719$--><div role="dialog" aria-modal="true" id="ca145091-8b72-42a5-9c84-b0ae2d601fbb" aria-labelledby="ca145091-8b72-42a5-9c84-b0ae2d601fbb__label" aria-hidden="true" class=" osano-cm-window__info-dialog osano-cm-info-dialog osano-cm-info-dialog--hidden "> <!--?lit$9985173719$--><!--?lit$9985173719$--><span tabindex="0" aria-hidden="true" data-focus="first"></span><!--?--> <div role="presentation" class=" osano-cm-info-dialog__info osano-cm-info osano-cm-info--position_right "> <!--?lit$9985173719$--><div role="presentation" class=" osano-cm-info__info-dialog-header osano-cm-info-dialog-header "> <p role="heading" aria-level="1" id="ca145091-8b72-42a5-9c84-b0ae2d601fbb__label" class=" osano-cm-info-dialog-header__header osano-cm-header "> <!--?lit$9985173719$--> </p> <!--?lit$9985173719$--> <button class=" osano-cm-info-dialog-header__close osano-cm-close "> <!--?lit$9985173719$--><svg width="20px" height="20px" viewBox="0 0 20 20" role="img" aria-labelledby="3754be05-252d-42d7-b081-4fcb784fbc89"> <title id="3754be05-252d-42d7-b081-4fcb784fbc89"><!---->Close Cookie Preferences<!----></title> <line role="presentation" x1="2" y1="2" x2="18" y2="18"></line> <line role="presentation" x1="2" y1="18" x2="18" y2="2"></line> </svg> </button> <!--?lit$9985173719$--> </div> <div role="presentation" class=" osano-cm-info__info-views osano-cm-info-views osano-cm-info-views--hidden osano-cm-info-views--position_0 "> <!--?lit$9985173719$--> </div> </div> <!--?lit$9985173719$--><!--?lit$9985173719$--><span tabindex="0" aria-hidden="true" data-focus="last"></span><!--?--> </div> </div><div hidden=""></div><a tabindex="0" href="#page-title" class="absolute left-0 top-0 z-50 -translate-y-full transform bg-yellow-500 px-4 py-2 font-semibold transition focus:translate-y-0">Skip to main content</a><main id="main" class="flex min-h-screen flex-col items-stretch pt-12 md:pt-18" tabindex="-1"><!--$--><!--/$--><nav id="navbar" class="fixed top-0 z-20 flex h-12 w-full items-center gap-2 bg-header px-2 text-on-header shadow-md md:h-18 lg:pe-4 lg:ps-8 print:hidden"><a href="/en-us" class="relative block h-11 w-52"><img alt="TLScontact logo" decoding="async" data-nimg="fill" class="object-contain object-left" sizes="200px" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F51249a1c-fbb6-4879-922f-2d5b8cf5faba&amp;w=3840&amp;q=75" style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"></a><div class="flex-1"></div><div role="list" aria-label="Language switcher" class="relative z-[11]"><div role="listitem" class="cursor-pointer rounded-lg p-2 duration-300 hover:bg-gray-50 active:scale-90"><div class="flex items-center gap-x-1" data-testid="btn-language-selector"><p class="text-xs text-on-header">EN</p><div class="hidden duration-150 md:block"><svg class="w-4 fill-primary-500" aria-label="Chevron down icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M4.46967 8.46967C4.76256 8.17678 5.23744 8.17678 5.53033 8.46967L12.5 15.4393L19.4697 8.46967C19.7626 8.17678 20.2374 8.17678 20.5303 8.46967C20.8232 8.76256 20.8232 9.23744 20.5303 9.53033L13.0303 17.0303C12.7374 17.3232 12.2626 17.3232 11.9697 17.0303L4.46967 9.53033C4.17678 9.23744 4.17678 8.76256 4.46967 8.46967Z"></path></svg></div></div></div></div><div role="list" aria-label="Dropdown selector" class="relative z-[11]"><div role="listitem" class="cursor-pointer rounded-lg p-2 duration-300 hover:bg-gray-50 active:scale-90"><svg class="fill-primary-500 w-5 lg:w-7" data-testid="user-button" aria-label="User icon" role="img" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8.43692 11.25C8.43692 7.62563 11.3751 4.6875 14.9994 4.6875C18.6238 4.6875 21.5619 7.62563 21.5619 11.25C21.5619 14.8743 18.6238 17.8124 14.9995 17.8125C14.9995 17.8125 14.9995 17.8125 14.9994 17.8125C11.3751 17.8125 8.43692 14.8744 8.43692 11.25ZM19.327 18.4947C21.7888 17.021 23.4369 14.3279 23.4369 11.25C23.4369 6.5901 19.6593 2.8125 14.9994 2.8125C10.3395 2.8125 6.56192 6.5901 6.56192 11.25C6.56192 14.328 8.21004 17.021 10.6719 18.4947C9.73468 18.7977 8.82805 19.1996 7.96788 19.6961C5.82983 20.93 4.05416 22.7049 2.81925 24.8424C2.56024 25.2907 2.71371 25.8642 3.16203 26.1232C3.61036 26.3822 4.18377 26.2287 4.44278 25.7804C5.51309 23.9278 7.05207 22.3895 8.90513 21.32C10.7581 20.2505 12.8599 19.6875 14.9994 19.6875C14.9995 19.6875 14.9995 19.6875 14.9996 19.6875C17.1392 19.6875 19.241 20.2506 21.0941 21.3201C22.9471 22.3896 24.4861 23.928 25.5563 25.7806C25.8153 26.2289 26.3887 26.3824 26.8371 26.1234C27.2854 25.8644 27.4389 25.291 27.1799 24.8427C25.945 22.7051 24.1694 20.9302 22.0314 19.6962C21.1711 19.1997 20.2643 18.7977 19.327 18.4947Z"></path></svg></div></div></nav><div class="relative flex-1"><img alt="A monochromatic blue-filtered skyline of a bustling city with modern skyscrapers and iconic architecture." width="1440" height="260" decoding="async" data-nimg="1" class="absolute start-0 top-0 h-[13.5rem] w-full object-cover print:hidden md:h-[25rem]" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F4d870d85-366f-4a8d-95ea-2d38550b90b0&amp;w=1920&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F4d870d85-366f-4a8d-95ea-2d38550b90b0&amp;w=3840&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F4d870d85-366f-4a8d-95ea-2d38550b90b0&amp;w=3840&amp;q=75" style="color: transparent;"><div class="relative"><div class="container mx-auto px-4 py-6 lg:pt-20"><h1 data-test-id="page-title" id="page-title" tabindex="-1" class="text-on-image mb-6 text-2xl font-semibold md:text-3xl lg:mb-12 xl:text-4xl">Select your Visa Application Centre</h1><div class="mb-6 rounded-lg rounded-tl-none bg-surface-container-high px-4 py-6 shadow-primary md:p-10 hidden"><div class="TlsCmsContent_cms-wrapper__5pjaA mb-10 text-center font-semibold"><p>To continue with your visa application process, you will need to book an appointment at one of the TLScontact visa application centres.</p></div><form><div class="mb-12"><label class="mb-1 block text-start font-semibold text-on-surface-variant md:mb-2" for="search-vac-map-view">To find a visa application centre, enter your city name.</label><div class="border-primary-container flex h-[2.875rem] items-center rounded-3xl border bg-surface-container focus-within:ring-2"><svg class="mx-3 h-5 w-5 fill-gray-500" aria-label="Search icon" role="img" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.8749 18.3862L13.078 12.5893C13.9775 11.4263 14.4641 10.0045 14.4641 8.50893C14.4641 6.71875 13.7655 5.04018 12.5021 3.77455C11.2387 2.50893 9.55566 1.8125 7.76772 1.8125C5.97977 1.8125 4.29674 2.51116 3.03334 3.77455C1.76772 5.03795 1.07129 6.71875 1.07129 8.50893C1.07129 10.2969 1.76995 11.9799 3.03334 13.2433C4.29674 14.5089 5.97754 15.2054 7.76772 15.2054C9.26325 15.2054 10.6829 14.7187 11.8458 13.8214L17.6427 19.6161C17.6597 19.6331 17.6799 19.6466 17.7021 19.6558C17.7243 19.665 17.7481 19.6697 17.7722 19.6697C17.7962 19.6697 17.82 19.665 17.8423 19.6558C17.8645 19.6466 17.8846 19.6331 17.9016 19.6161L18.8749 18.6451C18.8919 18.6281 18.9054 18.6079 18.9146 18.5857C18.9238 18.5635 18.9285 18.5397 18.9285 18.5156C18.9285 18.4916 18.9238 18.4678 18.9146 18.4456C18.9054 18.4233 18.8919 18.4032 18.8749 18.3862ZM11.3034 12.0446C10.357 12.9888 9.10254 13.5089 7.76772 13.5089C6.4329 13.5089 5.17843 12.9888 4.232 12.0446C3.28781 11.0982 2.76772 9.84375 2.76772 8.50893C2.76772 7.17411 3.28781 5.91741 4.232 4.97321C5.17843 4.02902 6.4329 3.50893 7.76772 3.50893C9.10254 3.50893 10.3592 4.02679 11.3034 4.97321C12.2476 5.91964 12.7677 7.17411 12.7677 8.50893C12.7677 9.84375 12.2476 11.1004 11.3034 12.0446Z"></path></svg><input id="search-vac-map-view" autocomplete="country" aria-labelledby="search-vac-map-view" class="h-10 flex-1 border-none bg-transparent text-gray-800 outline-none" placeholder="" type="text" value="" name="search-vac-map-view"><button type="button" class="TlsButton_tls-button__syUS5 TlsButton_--outline__Gz93Y TlsButton_primary__sPypD TlsButton_--base__NfSqN undefined">Search</button></div></div></form><div class="h-96 w-full overflow-hidden rounded-lg border border-primary-container bg-gray-100 md:h-[42rem]"><div class="h-full w-full" id="tls-map"></div></div></div><div class="mb-6 rounded-lg bg-surface-container-high px-4 py-6 shadow-primary md:p-10 block"><div class="TlsCmsContent_cms-wrapper__5pjaA mb-10 text-center font-semibold"><p>To continue with your visa application process, you will need to book an appointment at one of the TLScontact visa application centres.</p></div><div class="mb-12"><label class="mb-1 block text-start font-semibold text-on-surface-variant md:mb-2" for="search-vac-list-view">To find a visa application centre, enter your city name.</label><div class="border-primary-container flex h-[2.875rem] items-center rounded-3xl border bg-surface-container focus-within:ring-2"><svg class="mx-3 h-5 w-5 fill-gray-500" aria-label="Search icon" role="img" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.8749 18.3862L13.078 12.5893C13.9775 11.4263 14.4641 10.0045 14.4641 8.50893C14.4641 6.71875 13.7655 5.04018 12.5021 3.77455C11.2387 2.50893 9.55566 1.8125 7.76772 1.8125C5.97977 1.8125 4.29674 2.51116 3.03334 3.77455C1.76772 5.03795 1.07129 6.71875 1.07129 8.50893C1.07129 10.2969 1.76995 11.9799 3.03334 13.2433C4.29674 14.5089 5.97754 15.2054 7.76772 15.2054C9.26325 15.2054 10.6829 14.7187 11.8458 13.8214L17.6427 19.6161C17.6597 19.6331 17.6799 19.6466 17.7021 19.6558C17.7243 19.665 17.7481 19.6697 17.7722 19.6697C17.7962 19.6697 17.82 19.665 17.8423 19.6558C17.8645 19.6466 17.8846 19.6331 17.9016 19.6161L18.8749 18.6451C18.8919 18.6281 18.9054 18.6079 18.9146 18.5857C18.9238 18.5635 18.9285 18.5397 18.9285 18.5156C18.9285 18.4916 18.9238 18.4678 18.9146 18.4456C18.9054 18.4233 18.8919 18.4032 18.8749 18.3862ZM11.3034 12.0446C10.357 12.9888 9.10254 13.5089 7.76772 13.5089C6.4329 13.5089 5.17843 12.9888 4.232 12.0446C3.28781 11.0982 2.76772 9.84375 2.76772 8.50893C2.76772 7.17411 3.28781 5.91741 4.232 4.97321C5.17843 4.02902 6.4329 3.50893 7.76772 3.50893C9.10254 3.50893 10.3592 4.02679 11.3034 4.97321C12.2476 5.91964 12.7677 7.17411 12.7677 8.50893C12.7677 9.84375 12.2476 11.1004 11.3034 12.0446Z"></path></svg><input id="search-vac-list-view" autocomplete="country" aria-labelledby="search-vac-list-view" class="h-10 flex-1 border-none bg-transparent text-gray-800 outline-none" placeholder="" type="text" value="" name="search-vac-list-view"></div></div><ul class="flex flex-wrap items-stretch justify-center gap-4 lg:gap-10"><li class="relative z-0"><div class="relative z-10 h-full"><div class="TlsVacCard_tls-vac-card__DLGQr"><div class="TlsVacCard_tls-vac-card_image__7pHvU"><img alt="A vibrant city skyline with iconic landmarks and bustling streets, showcasing urban energy and charm" decoding="async" data-nimg="fill" class="!object-cover" sizes="17rem" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F8ee32c02-c69b-4102-bb68-9484ade64532&amp;w=3840&amp;q=75" style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"></div><div class="TlsVacCard_tls-vac-card_content__v2gMH"><div><p class="TlsVacCard_tls-vac-card_title__qk6jS">New Cairo </p><div class="mt-4 flex flex-col gap-1"><div class="flex items-start gap-2 text-sm"><svg viewBox="0 0 24 24" class="mt-0.5 w-4 fill-on-surface" fill="none" role="img" aria-label="Location icon" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 12.855 17.0161 15.6822 15.184 17.7891C14.2772 18.832 13.3684 19.6729 12.6861 20.2528C12.4163 20.4821 12.1828 20.6699 12 20.8125C11.8172 20.6699 11.5837 20.4821 11.3139 20.2528C10.6316 19.6729 9.72283 18.832 8.81595 17.7891C6.98389 15.6822 5.25 12.855 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703ZM11.5695 22.3641C11.5697 22.3643 11.5699 22.3644 12 21.75L11.5699 22.3644C11.8281 22.5452 12.1719 22.5452 12.4301 22.3644L12 21.75C12.4301 22.3644 12.4303 22.3643 12.4305 22.3641L12.4312 22.3637L12.4329 22.3624L12.4385 22.3585L12.4575 22.345C12.4737 22.3334 12.4969 22.3167 12.5264 22.2952C12.5856 22.252 12.6706 22.189 12.7777 22.1071C12.9919 21.9434 13.2951 21.7038 13.6576 21.3957C14.3816 20.7803 15.3478 19.8867 16.316 18.7734C18.2339 16.5678 20.25 13.395 20.25 9.75C20.25 7.56196 19.3808 5.46354 17.8336 3.91637C16.2865 2.36919 14.188 1.5 12 1.5C9.81196 1.5 7.71354 2.36919 6.16637 3.91637C4.61919 5.46354 3.75 7.56196 3.75 9.75C3.75 13.395 5.76611 16.5678 7.68405 18.7734C8.65217 19.8867 9.61838 20.7803 10.3424 21.3957C10.7049 21.7038 11.0081 21.9434 11.2223 22.1071C11.3294 22.189 11.4144 22.252 11.4736 22.2952C11.5031 22.3167 11.5263 22.3334 11.5425 22.345L11.5502 22.3505L11.5615 22.3585L11.5671 22.3624L11.5688 22.3637L11.5695 22.3641ZM9.75 9.75C9.75 8.50736 10.7574 7.5 12 7.5C13.2426 7.5 14.25 8.50736 14.25 9.75C14.25 10.9926 13.2426 12 12 12C10.7574 12 9.75 10.9926 9.75 9.75ZM12 6C9.92893 6 8.25 7.67893 8.25 9.75C8.25 11.8211 9.92893 13.5 12 13.5C14.0711 13.5 15.75 11.8211 15.75 9.75C15.75 7.67893 14.0711 6 12 6Z"></path></svg><p class="line-clamp-4 min-h-20 flex-1 overflow-hidden">Sodic Eastown EDNC, Building 6, 1st floor, office 2, New Cairo 1, Cairo Governorate, Egypt The entrance gate number is 8 or 9</p></div><div class="flex items-start gap-2 text-sm"><svg aria-label="Clock icon" class="mt-0.5 w-4 fill-on-surface" role="img" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C8.27614 4 8.5 4.22386 8.5 4.5V7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5H8C7.72386 8.5 7.5 8.27614 7.5 8V4.5C7.5 4.22386 7.72386 4 8 4Z"></path></svg><p class="flex-1">Open 5 days a week</p></div></div></div><div class="flex flex-col items-center gap-4"><a href="/en-us/country/eg/vac/egHAC2de"><button type="button" class="TlsButton_tls-button__syUS5 TlsButton_--filled__1vb1H TlsButton_primary__sPypD TlsButton_--base__NfSqN mx-auto" data-testid="btn-select-vac">Continue</button></a></div></div></div></div></li><li class="relative z-0"><div class="relative z-10 h-full"><div class="TlsVacCard_tls-vac-card__DLGQr"><div class="TlsVacCard_tls-vac-card_image__7pHvU"><img alt="A vibrant city skyline with iconic landmarks and bustling streets, showcasing urban energy and charm" decoding="async" data-nimg="fill" class="!object-cover" sizes="17rem" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffa0bfdf4-56db-4a4c-8eff-d5d3a93fdac8&amp;w=3840&amp;q=75" style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"></div><div class="TlsVacCard_tls-vac-card_content__v2gMH"><div><p class="TlsVacCard_tls-vac-card_title__qk6jS">El-Sheikh Zayed</p><div class="mt-4 flex flex-col gap-1"><div class="flex items-start gap-2 text-sm"><svg viewBox="0 0 24 24" class="mt-0.5 w-4 fill-on-surface" fill="none" role="img" aria-label="Location icon" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 12.855 17.0161 15.6822 15.184 17.7891C14.2772 18.832 13.3684 19.6729 12.6861 20.2528C12.4163 20.4821 12.1828 20.6699 12 20.8125C11.8172 20.6699 11.5837 20.4821 11.3139 20.2528C10.6316 19.6729 9.72283 18.832 8.81595 17.7891C6.98389 15.6822 5.25 12.855 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703ZM11.5695 22.3641C11.5697 22.3643 11.5699 22.3644 12 21.75L11.5699 22.3644C11.8281 22.5452 12.1719 22.5452 12.4301 22.3644L12 21.75C12.4301 22.3644 12.4303 22.3643 12.4305 22.3641L12.4312 22.3637L12.4329 22.3624L12.4385 22.3585L12.4575 22.345C12.4737 22.3334 12.4969 22.3167 12.5264 22.2952C12.5856 22.252 12.6706 22.189 12.7777 22.1071C12.9919 21.9434 13.2951 21.7038 13.6576 21.3957C14.3816 20.7803 15.3478 19.8867 16.316 18.7734C18.2339 16.5678 20.25 13.395 20.25 9.75C20.25 7.56196 19.3808 5.46354 17.8336 3.91637C16.2865 2.36919 14.188 1.5 12 1.5C9.81196 1.5 7.71354 2.36919 6.16637 3.91637C4.61919 5.46354 3.75 7.56196 3.75 9.75C3.75 13.395 5.76611 16.5678 7.68405 18.7734C8.65217 19.8867 9.61838 20.7803 10.3424 21.3957C10.7049 21.7038 11.0081 21.9434 11.2223 22.1071C11.3294 22.189 11.4144 22.252 11.4736 22.2952C11.5031 22.3167 11.5263 22.3334 11.5425 22.345L11.5502 22.3505L11.5615 22.3585L11.5671 22.3624L11.5688 22.3637L11.5695 22.3641ZM9.75 9.75C9.75 8.50736 10.7574 7.5 12 7.5C13.2426 7.5 14.25 8.50736 14.25 9.75C14.25 10.9926 13.2426 12 12 12C10.7574 12 9.75 10.9926 9.75 9.75ZM12 6C9.92893 6 8.25 7.67893 8.25 9.75C8.25 11.8211 9.92893 13.5 12 13.5C14.0711 13.5 15.75 11.8211 15.75 9.75C15.75 7.67893 14.0711 6 12 6Z"></path></svg><p class="line-clamp-4 min-h-20 flex-1 overflow-hidden">Building B9, the 3rd floor, Capital Business Park, Western Periphery of El-Sheikh Zayed City, 6th of October, Egypt</p></div><div class="flex items-start gap-2 text-sm"><svg aria-label="Clock icon" class="mt-0.5 w-4 fill-on-surface" role="img" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C8.27614 4 8.5 4.22386 8.5 4.5V7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5H8C7.72386 8.5 7.5 8.27614 7.5 8V4.5C7.5 4.22386 7.72386 4 8 4Z"></path></svg><p class="flex-1">Open 5 days a week</p></div></div></div><div class="flex flex-col items-center gap-4"><a href="/en-us/country/eg/vac/egCAI2de"><button type="button" class="TlsButton_tls-button__syUS5 TlsButton_--filled__1vb1H TlsButton_primary__sPypD TlsButton_--base__NfSqN mx-auto" data-testid="btn-select-vac">Continue</button></a></div></div></div></div></li><li class="relative z-0"><div class="relative z-10 h-full"><div class="TlsVacCard_tls-vac-card__DLGQr"><div class="TlsVacCard_tls-vac-card_image__7pHvU"><img alt="A vibrant city skyline with iconic landmarks and bustling streets, showcasing urban energy and charm" decoding="async" data-nimg="fill" class="!object-cover" sizes="17rem" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F3135d647-efd3-41c1-9a3f-1113115106ed&amp;w=3840&amp;q=75" style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"></div><div class="TlsVacCard_tls-vac-card_content__v2gMH"><div><p class="TlsVacCard_tls-vac-card_title__qk6jS">Alexandria</p><div class="mt-4 flex flex-col gap-1"><div class="flex items-start gap-2 text-sm"><svg viewBox="0 0 24 24" class="mt-0.5 w-4 fill-on-surface" fill="none" role="img" aria-label="Location icon" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 12.855 17.0161 15.6822 15.184 17.7891C14.2772 18.832 13.3684 19.6729 12.6861 20.2528C12.4163 20.4821 12.1828 20.6699 12 20.8125C11.8172 20.6699 11.5837 20.4821 11.3139 20.2528C10.6316 19.6729 9.72283 18.832 8.81595 17.7891C6.98389 15.6822 5.25 12.855 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703ZM11.5695 22.3641C11.5697 22.3643 11.5699 22.3644 12 21.75L11.5699 22.3644C11.8281 22.5452 12.1719 22.5452 12.4301 22.3644L12 21.75C12.4301 22.3644 12.4303 22.3643 12.4305 22.3641L12.4312 22.3637L12.4329 22.3624L12.4385 22.3585L12.4575 22.345C12.4737 22.3334 12.4969 22.3167 12.5264 22.2952C12.5856 22.252 12.6706 22.189 12.7777 22.1071C12.9919 21.9434 13.2951 21.7038 13.6576 21.3957C14.3816 20.7803 15.3478 19.8867 16.316 18.7734C18.2339 16.5678 20.25 13.395 20.25 9.75C20.25 7.56196 19.3808 5.46354 17.8336 3.91637C16.2865 2.36919 14.188 1.5 12 1.5C9.81196 1.5 7.71354 2.36919 6.16637 3.91637C4.61919 5.46354 3.75 7.56196 3.75 9.75C3.75 13.395 5.76611 16.5678 7.68405 18.7734C8.65217 19.8867 9.61838 20.7803 10.3424 21.3957C10.7049 21.7038 11.0081 21.9434 11.2223 22.1071C11.3294 22.189 11.4144 22.252 11.4736 22.2952C11.5031 22.3167 11.5263 22.3334 11.5425 22.345L11.5502 22.3505L11.5615 22.3585L11.5671 22.3624L11.5688 22.3637L11.5695 22.3641ZM9.75 9.75C9.75 8.50736 10.7574 7.5 12 7.5C13.2426 7.5 14.25 8.50736 14.25 9.75C14.25 10.9926 13.2426 12 12 12C10.7574 12 9.75 10.9926 9.75 9.75ZM12 6C9.92893 6 8.25 7.67893 8.25 9.75C8.25 11.8211 9.92893 13.5 12 13.5C14.0711 13.5 15.75 11.8211 15.75 9.75C15.75 7.67893 14.0711 6 12 6Z"></path></svg><p class="line-clamp-4 min-h-20 flex-1 overflow-hidden">3rd floor, 2 Patrice Lumumba St. Bab Sharky, Alexandria, Egypt</p></div><div class="flex items-start gap-2 text-sm"><svg aria-label="Clock icon" class="mt-0.5 w-4 fill-on-surface" role="img" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C8.27614 4 8.5 4.22386 8.5 4.5V7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5H8C7.72386 8.5 7.5 8.27614 7.5 8V4.5C7.5 4.22386 7.72386 4 8 4Z"></path></svg><p class="flex-1">Open 3 days a week</p></div></div></div><div class="flex flex-col items-center gap-4"><a href="/en-us/country/eg/vac/egALY2de"><button type="button" class="TlsButton_tls-button__syUS5 TlsButton_--filled__1vb1H TlsButton_primary__sPypD TlsButton_--base__NfSqN mx-auto" data-testid="btn-select-vac">Continue</button></a></div></div></div></div></li><li class="relative z-0"><div class="relative z-10 h-full"><div class="TlsVacCard_tls-vac-card__DLGQr"><div class="TlsVacCard_tls-vac-card_image__7pHvU"><img alt="A vibrant city skyline with iconic landmarks and bustling streets, showcasing urban energy and charm" decoding="async" data-nimg="fill" class="!object-cover" sizes="17rem" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=16&amp;q=75 16w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=32&amp;q=75 32w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=48&amp;q=75 48w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=64&amp;q=75 64w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=96&amp;q=75 96w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=128&amp;q=75 128w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=256&amp;q=75 256w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=384&amp;q=75 384w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=640&amp;q=75 640w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=750&amp;q=75 750w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=828&amp;q=75 828w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=1080&amp;q=75 1080w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=1200&amp;q=75 1200w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=1920&amp;q=75 1920w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=2048&amp;q=75 2048w, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=3840&amp;q=75 3840w" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F2ba5d797-16d9-43d4-817c-c9e7aa6046bb&amp;w=3840&amp;q=75" style="position: absolute; height: 100%; width: 100%; inset: 0px; color: transparent;"></div><div class="TlsVacCard_tls-vac-card_content__v2gMH"><div><p class="TlsVacCard_tls-vac-card_title__qk6jS">Hurghada</p><div class="mt-4 flex flex-col gap-1"><div class="flex items-start gap-2 text-sm"><svg viewBox="0 0 24 24" class="mt-0.5 w-4 fill-on-surface" fill="none" role="img" aria-label="Location icon" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M7.22703 4.97703C8.4929 3.71116 10.2098 3 12 3C13.7902 3 15.5071 3.71116 16.773 4.97703C18.0388 6.2429 18.75 7.95979 18.75 9.75C18.75 12.855 17.0161 15.6822 15.184 17.7891C14.2772 18.832 13.3684 19.6729 12.6861 20.2528C12.4163 20.4821 12.1828 20.6699 12 20.8125C11.8172 20.6699 11.5837 20.4821 11.3139 20.2528C10.6316 19.6729 9.72283 18.832 8.81595 17.7891C6.98389 15.6822 5.25 12.855 5.25 9.75C5.25 7.95979 5.96116 6.2429 7.22703 4.97703ZM11.5695 22.3641C11.5697 22.3643 11.5699 22.3644 12 21.75L11.5699 22.3644C11.8281 22.5452 12.1719 22.5452 12.4301 22.3644L12 21.75C12.4301 22.3644 12.4303 22.3643 12.4305 22.3641L12.4312 22.3637L12.4329 22.3624L12.4385 22.3585L12.4575 22.345C12.4737 22.3334 12.4969 22.3167 12.5264 22.2952C12.5856 22.252 12.6706 22.189 12.7777 22.1071C12.9919 21.9434 13.2951 21.7038 13.6576 21.3957C14.3816 20.7803 15.3478 19.8867 16.316 18.7734C18.2339 16.5678 20.25 13.395 20.25 9.75C20.25 7.56196 19.3808 5.46354 17.8336 3.91637C16.2865 2.36919 14.188 1.5 12 1.5C9.81196 1.5 7.71354 2.36919 6.16637 3.91637C4.61919 5.46354 3.75 7.56196 3.75 9.75C3.75 13.395 5.76611 16.5678 7.68405 18.7734C8.65217 19.8867 9.61838 20.7803 10.3424 21.3957C10.7049 21.7038 11.0081 21.9434 11.2223 22.1071C11.3294 22.189 11.4144 22.252 11.4736 22.2952C11.5031 22.3167 11.5263 22.3334 11.5425 22.345L11.5502 22.3505L11.5615 22.3585L11.5671 22.3624L11.5688 22.3637L11.5695 22.3641ZM9.75 9.75C9.75 8.50736 10.7574 7.5 12 7.5C13.2426 7.5 14.25 8.50736 14.25 9.75C14.25 10.9926 13.2426 12 12 12C10.7574 12 9.75 10.9926 9.75 9.75ZM12 6C9.92893 6 8.25 7.67893 8.25 9.75C8.25 11.8211 9.92893 13.5 12 13.5C14.0711 13.5 15.75 11.8211 15.75 9.75C15.75 7.67893 14.0711 6 12 6Z"></path></svg><p class="line-clamp-4 min-h-20 flex-1 overflow-hidden">291. Al Kawther Division  Unit No. A, on the ground floor of the property,  Infront of CIB bank, beside The Egyptian National Security Agency  Hurghada, Red Sea, Egypt</p></div><div class="flex items-start gap-2 text-sm"><svg aria-label="Clock icon" class="mt-0.5 w-4 fill-on-surface" role="img" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M8 2.5C4.96243 2.5 2.5 4.96243 2.5 8C2.5 11.0376 4.96243 13.5 8 13.5C11.0376 13.5 13.5 11.0376 13.5 8C13.5 4.96243 11.0376 2.5 8 2.5ZM1.5 8C1.5 4.41015 4.41015 1.5 8 1.5C11.5899 1.5 14.5 4.41015 14.5 8C14.5 11.5899 11.5899 14.5 8 14.5C4.41015 14.5 1.5 11.5899 1.5 8Z"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M8 4C8.27614 4 8.5 4.22386 8.5 4.5V7.5H11.5C11.7761 7.5 12 7.72386 12 8C12 8.27614 11.7761 8.5 11.5 8.5H8C7.72386 8.5 7.5 8.27614 7.5 8V4.5C7.5 4.22386 7.72386 4 8 4Z"></path></svg><p class="flex-1">Open 5 days a week</p></div></div></div><div class="flex flex-col items-center gap-4"><a href="/en-us/country/eg/vac/egHRG2de"><button type="button" class="TlsButton_tls-button__syUS5 TlsButton_--filled__1vb1H TlsButton_primary__sPypD TlsButton_--base__NfSqN mx-auto" data-testid="btn-select-vac">Continue</button></a></div></div></div></div></li></ul></div><div class="mx-auto p-4 md:container md:p-0"><div class="TlsBannerCarousel_tls-banner-carousel__6Yiso sm:hidden" aria-roledescription="carousel" role="group"><div aria-live="off"><div aria-label="1 of 1" aria-roledescription="slide" role="group" data-id="carousel-item"><div><a class="relative block aspect-[7] cursor-pointer overflow-hidden rounded-lg bg-surface-container-high bg-cover bg-center bg-no-repeat" href="https://visas-de.tlscontact.com/en-us/country/eg/vac/egCAI2de/insurte" aria-label="Learn more about it" data-dd-action-name="BannerItem insurance" style="background-image: url(&quot;https://static.tlscontact.com/media/insurte_english_banner.jpg&quot;);"></a></div></div></div></div><div class="TlsBannerCarousel_tls-banner-carousel__6Yiso max-sm:hidden" aria-roledescription="carousel" role="group"><div aria-live="off"><div aria-label="1 of 1" aria-roledescription="slide" role="group" data-id="carousel-item"><div><a class="relative block aspect-[7] cursor-pointer overflow-hidden rounded-lg bg-surface-container-high bg-cover bg-center bg-no-repeat" href="https://visas-de.tlscontact.com/en-us/country/eg/vac/egCAI2de/insurte" aria-label="Learn more about it" data-dd-action-name="BannerItem insurance" style="background-image: url(&quot;https://static.tlscontact.com/media/insurte_english_banner.jpg&quot;);"></a></div></div></div></div></div></div></div></div><footer class="relative bg-footer p-10 px-6 py-8 shadow-[0_-8px_20px_rgba(0,0,0,.08)] print:hidden"><div class="container mx-auto"><div class="grid grid-cols-2 content-between items-center justify-between gap-y-6 md:grid-cols-3"><a href="/en-us" class="justify-self-start md:col-span-2 lg:col-auto"><img alt="company logo" width="140" height="35" decoding="async" data-nimg="1" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffb60a0bb-8c69-48ae-8c83-2dffdde46a34&amp;w=256&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffb60a0bb-8c69-48ae-8c83-2dffdde46a34&amp;w=384&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2Ffb60a0bb-8c69-48ae-8c83-2dffdde46a34&amp;w=384&amp;q=75" style="color: transparent;"></a><div class="col-span-4 row-start-2 text-center text-on-footer lg:col-span-1 lg:row-start-auto"><p>© 2026 TLScontact. All rights reserved.</p></div><div class="col-span-3 flex items-center gap-4 justify-self-end md:col-span-2 lg:col-auto"><img alt="W3C WAI-AA WCAG-2.1" loading="lazy" width="106" height="36" decoding="async" data-nimg="1" srcset="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F53bbb1ea-21d2-45da-bf27-2802c8f93f09&amp;w=128&amp;q=75 1x, /_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F53bbb1ea-21d2-45da-bf27-2802c8f93f09&amp;w=256&amp;q=75 2x" src="/_next/image?url=https%3A%2F%2Fcache-cms.directuscloud.tlscontact.com%2Fassets%2F53bbb1ea-21d2-45da-bf27-2802c8f93f09&amp;w=256&amp;q=75" style="color: transparent;"></div></div></div></footer></main><div class="toast fixed end-2 top-6 z-50 flex flex-col items-end sm:end-7"></div><script src="/_next/static/chunks/webpack-30f96451a97e1438.js" id="_R_" async=""></script><script>(self.__next_f=self.__next_f||[]).push([0])</script><script>self.__next_f.push([1,"1:\"$Sreact.fragment\"\n2:I[9766,[],\"\"]\n3:I[98924,[],\"\"]\n6:I[24431,[],\"OutletBoundary\"]\n8:I[15278,[],\"AsyncMetadataOutlet\"]\na:I[24431,[],\"ViewportBoundary\"]\nc:I[24431,[],\"MetadataBoundary\"]\nd:\"$Sreact.suspense\"\nf:I[57150,[],\"\"]\n10:I[41402,[\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"1306\",\"static/chunks/1306-45a92788e90a35ca.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"1937\",\"static/chunks/1937-475369ecb844e156.js\",\"5160\",\"static/chunks/app/%5Blang%5D/layout-408861f30818b2bc.js\"],\"\"]\n11:I[88781,[\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"1306\",\"static/chunks/1306-45a92788e90a35ca.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"1937\",\"static/chunks/1937-475369ecb844e156.js\",\"5160\",\"static/chunks/app/%5Blang%5D/layout-408861f30818b2bc.js\"],\"default\"]\n12:I[49501,[\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"1306\",\"static/chunks/1306-45a92788e90a35ca.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"1937\",\"static/chunks/1937-475369ecb844e156.js\",\"5160\",\"static/chunks/app/%5Blang%5D/layout-408861f30818b2bc.js\"],\"default\"]\n14:I[98177,[\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"1306\",\"static/chunks/1306-45a92788e90a35ca.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"1937\",\"static/chunks/1937-475369ecb844e156.js\",\"5160\",\"static/chunks/app/%5Blang%5D/layout-408861f30818b2bc.js\"],\"default\"]\n15:I[13435,[\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"1306\",\"static/chunks/1306-45a92788e90a35ca.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"1937\",\"static/chunks/1937-475369ecb844e156.js\",\"5160\",\"static/chunks/"])</script><script>self.__next_f.push([1,"app/%5Blang%5D/layout-408861f30818b2bc.js\"],\"default\"]\n1e:I[30706,[\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"1306\",\"static/chunks/1306-45a92788e90a35ca.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"1937\",\"static/chunks/1937-475369ecb844e156.js\",\"5160\",\"static/chunks/app/%5Blang%5D/layout-408861f30818b2bc.js\"],\"default\"]\n1f:I[513,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"7048\",\"static/chunks/app/%5Blang%5D/error-72acaacb33e14d13.js\"],\"default\"]\n20:I[45635,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"4803\",\"static/chunks/4803-d24c48a8c8c4d542.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"5226\",\"static/chunks/app/%5Blang%5D/not-found-80e8e328231b5908.js\"],\"default\"]\n23:I[81356,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"Image\"]\n24:I[70923,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n25:I[30601,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50"])</script><script>self.__next_f.push([1,"a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n2a:I[74494,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n2b:I[66769,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n2c:I[39246,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n2d:I[9798,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n2e:I[43939,[\"1356\",\"static/chunks/1356-814af99a1613cc1d.js\",\"2619\",\"static/chunks/2619-b8db57ac19da49ac.js\",\"6136\",\"static/chunks/6136-945ce8def6cf87c3.js\",\"3276\",\"static/chunks/3276-7e5c90ae87912373.js\",\"5157\",\"static/chunks/5157-716f39b8ea1e5cf6.js\",\"6824\",\"static/chunks/6824-c79054c2a50a995b.js\",\"810\",\"static/chunks/app/%5Blang%5D/(splash)/page-26ba5cf68278242c.js\"],\"default\"]\n2f:I[80622,[],\"IconMark\"]\n:HL[\"/_next/sta"])</script><script>self.__next_f.push([1,"tic/media/e807dee2426166ad-s.p.woff2\",\"font\",{\"crossOrigin\":\"\",\"type\":\"font/woff2\"}]\n:HL[\"/_next/static/css/4a300a7f839274a6.css\",\"style\"]\n:HL[\"/_next/static/css/f0441552670f7a24.css\",\"style\"]\n:HL[\"/_next/static/css/f547d6e20863a62f.css\",\"style\"]\n"])</script><script>self.__next_f.push([1,"0:{\"P\":null,\"b\":\"GplKF-Gq0ogCx5bJpihIT\",\"p\":\"\",\"c\":[\"\",\"en-us\"],\"i\":false,\"f\":[[[\"\",{\"children\":[[\"lang\",\"en-us\",\"d\"],{\"children\":[\"(splash)\",{\"children\":[\"__PAGE__\",{}]}]},\"$undefined\",\"$undefined\",true]}],[\"\",[\"$\",\"$1\",\"c\",{\"children\":[null,[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L3\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":[[[\"$\",\"title\",null,{\"children\":\"404: This page could not be found.\"}],[\"$\",\"div\",null,{\"style\":{\"fontFamily\":\"system-ui,\\\"Segoe UI\\\",Roboto,Helvetica,Arial,sans-serif,\\\"Apple Color Emoji\\\",\\\"Segoe UI Emoji\\\"\",\"height\":\"100vh\",\"textAlign\":\"center\",\"display\":\"flex\",\"flexDirection\":\"column\",\"alignItems\":\"center\",\"justifyContent\":\"center\"},\"children\":[\"$\",\"div\",null,{\"children\":[[\"$\",\"style\",null,{\"dangerouslySetInnerHTML\":{\"__html\":\"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}\"}}],[\"$\",\"h1\",null,{\"className\":\"next-error-h1\",\"style\":{\"display\":\"inline-block\",\"margin\":\"0 20px 0 0\",\"padding\":\"0 23px 0 0\",\"fontSize\":24,\"fontWeight\":500,\"verticalAlign\":\"top\",\"lineHeight\":\"49px\"},\"children\":404}],[\"$\",\"div\",null,{\"style\":{\"display\":\"inline-block\"},\"children\":[\"$\",\"h2\",null,{\"style\":{\"fontSize\":14,\"fontWeight\":400,\"lineHeight\":\"49px\",\"margin\":0},\"children\":\"This page could not be found.\"}]}]]}]}]],[]],\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\"}]]}],{\"children\":[[\"lang\",\"en-us\",\"d\"],[\"$\",\"$1\",\"c\",{\"children\":[[[\"$\",\"link\",\"0\",{\"rel\":\"stylesheet\",\"href\":\"/_next/static/css/4a300a7f839274a6.css\",\"precedence\":\"next\",\"crossOrigin\":\"$undefined\",\"nonce\":\"$undefined\"}],[\"$\",\"link\",\"1\",{\"rel\":\"stylesheet\",\"href\":\"/_next/static/css/f0441552670f7a24.css\",\"precedence\":\"next\",\"crossOrigin\":\"$undefined\",\"nonce\":\"$undefined\"}],[\"$\",\"link\",\"2\",{\"rel\":\"stylesheet\",\"href\":\"/_next/static/css/f547d6e20863a62f.css\",\"precedence\":\"next\",\"crossOrigin\":\"$undefined\",\"nonce\":\"$undefined\"}]],\"$L4\"]}],{\"children\":[\"(splash)\",[\"$\",\"$1\",\"c\",{\"children\":[null,[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$undefined\",\"errorStyles\":\"$undefined\",\"errorScripts\":\"$undefined\",\"template\":[\"$\",\"$L3\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":\"$undefined\",\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\"}]]}],{\"children\":[\"__PAGE__\",[\"$\",\"$1\",\"c\",{\"children\":[\"$L5\",null,[\"$\",\"$L6\",null,{\"children\":[\"$L7\",[\"$\",\"$L8\",null,{\"promise\":\"$@9\"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],[\"$\",\"$1\",\"h\",{\"children\":[null,[[\"$\",\"$La\",null,{\"children\":\"$Lb\"}],[\"$\",\"meta\",null,{\"name\":\"next-size-adjust\",\"content\":\"\"}]],[\"$\",\"$Lc\",null,{\"children\":[\"$\",\"div\",null,{\"hidden\":true,\"children\":[\"$\",\"$d\",null,{\"fallback\":null,\"children\":\"$Le\"}]}]}]]}],false]],\"m\":\"$undefined\",\"G\":[\"$f\",[]],\"s\":false,\"S\":false}\n"])</script><script>self.__next_f.push([1,"b:[[\"$\",\"meta\",\"0\",{\"charSet\":\"utf-8\"}],[\"$\",\"meta\",\"1\",{\"name\":\"viewport\",\"content\":\"width=device-width, initial-scale=1\"}]]\n7:null\n16:T605,"])</script><script>self.__next_f.push([1,"Ces conditions générales constitueront le contrat régissant la fourniture de services au demandeur par TLScontact. Par la présente, vous reconnaissez et confirmez, avant le dépôt de votre demande de visa, avoir lu, compris et accepté, sans limite ni réserve, ces conditions générales. Vous pouvez accéder à ces conditions générales à tout moment sur le site internet de TLScontact afin de les consulter. Tous les amendements, les modifications, les ajouts ou les retraits pouvant occasionnellement être apportés à ces conditions générales seront publiés sur le site internet de TLScontact. Ces conditions générales modifiées, telles qu'affichées sur le site internet de TLScontact, prévaudront sur toute version antérieure et sur tout autre document contradictoire. Sauf preuve évidente du contraire, les données enregistrées dans le système d'information de TLScontact constitueront une preuve de toutes les transactions conclues par le demandeur avec TLScontact. Ces conditions générales ne sont applicables à aucun service fourni ni à aucune décision prise concernant votre demande de visa par l'Ambassade de France, y compris le paiement de vos droits de visa. Par la présente, vous reconnaissez et acceptez que TLScontact est un intermédiaire entre vous et l'Ambassade de France, intervenant en qualité d'agent de celle-ci, et qu'aucune réclamation concernant les décisions prises au sujet de votre demande de visa ou d'un remboursement des droits de visa ne devra être adressée à TLScontact."])</script><script>self.__next_f.push([1,"17:T59c,"])</script><script>self.__next_f.push([1,"Le cas échéant, les demandeurs ont la possibilité de sélectionner des services additionnels sur le site internet de TLScontact au moment de la prise de rendez-vous, ou de demander ces services additionnels via le centre d'appels de TLScontact ou directement lors d'une visite au centre de collecte de demandes de visa. TLScontact peut offrir des services additionnels liés au processus de demande de visa moyennant le paiement de frais supplémentaires au centre de collecte de demandes de visa ou, le cas échéant, sur le site internet de TLScontact. Les services additionnels sont facultatifs et ne garantissent pas que votre visa sera accordé ni que le traitement de votre demande de visa aura priorité sur celui des autres demandes. TLScontact n'acceptera aucune réservation ni commande de service si le demandeur n'a pas confirmé lors de son inscription, de la façon que TLScontact juge appropriée, qu'il accepte de respecter ces conditions générales. Cette confirmation constitue la preuve de la conclusion du contrat de fourniture de services avec le demandeur. Aucune réservation de services ne sera finalisée tant que TLScontact n'aura pas accepté la commande et reçu le paiement intégral des frais liés à la demande de visa. TLScontact se réserve le droit d'annuler ou de refuser toute commande de service en cas de litige existant avec le demandeur lié au paiement de commandes de service antérieures."])</script><script>self.__next_f.push([1,"18:T641,"])</script><script>self.__next_f.push([1,"Les frais indiqués ne sont valides que le jour où ils sont établis. Pour toute demande de visa à une date ultérieure, les frais peuvent être sujets à modification. Les droits de visa perçus par TLScontact pour le compte de l'Ambassade de France et les frais de service de TLScontact sont fixés en euros, mais payables dans la devise du pays où se trouve le centre de visas. Le taux de change entre ces devises est décidé par l'Ambassade de France et est sujet à variation, raison pour laquelle le montant à payer dans la devise locale peut différer de celui établi. Tous les frais liés à la demande de visa sont fermes, incluent la taxe sur la valeur ajoutée et sont affichés sur le site internet de TLScontact et dans le centre de visas. Tous les coûts liés au retour des passeports, des documents complémentaires et des décisions au sujet des visas aux demandeurs sont inclus dans le prix total final qui se fonde sur les informations que les demandeurs ont fournies et les méthodes de livraison qu'ils ont choisies parmi celles disponibles. Tous les frais doivent être reçus dans leur intégralité selon les options de paiement disponibles en tant que fonds compensés pour que la demande soit traitée. À l'exception des cas couverts par notre politique de remboursement détaillée ci-après, les frais ne sont pas remboursables ni transférables une fois le service prêté ou la demande transférée à l'Ambassade de France, et ce, que le visa soit finalement octroyé ou non par l'Ambassade de France ou que vous décidiez ou non de retirer votre demande de visa."])</script><script>self.__next_f.push([1,"19:T53e,"])</script><script>self.__next_f.push([1,"Les frais de service et les frais de services additionnels (ci-après dénommés « Frais de TLScontact ») sont payables en totalité le jour où vous prenez rendez-vous pour déposer votre demande de visa ou ultérieurement lorsque vous arrivez au centre de visas pour votre rendez-vous, au moyen des méthodes suivantes, en fonction du moment où vous payez les frais de TLScontact, comme indiqué sur le site internet de TLScontact: en espèces; par carte de crédit/débit et, pour les paiements à distance (en ligne, par téléphone, etc.), par un mode de paiement sécurisé; par virement bancaire ou tout autre mode de paiement accepté par TLScontact. TLScontact remettra au demandeur un récépissé de la transaction après réception du paiement des frais de TLScontact et des droits de Visa. Les frais et les intérêts qui pourraient résulter de l'utilisation du mode de paiement disponible sont à la charge du demandeur. Les données de paiement sont chiffrées avant le transfert à l'aide du protocole SSL (Secure Sockets Layer). TLScontact n'est tenu de fournir aucun service si les frais de TLScontact n'ont pas été payés en totalité. Les paiements ne seront pas considérés comme effectués tant que TLScontact n'aura pas dûment reçu tous les frais liés à la demande de visa en fonds compensés et disponibles."])</script><script>self.__next_f.push([1,"1a:T76b,"])</script><script>self.__next_f.push([1,"TLScontact s'engage à faire tout effort raisonnable afin de fournir les services aux demandeurs à la date de rendez-vous qu'ils ont choisie. TLScontact traitera toutes les demandes de visa avec une diligence et une compétence raisonnable et conformément à toutes les procédures prescrites par l'Ambassade de France. Néanmoins, bien que nous fassions preuve d'une diligence raisonnable pour examiner votre formulaire de demande afin de détecter des erreurs manifestes, nous ne garantissons pas la détection de toutes les erreurs qui pourraient y figurer, et nous ne nous engageons pas à vérifier les informations que vous fournissez. Il vous appartient de vous assurer que toutes les informations et tous les documents que vous fournissez sont précis, exacts et à jour. TLScontact décline toute responsabilité en cas de retard dans la fourniture de services causé par un événement ou un tiers échappant au contrôle de TLScontact. Les délais de réception des décisions de l'Ambassade de France relatives à votre demande de visa ne sont que des estimations fondées sur les informations dont nous disposons et sur notre expérience avec l'Ambassade de France. TLScontact n'exerce aucune influence sur ces délais et ne peut donc pas les garantir. Il incombe aux demandeurs de lire attentivement et de s'assurer de comprendre les exigences définies dans les formulaires de demande de visa, de remplir ces formulaires de façon honnête avec des informations correctes et précises, de fournir les documents complémentaires corrects, de s'assurer qu'ils ont un passeport valide (non endommagé ni expiré) et de vérifier la validité du visa délivré dès réception. Les demandeurs doivent fournir des coordonnées valides à TLScontact afin que celle-ci puisse les joindre en cas de problème avec leur demande de visa ou si des documents supplémentaires sont nécessaires."])</script><script>self.__next_f.push([1,"1b:T744,"])</script><script>self.__next_f.push([1,"L'Ambassade de France ne délègue aucune compétence ni aucun pouvoir à TLScontact en ce qui concerne l'évaluation des demandes de visa ou la prise de décisions relatives aux demandes de visa. Par conséquent, TLScontact décline toute responsabilité à l'égard des décisions prises par l'Ambassade de France concernant votre demande de visa ainsi que tout retard de l'Ambassade de France dans l'évaluation, la concession ou le rejet de votre demande de visa ou pour la requête de plus amples informations concernant votre demande de visa. TLScontact décline toute responsabilité en cas de perte, de retard ou de non-délivrance de toute demande de visa ou de tout visa découlant, entre autres, de formulaires de demande incomplets, de formulaires de demande remplis de façon incorrecte ou inexacte, ou d'informations ou documents complémentaires imprécis, incomplets ou erronés. TLScontact ne doit pas être considérée comme ayant violé le contrat ni être aucunement tenue responsable en cas de retard, de perte ou de dommage concernant tout passeport, tout autre document ou toute demande de visa causé par un événement échappant au contrôle de TLScontact. TLScontact ne peut être tenue responsable en cas de retard, de perte ou de dommage concernant toute demande de visa, tout passeport ou tout autre document causé par un service de messagerie tiers. Dans le cas exceptionnel où un passeport ou tout autre document envoyé par le demandeur est perdu ou sérieusement endommagé en raison d'une grave négligence commise par TLScontact, cette dernière remboursera au demandeur les frais de service uniquement ainsi que les frais facturés par le gouvernement du pays émetteur du passeport du demandeur pour le remplacement du passeport ou de tout autre document perdu ou endommagé selon sa procédure normale de remplacement."])</script><script>self.__next_f.push([1,"1c:T4b1,"])</script><script>self.__next_f.push([1,"L'entité responsable du traitement des données collectées pour votre demande de visa est SARL TLS Contact. TLScontact collecte des données à caractère personnel concernant les demandeurs dans le cadre des demandes de visa Schengen, notamment les informations fournies à travers les formulaires de demande imprimés ou en ligne, les passeports et autres documents. TLScontact ne demande, ne collecte et ne traite que les données à caractère personnel strictement nécessaires à la fourniture des services sujets à ces conditions générales. Par la présente, vous consentez à la collecte, au stockage, au traitement et à la transmission de vos données à caractère personnel par TLScontact, ainsi qu'au transfert transfrontalier de celles-ci, si nécessaire, lors du processus de demande de visa avec l'Ambassade de France. Conformément aux règlementations applicables, les demandeurs peuvent avoir certains droits sur le traitement de leurs données à caractère personnel, comme le droit d'information, d'accès, de modification, de rectification ou de suppression, le droit de s'opposer à leur traitement et de le restreindre, ainsi que le droit à la portabilité des données."])</script><script>self.__next_f.push([1,"4:[\"$\",\"html\",null,{\"data-theme\":\"$undefined\",\"lang\":\"en-us\",\"dir\":\"ltr\",\"children\":[\"$\",\"body\",null,{\"className\":\"__className_2fad4c\",\"children\":[[\"$\",\"$L10\",null,{\"src\":\"https://cmp.osano.com/AzqL4lT4Pea7o2XE9/c9db9abf-709d-4404-9b82-fbe51b312b5f/osano.js\"}],[\"$\",\"$L11\",null,{\"rumConfig\":{\"applicationId\":\"be7eb733-6f50-4cc5-80e1-3e2a9d78fa3d\",\"clientToken\":\"pubb5612748c6b425689c86ba99c1917d82\",\"env\":\"production\",\"version\":\"2026-06-05-4067ec1a\",\"service\":\"tlscitizen-webapp-v2-ssr\",\"kubeNamespace\":\"$undefined\"}}],[\"$\",\"$L12\",null,{\"lang\":\"en-us\",\"children\":[\"$L13\",[\"$\",\"$L14\",null,{\"children\":[\"$\",\"$L15\",null,{\"lang\":\"en-us\",\"messages\":{\"common.back\":[{\"type\":0,\"value\":\"Back\"}],\"common.cancel\":[{\"type\":0,\"value\":\"Cancel\"}],\"common.confirm\":[{\"type\":0,\"value\":\"Confirm\"}],\"common.login\":[{\"type\":0,\"value\":\"Login\"}],\"common.next\":[{\"type\":0,\"value\":\"Next\"}],\"common.ok\":[{\"type\":0,\"value\":\"Ok\"}],\"common.tryAgain\":[{\"type\":0,\"value\":\"Try again\"}],\"deviceLink.assistance.install.content\":[{\"type\":8,\"value\":\"p\",\"children\":[{\"type\":0,\"value\":\"If you’re unable to install or use the mobile app, your device may not meet the minimum requirements.\"}]},{\"type\":8,\"value\":\"ul\",\"children\":[{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Android: Version 8.0 or later\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"iOS: Version 14.0 or later\"}]}]},{\"type\":8,\"value\":\"p\",\"children\":[{\"type\":0,\"value\":\"Please update your device to a supported operating system. Older devices that no longer receive updates may not be compatible.\"}]}],\"deviceLink.assistance.install.title\":[{\"type\":0,\"value\":\"You are unable to install or use the mobile app on your device.\"}],\"deviceLink.assistance.rfid.content\":[{\"type\":0,\"value\":\"After finishing the identity verification, if the document does not contain a chip, the data is extracted using OCR (Optical Character Recognition). Since OCR reads visible text instead of chip data, it may introduce minor inconsistencies, sometimes requiring further validation or adjustments.\"}],\"deviceLink.assistance.rfid.title\":[{\"type\":0,\"value\":\"Your document doesn't have a chip.\"}],\"deviceLink.assistance.title\":[{\"type\":0,\"value\":\"Need Assistance?\"}],\"deviceLink.confirmIdentity.autoUpdate\":[{\"type\":0,\"value\":\"We’ll update this screen automatically\"}],\"deviceLink.confirmIdentity.cantScan\":[{\"type\":0,\"value\":\"Can’t scan the code? \"},{\"type\":8,\"value\":\"link\",\"children\":[{\"type\":0,\"value\":\"Get help\"}]}],\"deviceLink.confirmIdentity.instruction1\":[{\"type\":0,\"value\":\"Follow the steps on your phone to scan your ID.\"}],\"deviceLink.confirmIdentity.instruction2\":[{\"type\":0,\"value\":\"Keep this window open.\"}],\"deviceLink.confirmIdentity.scanQR\":[{\"type\":0,\"value\":\"Scan the QR code to start.\"}],\"deviceLink.confirmIdentity.title\":[{\"type\":0,\"value\":\"Confirm your identity\"}],\"deviceLink.failure.agentsAvailable\":[{\"type\":0,\"value\":\"Our agents are available 24/7 to assist you with this process.\"}],\"deviceLink.failure.description\":[{\"type\":0,\"value\":\"Your automated identity verification could not be completed at this time. To proceed with your application, you must speak with one of our customer support agents via a secure video call.\"}],\"deviceLink.failure.documentsReady\":[{\"type\":0,\"value\":\"Please have your original identity documents ready before starting the call.\"}],\"deviceLink.failure.processing\":[{\"type\":0,\"value\":\"Processing your request\"}],\"deviceLink.failure.retryButton\":[{\"type\":0,\"value\":\"Do the verification again\"}],\"deviceLink.failure.subtitle\":[{\"type\":0,\"value\":\"We need a bit more information to verify your identity.\"}],\"deviceLink.failure.title\":[{\"type\":0,\"value\":\"Verification Incomplete\"}],\"deviceLink.failure.videoCallButton\":[{\"type\":0,\"value\":\"Start video call now\"}],\"deviceLink.ongoing.description\":[{\"type\":0,\"value\":\"To complete your verification, please use the mobile app and follow the instructions below:\"}],\"deviceLink.ongoing.step1.description\":[{\"type\":0,\"value\":\"In the app, scan the biographical data page of your document. Place it flat within the frame, making sure all text is clearly visible and there are no reflections.\"}],\"deviceLink.ongoing.step1.title\":[{\"type\":0,\"value\":\"Document scan\"}],\"deviceLink.ongoing.step2.description\":[{\"type\":0,\"value\":\"Using the app, place your phone against your document and hold it steady until the chip is successfully read.\"}],\"deviceLink.ongoing.step2.title\":[{\"type\":0,\"value\":\"Document chip reading\"}],\"deviceLink.ongoing.step3.description\":[{\"type\":0,\"value\":\"In the app, look directly at your phone’s camera and follow the on-screen instructions to confirm your presence.\"}],\"deviceLink.ongoing.step3.title\":[{\"type\":0,\"value\":\"Liveness verification\"}],\"deviceLink.ongoing.title\":[{\"type\":0,\"value\":\"Verification in progress\"}],\"deviceLink.preparation.document.description\":[{\"type\":0,\"value\":\"Make sure your document is valid and easily accessible\"}],\"deviceLink.preparation.document.title\":[{\"type\":0,\"value\":\"Have your document ready\"}],\"deviceLink.preparation.nfc.description\":[{\"type\":0,\"value\":\"Make sure NFC is enabled on your smartphone before starting\"}],\"deviceLink.preparation.nfc.title\":[{\"type\":0,\"value\":\"Enable NFC\"}],\"deviceLink.preparation.smartphone.description\":[{\"type\":0,\"value\":\"You'll need a smartphone with NFC capability to scan your document\"}],\"deviceLink.preparation.smartphone.title\":[{\"type\":0,\"value\":\"Use your smartphone\"}],\"deviceLink.preparation.support\":[{\"type\":0,\"value\":\"Get support with mobile identity verification?\"}],\"deviceLink.preparation.title\":[{\"type\":0,\"value\":\"Preparation\"}],\"deviceLink.scan.expiration\":[{\"type\":0,\"value\":\"The QR code will expire in \"},{\"type\":8,\"value\":\"timer\",\"children\":[]},{\"type\":0,\"value\":\"m\"}],\"deviceLink.scan.expiration.mobile\":[{\"type\":0,\"value\":\"The link will expire in \"},{\"type\":8,\"value\":\"timer\",\"children\":[]},{\"type\":0,\"value\":\"m\"}],\"deviceLink.scan.mobileTitleHeader\":[{\"type\":0,\"value\":\"Identity Verification\"}],\"deviceLink.scan.or\":[{\"type\":0,\"value\":\"or\"}],\"deviceLink.scan.subtitle\":[{\"type\":0,\"value\":\"Use your smartphone to scan the QR code\"}],\"deviceLink.scan.subtitle.mobile\":[{\"type\":0,\"value\":\"Use your smartphone to start the verification\"}],\"deviceLink.scan.title\":[{\"type\":0,\"value\":\"Scan to Continue\"}],\"deviceLink.scan.title.mobile\":[{\"type\":0,\"value\":\"Tap to Continue\"}],\"digitalSelfUpload.pageDescription\":[{\"type\":0,\"value\":\"Upload any documents that support your application. You can add multiple files and review them before submitting.\"}],\"digitalSelfUpload.pageTitle\":[{\"type\":0,\"value\":\"Upload Documents\"}],\"digitalSelfUpload.skipButton\":[{\"type\":0,\"value\":\"Skip upload\"}],\"digitalSelfUpload.skipHintLinkText\":[{\"type\":0,\"value\":\"you can skip this step\"}],\"digitalSelfUpload.skipHintPrefix\":[{\"type\":0,\"value\":\"If you are unsure which documents to provide, \"}],\"digitalSelfUpload.skipHintSuffix\":[{\"type\":0,\"value\":\", pay the Assisted Service fee, and call us for expert support.\"}],\"error.message\":[{\"type\":0,\"value\":\"It looks like something went wrong. We apologise for the inconvenience. Please try to refresh the page or go back. If this does not solve the issue, please report this error below to help us fix the issue.\"}],\"error.title.line2\":[{\"type\":0,\"value\":\"Something went wrong\"}],\"errorCode\":[{\"type\":0,\"value\":\"Error code:\"}],\"exam.confirmIdentity.button\":[{\"type\":0,\"value\":\"Verify Identity\"}],\"exam.confirmIdentity.description\":[{\"type\":0,\"value\":\"Please verify your identity to start the test. Make sure you have your ID or Passport at hand.\"}],\"exam.confirmIdentity.title\":[{\"type\":0,\"value\":\"Ready to begin?\"}],\"exam.identityVerificationFailed.button\":[{\"type\":0,\"value\":\"Contact center\"}],\"exam.identityVerificationFailed.description\":[{\"type\":0,\"value\":\"We couldn't confirm your identity—please contact our support team to continue.\"}],\"exam.identityVerificationFailed.title\":[{\"type\":0,\"value\":\"Verification unsuccessful\"}],\"exam.startExam.button\":[{\"type\":0,\"value\":\"Start test\"}],\"exam.startExam.description\":[{\"type\":0,\"value\":\"Your exam is now available—start whenever you're ready.\"}],\"exam.startExam.title\":[{\"type\":0,\"value\":\"You're ready to begin\"}],\"exam.waitingExamDay.description\":[{\"type\":0,\"value\":\"You will be able to access the test here on your scheduled test day.\"}],\"exam.waitingExamDay.onboardingSetup\":[{\"type\":0,\"value\":\"Please complete the \"},{\"type\":8,\"value\":\"a\",\"children\":[{\"type\":0,\"value\":\"Test Onboarding Setup\"}]},{\"type\":0,\"value\":\" to ensure your system is ready. We recommend completing it at least 24 hours in advance.\"}],\"exam.waitingExamDay.title\":[{\"type\":0,\"value\":\"Your test day is coming\"}],\"expiredSession.redirect\":[{\"type\":0,\"value\":\"You will be redirected automatically in 10 seconds.\"}],\"expiredSession.subtitle\":[{\"type\":0,\"value\":\"For security reasons, your session has expired. Please log in again to continue.\"}],\"expiredSession.title\":[{\"type\":0,\"value\":\"Session expired!\"}],\"maintenance.message\":[{\"type\":0,\"value\":\"We are currently working on improving your experience.\"}],\"maintenance.title.line2\":[{\"type\":0,\"value\":\"Our website is under maintenance\"}],\"moreInfo\":[{\"type\":0,\"value\":\"If you need more information on visa applications in the meantime please visit:\"}],\"notFound.message\":[{\"type\":0,\"value\":\"Please double check that the link is spelled correctly.\"}],\"notFound.title.line1\":[{\"type\":0,\"value\":\"Oh no!\"}],\"notFound.title.line2\":[{\"type\":0,\"value\":\"Page not found\"}],\"ocrFeature.cameraSelectionMessage\":[{\"type\":0,\"value\":\"Take a photo of your travel document\"}],\"ocrFeature.dialogSubTitle\":[{\"type\":0,\"value\":\"Start your application by uploading your travel document. We'll automatically extract key details - name, document number, and date of birth, to pre-fill your form\"}],\"ocrFeature.dialogTitle\":[{\"type\":0,\"value\":\"Upload document image\"}],\"ocrFeature.dragAndDropContent\":[{\"type\":0,\"value\":\"Uploads of 'jpg', 'jpeg', 'png', 'pdf' are allowed, with file size no large than 8MB\"}],\"ocrFeature.dragAndDropTitle\":[{\"type\":0,\"value\":\"Drag and drop files here or click here to select files from your browser\"}],\"ocrFeature.fileSizeError\":[{\"type\":0,\"value\":\"The selected file exceeds the maximum allowed size of 8MB. Please choose a smaller file.\"}],\"ocrFeature.fileTypeError\":[{\"type\":0,\"value\":\"The selected file type is not supported. Please upload\"}],\"ocrFeature.maxAttemptsErrorMessage\":[{\"type\":0,\"value\":\"Redirecting to manual mode\"}],\"ocrFeature.maxAttemptsErrorTitle\":[{\"type\":0,\"value\":\"Max attempts reached\"}],\"ocrFeature.mobileDragAndDrop\":[{\"type\":0,\"value\":\"Upload file\"}],\"ocrResult.dateOfBirth\":[{\"type\":0,\"value\":\"Date of birth\"}],\"ocrResult.documentExpiryDate\":[{\"type\":0,\"value\":\"Document Expiry Date\"}],\"ocrResult.documentImageAltText\":[{\"type\":0,\"value\":\"Scanned document image\"}],\"ocrResult.documentIssuingCountry\":[{\"type\":0,\"value\":\"Document Issuing Country\"}],\"ocrResult.documentNumber\":[{\"type\":0,\"value\":\"Document Number\"}],\"ocrResult.familyName\":[{\"type\":0,\"value\":\"Family name\"}],\"ocrResult.firstName\":[{\"type\":0,\"value\":\"First name(s)\"}],\"ocrResult.nationality\":[{\"type\":0,\"value\":\"Nationality\"}],\"ocrResult.notDataExtracted\":[{\"type\":0,\"value\":\"Not able to extract data from the uploaded document\"}],\"ocrResult.proceedManually\":[{\"type\":0,\"value\":\"I want to do it manually\"}],\"ocrResult.processingRequest\":[{\"type\":0,\"value\":\"We are processing your request...\"}],\"ocrResult.reviewDocumentMessage\":[{\"type\":0,\"value\":\"Please take a moment to review your document carefully. If everything looks correct, go ahead and confirm it. If you spot any mistakes, feel free to make changes and try again.\"}],\"ocrResult.sex\":[{\"type\":0,\"value\":\"Sex\"}],\"ocrResult.sexSelector\":[{\"type\":5,\"value\":\"gender\",\"options\":{\"M\":{\"value\":[{\"type\":0,\"value\":\"Male\"}]},\"F\":{\"value\":[{\"type\":0,\"value\":\"Female\"}]},\"other\":{\"value\":[{\"type\":0,\"value\":\"Other\"}]}}}],\"ocrResult.subTitle\":[{\"type\":0,\"value\":\"Applicants information\"}],\"ocrResult.title\":[{\"type\":0,\"value\":\"Personal information\"}],\"paymentGateway.ababank.cardImageAlt\":[{\"type\":0,\"value\":\"Card payment\"}],\"paymentGateway.ababank.cardOption\":[{\"type\":0,\"value\":\"Card Payment\"}],\"paymentGateway.ababank.qrImageAlt\":[{\"type\":0,\"value\":\"QR Code payment\"}],\"paymentGateway.ababank.qrOption\":[{\"type\":0,\"value\":\"QR Code Payment (KHQR)\"}],\"paymentGateway.binga.cash.codeLabel\":[{\"type\":0,\"value\":\"Order reference number\"}],\"paymentGateway.binga.cash.expiry\":[{\"type\":0,\"value\":\"Code will expire after \"},{\"type\":1,\"value\":\"countdown\"},{\"type\":0,\"value\":\" minutes\"}],\"paymentGateway.binga.cash.message\":[{\"type\":0,\"value\":\"Go to any Binga payment point and present this reference number to pay\"}],\"paymentGateway.binga.cash.paidThrough\":[{\"type\":0,\"value\":\"Paid through\"}],\"paymentGateway.binga.cash.returnButton\":[{\"type\":0,\"value\":\"Return\"}],\"paymentGateway.binga.cash.title\":[{\"type\":0,\"value\":\"Order created successfully\"}],\"paymentGateway.binga.cash.total\":[{\"type\":0,\"value\":\"Total\"}],\"paymentGateway.bnp.confirmation.cancellationWarning\":[{\"type\":0,\"value\":\"If payment is not completed within the time limit, your appointment will be automatically cancelled.\"}],\"paymentGateway.bnp.confirmation.instruction1\":[{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Complete the payment\"}]},{\"type\":0,\"value\":\" as soon as the payment page opens.\"}],\"paymentGateway.bnp.confirmation.instruction2\":[{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Keep the payment page open\"}]},{\"type\":0,\"value\":\" until the transaction is confirmed.\"}],\"paymentGateway.bnp.confirmation.instruction3\":[{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Check your bank settings\"}]},{\"type\":0,\"value\":\" for any limits or security rules that could block online payments.\"}],\"paymentGateway.bnp.confirmation.instruction4\":[{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Ensure the phone number linked to your bank card\"}]},{\"type\":0,\"value\":\" can receive security codes.\"}],\"paymentGateway.bnp.confirmation.instruction5\":[{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Verify your card balance and limit\"}]},{\"type\":0,\"value\":\" before paying.\"}],\"paymentGateway.bnp.confirmation.instructionsIntro\":[{\"type\":0,\"value\":\"To avoid issues, please make sure to:\"}],\"paymentGateway.bnp.confirmation.reservationNotice\":[{\"type\":0,\"value\":\"Your appointment is temporarily reserved and will be confirmed only after successful payment.\"}],\"paymentGateway.bnp.confirmation.title\":[{\"type\":0,\"value\":\"Important: Complete your payment to confirm your appointment\"}],\"paymentGateway.bnp.satim.logoAlt\":[{\"type\":0,\"value\":\"SATIM Support\"}],\"paymentGateway.bnp.satim.supportText\":[{\"type\":0,\"value\":\"In case of payment problem, contact the SATIM toll-free number\"}],\"paymentGateway.bnp.terms.checkboxLabel\":[{\"type\":0,\"value\":\"I agree with \"},{\"type\":8,\"value\":\"a\",\"children\":[{\"type\":0,\"value\":\"Terms and Conditions of Service\"}]}],\"paymentGateway.bnp.terms.closeButtonAriaLabel\":[{\"type\":0,\"value\":\"Close terms and conditions\"}],\"paymentGateway.bnp.terms.introduction\":[{\"type\":0,\"value\":\"La collecte de demandes de visa dans les centres de TLScontact est un service fourni par SARL TLS Contact (ci-après dénommée « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"TLScontact\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"nous\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"notre\"}]},{\"type\":0,\"value\":\" » ou « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"nos\"}]},{\"type\":0,\"value\":\" »), immatriculée sous le numéro 08B0978253 et ayant son siège social à \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Butte des Deux Bassins, Oued Romane El Achour, 16000 Alger, Algérie.\"}]},{\"type\":0,\"value\":\"\u003cbr/\u003e\"},{\"type\":0,\"value\":\"TLScontact est un prestataire de services désigné et autorisé par l'Ambassade de France en Algérie pour gérer des centres de collecte de demandes de visa TLScontact dans ses locaux désignés (dénommés « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"centre de collecte de demandes de visa\"}]},{\"type\":0,\"value\":\" » ou « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"centre de visas\"}]},{\"type\":0,\"value\":\" ») et sur le site internet de TLScontact.\"}],\"paymentGateway.bnp.terms.section1.intro\":[{\"type\":0,\"value\":\"Ces conditions générales sont applicables à tous les services (ci-après dénommés « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"service\"}]},{\"type\":0,\"value\":\" » ou « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"services\"}]},{\"type\":0,\"value\":\" ») offerts par TLScontact pour le compte de l'Ambassade de France en Algérie ou pour son propre compte aux personnes (ci-après dénommées « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"demandeur\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"demandeurs\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"client\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"vous\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"votre\"}]},{\"type\":0,\"value\":\" » ou « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"vos\"}]},{\"type\":0,\"value\":\" ») qui souhaitent déposer une demande de visa à l'Ambassade de France par l'intermédiaire de TLScontact.\"}],\"paymentGateway.bnp.terms.section1.list\":[{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"L'inscription du demandeur sur le site internet de TLScontact afin de créer un compte;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La prise de rendez-vous par le demandeur afin de déposer une demande de visa;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La confirmation par TLScontact du rendez-vous du demandeur;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La présence du demandeur au rendez-vous au centre de visas afin de remettre la demande de visa à TLScontact;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La collecte des données biométriques nécessaires, le cas échéant, par l'Ambassade de France;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Le paiement des frais liés à la demande de visa;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Le dépôt et le transport par TLScontact à l'Ambassade de France de la demande de visa et de tous documents complémentaires;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La fourniture par TLScontact de services facultatifs (« \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"services additionnels\"}]},{\"type\":0,\"value\":\" »).\"}]}],\"paymentGateway.bnp.terms.section1.listIntro\":[{\"type\":0,\"value\":\"Ces conditions générales s'appliquent, sans limitation et selon la nature de votre demande de visa, à ce qui suit :\"}],\"paymentGateway.bnp.terms.section1.title\":[{\"type\":0,\"value\":\"1. Application de ces conditions générales\"}],\"paymentGateway.bnp.terms.section10.content\":[{\"type\":0,\"value\":\"Ces conditions générales et les transactions prévues aux présentes doivent être régies par les lois applicables dans le pays du centre de collecte de demandes de visa où le demandeur a passé sa commande de service.\"}],\"paymentGateway.bnp.terms.section10.title\":[{\"type\":0,\"value\":\"10. Droit applicable\"}],\"paymentGateway.bnp.terms.section11.content\":[{\"type\":0,\"value\":\"Tous les litiges liés à la fourniture des services ou aux transactions conclues conformément à ces conditions générales doivent être soumis aux tribunaux compétents en vertu des lois applicables.\"}],\"paymentGateway.bnp.terms.section11.title\":[{\"type\":0,\"value\":\"11. Litiges\"}],\"paymentGateway.bnp.terms.section12.content\":[{\"type\":0,\"value\":\"TLScontact peut, à sa seule discrétion, modifier, amender, annuler ou retirer une partie ou l'ensemble de ces conditions générales à tout moment sans aucun préavis. Toute modification sera publiée sur le site internet de TLScontact.\"}],\"paymentGateway.bnp.terms.section12.title\":[{\"type\":0,\"value\":\"12. Modifications de ces conditions générales\"}],\"paymentGateway.bnp.terms.section13.content\":[{\"type\":0,\"value\":\"Les titres des clauses ne servent qu'à en faciliter la lecture et ne sont pas destinés à en influencer l'interprétation. TLScontact n'offre aucune garantie et ne fait aucune déclaration ne figurant pas dans ces conditions générales.\"}],\"paymentGateway.bnp.terms.section13.title\":[{\"type\":0,\"value\":\"13. Généralités\"}],\"paymentGateway.bnp.terms.section2.intro\":[{\"type\":0,\"value\":\"Afin de bénéficier d'un service fourni par TLScontact, le demandeur doit réaliser les opérations suivantes sur le site internet de TLScontact:\"}],\"paymentGateway.bnp.terms.section2.list\":[{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"s'inscrire sur le site internet de TLScontact et créer un compte;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"se connecter et remplir le formulaire de demande en ligne, le cas échéant;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"prendre rendez-vous pour déposer la demande de visa au centre de collecte de demandes de visa.\"}]}],\"paymentGateway.bnp.terms.section2.title\":[{\"type\":0,\"value\":\"2. Commandes de service\"}],\"paymentGateway.bnp.terms.section3.content\":[{\"type\":0,\"value\":\"Les frais indiqués ne sont valides que le jour où ils sont établis. Pour toute demande de visa à une date ultérieure, les frais peuvent être sujets à modification.\"}],\"paymentGateway.bnp.terms.section3.title\":[{\"type\":0,\"value\":\"3. Frais de service\"}],\"paymentGateway.bnp.terms.section4.content\":[{\"type\":0,\"value\":\"Les frais de service et les frais de services additionnels (ci-après dénommés « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"Frais de TLScontact\"}]},{\"type\":0,\"value\":\" ») sont payables en totalité le jour où vous prenez rendez-vous pour déposer votre demande de visa ou ultérieurement lorsque vous arrivez au centre de visas pour votre rendez-vous.\"}],\"paymentGateway.bnp.terms.section4.title\":[{\"type\":0,\"value\":\"4. Conditions de paiement\"}],\"paymentGateway.bnp.terms.section5.content\":[{\"type\":0,\"value\":\"TLScontact s'engage à faire tout effort raisonnable afin de fournir les services aux demandeurs à la date de rendez-vous qu'ils ont choisie.\"}],\"paymentGateway.bnp.terms.section5.title\":[{\"type\":0,\"value\":\"5. Fourniture des services\"}],\"paymentGateway.bnp.terms.section6.content\":[{\"type\":0,\"value\":\"TLScontact ne remboursera aucun paiement de frais de TLScontact effectué par un demandeur au motif que l'Ambassade de France refuse d'accorder un visa ou que ce demandeur décide de retirer une demande de visa une fois la procédure en cours et les services prêtés.\"}],\"paymentGateway.bnp.terms.section6.title\":[{\"type\":0,\"value\":\"6. Conditions d'annulation\"}],\"paymentGateway.bnp.terms.section7.content\":[{\"type\":0,\"value\":\"L'Ambassade de France ne délègue aucune compétence ni aucun pouvoir à TLScontact en ce qui concerne l'évaluation des demandes de visa ou la prise de décisions relatives aux demandes de visa.\"}],\"paymentGateway.bnp.terms.section7.title\":[{\"type\":0,\"value\":\"7. Responsabilité de TLScontact\"}],\"paymentGateway.bnp.terms.section8.content\":[{\"type\":0,\"value\":\"L'entité responsable du traitement des données collectées pour votre demande de visa est SARL TLS Contact. TLScontact collecte des données à caractère personnel concernant les demandeurs dans le cadre des demandes de visa Schengen.\"}],\"paymentGateway.bnp.terms.section8.title\":[{\"type\":0,\"value\":\"8. Protection des données\"}],\"paymentGateway.bnp.terms.section9.content\":[{\"type\":0,\"value\":\"Le contenu du site internet de TLScontact est la propriété intellectuelle du groupe TLScontact et est protégé par les lois relatives à la propriété intellectuelle et les lois antitrust en vigueur.\"}],\"paymentGateway.bnp.terms.section9.title\":[{\"type\":0,\"value\":\"9. Propriété intellectuelle\"}],\"paymentGateway.bnp.terms.title\":[{\"type\":0,\"value\":\"Conditions d'utilisation du service\"}],\"paymentGateway.bnp.terms.toc.section1\":[{\"type\":0,\"value\":\"1. Application de ces conditions générales\"}],\"paymentGateway.bnp.terms.toc.section10\":[{\"type\":0,\"value\":\"10. Droit applicable\"}],\"paymentGateway.bnp.terms.toc.section11\":[{\"type\":0,\"value\":\"11. Litiges\"}],\"paymentGateway.bnp.terms.toc.section12\":[{\"type\":0,\"value\":\"12. Modifications de ces conditions générales\"}],\"paymentGateway.bnp.terms.toc.section13\":[{\"type\":0,\"value\":\"13. Généralités\"}],\"paymentGateway.bnp.terms.toc.section2\":[{\"type\":0,\"value\":\"2. Commandes de service\"}],\"paymentGateway.bnp.terms.toc.section3\":[{\"type\":0,\"value\":\"3. Frais de service\"}],\"paymentGateway.bnp.terms.toc.section4\":[{\"type\":0,\"value\":\"4. Conditions de paiement\"}],\"paymentGateway.bnp.terms.toc.section5\":[{\"type\":0,\"value\":\"5. Fourniture des services\"}],\"paymentGateway.bnp.terms.toc.section6\":[{\"type\":0,\"value\":\"6. Conditions d'annulation\"}],\"paymentGateway.bnp.terms.toc.section7\":[{\"type\":0,\"value\":\"7. Responsabilité de TLScontact\"}],\"paymentGateway.bnp.terms.toc.section8\":[{\"type\":0,\"value\":\"8. Protection des données\"}],\"paymentGateway.bnp.terms.toc.section9\":[{\"type\":0,\"value\":\"9. Propriété intellectuelle\"}],\"paymentGateway.cmi.contact\":[{\"type\":0,\"value\":\"In case of payment problem, please contact CMI\"}],\"paymentGateway.cmi.terms.checkboxLabel\":[{\"type\":0,\"value\":\"I agree with \"},{\"type\":8,\"value\":\"a\",\"children\":[{\"type\":0,\"value\":\"general conditions of service\"}]}],\"paymentGateway.cmi.terms.closeButtonAriaLabel\":[{\"type\":0,\"value\":\"Close terms and conditions\"}],\"paymentGateway.cmi.terms.introduction\":[{\"type\":0,\"value\":\"La collecte de demandes de visa dans les centres de TLScontact est un service fourni par SARL TLS Contact (ci-après dénommée « TLScontact », « nous », « notre » ou « nos »). TLScontact est un prestataire de services désigné et autorisé par l'Ambassade de France en Maroc pour gérer des centres de collecte de demandes de visa TLScontact dans ses locaux désignés (dénommés « centre de collecte de demandes de visa » ou « centre de visas ») et sur le site internet de TLScontact.\"}],\"paymentGateway.cmi.terms.section1.conclusion\":[{\"type\":0,\"value\":\"$16\"}],\"paymentGateway.cmi.terms.section1.intro\":[{\"type\":0,\"value\":\"Ces conditions générales sont applicables à tous les services (ci-après dénommés « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"service\"}]},{\"type\":0,\"value\":\" » ou « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"services\"}]},{\"type\":0,\"value\":\" ») offerts par TLScontact pour le compte de l'Ambassade de France en Maroc ou pour son propre compte aux personnes (ci-après dénommées « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"demandeur\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"demandeurs\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"client\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"vous\"}]},{\"type\":0,\"value\":\" », « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"votre\"}]},{\"type\":0,\"value\":\" » ou « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"vos\"}]},{\"type\":0,\"value\":\" ») qui souhaitent déposer une demande de visa à l'Ambassade de France par l'intermédiaire de TLScontact et à l'éventuelle fourniture d'informations par TLScontact au sujet de cette demande de visa.\"}],\"paymentGateway.cmi.terms.section1.list\":[{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"L'inscription du demandeur sur le site internet de TLScontact afin de créer un compte;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La prise de rendez-vous par le demandeur afin de déposer une demande de visa;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La confirmation par TLScontact du rendez-vous du demandeur;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La présence du demandeur au rendez-vous au centre de visas afin de remettre la demande de visa à TLScontact;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La collecte des données biométriques nécessaires, le cas échéant, par l'Ambassade de France;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Le paiement des frais liés à la demande de visa;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Le dépôt et le transport par TLScontact (ou tout sous-traitant de TLScontact) à l'Ambassade de France de la demande de visa et de tous documents complémentaires;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Le transfert de tous ces documents de l'Ambassade de France à TLScontact afin de retourner le document de voyage et tout autre document complémentaire, le cas échéant, au demandeur;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"La fourniture par TLScontact de services facultatifs en plus de celui de collecte de votre demande de visa (ci-après dénommés « \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"services additionnels\"}]},{\"type\":0,\"value\":\" ») pour rendre le dépôt de votre demande de visa plus aisé.\"}]}],\"paymentGateway.cmi.terms.section1.listIntro\":[{\"type\":0,\"value\":\"Ces conditions générales s'appliquent, sans limitation et selon la nature de votre demande de visa, à ce qui suit :\"}],\"paymentGateway.cmi.terms.section1.title\":[{\"type\":0,\"value\":\"1. Application de ces conditions générales\"}],\"paymentGateway.cmi.terms.section10.content\":[{\"type\":0,\"value\":\"Ces conditions générales et les transactions prévues aux présentes doivent être régies par les lois applicables dans le pays du centre de collecte de demandes de visa où le demandeur a passé sa commande de service.\"}],\"paymentGateway.cmi.terms.section10.title\":[{\"type\":0,\"value\":\"10. Droit applicable\"}],\"paymentGateway.cmi.terms.section11.content\":[{\"type\":0,\"value\":\"Tous les litiges liés à la fourniture des services ou aux transactions conclues liées à ceux-ci conformément à ces conditions générales concernant leur validité, leur interprétation, leur exécution, leur résiliation, leurs conséquences et leurs implications, qui ne peuvent pas être réglés à l'amiable entre TLScontact et le demandeur, doivent être soumis aux tribunaux compétents en vertu des lois applicables dans le pays du centre de collecte de demandes de visa où le demandeur a passé sa commande de service.\"}],\"paymentGateway.cmi.terms.section11.title\":[{\"type\":0,\"value\":\"11. Litiges\"}],\"paymentGateway.cmi.terms.section12.content\":[{\"type\":0,\"value\":\"TLScontact peut, à sa seule discrétion, modifier, amender, annuler ou retirer une partie ou l'ensemble de ces conditions générales à tout moment sans aucun préavis conformément à la clause 1 des conditions générales. Toute modification sera publiée sur le site internet de TLScontact.\"}],\"paymentGateway.cmi.terms.section12.title\":[{\"type\":0,\"value\":\"12. Modifications de ces conditions générales\"}],\"paymentGateway.cmi.terms.section13.content\":[{\"type\":0,\"value\":\"Les titres des clauses ne servent qu'à en faciliter la lecture et ne sont pas destinés à en influencer l'interprétation. TLScontact n'offre aucune garantie et ne fait aucune déclaration ne figurant pas dans ces conditions générales. Aucune prolongation de délai ou autre indulgence que peut concéder TLScontact à un demandeur ne constituera une renonciation de TLScontact à ses droits nés ou à naître, qu'il pourrait exercer contre le demandeur. Toutes les dispositions de ces conditions générales sont séparables les unes des autres, nonobstant la façon dont elles ont été regroupées ensemble ou liées grammaticalement.\"}],\"paymentGateway.cmi.terms.section13.title\":[{\"type\":0,\"value\":\"13. Généralités\"}],\"paymentGateway.cmi.terms.section2.conclusion\":[{\"type\":0,\"value\":\"$17\"}],\"paymentGateway.cmi.terms.section2.intro\":[{\"type\":0,\"value\":\"Afin de bénéficier d'un service fourni par TLScontact, le demandeur doit réaliser les opérations suivantes sur le site internet de TLScontact:\"}],\"paymentGateway.cmi.terms.section2.list\":[{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"s'inscrire sur le site internet de TLScontact et créer un compte;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"se connecter et remplir le formulaire de demande en ligne, le cas échéant;\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"prendre rendez-vous pour déposer la demande de visa au centre de collecte de demandes de visa.\"}]}],\"paymentGateway.cmi.terms.section2.title\":[{\"type\":0,\"value\":\"2. Commandes de service\"}],\"paymentGateway.cmi.terms.section3.sub1.content\":[{\"type\":0,\"value\":\"$18\"}],\"paymentGateway.cmi.terms.section3.sub1.title\":[{\"type\":0,\"value\":\"3.1 Conditions générales pour tous les frais à régler\"}],\"paymentGateway.cmi.terms.section3.sub2.content\":[{\"type\":0,\"value\":\"Les frais de service pour le traitement de votre demande de visa sont convenus entre l'Ambassade de France et TLScontact. Toute modification des frais de service pour la demande de visa doit être réalisée conformément à l'accord conclu avec l'Ambassade de France et doit être dûment affichée sur le site internet de TLScontact ou dans le centre de visas. TLScontact délivrera au demandeur un récépissé après paiement des frais de service.\"}],\"paymentGateway.cmi.terms.section3.sub2.title\":[{\"type\":0,\"value\":\"3.2 Frais de service de TLScontact pour le dépôt de votre demande de visa (ci-après dénommés « frais de service »)\"}],\"paymentGateway.cmi.terms.section3.sub3.content\":[{\"type\":0,\"value\":\"Les frais de services additionnels de TLScontact sont établis dans la devise du pays où vous déposez votre demande de visa ou en euros. TLScontact se réserve le droit de modifier les frais de services additionnels et de facturer ces frais de services additionnels modifiés aux demandeurs après la date d'entrée en vigueur de cette modification. Le demandeur doit en tenir compte s'il envisage de passer une commande à une date ultérieure. TLScontact délivrera au demandeur un récépissé après paiement des frais de services additionnels.\"}],\"paymentGateway.cmi.terms.section3.sub3.title\":[{\"type\":0,\"value\":\"3.3 Frais de services additionnels (ci-après dénommés « frais de service additionnels »)\"}],\"paymentGateway.cmi.terms.section3.sub4.content\":[{\"type\":0,\"value\":\"TLScontact n'a aucun contrôle sur les modifications apportées aux droits de visa perçus par TLScontact pour le compte de l'Ambassade de France et décline toute responsabilité à cet égard. TLScontact n'accepte aucune demande de remboursement des droits de visa, et de telles demandes ne doivent pas être adressées à TLScontact.\"}],\"paymentGateway.cmi.terms.section3.sub4.title\":[{\"type\":0,\"value\":\"3.4 Droits de visa perçus par TLScontact pour le compte de l'Ambassade de France (ci-après dénommés « droits de visa »)\"}],\"paymentGateway.cmi.terms.section3.title\":[{\"type\":0,\"value\":\"3. Frais de service\"}],\"paymentGateway.cmi.terms.section4.content\":[{\"type\":0,\"value\":\"$19\"}],\"paymentGateway.cmi.terms.section4.title\":[{\"type\":0,\"value\":\"4. Conditions de paiement\"}],\"paymentGateway.cmi.terms.section5.content\":[{\"type\":0,\"value\":\"$1a\"}],\"paymentGateway.cmi.terms.section5.title\":[{\"type\":0,\"value\":\"5. Fourniture des services\"}],\"paymentGateway.cmi.terms.section6.content\":[{\"type\":0,\"value\":\"TLScontact ne remboursera aucun paiement de frais de TLScontact effectué par un demandeur au motif que l'Ambassade de France refuse d'accorder un visa ou que ce demandeur décide de retirer une demande de visa une fois la procédure en cours et les services prêtés. Les frais de TLScontact ne sont pas remboursables ni transférables une fois le service de TLScontact prêté ou la demande transférée à l'Ambassade de France. Néanmoins, si TLScontact a commis une négligence grave ou une faute intentionnelle liée à une demande de visa déposée, entraînant la non-concession du visa ou la perte du passeport du demandeur avec les visas valides, TLScontact remboursera au demandeur les frais de service uniquement ainsi que les frais facturés par le pays émetteur du passeport du demandeur pour le remplacement du passeport ou de tout autre document perdu ou endommagé selon sa procédure normale de remplacement.\"}],\"paymentGateway.cmi.terms.section6.title\":[{\"type\":0,\"value\":\"6. Conditions d'annulation\"}],\"paymentGateway.cmi.terms.section7.content\":[{\"type\":0,\"value\":\"$1b\"}],\"paymentGateway.cmi.terms.section7.title\":[{\"type\":0,\"value\":\"7. Responsabilité de TLScontact\"}],\"paymentGateway.cmi.terms.section8.content\":[{\"type\":0,\"value\":\"$1c\"}],\"paymentGateway.cmi.terms.section8.title\":[{\"type\":0,\"value\":\"8. Protection des données\"}],\"paymentGateway.cmi.terms.section9.content\":[{\"type\":0,\"value\":\"Le contenu du site internet de TLScontact est la propriété intellectuelle du groupe TLScontact et est protégé par les lois relatives à la propriété intellectuelle et les lois antitrust en vigueur. La copie ou la publication des informations, en tout ou en partie, sur d'autres sites internet sans lien redirigeant vers le site internet de TLScontact est strictement interdite et constitue un acte de contrefaçon. En outre, TLScontact conservera tous les droits de propriété intellectuelle relatifs aux photographies, présentations, études, conceptions, modèles, prototypes, etc. créés afin de fournir les services.\"}],\"paymentGateway.cmi.terms.section9.title\":[{\"type\":0,\"value\":\"9. Propriété intellectuelle\"}],\"paymentGateway.cmi.terms.title\":[{\"type\":0,\"value\":\"Conditions d'utilisation du service\"}],\"paymentGateway.cmi.terms.toc.section1\":[{\"type\":0,\"value\":\"1. Application de ces conditions générales\"}],\"paymentGateway.cmi.terms.toc.section10\":[{\"type\":0,\"value\":\"10. Droit applicable\"}],\"paymentGateway.cmi.terms.toc.section11\":[{\"type\":0,\"value\":\"11. Litiges\"}],\"paymentGateway.cmi.terms.toc.section12\":[{\"type\":0,\"value\":\"12. Modifications de ces conditions générales\"}],\"paymentGateway.cmi.terms.toc.section13\":[{\"type\":0,\"value\":\"13. Généralités\"}],\"paymentGateway.cmi.terms.toc.section2\":[{\"type\":0,\"value\":\"2. Commandes de service\"}],\"paymentGateway.cmi.terms.toc.section3\":[{\"type\":0,\"value\":\"3. Frais de service\"}],\"paymentGateway.cmi.terms.toc.section4\":[{\"type\":0,\"value\":\"4. Conditions de paiement\"}],\"paymentGateway.cmi.terms.toc.section5\":[{\"type\":0,\"value\":\"5. Fourniture des services\"}],\"paymentGateway.cmi.terms.toc.section6\":[{\"type\":0,\"value\":\"6. Conditions d'annulation\"}],\"paymentGateway.cmi.terms.toc.section7\":[{\"type\":0,\"value\":\"7. Responsabilité de TLScontact\"}],\"paymentGateway.cmi.terms.toc.section8\":[{\"type\":0,\"value\":\"8. Protection des données\"}],\"paymentGateway.cmi.terms.toc.section9\":[{\"type\":0,\"value\":\"9. Propriété intellectuelle\"}],\"paymentGateway.confirmButton\":[{\"type\":0,\"value\":\"Confirm\"}],\"paymentGateway.default.confirmation.description\":[{\"type\":8,\"value\":\"ul\",\"children\":[{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Your appointment has been \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"temporarily reserved\"}]},{\"type\":0,\"value\":\".\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"The appointment will be \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"confirmed only after a successful payment\"}]},{\"type\":0,\"value\":\".\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"Please be aware of the \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"time limit\"}]},{\"type\":0,\"value\":\" for completing your payment.\"}]},{\"type\":8,\"value\":\"li\",\"children\":[{\"type\":0,\"value\":\"If the payment is not completed before the time expires, your appointment will be \"},{\"type\":8,\"value\":\"b\",\"children\":[{\"type\":0,\"value\":\"automatically released\"}]},{\"type\":0,\"value\":\".\"}]}]},{\"type\":0,\"value\":\"Make sure to complete your payment promptly to secure your appointment.\"}],\"paymentGateway.default.confirmation.title\":[{\"type\":0,\"value\":\"Important Information Before Proceeding to Payment\"}],\"paymentGateway.default.terms.checkboxLabel\":[{\"type\":0,\"value\":\"I do understand\"}],\"paymentGateway.easypayOffline.en.applicationNumberLabel\":[{\"type\":0,\"value\":\"Application Number:\"}],\"paymentGateway.easypayOffline.en.deadline\":[{\"type\":0,\"value\":\"Provide this application number and pay within 24 hours.\"}],\"paymentGateway.easypayOffline.en.findTerminals\":[{\"type\":0,\"value\":\"You can find the nearest kiosks here:\"}],\"paymentGateway.easypayOffline.en.instruction\":[{\"type\":0,\"value\":\"To have your application done, please go to one of the EasyPay kiosks\"}],\"paymentGateway.easypayOffline.en.title\":[{\"type\":0,\"value\":\"Please proceed to an EasyPay Kiosk\"}],\"paymentGateway.easypayOffline.ua.applicationNumberLabel\":[{\"type\":0,\"value\":\"Номер Вашої заявки:\"}],\"paymentGateway.easypayOffline.ua.deadline\":[{\"type\":0,\"value\":\"Оплату треба здійснити протягом 24 годин, обов'язково вказавши зазначений вище номер візової заявки.\"}],\"paymentGateway.easypayOffline.ua.findTerminals\":[{\"type\":0,\"value\":\"Найближчі платіжні термінали можна знайти за посиланням\"}],\"paymentGateway.easypayOffline.ua.instruction\":[{\"type\":0,\"value\":\"Щоб закінчити подачу візової форми, будь ласка, відвідайте один з терміналів EasyPay\"}],\"paymentGateway.easypayOffline.ua.title\":[{\"type\":0,\"value\":\"Будь ласка, відвідайте EasyPay термінал\"}],\"paymentGateway.fliggy.wait.backToOrder\":[{\"type\":0,\"value\":\"Back to Order\"}],\"paymentGateway.fliggy.wait.description\":[{\"type\":0,\"value\":\"Open Alipay and scan the QR code below to complete your payment. Do not close this page.\"}],\"paymentGateway.fliggy.wait.expired\":[{\"type\":0,\"value\":\"Payment time has expired. You can still complete the payment and we will process it if successful.\"}],\"paymentGateway.fliggy.wait.failed\":[{\"type\":0,\"value\":\"Payment failed. Please try again.\"}],\"paymentGateway.fliggy.wait.title\":[{\"type\":0,\"value\":\"Scan to pay with Alipay\"}],\"paymentGateway.goToPaymentButton\":[{\"type\":0,\"value\":\"Go to Payment\"}],\"paymentGateway.kbank.cardOption\":[{\"type\":0,\"value\":\"Card Payment\"}],\"paymentGateway.kbank.qrOption\":[{\"type\":0,\"value\":\"QR Code Payment\"}],\"paymentGateway.kbank.wait.description\":[{\"type\":0,\"value\":\"Please complete your payment using the form below. Do not close this page.\"}],\"paymentGateway.kbank.wait.title\":[{\"type\":0,\"value\":\"Processing your payment\"}],\"paymentGateway.omt.instructions.codeLabel\":[{\"type\":0,\"value\":\"Order reference number\"}],\"paymentGateway.omt.instructions.expiry\":[{\"type\":0,\"value\":\"This code will expire after \"},{\"type\":1,\"value\":\"countdown\"},{\"type\":0,\"value\":\" hours\"}],\"paymentGateway.omt.instructions.message\":[{\"type\":0,\"value\":\"Go to any OMT Store and present this reference number to pay\"}],\"paymentGateway.omt.instructions.paidThrough\":[{\"type\":0,\"value\":\"Paid through\"}],\"paymentGateway.omt.instructions.returnButton\":[{\"type\":0,\"value\":\"Return\"}],\"paymentGateway.omt.instructions.title\":[{\"type\":0,\"value\":\"Order created successfully\"}],\"paymentGateway.omt.instructions.total\":[{\"type\":0,\"value\":\"Total\"}],\"paymentGateway.orange.wait.backToOrder\":[{\"type\":0,\"value\":\"Back to Order\"}],\"paymentGateway.payLater.confirmation.description\":[{\"type\":5,\"value\":\"tenant\",\"options\":{\"visail\":{\"value\":[{\"type\":0,\"value\":\"Please pay the fees through CITIC Bank online payment or at CITIC bank counter, including visa fee, visa service fee and added value service charge. It is not possible to pay the above fees at the Visa Application Center.\\nThe receipt of payment of CITIC bank must be accompanied by visa application materials. If the certificate is missing, your visa application will not be transferred to the Israeli embassy or consulate.\"}]},\"other\":{\"value\":[]}}}],\"paymentGateway.payLater.name\":[{\"type\":5,\"value\":\"tenant\",\"options\":{\"visail\":{\"value\":[{\"type\":0,\"value\":\"CITIC Bank online payment or at CITIC bank counter\"}]},\"legalizationbe\":{\"value\":[{\"type\":0,\"value\":\"Pay later in our legalisation centre\"}]},\"other\":{\"value\":[{\"type\":0,\"value\":\"Pay later at our visa application centre\"}]}}}],\"paymentGateway.section.title\":[{\"type\":0,\"value\":\"Available payment method(s)\"}],\"paymentGateway.switch.checkout.loadError\":[{\"type\":0,\"value\":\"Failed to load the payment form. Please try again.\"}],\"paymentGateway.switch.checkout.title\":[{\"type\":0,\"value\":\"Complete your payment\"}],\"paymentGateway.unavailable\":[{\"type\":0,\"value\":\"Payment methods currently unavailable\"}],\"rights\":[{\"type\":0,\"value\":\"© \"},{\"type\":1,\"value\":\"year\"},{\"type\":0,\"value\":\" TLScontact. All rights reserved.\"}],\"sorry\":[{\"type\":0,\"value\":\"Sorry\"}],\"temporarilyBlocked.subtitle\":[{\"type\":0,\"value\":\"Your session has been temporarily suspended due to the high number of your access to this page.\"}],\"temporarilyBlocked.timeSpan\":[{\"type\":6,\"value\":\"count\",\"options\":{\"one\":{\"value\":[{\"type\":0,\"value\":\"You can try to access your account again in one hour.\"}]},\"other\":{\"value\":[{\"type\":0,\"value\":\"You can try to access your account again in \"},{\"type\":7},{\"type\":0,\"value\":\" hours.\"}]}},\"offset\":0,\"pluralType\":\"cardinal\"}],\"temporarilyBlocked.title\":[{\"type\":0,\"value\":\"Temporarily blocked!\"}],\"tlsFileUploader.addMoreFiles\":[{\"type\":0,\"value\":\"Add more files\"}],\"tlsFileUploader.applicantDocumentsHeading\":[{\"type\":1,\"value\":\"name\"},{\"type\":0,\"value\":\"'s documents (\"},{\"type\":1,\"value\":\"count\"},{\"type\":0,\"value\":\" files)\"}],\"tlsFileUploader.categoryPlaceholder\":[{\"type\":0,\"value\":\"Unassigned\"}],\"tlsFileUploader.columnCategory\":[{\"type\":0,\"value\":\"Category\"}],\"tlsFileUploader.columnName\":[{\"type\":0,\"value\":\"Name\"}],\"tlsFileUploader.columnPages\":[{\"type\":0,\"value\":\"Number of Pages\"}],\"tlsFileUploader.columnSize\":[{\"type\":0,\"value\":\"Size\"}],\"tlsFileUploader.confirmationModal.subtitle\":[{\"type\":0,\"value\":\"Once you submit, no changes are allowed.\"}],\"tlsFileUploader.confirmationModal.titleLine1\":[{\"type\":0,\"value\":\"Are you sure you want to submit\"}],\"tlsFileUploader.confirmationModal.titleLine2\":[{\"type\":1,\"value\":\"name\"},{\"type\":0,\"value\":\"'s files?\"}],\"tlsFileUploader.deleting\":[{\"type\":0,\"value\":\"Deleting...\"}],\"tlsFileUploader.dragAndDropContent\":[{\"type\":0,\"value\":\"Uploads of 'jpg', 'jpeg', 'png', 'pdf' are allowed, with file size no larger than 8MB\"}],\"tlsFileUploader.dragAndDropTitle\":[{\"type\":0,\"value\":\"Drag and drop files here or click here to select files from your browser\"}],\"tlsFileUploader.errors.categoryRequired\":[{\"type\":0,\"value\":\"Please assign a category to all uploaded documents before submitting.\"}],\"tlsFileUploader.errors.deleteError\":[{\"type\":0,\"value\":\"It was not possible to delete the document.\"}],\"tlsFileUploader.errors.documentNotFound\":[{\"type\":0,\"value\":\"Document not found!\"}],\"tlsFileUploader.errors.fileTooLarge\":[{\"type\":0,\"value\":\"The selected file exceeds the maximum allowed size of \"},{\"type\":1,\"value\":\"maxSize\"},{\"type\":0,\"value\":\".\"}],\"tlsFileUploader.errors.invalidFileType\":[{\"type\":0,\"value\":\"The selected file type is not allowed. Allowed formats: \"},{\"type\":1,\"value\":\"extensions\"},{\"type\":0,\"value\":\".\"}],\"tlsFileUploader.errors.previewError\":[{\"type\":0,\"value\":\"It was not possible to download the document.\"}],\"tlsFileUploader.errors.timeout\":[{\"type\":0,\"value\":\"The request timed out. Please try again later.\"}],\"tlsFileUploader.filesCount\":[{\"type\":6,\"value\":\"count\",\"options\":{\"one\":{\"value\":[{\"type\":7},{\"type\":0,\"value\":\" file\"}]},\"other\":{\"value\":[{\"type\":7},{\"type\":0,\"value\":\" files\"}]}},\"offset\":0,\"pluralType\":\"cardinal\"}],\"tlsFileUploader.pagesCount\":[{\"type\":6,\"value\":\"count\",\"options\":{\"one\":{\"value\":[{\"type\":7},{\"type\":0,\"value\":\" page\"}]},\"other\":{\"value\":[{\"type\":7},{\"type\":0,\"value\":\" pages\"}]}},\"offset\":0,\"pluralType\":\"cardinal\"}],\"tlsFileUploader.submit\":[{\"type\":0,\"value\":\"Submit\"}],\"tlsFileUploader.submitFailed\":[{\"type\":0,\"value\":\"Failed to submit documents. Please try again.\"}],\"tlsFileUploader.submitted\":[{\"type\":0,\"value\":\"Submitted\"}],\"tlsFileUploader.uploadBlockedTooltip\":[{\"type\":0,\"value\":\"Our system blocked this file for security reasons. To proceed, please ensure your document is virus-free and re-scan it before trying a new upload.\"}],\"tlsFileUploader.uploadFailed\":[{\"type\":0,\"value\":\"Upload failed\"}],\"tlsFileUploader.uploading\":[{\"type\":0,\"value\":\"Uploading...\"}],\"travelGroups.cannotDeleteDialog.description\":[{\"type\":0,\"value\":\"You have reached the maximum number of group deletions. If you need assistance, please contact our support center.\"}],\"travelGroups.cannotDeleteDialog.title\":[{\"type\":0,\"value\":\"You can no longer delete this group\"}]},\"children\":\"$L1d\"}]}]]}]]}]}]\n"])</script><script>self.__next_f.push([1,"1d:[\"$\",\"$L1e\",null,{\"captchaKey\":\"6LevDoQeAAAAAEVrXcQsTo2zjgSO5oQs-PGf6ZW7\",\"provider\":\"recaptcha-net\",\"children\":[\"$\",\"main\",null,{\"id\":\"main\",\"className\":\"flex min-h-screen flex-col items-stretch pt-12 md:pt-18\",\"tabIndex\":-1,\"children\":[\"$\",\"$L2\",null,{\"parallelRouterKey\":\"children\",\"error\":\"$1f\",\"errorStyles\":[],\"errorScripts\":[],\"template\":[\"$\",\"$L3\",null,{}],\"templateStyles\":\"$undefined\",\"templateScripts\":\"$undefined\",\"notFound\":[[\"$\",\"$L20\",null,{}],[]],\"forbidden\":\"$undefined\",\"unauthorized\":\"$undefined\"}]}]}]\n"])</script><script>self.__next_f.push([1,"5:[\"$L21\",\"$L22\",[\"$\",\"footer\",null,{\"className\":\"relative bg-footer p-10 px-6 py-8 shadow-[0_-8px_20px_rgba(0,0,0,.08)] print:hidden\",\"children\":[[\"$\",\"div\",null,{\"className\":\"container mx-auto\",\"children\":[false,[\"$\",\"div\",null,{\"className\":\"grid grid-cols-2 content-between items-center justify-between gap-y-6 md:grid-cols-3\",\"children\":[[\"$\",\"a\",null,{\"href\":\"/en-us\",\"className\":\"justify-self-start md:col-span-2 lg:col-auto\",\"children\":[\"$\",\"$L23\",null,{\"priority\":true,\"width\":140,\"height\":35,\"src\":\"https://cache-cms.directuscloud.tlscontact.com/assets/fb60a0bb-8c69-48ae-8c83-2dffdde46a34\",\"alt\":\"company logo\"}]}],[\"$\",\"div\",null,{\"className\":\"col-span-4 row-start-2 text-center text-on-footer lg:col-span-1 lg:row-start-auto\",\"children\":[\"$\",\"p\",null,{\"children\":\"© 2026 TLScontact. All rights reserved.\"}]}],false,[\"$\",\"div\",null,{\"className\":\"col-span-3 flex items-center gap-4 justify-self-end md:col-span-2 lg:col-auto\",\"children\":[[\"$\",\"$L23\",null,{\"width\":106,\"height\":36,\"src\":\"https://cache-cms.directuscloud.tlscontact.com/assets/53bbb1ea-21d2-45da-bf27-2802c8f93f09\",\"alt\":\"W3C WAI-AA WCAG-2.1\"}],false]}]]}]]}],[\"$\",\"$L24\",null,{}]]}]]\n"])</script><script>self.__next_f.push([1,"22:[\"$\",\"div\",null,{\"className\":\"relative z-0 min-h-screen flex-1\",\"children\":[[\"$\",\"$L23\",null,{\"src\":\"https://cache-cms.directuscloud.tlscontact.com/assets/cd59e348-8a25-4698-a93a-6303771fe9e0\",\"alt\":\"A vibrant city skyline with iconic landmarks and bustling streets, showcasing urban energy and charm\",\"fill\":true,\"priority\":true,\"className\":\"object-cover max-sm:!h-screen\"}],[\"$\",\"div\",null,{\"className\":\"relative z-10 min-h-screen bg-image/80 md:px-6 md:pb-20\",\"children\":[[\"$\",\"div\",null,{\"className\":\"md:min-h-auto relative flex min-h-[calc(100vh-3rem)] flex-col items-center justify-center gap-8 px-4 py-4 md:min-h-0 md:pb-16 md:pt-20\",\"children\":[[\"$\",\"div\",null,{\"className\":\"relative h-18 w-72 sm:h-28 sm:w-[400px]\",\"children\":[\"$\",\"$L23\",null,{\"fill\":true,\"src\":\"https://cache-cms.directuscloud.tlscontact.com/assets/867975e6-06f8-42c3-bef3-dfa89a4f2dce\",\"alt\":\"TLScontact\",\"className\":\"object-contain\"}]}],[\"$\",\"div\",null,{\"children\":[[\"$\",\"h1\",null,{\"className\":\"mb-8 text-center text-2xl font-semibold text-on-image md:text-4xl md:leading-10\",\"data-test-id\":\"page-title\",\"id\":\"page-title\",\"children\":\"Welcome to the TLScontact visa application website for Germany\"}],[\"$\",\"p\",null,{\"className\":\"text-center text-base text-on-image md:text-xl\",\"data-test-id\":\"page-subtitle-logout\",\"children\":\"Your partner for all your visa applications to Germany\"}]]}],[\"$\",\"$L23\",null,{\"src\":\"https://cache-cms.directuscloud.tlscontact.com/assets/39ce44fb-5969-4baf-8b32-4876f32a692f\",\"alt\":\"Flag\",\"width\":60,\"height\":60,\"className\":\"h-18 w-18 rounded-full border-[3px] border-surface-container bg-surface-container object-cover\"}],[\"$\",\"$L25\",null,{\"govWebsite\":\"https://france-visas.gouv.fr/en/online-application\",\"cmsContent\":{\"carouselMobile\":[{\"image_banner\":\"https://static.tlscontact.com/media/insurte_english_banner.jpg\",\"redirect_link\":\"https://insurte.com/schengen-travel-insurance?aff=aftl3e3q79xse3h4t3\u0026cd=Unknown\u0026ca=Germany\",\"type\":\"insurance\"}],\"metaDescription\":\"\",\"metaTitle\":\"Germany visa application centre | TLScontact\",\"popupStartTlsTitle\":\"Have you registered with TLScontact?\",\"noResultsMessage\":\"No results for {{search_term}}\",\"subtitleLogin\":\"Your partner for all your visa applications to Germany.\\n\\nTo continue with your application, click on “Book appointment”.\",\"searchPlaceholder\":\"Search TLScontact\",\"searchResultAmount\":\"{{count}} search results\",\"metaKeywords\":\"\",\"procedureVideoLink\":\"https://www.youtube.com/embed/aZ2jby-HDPs\",\"title\":\"Welcome to the TLScontact visa application website for Germany\",\"listSubtitle\":\"Please select your place of residence to continue\",\"id\":87,\"popupStartGovTitle\":\"Have you completed your VIDEX application?\",\"listSubtitlePlaceholder\":\"Choose from\",\"popupStartGovContent\":\"Before booking an appointment at one of our visa application centres, you will have to go to the official German government website and complete a visa application.\",\"welcomeSubtitle\":\"\",\"btnWelcome\":\"\",\"welcomeTitle\":\"\",\"listTitle\":\"Choose the German visa application centre in your place of residence\",\"subtitleLogout\":\"Your partner for all your visa applications to Germany\",\"popupStartTlsContent\":\"To register with TLScontact, you will have to create an account on our website.\",\"globalSplashId\":41,\"procedureTitle\":\"How to submit your German visa application\",\"procedureSubtitle\":\"Please read the different steps below to learn how to submit your visa application at the TLScontact visa application centre.​\",\"recentSearchesTitle\":\"Recent searches\",\"noRecentSearchesMessage\":\"No recent searches\",\"languagesCode\":\"en-us\",\"hello\":\"Hello {{userName}}\",\"carousel\":[{\"image_banner\":\"https://static.tlscontact.com/media/insurte_english_banner.jpg\",\"redirect_link\":\"https://insurte.com/schengen-travel-insurance?aff=aftl3e3q79xse3h4t3\u0026cd=Unknown\u0026ca=Germany\",\"type\":\"insurance\"}],\"buttonGoToGov\":\"Go to German website\",\"buttonBookAppointment\":\"Book an appointment\",\"buttonSelectCountry\":\"Select a country\",\"buttonConfirm\":\"Confirm\",\"buttonYes\":\"Yes\",\"buttonNo\":\"No\",\"clientFlag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/39ce44fb-5969-4baf-8b32-4876f32a692f\",\"clientLogo\":\"https://cache-cms.directuscloud.tlscontact.com/assets/867975e6-06f8-42c3-bef3-dfa89a4f2dce\",\"clientImage\":\"https://cache-cms.directuscloud.tlscontact.com/assets/cd59e348-8a25-4698-a93a-6303771fe9e0\"},\"showGovTriageDialog\":false,\"children\":\"Book an appointment\"}],\"$L26\"]}],\"$L27\",\"$L28\",\"$L29\"]}]]}]\n"])</script><script>self.__next_f.push([1,"26:[\"$\",\"div\",null,{\"className\":\"absolute bottom-4 md:hidden\",\"children\":[[\"$\",\"p\",null,{\"className\":\"mb-2 border-b-2 border-on-image text-center font-semibold text-on-image\",\"data-test-id\":\"visa-process-title\",\"children\":\"How to submit your German visa application\"}],[\"$\",\"svg\",null,{\"className\":\"mx-auto h-6 animate-bounce fill-on-image\",\"aria-label\":\"Chevron down icon\",\"role\":\"img\",\"viewBox\":\"0 0 24 24\",\"xmlns\":\"http://www.w3.org/2000/svg\",\"children\":[\"$\",\"path\",null,{\"fillRule\":\"evenodd\",\"clipRule\":\"evenodd\",\"d\":\"M4.46967 8.46967C4.76256 8.17678 5.23744 8.17678 5.53033 8.46967L12.5 15.4393L19.4697 8.46967C19.7626 8.17678 20.2374 8.17678 20.5303 8.46967C20.8232 8.76256 20.8232 9.23744 20.5303 9.53033L13.0303 17.0303C12.7374 17.3232 12.2626 17.3232 11.9697 17.0303L4.46967 9.53033C4.17678 9.23744 4.17678 8.76256 4.46967 8.46967Z\"}]}]]}]\n"])</script><script>self.__next_f.push([1,"27:[\"$\",\"div\",null,{\"className\":\"mx-auto w-full bg-surface-container py-6 md:container md:mb-10 md:rounded-lg lg:py-12\",\"children\":[\"$\",\"div\",null,{\"className\":\"px-4\",\"children\":[[\"$\",\"p\",null,{\"className\":\"text-xl font-semibold text-on-surface-variant md:mb-2 md:text-center md:text-3xl\",\"data-test-id\":\"visa-process-title\",\"children\":\"How to submit your German visa application\"}],[\"$\",\"p\",null,{\"className\":\"mb-4 text-sm font-normal text-on-surface-variant md:mb-10 md:text-center md:text-base md:font-semibold\",\"data-test-id\":\"visa-process-subtitle\",\"children\":\"Please read the different steps below to learn how to submit your visa application at the TLScontact visa application centre.​\"}],[\"$\",\"figure\",null,{\"children\":[[\"$\",\"iframe\",null,{\"className\":\"mx-auto mb-4 aspect-video w-full max-w-sm rounded-lg lg:mb-10\",\"src\":\"https://www.youtube.com/embed/aZ2jby-HDPs\",\"title\":\"How to submit your German visa application\",\"data-test-id\":\"visa-process-video\"}],[\"$\",\"figcaption\",null,{\"id\":\"video-description\",\"className\":\"sr-only\",\"children\":\"How to submit your German visa application\"}]]}]]}]}]\n"])</script><script>self.__next_f.push([1,"28:[\"$\",\"div\",null,{\"id\":\"splash-content\",\"className\":\"mx-auto w-full bg-surface-container-high px-4 py-8 md:container md:mb-10 md:rounded-lg lg:px-20 lg:py-12\",\"children\":[[\"$\",\"p\",null,{\"className\":\"mb-2 text-xl font-semibold text-on-surface-variant lg:mb-6 lg:text-center lg:text-3xl\",\"data-test-id\":\"country-list-title\",\"children\":\"Choose the German visa application centre in your place of residence\"}],[\"$\",\"p\",null,{\"className\":\"mb-3 text-sm text-on-surface-variant lg:text-base lg:font-semibold\",\"data-test-id\":\"country-list-subtitle\",\"children\":\"Please select your place of residence to continue\"}],[\"$\",\"$L2a\",null,{\"listPlaceholder\":\"Choose from\",\"confirmLabel\":\"Confirm\",\"countries\":[{\"name\":\"Armenia\",\"code\":\"am\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/c9502e99-5eb5-4eb5-83c5-606c08bbf75f\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Azerbaijan\",\"code\":\"az\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/8060d6d6-2071-4018-92e2-298d37e906fe\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Botswana\",\"code\":\"bw\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/c2c5c1dc-03af-412d-bed0-5cf14de83c75\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Egypt\",\"code\":\"eg\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/b077c09d-8da2-4497-9680-12ee288d1b6c\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Eswatini\",\"code\":\"sz\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/df372c24-5cf6-4fa1-a62c-148891b80396\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Islamic Republic of Iran\",\"code\":\"ir\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/dfd2d367-2459-405f-8397-d026c3fe0c52\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Kazakhstan\",\"code\":\"kz\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/ac199c83-c45e-4b22-b92d-a65a0f201ebc\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Kenya\",\"code\":\"ke\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/c0880439-6d9e-4c43-900d-4569e39f484f\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Kyrgyzstan\",\"code\":\"kg\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/3bef0c57-a937-4dce-b51b-4023c06ba643\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Lesotho\",\"code\":\"ls\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/9c17edef-9639-4c6c-820b-9d711b0cf38c\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Libya\",\"code\":\"ly\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/8d5ff1dd-e4fa-475e-92f9-e2fdd858a4ba\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Mauritius\",\"code\":\"mu\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/77c9294d-714f-45e0-a702-76b51de1140a\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Morocco\",\"code\":\"ma\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/2d8e51dc-ac08-4a03-a4ba-fa30d4570caf\",\"defaultLanguage\":\"fr-fr\"},{\"name\":\"Namibia\",\"code\":\"na\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/debfc96c-cda4-43bd-ac8e-6ea334d5c116\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Saudi Arabia\",\"code\":\"sa\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/95b18b3c-1bd6-4dac-b610-0f5339b0fc86\",\"defaultLanguage\":\"en-us\"},{\"name\":\"South Africa\",\"code\":\"za\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/33c9e825-2129-4440-9fed-8f68ad3e0288\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Tajikistan\",\"code\":\"tj\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/ce099645-fd6a-40e0-9625-c432ed694f77\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Tanzania\",\"code\":\"tz\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/13dd6957-7938-4101-98ae-431f2cedb52a\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Tunisia\",\"code\":\"tn\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/917c4907-0015-4914-ac5f-7b65a11e3471\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Uganda\",\"code\":\"ug\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/4f1468ef-01ff-4235-8216-7b2d0019da7a\",\"defaultLanguage\":\"en-us\"},{\"name\":\"United Kingdom\",\"code\":\"gb\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/0ee1102b-21f9-4be1-baa5-ec4ea5e78183\",\"defaultLanguage\":\"en-us\"},{\"name\":\"Uzbekistan\",\"code\":\"uz\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/52b31bbe-f4f7-4c40-9555-a721acd891e3\",\"defaultLanguage\":\"en-us\"}],\"countryRedirectionMap\":{\"ls\":\"za\",\"sz\":\"za\"}}]]}]\n"])</script><script>self.__next_f.push([1,"13:[\"$\",\"a\",null,{\"tabIndex\":0,\"href\":\"#page-title\",\"className\":\"absolute left-0 top-0 z-50 -translate-y-full transform bg-yellow-500 px-4 py-2 font-semibold transition focus:translate-y-0\",\"children\":\"Skip to main content\"}]\n"])</script><script>self.__next_f.push([1,"21:[\"$\",\"nav\",null,{\"id\":\"navbar\",\"className\":\"fixed top-0 z-20 flex h-12 w-full items-center gap-2 bg-header px-2 text-on-header shadow-md md:h-18 lg:pe-4 lg:ps-8 print:hidden\",\"children\":[[\"$\",\"a\",null,{\"href\":\"/en-us\",\"className\":\"relative block h-11 w-52\",\"children\":[\"$\",\"$L23\",null,{\"fill\":true,\"src\":\"https://cache-cms.directuscloud.tlscontact.com/assets/51249a1c-fbb6-4879-922f-2d5b8cf5faba\",\"alt\":\"TLScontact logo\",\"sizes\":\"200px\",\"priority\":true,\"className\":\"object-contain object-left\"}]}],[\"$\",\"div\",null,{\"className\":\"flex-1\"}],[\"$\",\"$L2b\",null,{\"issuerId\":\"$undefined\",\"cmsContent\":{\"consentPreferences\":\"Consent\",\"goToPayment\":\"Proceed to checkout\",\"login\":\"LOGIN\",\"logout\":\"Logout\",\"myApplication\":\"My application\",\"register\":\"REGISTER\",\"menuItems\":[]},\"showAuthButtons\":false,\"currentLanguage\":\"en-us\"}],[\"$\",\"$L2c\",null,{\"availableLanguages\":[{\"code\":\"ar-ar\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/21084a1b-a459-4019-9f76-9bff0e9ce518\",\"name\":\"Arabic\",\"id\":\"ar-ar\"},{\"code\":\"en-us\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/9856539f-4a08-476a-af02-98cf8a688aaa\",\"name\":\"English\",\"id\":\"en-us\"},{\"code\":\"fr-fr\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/ca841c4b-168c-405d-88b0-e05c2bc4a7eb\",\"name\":\"French\",\"id\":\"fr-fr\"},{\"code\":\"de-de\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/8a892811-a793-436a-a2e4-dcc290249a51\",\"name\":\"German\",\"id\":\"de-de\"},{\"code\":\"az-az\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/null\",\"name\":\"Azeri\",\"id\":\"az-az\"},{\"code\":\"ky-kg\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/null\",\"name\":\"Kyrgyz\",\"id\":\"ky-kg\"},{\"code\":\"fa-ir\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/null\",\"name\":\"Farsi\",\"id\":\"fa-ir\"},{\"code\":\"ru-ru\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/20465127-af21-4d74-b070-709274bc51f0\",\"name\":\"Russian\",\"id\":\"ru-ru\"},{\"code\":\"tg-tg\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/null\",\"name\":\"Tajik\",\"id\":\"tg-tg\"},{\"code\":\"uz-uz\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/d62b38ab-6d93-4e5d-bdc0-a14dfb8a17ca\",\"name\":\"Uzbek\",\"id\":\"uz-uz\"},{\"code\":\"kk-kz\",\"flag\":\"https://cache-cms.directuscloud.tlscontact.com/assets/d914fa7a-6641-404b-a96f-5d94407d4847\",\"name\":\"Kazakh\",\"id\":\"kk-kz\"}],\"selectedLanguage\":\"en-us\"}],[\"$\",\"$L2d\",null,{\"user\":{\"userName\":\"mohamed71291@gmail.com\",\"sessionState\":\"173c0175-ef4a-4ae0-8011-08b6dd330a7d\"},\"cmsContent\":\"$21:props:children:2:props:cmsContent\",\"lang\":\"en-us\",\"showConsentConsole\":\"$undefined\"}],\"$undefined\"]}]\n"])</script><script>self.__next_f.push([1,"29:[\"$\",\"div\",null,{\"className\":\"mx-auto p-4 md:container md:p-0\",\"children\":[[\"$\",\"$L2e\",null,{\"items\":[{\"image\":\"https://static.tlscontact.com/media/insurte_english_banner.jpg\",\"link\":\"https://insurte.com/schengen-travel-insurance?aff=aftl3e3q79xse3h4t3\u0026cd=Unknown\u0026ca=Germany\",\"title\":\"\",\"content\":\"\",\"type\":\"insurance\"}],\"type\":\"mobile\"}],[\"$\",\"$L2e\",null,{\"items\":[{\"image\":\"https://static.tlscontact.com/media/insurte_english_banner.jpg\",\"link\":\"https://insurte.com/schengen-travel-insurance?aff=aftl3e3q79xse3h4t3\u0026cd=Unknown\u0026ca=Germany\",\"title\":\"\",\"content\":\"\",\"type\":\"insurance\"}],\"type\":\"desktop\"}],\"$undefined\"]}]\n9:{\"metadata\":[[\"$\",\"title\",\"0\",{\"children\":\"Germany visa application centre | TLScontact\"}],[\"$\",\"link\",\"1\",{\"rel\":\"icon\",\"href\":\"/favicon.ico\",\"type\":\"image/x-icon\",\"sizes\":\"32x32\"}],[\"$\",\"$L2f\",\"2\",{}]],\"error\":null,\"digest\":\"$undefined\"}\ne:\"$9:metadata\"\n"])</script><script type="module" src="https://static.cloudflareinsights.com/beacon.min.js/v4513226cdae34746b4dedf0b4dfa099e1781791509496" integrity="sha512-ZE9pZaUXND66v380QUtch/5sE9tPFh2zg45pR2PB0CVkCtOREv2AJKkSidISWkysEuQ0EH8faUU5du78bx87UQ==" data-cf-beacon="{&quot;version&quot;:&quot;2024.11.0&quot;,&quot;token&quot;:&quot;89c2c2834f854b4c916c3c28ef5d92d4&quot;,&quot;server_timing&quot;:{&quot;name&quot;:{&quot;cfCacheStatus&quot;:true,&quot;cfEdge&quot;:true,&quot;cfExtPri&quot;:true,&quot;cfL4&quot;:true,&quot;cfOrigin&quot;:true,&quot;cfSpeedBrain&quot;:true},&quot;location_startswith&quot;:null}}" crossorigin="anonymous"></script>
<script>(function(){function c(){var b=a.contentDocument||a.contentWindow.document;if(b){var d=b.createElement('script');d.innerHTML="window.__CF$cv$params={r:'a1ecb77d4a323c2c',t:'MTc4NDY2MzIzOQ=='};var a=document.createElement('script');a.src='/cdn-cgi/challenge-platform/scripts/jsd/main.js';document.getElementsByTagName('head')[0].appendChild(a);";b.getElementsByTagName('head')[0].appendChild(d)}}if(document.body){var a=document.createElement('iframe');a.height=1;a.width=1;a.style.position='absolute';a.style.top=0;a.style.left=0;a.style.border='none';a.style.visibility='hidden';document.body.appendChild(a);if('loading'!==document.readyState)c();else if(window.addEventListener)document.addEventListener('DOMContentLoaded',c);else{var e=document.onreadystatechange||function(){};document.onreadystatechange=function(b){e(b);'loading'!==document.readyState&&(document.onreadystatechange=e,c())}}}})();</script><iframe height="1" width="1" style="position: absolute; top: 0px; left: 0px; border-width: medium; border-style: none; border-color: currentcolor; border-image: none; visibility: hidden;"></iframe><script src="https://cmp.osano.com/AzqL4lT4Pea7o2XE9/c9db9abf-709d-4404-9b82-fbe51b312b5f/osano.js" data-nscript="afterInteractive"></script><script src="https://recaptcha.net/recaptcha/api.js?render=6LevDoQeAAAAAEVrXcQsTo2zjgSO5oQs-PGf6ZW7" data-nscript="afterInteractive"></script><next-route-announcer style="position: absolute;"><template shadowrootmode="open"><div aria-live="assertive" id="__next-route-announcer__" role="alert" style="position: absolute; border: 0px; height: 1px; margin: -1px; padding: 0px; width: 1px; clip: rect(0px, 0px, 0px, 0px); overflow: hidden; white-space: nowrap; overflow-wrap: normal;">Germany Visa Application Centres | TLScontact</div></template></next-route-announcer><iframe name="__uspapiLocator" style="display: none;"></iframe><div><div class="grecaptcha-badge" data-style="bottomright" style="width: 256px; height: 60px; display: block; transition: right 0.3s; position: fixed; bottom: 14px; right: -186px; box-shadow: gray 0px 0px 5px; border-radius: 2px; overflow: hidden;"><div class="grecaptcha-logo"><iframe title="reCAPTCHA" width="256" height="60" role="presentation" name="a-uxyn931rbp1k" frameborder="0" scrolling="no" sandbox="allow-forms allow-popups allow-same-origin allow-scripts allow-top-navigation allow-modals allow-popups-to-escape-sandbox allow-storage-access-by-user-activation" src="https://recaptcha.net/recaptcha/api2/anchor?ar=2&amp;k=6LevDoQeAAAAAEVrXcQsTo2zjgSO5oQs-PGf6ZW7&amp;co=aHR0cHM6Ly92aXNhcy1kZS50bHNjb250YWN0LmNvbTo0NDM.&amp;hl=en&amp;v=A7KpaEASfhDcK0nXxgQEyyYv&amp;size=invisible&amp;anchor-ms=20000&amp;execute-ms=30000&amp;cb=o4gcibeyodin"></iframe></div><div class="grecaptcha-error"></div><textarea id="g-recaptcha-response-100000" name="g-recaptcha-response" class="g-recaptcha-response" style="width: 250px; height: 40px; border: 1px solid rgb(193, 193, 193); margin: 10px 25px; padding: 0px; resize: none; display: none;"></textarea></div><iframe style="display: none;"></iframe></div></body></html>
```
after your last ubdate it keep showing that page is unknown
```sh
:) python.exe .\app.py
[▶️] 'View' clicked on idle instance. Launching mohamed71291@gmail.com...
[🧵] Thread started for: mohamed71291@gmail.com
[📍] mohamed71291@gmail.com identified location: LOGIN_FORM
[🔐] mohamed71291@gmail.com injecting credentials...
    - Credentials entered. Checking for CAPTCHA...
[🧩] mohamed71291@gmail.com CAPTCHA detected on login form.
[🧩][58812] reCAPTCHA v2 detected. Initiating Audio Bypass strategy...
    - Clicked checkbox. Waiting for challenge...
    - Switched to audio challenge.
    - Looking for audio download link...
    - Audio stream URL captured. Downloading silently...
    - Transcription successful: 'venetian palace'
    - Submitted transcription and clicked Verify.
[✅][58812] CAPTCHA Audio Bypass successful!
    - CAPTCHA solved successfully. Submitting credentials.
[✅] mohamed71291@gmail.com login submitted.
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[📍] mohamed71291@gmail.com identified location: CHOOSE_COUNTRY
[🌍] mohamed71291@gmail.com handling country selection...
    - Selected country: Egypt
    - Confirmed country selection.
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[⚠️] mohamed71291@gmail.com is on an unknown page. Waiting...
[💡] Thread for mohamed71291@gmail.com has exited.
(wenv) PS C:\Users\Active\Desktop\Coding\Gradutaion\CustProjects\Omni-Booking-Automation-Suite\TLS_Germany> 
```
```


## FILE: .\temp.py

```py
import threading
import time

def task(name, delay=2):
    print(f"{name} is starting")
    time.sleep(delay)
    print(f"{name} has finished")

# Create two threads
thread1 = threading.Thread(target=task, args=("Process A",2))
thread2 = threading.Thread(target=task, args=("Process B",3))

# Start both threads
print("Main thread: Starting worker threads")
thread1.start()
thread2.start()

print("Main thread: Worker threads are running...")

# Wait for both threads to complete
thread1.join()
# thread2.join()
print("Main thread: Worker threads have Terminated")
```


## FILE: .\temp1.py

```py
import threading
import time

# Simulated function to download a file from a server
def download_file(server_name):
    print(f"Starting download from {server_name}...")
    time.sleep(2)  # Simulates 2 seconds of network/download lag
    print(f"Finished download from {server_name}.")

def main():
    servers = ["Server A", "Server B", "Server C"]
    start_time = time.time()

    print("--- Starting Threaded Downloads ---")
    threads = []
    
    # Create and start a thread for each server download
    for server in servers:
        t = threading.Thread(target=download_file, args=(server,))
        threads.append(t)
        t.start()

    # Wait for all download threads to finish before moving forward
    for t in threads:
        t.join()

    end_time = time.time()
    elapsed_time = end_time - start_time
    print(f"Total threaded execution time: {elapsed_time:.2f} seconds")

if __name__ == "__main__":
    main()
```


## FILE: .\theme.py

```py
# --- Global Stylesheet (QSS) for the Cyber Tactical Dark Theme ---
# This defines the entire visual profile of the application.
CYBER_DARK_STYLESHEET = """
    /* Main Window & Dialogs */
    QMainWindow, QDialog {
        background-color: #0B0F17; /* Deep Canvas Charcoal/Navy */
    }

    /* Labels */
    QLabel {
        color: #94A3B8; /* Slate Gray */
        font-size: 14px;
    }

    /* Input Fields */
    QLineEdit {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
    }
    QLineEdit:focus {
        border-color: #4F46E5; /* Indigo for focus */
    }

    /* Buttons */
    QPushButton {
        background-color: #334155; /* Slate */
        color: #E2E8F0;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
    }
    QPushButton:hover {
        background-color: #475569;
    }
    QPushButton:pressed {
        background-color: #1E293B;
    }

    /* Primary Action Button (Deploy) */
    QPushButton#deployButton {
        background-color: #2563EB; /* Blue */
        color: white;
    }
    QPushButton#deployButton:hover {
        background-color: #3B82F6;
    }

    /* Destructive Action Button (Terminate Suite) */
    QPushButton#terminateSuiteButton {
        background-color: #991B1B; /* Dark Crimson */
        color: white;
    }
    QPushButton#terminateSuiteButton:hover {
        background-color: #B91C1C;
    }

    /* Table Widget */
    QTableWidget {
        background-color: #121824; /* Panel Container */
        color: #94A3B8;
        border: 1px solid #334155;
        gridline-color: #1E293B;
        font-size: 13px;
    }

    /* Table Header */
    QHeaderView::section {
        background-color: #1E293B;
        color: #94A3B8;
        padding: 8px;
        border: 1px solid #334155;
        font-weight: bold;
    }

    /* Table Cells */
    QTableWidget::item {
        padding: 8px;
        border-bottom: 1px solid #1E293B;
    }
    QTableWidget::item:selected {
        background-color: #334155;
        color: #F1F5F9;
    }

    /* Scrollbars */
    QScrollBar:vertical, QScrollBar:horizontal {
        border: none;
        background: #121824;
        width: 10px;
        height: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:vertical, QScrollBar::handle:horizontal {
        background: #334155;
        min-height: 20px;
        min-width: 20px;
        border-radius: 5px;
    }

    /* SpinBox for Hot-Patching */
    QSpinBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 5px;
        font-size: 16px;
        font-weight: bold;
    }
    QSpinBox::up-button, QSpinBox::down-button {
        width: 20px;
    }
"""
```


## FILE: .\browsers\browser_base.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/browser_base.py
Handles page identification and specific page interactions continuously.
"""
import time
from typing import Callable
from seleniumbase import Driver
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from config import settings
from config.selectors import TLS_SELECTORS
from browsers.stealth_actions import StealthActions
from browsers.captcha_handler import CaptchaHandler

class BrowserBase:
    def __init__(self, driver: Driver, account: str, password: str, is_running_flag: Callable[[], bool]):
        self.driver = driver
        self.account = account
        self.password = password
        self.is_running = is_running_flag
        self.actor = StealthActions(self.driver)
        self.captcha_handler = CaptchaHandler(self.driver)
        self.login_attempted_on_this_page = False

    def identify_current_page(self) -> str:
        WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY).until(
            lambda d: d.execute_script('return document.readyState') == 'complete'
        )

        # Priority 0: Check for Cloudflare interstitial page.
        if "Just a moment..." in self.driver.get_title() and self.driver.is_element_visible(TLS_SELECTORS['cloudflare']['heading_text']):
            return "cloudflare_interstitial"

        # Priority 1: Check for the application list page, a key post-login state.
        if self.driver.is_element_visible(TLS_SELECTORS['application_list']['page_title_header']):
            if "Application manager" in self.driver.get_text(TLS_SELECTORS['application_list']['page_title_header']):
                return "application_list"

        # Priority 2: Check for the final logged-in state (the main dashboard for appointment checking).
        if self.driver.is_element_visible(TLS_SELECTORS['dashboard']['logged_in_anchor']):
            return "dashboard_ready"

        # Priority 3: Check for the login form itself.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['email_input_field']):
            return "login_form"

        # Priority 4 & 5: Check for specific pre-login setup pages.
        if self.driver.is_element_visible(TLS_SELECTORS['choose_country']['select_dropdown']):
            return "choose_country"
        
        if self.driver.is_element_visible(TLS_SELECTORS['choose_city']['page_title_header']):
            if "Select your Visa Application Centre" in self.driver.get_text(TLS_SELECTORS['choose_city']['page_title_header']):
                return "choose_city"

        # Priority 6: As a fallback, if a login button is visible in the header,
        # we're on a generic info page and need to log in. This implements your request
        # for a global "logged-out" check.
        if self.driver.is_element_visible(TLS_SELECTORS['info_page']['header_login_btn']):
            return "info_page"

        return "unknown"

    def navigate_to_target_state(self) -> None:
        while self.is_running():
            current_state = self.identify_current_page()

            if current_state != "login_form":
                self.login_attempted_on_this_page = False
            
            if current_state == "dashboard_ready":
                print(f"[🎯] {self.account} reached Dashboard. Handing over to timing engine...")
                break 

            elif current_state != "unknown":
                print(f"[📍] {self.account} identified location: {current_state.upper()}")
                self._handle_current_state(current_state)
            else:
                print(f"[⚠️] {self.account} is on an unknown page. Waiting...")
                time.sleep(2)
            
            time.sleep(2)

    def _handle_current_state(self, current_state: str) -> None:
        try:
            if current_state == "cloudflare_interstitial":
                self.captcha_handler.solve_interstitial_captcha()
            elif current_state == "login_form":
                self._workflow_login()
            elif current_state == "choose_country":
                self._workflow_choose_country()
            elif current_state == "choose_city":
                self._workflow_choose_city()
            elif current_state == "application_list":
                self._workflow_application_list()
            elif current_state == "info_page":
                self._workflow_info_page()
        except Exception as e:
            print(f"[❌] {self.account} failed to handle {current_state}: {e}")

    def _workflow_login(self) -> None:
        if not self.login_attempted_on_this_page:
            print(f"[🔐] {self.account} injecting credentials...")
            self.actor.smart_type(TLS_SELECTORS['login_form']['email_input_field'], self.account)
            self.actor.natural_delay()
            self.actor.smart_type(TLS_SELECTORS['login_form']['password_input_field'], self.password)
            self.login_attempted_on_this_page = True
            print(f"    - Credentials entered. Checking for CAPTCHA...")
            time.sleep(2) 

        # Step 2: Check for CAPTCHA.
        if self.driver.is_element_visible(TLS_SELECTORS['login_form']['captcha_widget']):
            print(f"[🧩] {self.account} CAPTCHA detected on login form.")
            
            # Attempt to solve automatically
            success = self.captcha_handler.solve_google_recaptcha() 
            
            if success:
                print(f"    - CAPTCHA solved successfully. Submitting credentials.")
                self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
                print(f"[✅] {self.account} login submitted.")
                time.sleep(3) # Wait for page to route
            else:
                print(f"    - Audio Bypass Blocked or Failed. Waiting 10 seconds for manual CAPTCHA solve...")
                time.sleep(10)
                
                # Fallback: Check if user solved it manually during the wait
                try:
                    # Use standard Selenium API for frame switching for better stability
                    checkbox_iframe = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'])
                    self.driver.switch_to.frame(checkbox_iframe)
                    is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
                    self.driver.switch_to.default_content()
                    
                    if str(is_checked).lower() == "true":
                        print(f"    - Manual CAPTCHA solve detected. Submitting credentials.")
                        self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
                        print(f"[✅] {self.account} login submitted.")
                        time.sleep(3)
                        return
                except Exception:
                    self.driver.switch_to.default_content()
                
                if self.identify_current_page() == "login_form":
                     print(f"[⚠️] Login stalled. Please solve CAPTCHA and click 'Login' manually.")
        else:
            print(f"    - No CAPTCHA detected. Submitting credentials.")
            self.actor.human_click(TLS_SELECTORS['login_form']['submit_login_btn'])
            print(f"[✅] {self.account} login submitted.")
            time.sleep(3)

    def _workflow_choose_country(self) -> None:
        print(f"[🌍] {self.account} handling country selection...")
        try:
            self.driver.wait_for_element_visible(TLS_SELECTORS['choose_country']['cookie_close_btn'], timeout=3)
            self.driver.click(TLS_SELECTORS['choose_country']['cookie_close_btn'])
            time.sleep(1) 
        except Exception:
            pass

        dropdown_selector = TLS_SELECTORS['choose_country']['select_dropdown']
        wait = WebDriverWait(self.driver, settings.WAIT_TIMEOUT_ELEMENT_READY)
        select_element = wait.until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, dropdown_selector))
        )
        
        select = Select(select_element)
        select.select_by_visible_text(settings.RESIDENCE['country'])

        print(f"    - Selected country: {settings.RESIDENCE['country']}")
        self.actor.natural_delay()
        self.actor.human_click(TLS_SELECTORS['choose_country']['confirm_country_btn'])
        print(f"    - Confirmed country selection.")

    def _workflow_choose_city(self) -> None:
        print(f"[🏢] {self.account} handling city selection...")
        city_name = settings.RESIDENCE['city']
        
        # This is a more robust way to find the city, by iterating through the cards
        # and matching the city name by text, rather than relying on a hardcoded href.
        city_cards_selector = "div.TlsVacCard_tls-vac-card__DLGQr"
        self.driver.wait_for_element_visible(city_cards_selector)
        cards = self.driver.find_elements(city_cards_selector)
        
        city_found = False
        for card in cards:
            try:
                card_title = card.find_element(By.CSS_SELECTOR, TLS_SELECTORS['choose_city']['city_card_title']).text
                
                if city_name.lower() in card_title.lower():
                    print(f"    - Found card for city: {card_title}")
                    continue_button = card.find_element(By.CSS_SELECTOR, TLS_SELECTORS['choose_city']['generic_continue_btn'])
                    self.driver.execute_script("arguments[0].click();", continue_button)
                    print(f"    - Clicked 'Continue' for {city_name}.")
                    city_found = True
                    break
            except Exception as e:
                print(f"    - Error processing a city card: {e}")
                continue
                
        if not city_found:
            print(f"[❌] CRITICAL: Could not find city card for '{city_name}'")
            time.sleep(10)

    def _workflow_info_page(self) -> None:
        print(f"[ℹ️] {self.account} found info page. Navigating to login...")
        self.actor.human_click(TLS_SELECTORS['info_page']['header_login_btn'])

    def _workflow_application_list(self) -> None:
        print(f"[📋] {self.account} on application list page. Clicking 'Select'...")
        try:
            self.actor.human_click(TLS_SELECTORS['application_list']['select_application_button'])
            print(f"    - 'Select' button clicked.")
            time.sleep(3) # Wait for next page
        except Exception as e:
            print(f"[❌] {self.account} could not find or click the 'Select' button on the application list page: {e}")
            time.sleep(5)
```


## FILE: .\browsers\captcha_handler.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/captcha_handler.py

Required dependencies for audio bypass:
pip install SpeechRecognition pydub requests
(Requires FFmpeg installed on system PATH for pydub to convert audio)
"""
import os
import time
import threading
import requests
import speech_recognition as sr
from pydub import AudioSegment
from seleniumbase import Driver
from config.selectors import TLS_SELECTORS

class CaptchaHandler:
    """
    Handles detection and resolution of Google reCAPTCHA v2 using Audio Bypass.
    """
    def __init__(self, driver: Driver):
        self.driver = driver

    def _dismiss_alerts(self):
        """Silently dismisses any unexpected browser alerts that freeze execution."""
        try:
            if self.driver.is_alert_present():
                self.driver.accept_alert()
        except Exception:
            pass

    def solve_interstitial_captcha(self) -> None:
        """
        Triggered when the bot hits a full-page Cloudflare block ("Just a moment...").
        This method waits for the Cloudflare Turnstile challenge to complete, clicking if necessary.
        """
        print("[🧩] CaptchaHandler: Interstitial Cloudflare block detected. Waiting for resolution...")
        
        # Cloudflare Turnstile can be passive or interactive.
        # We'll first try to click the checkbox if it becomes available.
        try:
            # SeleniumBase's ">>>" operator can pierce shadow-roots.
            # The selector targets the checkbox inside the Turnstile iframe.
            checkbox_selector = f"{TLS_SELECTORS['cloudflare']['turnstile_iframe']} >>> {TLS_SELECTORS['cloudflare']['turnstile_checkbox']}"
            
            # We give it a few seconds to appear. If not, we assume it's a passive check.
            self.driver.wait_for_element_visible(checkbox_selector, timeout=10)
            print("    - Found interactive Cloudflare Turnstile. Clicking checkbox...")
            self.driver.click(checkbox_selector)
            print("    - Clicked Turnstile checkbox.")
        except Exception:
            # If the checkbox isn't found or an error occurs, it's likely a passive challenge.
            # We'll just wait for it to resolve on its own.
            print("    - No interactive element found, or it resolved automatically. Waiting for page to proceed...")

        # After clicking (or not), we wait for the page to navigate away.
        # A good indicator is the main "Performing security verification" heading disappearing.
        try:
            print("    - Waiting for challenge to complete...")
            self.driver.wait_for_element_not_visible(TLS_SELECTORS['cloudflare']['heading_text'], timeout=30)
            print("[✅] CaptchaHandler: Cloudflare interstitial page seems to have passed.")
        except Exception:
            print("[⚠️] CaptchaHandler: Timed out waiting for Cloudflare page to resolve. The page might be stuck.")
        
        time.sleep(3) # Give it a moment to redirect.
        
    def _solve_audio_challenge_modal(self, thread_id: int) -> bool:
        """
        Handles the audio challenge modal after switching to its iframe.
        """
        mp3_path, wav_path = None, None
        try:
            self._dismiss_alerts()

            # 1. Check for Audio Block (Google blocking IP from automated queries)
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['error_message']):
                print(f"[❌][{thread_id}] IP blocked from audio challenge (Automated queries detected).")
                return False

            # 2. Extract Audio URL directly (WE SKIP THE PLAY BUTTON ENTIRELY TO AVOID BOT DETECTION)
            print(f"    - Looking for audio download link...")
            self.driver.wait_for_element_present(TLS_SELECTORS['recaptcha_v2']['audio_download_link'], timeout=10)
            audio_url = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['audio_download_link'], "href")

            # Fallback if the download link is empty
            if not audio_url:
                audio_url = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['audio_source'], "src")

            if not audio_url or not audio_url.startswith("http"):
                print(f"[❌][{thread_id}] Could not capture audio stream URL.")
                return False

            print(f"    - Audio stream URL captured. Downloading silently...")

            # 3. Generate unique file paths for thread safety
            timestamp = int(time.time())
            mp3_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.mp3")
            wav_path = os.path.abspath(f"./downloaded_files/audio_{thread_id}_{timestamp}.wav")

            # 4. Download MP3 using session cookies to prevent access denied
            session = requests.Session()
            for cookie in self.driver.get_cookies():
                session.cookies.set(cookie['name'], cookie['value'])
            
            response = session.get(audio_url, headers={'User-Agent': self.driver.get_user_agent()})
            with open(mp3_path, 'wb') as f:
                f.write(response.content)

            # 5. Convert MP3 to WAV using Pydub & FFmpeg
            try:
                AudioSegment.from_mp3(mp3_path).export(wav_path, format="wav")
            except FileNotFoundError:
                print(f"\n[⚠️ CRITICAL ERROR][{thread_id}] FFmpeg IS NOT INSTALLED OR NOT IN PATH!")
                print("    -> Pydub cannot convert MP3 to WAV without FFmpeg.")
                return False

            # 6. Transcribe WAV file to Text
            recognizer = sr.Recognizer()
            with sr.AudioFile(wav_path) as source:
                audio_data = recognizer.record(source)
            
            transcribed_text = recognizer.recognize_google(audio_data).lower()
            print(f"    - Transcription successful: '{transcribed_text}'")

            # 7. Type Response and Verify
            self.driver.type(TLS_SELECTORS['recaptcha_v2']['audio_response_input'], transcribed_text)
            time.sleep(0.5)
            # Using js_click() to bypass overlays
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['verify_button'])
            print(f"    - Submitted transcription and clicked Verify.")
            time.sleep(3)
            return True

        except Exception as e:
            err_str = str(e)
            err_msg = err_str.splitlines()[0] if err_str.splitlines() else str(e.__class__.__name__)
            print(f"[❌][{thread_id}] Audio challenge processing failed: {err_msg}")
            return False
        finally:
            # Clean up temp files
            if mp3_path and os.path.exists(mp3_path): os.remove(mp3_path)
            if wav_path and os.path.exists(wav_path): os.remove(wav_path)

    def solve_google_recaptcha(self) -> bool:
        """
        Main entry method called by BrowserBase to handle Google reCAPTCHA v2.
        """
        thread_id = threading.get_ident()
        print(f"[🧩][{thread_id}] reCAPTCHA v2 detected. Initiating Audio Bypass strategy...")
        
        os.makedirs("./downloaded_files", exist_ok=True)
        checkbox_iframe = None

        try:
            self._dismiss_alerts()
            time.sleep(2)

            # Step 1: Find and Switch to Checkbox Iframe safely
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'], timeout=12)
            checkbox_iframe = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['checkbox_iframe'])
            
            # Scroll to center to avoid getting blocked by floating headers
            self.driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", checkbox_iframe)
            time.sleep(1)

            self.driver.switch_to.frame(checkbox_iframe)
            self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['checkbox'], timeout=10)
            
            # Use js_click() to cut through Google's defensive layers
            self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['checkbox'])
            
            self.driver.switch_to.default_content()
            print(f"    - Clicked checkbox. Waiting for challenge...")
            time.sleep(3)

            self._dismiss_alerts()

            # Step 1.5: Check if instantly solved (Green Check)
            self.driver.switch_to.frame(checkbox_iframe)
            is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
            self.driver.switch_to.default_content()

            if str(is_checked).lower() == "true":
                print(f"[✅][{thread_id}] CAPTCHA instantly solved (Green Checkmark).")
                return True

            # Step 2: Switch to Challenge Iframe
            if self.driver.is_element_visible(TLS_SELECTORS['recaptcha_v2']['challenge_iframe']):
                challenge_iframe_element = self.driver.find_element("css selector", TLS_SELECTORS['recaptcha_v2']['challenge_iframe'])
                self.driver.switch_to.frame(challenge_iframe_element)
                
                # Click the Audio Headphone icon
                self.driver.wait_for_element_visible(TLS_SELECTORS['recaptcha_v2']['audio_button'], timeout=10)
                self.driver.js_click(TLS_SELECTORS['recaptcha_v2']['audio_button'])
                print(f"    - Switched to audio challenge.")
                time.sleep(2)

                # Delegate to Audio Resolver logic
                if not self._solve_audio_challenge_modal(thread_id):
                    self.driver.switch_to.default_content()
                    return False
            else:
                print(f"[❌][{thread_id}] Challenge iframe not found.")
                self.driver.switch_to.default_content()
                return False

            # Step 3: Final Verification Check
            self.driver.switch_to.default_content()
            if checkbox_iframe:
                self.driver.switch_to.frame(checkbox_iframe)
                is_checked = self.driver.get_attribute(TLS_SELECTORS['recaptcha_v2']['checkbox'], "aria-checked")
                self.driver.switch_to.default_content()

                if str(is_checked).lower() == "true":
                    print(f"[✅][{thread_id}] CAPTCHA Audio Bypass successful!")
                    return True
            
            print(f"[❌][{thread_id}] CAPTCHA verification failed after audio attempt.")
            return False

        except Exception as e:
            err_str = str(e)
            err_msg = err_str.splitlines()[0] if err_str.splitlines() else str(e.__class__.__name__)
            print(f"[❌][{thread_id}] An unexpected error occurred during CAPTCHA bypass: {err_msg}")
            try:
                self.driver.switch_to.default_content()
            except:
                pass
            return False
```


## FILE: .\browsers\chrome.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/chrome.py
Synchronous Thread-Based Implementation
"""
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import threading
import time
from typing import Optional, Dict
import datetime
from seleniumbase import Driver

from browsers.browser_base import BrowserBase
from config.settings import *

class ChromeManager:
    """
    Manages an isolated Chrome browser instance using pure threading.
    Handles lifecycle, threading, and precision timing.
    Delegates all page interaction to BrowserBase.
    """

    # Class-level lock to prevent race conditions during driver initialization,
    # especially when using seleniumbase's uc=True mode, which patches files on the fly.
    _driver_init_lock = threading.Lock()

    def __init__(
        self,
        account: str,
        password: str,
        url: str,
        target_hr: int = 0,
        target_min: int = 0,
        target_sec: int = 0,
        target_ms: int = 0,
        proxy_address: Optional[str] = None
    ) -> None:
        self.account = account
        self.password = password
        self.target_url = url
        self.target_hr = int(target_hr)
        self.target_min = int(target_min)
        self.target_sec = int(target_sec)
        self.target_ms = int(target_ms)
        self.proxy_address = proxy_address
        
        # --- Unique Identifiers for Isolation & Viewing ---
        # Create a filesystem-safe name for the profile directory
        self.account_safe_name = "".join([c if c.isalnum() else "_" for c in self.account])
        self.profile_path = os.path.abspath(f"./runtime_profiles/{self.account_safe_name}")
        self.window_title = f"Omni-Booking :: {self.account}"
        
        self.thread: Optional[threading.Thread] = None
        self.is_running = False
        self.driver: Optional[Driver] = None
        self.status = "Idle"

    def _build_stealth_profile(self) -> list:
        os.makedirs(self.profile_path, exist_ok=True)
        flags = [
            f"--user-data-dir={self.profile_path}",
            "--window-size=1280,800",
            "--disable-blink-features=AutomationControlled",
            "--disable-infobars",
            "--no-sandbox",
            "--disk-cache-size=1",
            "--media-cache-size=1",
            "--disable-dev-shm-usage",
            "--disable-gpu",
            "--disable-extensions"
        ]
        if self.proxy_address:
            flags.append(f"--proxy-server={self.proxy_address}")
        return flags

    def start_engine(self) -> None:
        if self.is_running:
            return

        self.is_running = True
        self.thread = threading.Thread(
            target=self._run_task,
            name=f"Thread_{self.account}",
            daemon=True
        )
        self.thread.start()

    def _run_task(self) -> None:
        print(f"[🧵] Thread started for: {self.account}")
        self.status = "Initializing"

        try:
            # 1. Initialize browser (synchronized to prevent race conditions)
            with ChromeManager._driver_init_lock:
                self.status = "Launching Driver"
                self.driver = Driver(
                    uc=True,
                    incognito=False,
                    chromium_arg=",".join(self._build_stealth_profile())
                )
            self.driver.execute_script(f"document.title = '{self.window_title}'")

            # 2. Navigate to the start URL
            self.status = "Navigating to Start URL"
            self.driver.get(self.target_url)

            # 3. Hand over control to the BrowserBase (The State Machine)
            self.status = "Routing to Dashboard"
            # Pass lambda to allow the loop to monitor the thread's running state
            navigator = BrowserBase(
                driver=self.driver, 
                account=self.account, 
                password=self.password,
                is_running_flag=lambda: self.is_running
            )

            # 4. START THE INFINITE ROUTING LOOP
            navigator.navigate_to_target_state()

            # 5. Precision Timing (Wait for the exact millisecond)
            if self.is_running:
                self._wait_until_target()

            # 6. Trigger Action
            if self.is_running:
                self.status = "Executing Action"
                self._execute_action()
                self.status = "Finished"
                
                # Idle loop: Keep browser open until stopped from the GUI
                while self.is_running:
                    time.sleep(0.5)

        except Exception as e:
            # This block is entered if an error occurs during automation,
            # or if driver.quit() is called by stop_engine, which raises an exception.
            if self.is_running: # If it's an unexpected error, not a manual stop
                error_msg = str(e).split('\n')[0]
                print(f"❌ [Error in {self.account}]: {error_msg}")
                self.status = f"Error: {error_msg}"
        
        # When the loop breaks (is_running=False) or an exception occurs, the thread ends.
        print(f"[💡] Thread for {self.account} has exited.")

    def _wait_until_target(self) -> None:
        """
        Waits until the specified H:M:S.ms. This loop is designed to be
        responsive to on-the-fly changes of the target time attributes from the GUI.
        """
        while self.is_running:
            # Re-calculate target_datetime in every loop to allow for hot-patching
            now = datetime.datetime.now()
            try:
                target_datetime = now.replace(
                    hour=self.target_hr, 
                    minute=self.target_min, 
                    second=self.target_sec, 
                    microsecond=self.target_ms * 1000,
                )
            except ValueError:
                self.status = f"Error: Invalid time {self.target_hr}:{self.target_min}:{self.target_sec}"
                print(f"❌ [{self.account}] {self.status}")
                # Do not self-terminate. Instead, idle here with an error status
                # to allow the user to see the problem and take manual action.
                while self.is_running:
                    time.sleep(1)
                return

            # If target time has already passed for today, aim for the next day
            if now > target_datetime:
                target_datetime += datetime.timedelta(days=1)

            self.status = f"Armed for {target_datetime.strftime('%H:%M:%S')}.{self.target_ms:03d}"

            # This is a busy-wait loop for high precision. A small sleep prevents 100% CPU usage
            # while remaining highly responsive to the exact target millisecond.
            while self.is_running and datetime.datetime.now() < target_datetime:
                time.sleep(0.001) # 1ms sleep for precision

            # If the loop was exited because the thread was stopped, just return.
            if not self.is_running:
                return

            # If we reached here, it's time to fire. Break the outer loop.
            break

    def _execute_action(self) -> None:
        print(f"🚀 [💥 FIRE] {self.account} executed at {time.time()}")

    def stop_engine(self) -> None:
        if not self.is_running: return
        
        self.is_running = False # Signal thread to stop its loops
        
        if self.driver:
            try:
                self.driver.quit()
            except Exception:
                # Ignore errors, e.g., if browser was already closed manually
                pass
            self.driver = None
            
        if "Error" not in self.status and self.status != "Finished":
            self.status = "Terminated"

if __name__ == "__main__":
    bot = ChromeManager(
        account="tivime8259@preparmy.com",
        password="Yallavisa@@123",
        target_hr=datetime.datetime.now().hour,
        target_min=datetime.datetime.now().minute,
        target_sec=(datetime.datetime.now().second + 10) % 60, # 10 seconds from now
        target_ms=0,
        url=BASE_URL # Testing from the base URL to verify routing works
    )

    bot.start_engine()
    try:
        bot.thread.join()
    except KeyboardInterrupt:
        bot.stop_engine()
```


## FILE: .\browsers\stealth_actions.py

```py
import time
import random
from seleniumbase import Driver
from config import settings

class StealthActions:
    """
    Synchronous utility class for human-like browser interactions.
    """

    def __init__(self, driver: Driver):
        self.driver = driver
        self.base_type_min = random.uniform(settings.TYPING_SPEED_MIN, settings.TYPING_SPEED_MIN + settings.PERSONA_TYPE_JITTER)
        self.base_type_max = random.uniform(settings.TYPING_SPEED_MAX - settings.PERSONA_TYPE_JITTER, settings.TYPING_SPEED_MAX)
        self.base_delay_min = random.uniform(settings.ACTION_DELAY_MIN, settings.ACTION_DELAY_MIN + settings.PERSONA_DELAY_JITTER)
        self.base_delay_max = random.uniform(settings.ACTION_DELAY_MAX - settings.PERSONA_DELAY_JITTER, settings.ACTION_DELAY_MAX)

    def natural_delay(self, min_sec: float = None, max_sec: float = None) -> None:
        """Pause execution using standard time.sleep()."""
        sleep_time = random.uniform(min_sec or self.base_delay_min, max_sec or self.base_delay_max)
        time.sleep(sleep_time)

    def smart_type(self, selector: str, text_to_type: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
            """Waits for field, clears it using JS, and types character-by-character."""
            
            # 1. الانتظار حتى يظهر العنصر
            self.driver.wait_for_element(selector, timeout=timeout)
            
            # 2. الوصول للعنصر كـ WebElement عادي
            # نستخدم find_element لأنها دالة قياسية موجودة في كل تعريفات Driver
            element = self.driver.find_element("css selector", selector)
            
            # 3. الطريقة الاحترافية لمسح الحقل باستخدام JavaScript
            # هذه الطريقة تتخطى أي مشاكل في المكتبات وتمسح الحقل فوراً
            self.driver.execute_script("arguments[0].value = '';", element)
            
            # 4. التركيز على الحقل والبدء في الكتابة
            self.driver.click(selector)
            for char in text_to_type:
                element.send_keys(char)
                time.sleep(random.uniform(self.base_type_min, self.base_type_max))
    def human_click(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Wait for element visibility, pause briefly (targeting), then click."""
        # التعديل هنا أيضاً: استخدام الدالة الشاملة
        self.driver.wait_for_element(selector, timeout=timeout)
        
        self.natural_delay()
        self.driver.click(selector)
    def safe_scroll(self, selector: str, timeout: int = settings.WAIT_TIMEOUT_ELEMENT_READY) -> None:
        """Scroll element into viewport smoothly."""
        self.driver.wait_for_element(selector, timeout=timeout)
        self.natural_delay(0.2, 0.5)
        self.driver.scroll_to(selector)
        self.natural_delay(0.3, 0.7)
```


## FILE: .\browsers\__init__.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/browsers/__init__.py
"""
```


## FILE: .\config\selectors.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/config/selectors.py
Fully mapped selectors for the TLScontact Germany workflow engines
"""

TLS_SELECTORS = {
    # [0] choose_country
    "choose_country": {
        "splash_container": "div#splash-country-selector",
        "select_dropdown": "select#select-country",
        "confirm_country_btn": "a#btn-confirm-country",
        "apply_for_visa_btn": "button#btn-apply-for-a-visa",
        "cookie_close_btn": "button.osano-cm-close"
    },

    # [1] choose_city
    "choose_city": {
        "page_title_header": "h1#page-title",
        "map_view_search_input": "input#search-vac-map-view",
        "list_view_search_input": "input#search-vac-list-view",
        "search_submit_btn": "input#search-vac-map-view + button",
        "vac_list_container": "ul.flex.flex-wrap",  # Container for the city cards
        "city_card_title": "p.TlsVacCard_tls-vac-card_title__qk6jS",
        "generic_continue_btn": "button[data-testid='btn-select-vac']",

        # Specific regional routing links
        "alexandria_center_route": "a[href*='/vac/egALY2de'] button[data-testid='btn-select-vac']",
        "cairo_center_route": "a[href*='/vac/egCAI2de'] button[data-testid='btn-select-vac']",
        "hurghada_center_route": "a[href*='/vac/egHRG2de'] button[data-testid='btn-select-vac']",
        "6th_of_october_route": "a[href*='/vac/egHAC2de'] button[data-testid='btn-select-vac']"
    },

    # [2] info_page
    "info_page": {
        "header_login_btn": "a[href*='/login']",
        "login_btn_inner_span": "a[href='/en-us/login'] span.TlsButton_tls-button__syUS5",
        "services_tab_link": "a[href$='/services']",
        "application_process_link": "a[href$='/application-process']",
        "news_bulletins_link": "a[href$='/news']",
        "address_hours_footer_link": "a[href$='/address-opening-hours']"
    },

    # [3] login_form
    "login_form": {
        "form_title_header": "h1#login-page-title",
        "email_input_field": "input#email-input-field",
        "password_input_field": "input#password-input-field",
        "forgot_password_btn": "a#forget-password",
        "submit_login_btn": "button#btn-login",
        "captcha_widget": "iframe[title='reCAPTCHA']"
    },
    
    # [4] Dashboard Ready State
    "dashboard": {
        "logged_in_anchor": "a[href*='/logout'], button.user-profile, div.dashboard-container"
    },

    # [5] Application List Page
    "application_list": {
        "page_title_header": "h1#page-title",
        # XPath ذكي ومضمون للبحث عن الزر بناءً على الكلمة المكتوبة داخله
        "select_application_button": "//button[contains(., 'Select') and @type='submit']",
        "create_new_button": "span[data-testid='btn-create-new-travel-group']"
    },

    # [6] Google reCAPTCHA v2 Elements
    "recaptcha_v2": {
        "checkbox_iframe": "iframe[title='reCAPTCHA']",
        "checkbox": "span#recaptcha-anchor",
        "challenge_iframe": "iframe[title*='recaptcha challenge']",
        "audio_play_button": "div.rc-audiochallenge-play-button button",
        "audio_button": "button#recaptcha-audio-button",
        "audio_source": "audio#audio-source",
        "audio_download_link": "a.rc-audiochallenge-tdownload-link",
        "audio_response_input": "input#audio-response",
        "verify_button": "button#recaptcha-verify-button",
        "error_message": "div.rc-audiochallenge-error-message",
        # Image Challenge selectors
        "image_challenge_payload": "div.rc-imageselect-payload",
        "image_challenge_instruction_desc": "div.rc-imageselect-desc",
        "image_challenge_instruction_strong": "div.rc-imageselect-desc strong",
        "image_challenge_tiles": "td.rc-imageselect-tile",
        "image_challenge_img": "img.rc-image-tile-33",
        "image_challenge_checkbox": "div.rc-imageselect-checkbox",
        "image_challenge_incorrect_response": "div.rc-imageselect-incorrect-response",
        "image_challenge_error_select_more": "div.rc-imageselect-error-select-more",
        "image_challenge_error_dynamic_more": "div.rc-imageselect-error-dynamic-more",
        "image_challenge_error_select_something": "div.rc-imageselect-error-select-something",
    },

    # [7] Cloudflare Interstitial Page
    "cloudflare": {
        "page_title": "Just a moment...", 
        "heading_text": "h2#fTjHU3", 
        "turnstile_iframe": "iframe[src*='challenges.cloudflare.com']",
        "turnstile_checkbox": "input[type='checkbox']", 
        "verification_successful_text": "h2#yZFa8" 
    }
}
```


## FILE: .\config\settings.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/config/settings.py
"""
URLS = [
    "https://visas-de.tlscontact.com/en-us",
    "https://auth.visas-de.tlscontact.com/auth/realms/atlas/protocol/openid-connect/auth?client_id=tlscitizen&redirect_uri=https%3A%2F%2Fvisas-de.tlscontact.com%2Fen-us%2Fauth-callback&state=%257B%2522csrf%2522%253A%2522bcbe284f-43fd-4829-9c87-402c56da8a4b%2522%257D&response_mode=query&response_type=code&scope=openid&nonce=b0768df2-85b0-44b6-8e98-212802dad580&ui_locales=en"
]

BASE_URL = URLS[1]
START_URL = URLS[1]

# --- TARGET DYNAMICS ---
# This dictionary drives the workflow dynamically
RESIDENCE = {
    "country": "Egypt", 
    "city": "Alexandria"
}
ACCOUNTS_FOR_TEST ={
    "test1":{
        "account": "tivime8259@preparmy.com",
        "password": "Yallavisa@@123",

    },
    "me":{
        "account":"mohamed71291@gmail.com",
        "password":"moed-TLS-25",
    }
}
# --- TYPING PROFILES ---
TYPING_SPEED_MIN = 0.05
TYPING_SPEED_MAX = 0.15

# --- ACTION DELAYS ---
ACTION_DELAY_MIN = 0.5
ACTION_DELAY_MAX = 1.2

# --- DIGITAL PERSONA BASELINES ---
PERSONA_TYPE_JITTER = 0.03
PERSONA_DELAY_JITTER = 0.2

# --- TIMEOUTS ---
WAIT_TIMEOUT_ELEMENT_READY = 10
```


## FILE: .\config\__init__.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/config/__init__.py
"""

```


## FILE: .\core\data_handler.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/core/data_handler.py
"""

import os
import re
import pandas as pd
from typing import List, Dict, Any, Optional

class DataIngestor:
    """
    General File Parser for Omni-Booking Suite.
    Dynamically handles required columns, rejects invalid files, 
    and gracefully skips invalid rows while capturing all dynamic columns.
    """

    def __init__(self, target_columns: Optional[List[str]] = None) -> None:
        # Default mandatory columns if none are provided
        self.required_columns: List[str] = target_columns or ['Account', 'Password']

    def _sanitize_and_parse(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Internal method to safely validate and parse the dataframe dynamically.
        Returns a structured dictionary with execution results.
        """
        # Clean column headers (removes accidental trailing spaces like "IP Address ")
        df.columns = df.columns.str.strip()

        # 1. File Level Validation
        missing_cols = [col for col in self.required_columns if col not in df.columns]
        if missing_cols:
            return {
                "success": False,
                "data": [],
                "error": f"File rejected. Missing required columns: {', '.join(missing_cols)}",
                "warnings": []
            }

        parsed_data = []
        warnings = []

        # 2. Row Level Validation & Dynamic Parsing
        for index, row in df.iterrows():
            try:
                row_dict = row.to_dict()
                row_is_valid = True
                
                # A. Validate mandatory columns
                for req_col in self.required_columns:
                    val = row_dict.get(req_col)
                    if pd.isna(val) or str(val).strip() == '' or str(val).strip().lower() == 'nan':
                        warnings.append(f"Row {index + 2} skipped: Missing required value for '{req_col}'.")
                        row_is_valid = False
                        break 
                
                if not row_is_valid:
                    continue

                # B. Dynamically clean and build the row payload
                cleaned_row = {}
                for key, val in row_dict.items():
                    if pd.isna(val):
                        cleaned_row[key] = None
                    elif isinstance(val, str):
                        cleaned_row[key] = val.strip()
                    else:
                        cleaned_row[key] = val

                # C. Ensure timing values are integers if they exist, otherwise default to 0
                for time_col in ['Second', 'Millisecond']:
                    if time_col in cleaned_row and cleaned_row[time_col] is not None:
                        try:
                            cleaned_row[time_col] = int(float(cleaned_row[time_col]))
                        except ValueError:
                            cleaned_row[time_col] = 0
                    elif time_col not in cleaned_row:
                        cleaned_row[time_col] = 0

                # D. Apply specific business logic fallbacks
                if 'Platform' not in cleaned_row or not cleaned_row['Platform']:
                    cleaned_row['Platform'] = 'TLS_Germany'
                    
                if 'Country' in cleaned_row and not cleaned_row['Country']:
                    cleaned_row['Country'] = 'blank'

                # Append the fully dynamic row dictionary
                parsed_data.append(cleaned_row)

            except Exception as e:
                warnings.append(f"Row {index + 2} skipped due to unexpected error: {str(e)}")
                
        return {
            "success": True,
            "data": parsed_data,
            "error": "",
            "warnings": warnings
        }

    def load_from_csv(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"success": False, "data": [], "error": "The selected CSV file does not exist.", "warnings": []}
        try:
            return self._sanitize_and_parse(pd.read_csv(file_path))
        except Exception as e:
            return {"success": False, "data": [], "error": f"Failed to read CSV file: {str(e)}", "warnings": []}

    def load_from_excel(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"success": False, "data": [], "error": "The selected Excel file does not exist.", "warnings": []}
        try:
            return self._sanitize_and_parse(pd.read_excel(file_path))
        except Exception as e:
            return {"success": False, "data": [], "error": f"Failed to read Excel file: {str(e)}", "warnings": []}

    def load_from_google_sheet(self, url: str) -> Dict[str, Any]:
        """
        Extracts data from a standard Google Sheets share link.
        Automatically converts the URL to a CSV export endpoint.
        """
        # Extract the Spreadsheet ID
        id_match = re.search(r'/d/([a-zA-Z0-9-_]+)', url)
        if not id_match:
            return {"success": False, "data": [], "error": "Invalid Google Sheets URL. Could not find Spreadsheet ID.", "warnings": []}
        
        spreadsheet_id = id_match.group(1)

        # Extract the GID (sheet page identifier) if present
        gid_match = re.search(r'[#&?]gid=([0-9]+)', url)
        
        if gid_match:
            gid = gid_match.group(1)
            export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
        else:
            export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv"

        print(f"[🌐] Fetching Google Sheet: {export_url}")

        try:
            storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            df = pd.read_csv(export_url, storage_options=storage_options)
            return self._sanitize_and_parse(df)
        except Exception as e:
            hint = "\n[Hint]: Ensure the Google Sheet is set to 'Anyone with the link can view'." if "HTTP Error 400" in str(e) else ""
            return {"success": False, "data": [], "error": f"Failed to fetch Google Sheet data: {str(e)}{hint}", "warnings": []}


if __name__ == "__main__":
    ingestor = DataIngestor()
    
    sheet_url = "https://docs.google.com/spreadsheets/d/12N0onox6RMsgRJ9uzzSGMkrKVqcCdfEnLm-GAsJyqPs/edit?usp=sharing"
    
    # Store the returned dictionary
    result = ingestor.load_from_google_sheet(sheet_url)
    
    if result["success"]:
        print(f"✅ Success! Loaded {len(result['data'])} accounts:\n")
        for row in result["data"]:
            print(row)
    else:
        print(f"❌ Critical Error: {result['error']}")
        
    if result["warnings"]:
        print("\n⚠️ Warnings (Skipped Rows):")
        for warn in result["warnings"]:
            print(f"- {warn}")
```


## FILE: .\core\__init__.py

```py
"""
Omni-Booking-Automation-Suite/TLS_Germany/core/__init__.py
"""

```


## FILE: .\gui\dialogs.py

```py
"""
Contains all QDialog-based pop-up windows for the application.
"""
from PyQt6.QtWidgets import (
    QDialog, QVBoxLayout, QHBoxLayout, QLabel, QSpinBox, QPushButton
)
from PyQt6.QtCore import Qt

from browsers.chrome import ChromeManager

class EditInstanceDialog(QDialog):
    """
    A modal dialog for live editing of a ChromeManager's target time parameters.
    Changes are "hot-patched" by directly modifying the attributes of the
    ChromeManager instance in memory while its thread is running.
    """
    def __init__(self, parent, instance: ChromeManager):
        super().__init__(parent)
        self.instance = instance

        self.setWindowTitle(f"Hot-Patch: {instance.account}")
        self.setModal(True)
        self.setFixedSize(320, 420)

        layout = QVBoxLayout(self)
        layout.setContentsMargins(20, 20, 20, 20)
        layout.setSpacing(15)

        title_label = QLabel(f"Target: {instance.account}")
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("font-size: 16px; font-weight: bold; color: #E2E8F0;")
        layout.addWidget(title_label)

        # Create spin boxes for time editing
        self.hour_spin = self._create_spinbox(layout, "Hour (0-23):", 0, 23, instance.target_hr)
        self.min_spin = self._create_spinbox(layout, "Minute (0-59):", 0, 59, instance.target_min)
        self.sec_spin = self._create_spinbox(layout, "Second (0-59):", 0, 59, instance.target_sec)
        self.ms_spin = self._create_spinbox(layout, "Millisecond (0-999):", 0, 999, instance.target_ms)

        layout.addStretch()

        # --- Action Buttons ---
        button_layout = QHBoxLayout()
        apply_btn = QPushButton("Apply Pulse")
        apply_btn.clicked.connect(self._apply_changes)
        cancel_btn = QPushButton("Cancel")
        cancel_btn.clicked.connect(self.reject)

        button_layout.addWidget(apply_btn)
        button_layout.addWidget(cancel_btn)
        layout.addLayout(button_layout)

    def _create_spinbox(self, layout: QVBoxLayout, label_text: str, min_val: int, max_val: int, initial_val: int) -> QSpinBox:
        """Factory helper to create a labeled QSpinBox and add it to the layout."""
        layout.addWidget(QLabel(label_text))
        spinbox = QSpinBox()
        spinbox.setRange(min_val, max_val)
        spinbox.setValue(initial_val)
        layout.addWidget(spinbox)
        return spinbox

    def _apply_changes(self):
        """
        Applies the new time values from the spinboxes directly to the
        ChromeManager instance's attributes. This is thread-safe for simple
        atomic assignments (like integers), and the running thread's timing loop
        is designed to read these values on each iteration.
        """
        new_hr = self.hour_spin.value()
        new_min = self.min_spin.value()
        new_sec = self.sec_spin.value()
        new_ms = self.ms_spin.value()

        # Direct memory update. This is thread-safe for simple assignments.
        self.instance.target_hr = new_hr
        self.instance.target_min = new_min
        self.instance.target_sec = new_sec
        self.instance.target_ms = new_ms

        print(f"[⚙️] Hot-Patch applied to {self.instance.account}. New target: {new_hr:02}:{new_min:02}:{new_sec:02}.{new_ms:03}")
        # Close the dialog
        self.accept()
```


## FILE: .\gui\get_page.py

```py
#!/usr/bin/env python
import os
import time
from seleniumbase import Driver

def dump_live_page_html(account_email: str, target_url: str):
    """
    Launches your isolated stealth browser profile, gives you time 
    to manually open the disappearing dropdown, and saves the live HTML.
    """
    # 1. Map to your existing isolated runtime profile folder
    safe_email = "".join([c if c.isalnum() else "_" for c in account_email])
    profile_path = os.path.abspath(f"./runtime_profiles/{safe_email}")
    
    flags = [
        f"--user-data-dir={profile_path}",
        "--window-size=1280,800",
        "--disable-blink-features=AutomationControlled"
    ]
    
    print(f"[🌐] Launching browser with session profile: {safe_email}")
    driver = Driver(uc=True, incognito=False, chromium_arg=",".join(flags))
    
    try:
        # 2. Navigate to your target TLScontact URL
        driver.get(target_url)
        
        # 3. The Countdown Window
        print("\n⏳ ACTION REQUIRED:")
        print("--> You have 8 seconds to click and EXPAND the dropdown menu on the screen now! Don't let go!")
        
        for i in range(8, 0, -1):
            print(f"Capturing live DOM snapshot in {i} seconds...", end="\r")
            time.sleep(1)
            
        # 4. Extract the exact live DOM state
        print("\n\n📸 Snapshot triggered! Extracting raw page source...")
        live_html = driver.page_source
        
        # 5. Save to your local project directory
        os.makedirs("./downloaded_files", exist_ok=True)
        output_file = "./downloaded_files/captured_dropdown_page.html"
        
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(live_html)
            
        print(f"✅ Success! Live HTML saved to: {output_file}")
        print("You can now open this file in VS Code and safely extract your CSS selectors.")
        
    except Exception as e:
        print(f"❌ Error encountered: {e}")
    finally:
        # Keep the browser open briefly for review, then close
        time.sleep(5)
        driver.quit()

if __name__ == "__main__":
    # Test values using your current working structures
    TARGET_ACCOUNT = "tivime8259@preparmy.com"
    TLS_URL = "https://visas-de.tlscontact.com/en-us" 
    
    dump_live_page_html(TARGET_ACCOUNT, TLS_URL)
```


## FILE: .\gui\gui.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/gui.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())
```


## FILE: .\gui\main.py

```py
#!/usr/bin/env python3
"""
Omni-Booking-Automation-Suite/TLS_Germany/main.py
Application entry point.
"""
import os
import sys

# Ensure the script can find project modules from the root directory
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from PyQt6.QtWidgets import QApplication
from gui.main_window import MainWindow

if __name__ == "__main__":
    app = QApplication(sys.argv)
    dashboard = MainWindow()
    dashboard.show()
    sys.exit(app.exec())
```


## FILE: .\gui\main_window.py

```py
"""
The main application window class. Manages UI, data loading, thread orchestration,
and state monitoring for the browser automation suite.
"""
from typing import Dict, List, Any, Optional

from PyQt6.QtWidgets import (
    QMainWindow, QWidget, QVBoxLayout, QHBoxLayout, QLineEdit, QPushButton,
    QTableWidget, QTableWidgetItem, QHeaderView, QMessageBox, QFileDialog,
    QAbstractItemView
)
from PyQt6.QtCore import Qt, QTimer
from PyQt6.QtGui import QColor, QBrush

from core.data_handler import DataIngestor
from browsers.chrome import ChromeManager
from config.settings import BASE_URL
from .theme import CYBER_DARK_STYLESHEET
from .dialogs import EditInstanceDialog

# Attempt to import pywin32 for the "View" functionality on Windows
try:
    import win32gui
    import win32con
    PYWIN32_AVAILABLE = True
except ImportError:
    PYWIN32_AVAILABLE = False

class MainWindow(QMainWindow):
    """
    The main application window class. Manages UI, data loading, thread orchestration,
    and state monitoring for the browser automation suite.
    """
    def __init__(self):
        super().__init__()

        # --- Core Application Setup ---
        self.setWindowTitle("Omni-Booking Automation Suite :: TLS Germany")
        self.setGeometry(100, 100, 1400, 700)
        self.setStyleSheet(CYBER_DARK_STYLESHEET)

        # --- State Management ---
        self.data_ingestor = DataIngestor() # Handles loading data from files/sheets.
        # Core state dictionary: Maps an account's email (as a unique ID) to its controlling ChromeManager instance.
        self.active_instances: Dict[str, ChromeManager] = {}
        # Performance optimization: Maps an account's email to its current row index in the table for fast UI updates.
        self.account_to_row: Dict[str, int] = {}

        # --- UI Initialization ---
        self._init_ui()

        # --- Background Processes ---
        # This timer is the heart of the live dashboard, periodically calling a method to refresh the UI.
        self.monitor_timer = QTimer(self)
        self.monitor_timer.timeout.connect(self._update_dashboard_from_state)
        self.monitor_timer.start(500) # Poll every 500ms

    def _init_ui(self):
        """Constructs and lays out all GUI elements."""
        central_widget = QWidget()
        self.setCentralWidget(central_widget)
        main_layout = QVBoxLayout(central_widget)
        main_layout.setContentsMargins(10, 10, 10, 10)
        main_layout.setSpacing(10)

        # --- TOP FRAME: Data Ingestion Controls ---
        top_layout = QHBoxLayout()
        self.data_source_entry = QLineEdit()
        self.data_source_entry.setPlaceholderText("Enter local file path or Google Sheet URL")
        browse_btn = QPushButton("Browse Files...")
        browse_btn.clicked.connect(self._browse_local_file)
        fetch_btn = QPushButton("Fetch Cloud Sheet")
        fetch_btn.clicked.connect(self._fetch_google_sheet)

        top_layout.addWidget(self.data_source_entry)
        top_layout.addWidget(browse_btn)
        top_layout.addWidget(fetch_btn)
        main_layout.addLayout(top_layout)

        # --- MIDDLE FRAME: Instance Tracker Table ---
        self.table = QTableWidget()
        self.table.setColumnCount(6)
        self.table.setHorizontalHeaderLabels([
            "", "Target Account Context", "Operational State (Status)",
            "Trigger Matrix (H:M:S.ms)", "Network Tunnel Routing (Proxy)", "Actions"
        ])
        
        # Enforce comfortable vertical row section height so custom button layouts fit perfectly
        self.table.verticalHeader().setDefaultSectionSize(36)
        
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(QHeaderView.ResizeMode.Stretch)
        header.setSectionResizeMode(0, QHeaderView.ResizeMode.ResizeToContents) # Checkbox
        header.setSectionResizeMode(1, QHeaderView.ResizeMode.Interactive)   # Account
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # Actions
        self.table.setColumnWidth(1, 350)

        # Allow selecting rows or individual cells for copy-pasting text.
        # Editing is disabled by default on QTableWidgetItems unless the 'ItemIsEditable' flag is set.
        self.table.setSelectionBehavior(QAbstractItemView.SelectionBehavior.SelectRows)
        self.table.setSelectionMode(QAbstractItemView.SelectionMode.SingleSelection)
        # Double-clicking a row still opens the edit dialog
        self.table.cellDoubleClicked.connect(self._open_edit_dialog)
        main_layout.addWidget(self.table)

        # --- BOTTOM FRAME: Main Control Panel ---
        bottom_layout = QHBoxLayout()
        deploy_btn = QPushButton("⚡ Deploy All Engines")
        deploy_btn.setObjectName("deployButton")
        deploy_btn.clicked.connect(self._deploy_all)

        edit_btn = QPushButton("⚙️ Hot-Patch Highlighted")
        edit_btn.clicked.connect(self._open_edit_dialog)

        select_all_btn = QPushButton("Select All")
        select_all_btn.clicked.connect(self._select_all)

        deselect_all_btn = QPushButton("Deselect All")
        deselect_all_btn.clicked.connect(self._deselect_all)

        terminate_selected_btn = QPushButton("Terminate Selected")
        terminate_selected_btn.clicked.connect(self._terminate_selected)

        delete_selected_btn = QPushButton("Delete Selected")
        delete_selected_btn.setStyleSheet("background-color: #7f1d1d; color: #f1f5f9;") # Dark Red
        delete_selected_btn.clicked.connect(self._delete_selected)

        terminate_all_btn = QPushButton("🛑 Terminate Suite")
        terminate_all_btn.setObjectName("terminateSuiteButton")
        terminate_all_btn.clicked.connect(self._terminate_all)

        bottom_layout.addWidget(deploy_btn)
        bottom_layout.addWidget(edit_btn)
        bottom_layout.addStretch(1)
        bottom_layout.addWidget(select_all_btn)
        bottom_layout.addWidget(deselect_all_btn)
        bottom_layout.addSpacing(20)
        bottom_layout.addWidget(terminate_selected_btn)
        bottom_layout.addWidget(delete_selected_btn)
        bottom_layout.addStretch(2)
        bottom_layout.addWidget(terminate_all_btn)
        main_layout.addLayout(bottom_layout)

    def _browse_local_file(self):
        """Opens a file dialog to select a local data file and loads it."""
        file_path, _ = QFileDialog.getOpenFileName(self, "Select Data File", "", "Data Files (*.xlsx *.xls *.csv)")
        if file_path:
            self.data_source_entry.setText(file_path)
            self._load_data(file_path)

    def _fetch_google_sheet(self):
        """Takes the URL from the entry box and attempts to load it as a Google Sheet."""
        url = self.data_source_entry.text().strip()
        if "docs.google.com" not in url:
            QMessageBox.critical(self, "Invalid URL", "Please enter a valid Google Sheets URL.")
            return
        self._load_data(url)

    def _load_data(self, source: str):
        """
        Central data loading function. It terminates any running instances,
        calls the DataIngestor, and then populates the UI table with the new data.
        """
        # Safety check: ensure user confirms before wiping existing session.
        if self.active_instances:
            reply = QMessageBox.question(self, "Confirm", "Loading new data will terminate all running instances. Continue?",
                                         QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
            if reply == QMessageBox.StandardButton.No: return
            self._terminate_all(silent=True)

        result = self.data_ingestor.load_from_source(source)

        if not result["success"]:
            QMessageBox.critical(self, "Data Loading Failed", result["error"])
            return
        if result["warnings"]:
            warnings_text = "\n".join(result["warnings"])
            QMessageBox.warning(self, "Data Loading Warnings", f"Some rows were skipped:\n\n{warnings_text}")

        self._populate_table(result["data"])

    def _populate_table(self, data: List[Dict[str, Any]]):
        """
        Clears the current table and state, then builds new ChromeManager instances
        and UI rows for each entry in the provided data.
        """
        self.table.setRowCount(0)
        self.active_instances.clear()
        self.account_to_row.clear()

        for i, row_data in enumerate(data):
            account = row_data.get('Account', f'N/A_{i}')
            manager = ChromeManager(
                account=account,
                password=row_data.get('Password', ''),
                url=BASE_URL,
                target_hr=int(row_data.get('Hour', 0)),
                target_min=int(row_data.get('Minute', 0)),
                target_sec=int(row_data.get('Second', 0)),
                target_ms=int(row_data.get('Millisecond', 0)),
                proxy_address=row_data.get('Proxy') if row_data.get('Proxy') != 'None' else None
            )
            self.active_instances[account] = manager
            self.account_to_row[account] = i

            self.table.insertRow(i)

            # Column 0: Checkbox
            check_item = QTableWidgetItem()
            check_item.setFlags(Qt.ItemFlag.ItemIsUserCheckable | Qt.ItemFlag.ItemIsEnabled)
            check_item.setCheckState(Qt.CheckState.Unchecked)
            self.table.setItem(i, 0, check_item)

            # Column 1: Account
            self.table.setItem(i, 1, QTableWidgetItem(account))
            # Column 2: Status
            self.table.setItem(i, 2, QTableWidgetItem(manager.status))
            # Column 3: Time
            time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            self.table.setItem(i, 3, QTableWidgetItem(time_str))
            # Column 4: Proxy
            self.table.setItem(i, 4, QTableWidgetItem(str(manager.proxy_address or 'None')))
            # Column 5: Actions
            self._add_action_buttons(i, account)

        self.table.resizeColumnsToContents()
        header = self.table.horizontalHeader()
        header.setSectionResizeMode(2, QHeaderView.ResizeMode.Stretch) # Status column
        header.setSectionResizeMode(5, QHeaderView.ResizeMode.ResizeToContents) # Actions

    def _add_action_buttons(self, row: int, account: str):
        """
        Creates a widget containing the 'View', 'Terminate', and 'Delete' buttons
        for a single row and sets it in the 'Actions' column.
        """
        actions_widget = QWidget()
        layout = QHBoxLayout(actions_widget)
        layout.setContentsMargins(5, 0, 5, 0)
        layout.setSpacing(5)

        # Normalized CSS theme templates: Compact padding prevents layout vertical truncation bugs entirely
        view_btn = QPushButton("View")
        view_btn.setToolTip("View this instance's browser window")
        view_btn.setStyleSheet("""
            QPushButton { 
                background-color: #0891B2; 
                color: white; 
                font-size: 11px; 
                padding: 4px 12px; 
                font-weight: bold; 
                border: none; 
                border-radius: 4px; 
            } 
            QPushButton:hover { 
                background-color: #06B6D4; 
            }
        """)
        view_btn.clicked.connect(lambda checked, acc=account: self._view_instance(acc))

        term_btn = QPushButton("Close")
        term_btn.setToolTip("Terminate this instance's process")
        term_btn.setStyleSheet("""
            QPushButton { 
                background-color: #D97706; 
                color: white; 
                font-size: 11px; 
                padding: 4px 12px; 
                font-weight: bold; 
                border: none; 
                border-radius: 4px; 
            } 
            QPushButton:hover { 
                background-color: #F59E0B; 
            }
        """)
        term_btn.clicked.connect(lambda checked, acc=account: self._terminate_instance(acc))

        del_btn = QPushButton("Delete")
        del_btn.setToolTip("Terminate and delete this instance from the list")
        del_btn.setStyleSheet("""
            QPushButton { 
                background-color: #B91C1C; 
                color: white; 
                font-size: 11px; 
                padding: 4px 12px; 
                font-weight: bold; 
                border: none; 
                border-radius: 4px; 
            } 
            QPushButton:hover { 
                background-color: #EF4444; 
            }
        """)
        del_btn.clicked.connect(lambda checked, acc=account: self._delete_instance(acc))

        layout.addWidget(view_btn)
        layout.addWidget(term_btn)
        layout.addWidget(del_btn)
        layout.addStretch()
        self.table.setCellWidget(row, 5, actions_widget)

    def _deploy_all(self):
        """Starts the automation engine for all loaded instances that are not already running."""
        if not self.active_instances:
            QMessageBox.information(self, "No Data", "Please load account data before deploying.")
            return
        for manager in self.active_instances.values():
            if not manager.is_running:
                manager.start_engine()

    def _terminate_all(self, silent: bool = False):
        """Stops the automation engine for all running instances."""
        if not self.active_instances and not silent:
            QMessageBox.information(self, "No Instances", "There are no active instances to terminate.")
            return
        for manager in self.active_instances.values():
            if manager.is_running:
                manager.stop_engine()

    def _terminate_selected(self):
        """Terminates all instances that have their checkbox ticked."""
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to terminate.")
            return
        for account in accounts:
            self._terminate_instance(account)

    def _terminate_instance(self, account: str):
        """Stops the engine for a specific instance by its account ID."""
        manager = self.active_instances.get(account)
        if manager and manager.is_running:
            manager.stop_engine()

    def _view_instance(self, account: str):
        """
        Brings an instance's browser window to the foreground.
        If the instance isn't running, it will be launched first.
        NOTE: This functionality relies on the 'pywin32' library and only works on Windows.
        """
        manager = self.active_instances.get(account)
        if not manager:
            return

        # If the instance is idle, clicking 'View' is a convenient way to launch it.
        if not manager.is_running:
            print(f"[▶️] 'View' clicked on idle instance. Launching {account}...")
            manager.start_engine()
            QMessageBox.information(self, "Instance Launching", f"The browser for {account} is now being launched.")
            return

        # On non-Windows systems or if pywin32 is not installed, inform the user.
        if not PYWIN32_AVAILABLE:
            QMessageBox.warning(self, "Feature Unavailable", "The 'pywin32' library is required to focus windows. Please install it (`pip install pywin32`) and restart.\n\nThis feature is only available on Windows.")
            return

        window_title = manager.window_title
        hwnd = win32gui.FindWindow(None, window_title)

        # If we found the window handle, use it to restore and focus the window.
        if hwnd:
            print(f"[👁️] Found window for {account} (HWND: {hwnd}). Bringing to front.")
            # Restore if minimized
            win32gui.ShowWindow(hwnd, win32con.SW_RESTORE)
            # Bring to foreground
            win32gui.SetForegroundWindow(hwnd)
        else:
            QMessageBox.warning(self, "Window Not Found", f"Could not find the browser window for {account}.\nIt might still be launching or may have been closed manually.")

    def _delete_instance(self, account: str):
        """Terminates and removes an instance entirely from the UI and state."""
        self._terminate_instance(account)

        row_to_remove = self.account_to_row.get(account)
        if row_to_remove is not None:
            self.table.removeRow(row_to_remove)
            if account in self.active_instances:
                del self.active_instances[account]
            # The row map will be incorrect after this, so we rebuild it.
            self._rebuild_row_map()

    def _delete_selected(self):
        """Terminates and removes all checked instances."""
        accounts = self._get_checked_accounts()
        if not accounts:
            QMessageBox.warning(self, "No Selection", "Please check one or more instances to delete.")
            return

        reply = QMessageBox.question(self, "Confirm Deletion", f"This will terminate and remove {len(accounts)} instance(s). Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.No:
            return

        # Get a static list of rows to remove, sorted descending to avoid index errors
        rows_to_remove = sorted([self.account_to_row[acc] for acc in accounts if acc in self.account_to_row], reverse=True)

        for row in rows_to_remove:
            # Find account for this row before it's deleted (account is in column 1)
            account = self.table.item(row, 1).text()
            self._terminate_instance(account) # Stop thread
            if account in self.active_instances:
                del self.active_instances[account]

        # Remove rows from the table UI after processing
        for row in rows_to_remove:
            self.table.removeRow(row)

        # Finally, rebuild the clean mapping from account to the new row indices
        self._rebuild_row_map()

    def _get_checked_accounts(self) -> List[str]:
        """Returns a list of account names for all checked rows."""
        checked_accounts = []
        for row in range(self.table.rowCount()):
            # Checkbox is in column 0
            if self.table.item(row, 0).checkState() == Qt.CheckState.Checked:
                # Account is in column 1
                account_item = self.table.item(row, 1)
                if account_item:
                    checked_accounts.append(account_item.text())
        return checked_accounts

    def _open_edit_dialog(self):
        """Opens the 'Hot-Patch' dialog for the currently highlighted row in the table."""
        selected_rows = self.table.selectionModel().selectedRows()
        if not selected_rows:
            QMessageBox.warning(self, "No Selection", "Please highlight a single instance to edit.")
            return
        # Account is in column 1
        account = self.table.item(selected_rows[0].row(), 1).text()
        instance = self.active_instances.get(account)
        if instance:
            dialog = EditInstanceDialog(self, instance)
            dialog.exec()

    def _update_dashboard_from_state(self):
        """
        The heart of the dashboard's live updates. This method is called by a QTimer.
        It iterates through all active instances, reads their current state (status, time), and updates the UI table.
        """
        status_colors = {
            "active": QColor("#00FF66"), "error": QColor("#FF4D4D"),
            "loading": QColor("#FFD633"), "default": QColor("#0F1420")
        }

        for account, manager in self.active_instances.items():
            row = self.account_to_row.get(account)
            if row is None: continue

            # Update the 'Operational State (Status)' column and apply color-coding.
            status_item = self.table.item(row, 2)
            if status_item.text() != manager.status:
                status_item.setText(manager.status)
                status_lower = manager.status.lower()
                color_key = "default"
                if "error" in status_lower or "terminated" in status_lower: color_key = "error"
                elif "armed" in status_lower or "executing" in status_lower or "dashboard" in status_lower: color_key = "active"
                elif "init" in status_lower or "launching" in status_lower or "navigating" in status_lower or "routing" in status_lower: color_key = "loading"
                status_item.setBackground(QBrush(status_colors[color_key]))

            # Update the 'Trigger Matrix' column. This ensures changes from the Hot-Patch dialog are reflected.
            time_item = self.table.item(row, 3)
            new_time_str = f"{manager.target_hr:02}:{manager.target_min:02}:{manager.target_sec:02}.{manager.target_ms:03}"
            if time_item.text() != new_time_str:
                time_item.setText(new_time_str)

    def _select_all(self):
        """Sets all row checkboxes to checked."""
        for row in range(self.table.rowCount()):
            self.table.item(row, 0).setCheckState(Qt.CheckState.Checked)

    def _deselect_all(self):
        """Sets all row checkboxes to unchecked."""
        for row in range(self.table.rowCount()):
            self.table.item(row, 0).setCheckState(Qt.CheckState.Unchecked)

    def _rebuild_row_map(self):
        """
        Clears and rebuilds the account-to-row index map.
        This is a crucial maintenance step to call after any row(s) are deleted from the table,
        ensuring the fast lookup map doesn't point to incorrect or non-existent rows.
        """
        self.account_to_row.clear()
        for row in range(self.table.rowCount()):
            self.account_to_row[self.table.item(row, 1).text()] = row

    def closeEvent(self, event):
        """Handles the application close event, ensuring all threads are terminated."""
        reply = QMessageBox.question(self, 'Quit', "This will terminate all running browser instances. Are you sure?",
                                     QMessageBox.StandardButton.Yes | QMessageBox.StandardButton.No,
                                     QMessageBox.StandardButton.No)
        if reply == QMessageBox.StandardButton.Yes:
            self._terminate_all(silent=True)
            event.accept()
        else:
            event.ignore()


def _patch_data_ingestor():
    """Dynamically adds a generic load_from_source method to DataIngestor."""
    def load_from_source(self, source: str) -> Dict[str, Any]:
        if "docs.google.com" in source:
            return self.load_from_google_sheet(source)
        elif source.endswith(('.xlsx', '.xls')):
            return self.load_from_excel(source)
        elif source.endswith('.csv'):
            return self.load_from_csv(source)
        return {"success": False, "data": [], "error": "Unsupported file or URL format.", "warnings": []}
    DataIngestor.load_from_source = load_from_source

_patch_data_ingestor()
```


## FILE: .\gui\theme.py

```py
# --- Global Stylesheet (QSS) for the Cyber Tactical Dark Theme ---
# This defines the entire visual profile of the application.
CYBER_DARK_STYLESHEET = """
    /* Main Window & Dialogs */
    QMainWindow, QDialog {
        background-color: #0B0F17; /* Deep Canvas Charcoal/Navy */
    }

    /* Labels */
    QLabel {
        color: #94A3B8; /* Slate Gray */
        font-size: 14px;
    }

    /* Input Fields */
    QLineEdit {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 8px;
        font-size: 14px;
    }
    QLineEdit:focus {
        border-color: #4F46E5; /* Indigo for focus */
    }

    /* Buttons */
    QPushButton {
        background-color: #334155; /* Slate */
        color: #E2E8F0;
        border: none;
        border-radius: 4px;
        padding: 8px 16px;
        font-size: 14px;
        font-weight: bold;
    }
    QPushButton:hover {
        background-color: #475569;
    }
    QPushButton:pressed {
        background-color: #1E293B;
    }

    /* Primary Action Button (Deploy) */
    QPushButton#deployButton {
        background-color: #2563EB; /* Blue */
        color: white;
    }
    QPushButton#deployButton:hover {
        background-color: #3B82F6;
    }

    /* Destructive Action Button (Terminate Suite) */
    QPushButton#terminateSuiteButton {
        background-color: #991B1B; /* Dark Crimson */
        color: white;
    }
    QPushButton#terminateSuiteButton:hover {
        background-color: #B91C1C;
    }

    /* Table Widget */
    QTableWidget {
        background-color: #121824; /* Panel Container */
        color: #94A3B8;
        border: 1px solid #334155;
        gridline-color: #1E293B;
        font-size: 13px;
    }

    /* Table Header */
    QHeaderView::section {
        background-color: #1E293B;
        color: #94A3B8;
        padding: 8px;
        border: 1px solid #334155;
        font-weight: bold;
    }

    /* Table Cells */
    QTableWidget::item {
        padding: 8px;
        border-bottom: 1px solid #1E293B;
    }
    QTableWidget::item:selected {
        background-color: #334155;
        color: #F1F5F9;
    }

    /* Scrollbars */
    QScrollBar:vertical, QScrollBar:horizontal {
        border: none;
        background: #121824;
        width: 10px;
        height: 10px;
        margin: 0px 0px 0px 0px;
    }
    QScrollBar::handle:vertical, QScrollBar::handle:horizontal {
        background: #334155;
        min-height: 20px;
        min-width: 20px;
        border-radius: 5px;
    }

    /* SpinBox for Hot-Patching */
    QSpinBox {
        background-color: #0F1420;
        color: #E2E8F0;
        border: 1px solid #334155;
        border-radius: 4px;
        padding: 5px;
        font-size: 16px;
        font-weight: bold;
    }
    QSpinBox::up-button, QSpinBox::down-button {
        width: 20px;
    }
"""
```


## FILE: .\gui\__init__.py

```py

```
