
A - in injection.js we will do `VisaAutomationAgent` class  that class will be used inside `Chromeworker` class
0 bot will open navigate to login normally
so im moving 
A *signin injected script method `VisaAutomationAgent.signin will` inject sign in function*
1 - accept cookies 
2- handle cloud flare captcha 
3-fill signin  from .. but in sing in there are there methods by default its fill user will chose from  main window to apply for all accounts 
 -typing (letter by letter)
 -paste  (mimic copy paste action)
 -fill (fill them both at once)
 -random(apply one of previous there method each time randomly)
  "bot will pass this config to signin injected script as well as account and password"
 C- bot will press `Start New Pocking` then inject other part of script
 B - Appointment Details
  *`VisaAutomationAgent.appointmentDetails` function in injection.js will named "Appointment-Details"*
  **if it  receive termination signal from bot it should be stopped pr find appointment**

 1- fill `Appointment Details` from data 
 2- if no appointment do subcategory switches  until finding appointment press continue until now injected function stops
 3- *bot keeps monitor as it doing always  bot have functionality to aller user converting visible mode keep it as its*  
A-
i want make signIn  in throw injection 
in want `injection`.js i want to but function`injectionSignIn` to inject it 
that function will
1 - accept cookies 
2- handle cloud flare captcha 
3-fill signin  from .. but in sing in there are there methods by default its fill user will chose from  main window to apply for all accounts 
 -typing (letter by letter)
 -paste  (mimic copy paste action)
 -fill (fill them both at once)
 -random(apply one of previous there method each time randomly)
  "bot will pass this config to signin injected script as well as account and password"
  it will depend in selector that  already exist in `config/injection.js`
  4- in  main window add drop down list to make user chose the way to type email and password 
  5- `injectionSignIn` will be injected using `chromeWorker.signIn` and all data  like  `account` `password`  `selectors`  passed to `injectionSignIn`
  when it called inside `chromeWorker.signIn`
  config like typing method will be  passed from `gui` to `chromeWorker.signIn` to `injectionSignIn`
B-