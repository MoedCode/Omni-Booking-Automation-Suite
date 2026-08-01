1- i want attribute in host `batch meuse` to by as in accounts
`accounts.xlsx` column headers

Account, Password, Second, Millisecond, End Time month, year, city
in settings.py
default those in `config/settings.py`
if values not exist in `accounts.xlsx`
city:Alexandria
month:August
year:2026
seconds:1
Millisecond:1
end_time:None
also create list  `mediatory_attributes`
with  `["account", "passwords"]`
if end time one means it last until uer terminate it ..when session expired re login again
2-user can manually ad instants from dashboard also mandatory values jusr account and password  also use `mediatory_attributes`
3- i have also other issue .. in Excel or sheet file it ignore accounts without tell user .. also it ignore   row in spite of it contain account and password 
but  i want ato just ignore files that not contain one of
