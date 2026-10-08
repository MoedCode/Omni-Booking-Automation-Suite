

__in this prompt i file n there are tow digit before each line fires is the step number  second digit is subset number__
00 - *Your Details Summary*bot will click continue button in `Your Details Summary` directly
    01 -  read attached  html file PDF file Your-Details-Summary.html/.pdf 
    02 - update `config/selectors` an other necessary code in other files
 10- *Book an Appointment* in `Browsers/injection.js`then inject script that handle  `bookAnAppointment` function that handle `Book an Appointment` page 
    11-  select fires appoint available if not exist in the currant "the month we  currently in now" month scroll until find encounter first  month with avialble appointment 
    chose first appointment in this month 
    12 - then select from `Choose an appointment time` drop down list according to what in `hot-batch`but
         -according to to waht user select from `Choose an appointment time` list that in hot-batch 
        - `All` , `morning`, `After none`, `evening`
         - if encounter div like that 
         `<div class="card bg-brand-dark-green text-white rounded-0 mt-20"><div class="card-body"> No Slots Available </div></div>`
           switch to all again ..
    13 - click on `select` input  radio
    14- click on continue `button`
    15 - read files `Book appointment _ VFS Global.html/.pdf`update necessary 
    16- read `Element.md` for `Choose an appointment time` list items 

 20 -*services* bot directly with  click in continue `button` in `services` page and will not add any service 
     21 - read `Services _ VFS Global.pdf/.pdf`update necessary code

 30 -*Review* in `Review` page bot will handled directly by bot without injection 
     31- click on  `check box input` `I accept theTerms and Conditions`
     32- Click `Pay Online` button
     33- read `Review _ VFS Global.html/.pdf`update necessary code

 40- `Payment Disclaimer` button handled directly by bot without injection 
     41 - read `Payment-Disclaimer.html/.pdf`update necessary code
 50- `PayFort` when incounter this page here will alert user with pop up ..telling them we bocked appointment ..notify him to bay ... 
     51- if we reach to this page mean bot successfully done  hold or catch appointment ,,but by ment will done manually by user so must pop up user telling him that
     52 - read `PayFort.html/.html` just update Slelectors to make bot know  this page but no any action will be taken on it


  60- in `gui` you will add o other section in hot-batch titled as  `Book an Appointment` page 
     61- there are `Choose an appointment time` exactly like it appers in VFS  page 
 ##- in `config/settings.js` add new keys , `config/selectors` again we dont use `class` or `id` selectors it might change
 ## - when browser closed  availability   status must be turned of ,,,    
 _  _  _  _  _  _  _ _   _
/|\/|\/|\/|\/|\/|\/|\/|\/|\
\|/\|/\|/\|/\|/\|/\|/\|/\|/
