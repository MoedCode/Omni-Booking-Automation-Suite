
### **Task Description**

Build a TypeScript AccountsReader class designed to read account records from multiple data sources (**Excel files, Google Sheets, or CSV files**).

---

### **Core Requirements & Validation Rules**

1. **Mandatory Columns / Attributes Validation:**
* The class must accept an object/dictionary defining **mandatory keys**.
* **Row-Level Validation:** If a row is missing any mandatory values  ignore that **entire row**.
* **File-Level Validation:** If the file completely lacks the required mandatory columns, abort processing, ignore the file, and trigger an error (pop-up/exception) explaining that the file is missing mandatory columns.


2. **Allowed / Lookup Keys Validation:**
* The class must accept a second object/dictionary defining **exclusive/allowed keys** (lookup keys).
* If a row contains any keys or columns **other than** the defined mandatory and allowed keys, ignore that row and issue a warning ($\triangle$ / warning log).

3. **methods**
* constructor
* sanitizeParsing 
    Internal method to safely validate and parse the dataframe dynamically.
    Returns a structured dictionary with execution results.
 * loadFromExcel
 * loadFromSheet
 * loadFromCsv
 python example 
 ```py
 
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
```

```html
<form novalidate="" class="ng-untouched ng-pristine ng-valid"><mat-card class="mat-mdc-card mdc-card form-card"><p class="grey-color mb-5">All fields are mandatory</p><h1 class="fs-24 fs-sm-46 mb-25">Appointment Details</h1><p class="c-brand-grey-para mb-15">Please provide information about the type of visa you wish to apply for. Be aware that the appointment category Applicant 1 chooses will be applied to each of the applicants added to your appointment booking.</p><!----><form novalidate="" class="ng-untouched ng-pristine ng-invalid"><!----><!----><div class="form-group"><div class="mt-15"><label for="mat-select-0" id="mat-select-value-1" class="align-label"><div> Choose your Application Centre<span class="c-brand-error">*</span><!----></div><p class="d-inline float-end text-end"> 2 Centre(s) </p><!----></label></div><!----><mat-form-field aria-describedby="errorMsg" appearance="outline" class="mat-mdc-form-field mat-form-field-outline-brand mat-mdc-form-field-type-mat-select mat-form-field-appearance-outline mat-primary ng-untouched ng-pristine ng-invalid mat-form-field-animations-enabled"><!----><div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label"><!----><div class="mat-mdc-form-field-flex"><div matformfieldnotchedoutline="" class="mdc-notched-outline mdc-notched-outline--no-label"><div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div><div class="mat-mdc-notch-piece mdc-notched-outline__notch"><!----><!----><!----></div><div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div></div><!----><!----><!----><div class="mat-mdc-form-field-infix"><!----><mat-select role="combobox" aria-haspopup="listbox" formcontrolname="centerCode" appdefaultselect="" class="mat-mdc-select mat-mdc-select-required mat-mdc-select-empty ng-untouched ng-pristine ng-invalid" aria-labelledby="mat-select-value-0" id="mat-select-0" tabindex="0" aria-expanded="false" aria-required="true" aria-disabled="false" aria-invalid="false"><div cdk-overlay-origin="" class="mat-mdc-select-trigger"><div class="mat-mdc-select-value" id="mat-select-value-0"><span class="mat-mdc-select-placeholder mat-mdc-select-min-line">Choose your Application Centre</span><!----><!----></div><div class="mat-mdc-select-arrow-wrapper"><div class="mat-mdc-select-arrow"><svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div></div></div><!----></mat-select></div><!----><!----></div><!----></div><div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"><div aria-atomic="true" aria-live="polite" class="mat-mdc-form-field-hint-wrapper"><!----><!----><div class="mat-mdc-form-field-hint-spacer"></div><!----></div></div></mat-form-field></div><hr role="presentation"><!----><!----><div class="form-group"><label for="mat-select-4" id="mat-select-value-5"> Choose your appointment category<span class="c-brand-error">*</span><!----></label><!----><mat-form-field aria-describedby="errorMsg" appearance="outline" class="mat-mdc-form-field mat-form-field-outline-brand mat-mdc-form-field-type-mat-select mat-form-field-appearance-outline mat-primary ng-untouched ng-pristine ng-invalid mat-form-field-animations-enabled"><!----><div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label"><!----><div class="mat-mdc-form-field-flex"><div matformfieldnotchedoutline="" class="mdc-notched-outline mdc-notched-outline--no-label"><div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div><div class="mat-mdc-notch-piece mdc-notched-outline__notch"><!----><!----><!----></div><div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div></div><!----><!----><!----><div class="mat-mdc-form-field-infix"><!----><mat-select role="combobox" aria-haspopup="listbox" formcontrolname="selectedSubvisaCategory" appdefaultselect="" class="mat-mdc-select mat-mdc-select-required mat-mdc-select-empty ng-untouched ng-pristine ng-invalid" aria-labelledby="mat-select-value-2" id="mat-select-2" tabindex="0" aria-expanded="false" aria-required="true" aria-disabled="false" aria-invalid="false"><div cdk-overlay-origin="" class="mat-mdc-select-trigger"><div class="mat-mdc-select-value" id="mat-select-value-2"><span class="mat-mdc-select-placeholder mat-mdc-select-min-line">Select your appointment category</span><!----><!----></div><div class="mat-mdc-select-arrow-wrapper"><div class="mat-mdc-select-arrow"><svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div></div></div><!----></mat-select></div><!----><!----></div><!----></div><div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"><div aria-atomic="true" aria-live="polite" class="mat-mdc-form-field-hint-wrapper"><!----><!----><div class="mat-mdc-form-field-hint-spacer"></div><!----></div></div></mat-form-field></div><!----><hr role="presentation"><!----><!----><!----><div class="form-group"><label for="mat-select-2" id="mat-select-value-3"> Choose your sub-category<span class="c-brand-error">*</span><!----><!----></label><!----><mat-form-field aria-describedby="errorMsg" appearance="outline" class="mat-mdc-form-field mat-form-field-outline-brand mat-mdc-form-field-type-mat-select mat-form-field-appearance-outline mat-primary ng-untouched ng-pristine ng-invalid mat-form-field-animations-enabled"><!----><div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label"><!----><div class="mat-mdc-form-field-flex"><div matformfieldnotchedoutline="" class="mdc-notched-outline mdc-notched-outline--no-label"><div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div><div class="mat-mdc-notch-piece mdc-notched-outline__notch"><!----><!----><!----></div><div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div></div><!----><!----><!----><div class="mat-mdc-form-field-infix"><!----><mat-select role="combobox" aria-haspopup="listbox" formcontrolname="visaCategoryCode" appdefaultselect="" mattooltipposition="above" mattooltipclass="mat-tooltip-full" class="mat-mdc-select mat-mdc-tooltip-trigger mat-mdc-select-required mat-mdc-select-empty ng-untouched ng-pristine ng-invalid" aria-labelledby="mat-select-value-1" id="mat-select-1" tabindex="0" aria-expanded="false" aria-required="true" aria-disabled="false" aria-invalid="false"><div cdk-overlay-origin="" class="mat-mdc-select-trigger"><div class="mat-mdc-select-value" id="mat-select-value-1"><span class="mat-mdc-select-placeholder mat-mdc-select-min-line">Select your sub-category</span><!----><!----></div><div class="mat-mdc-select-arrow-wrapper"><div class="mat-mdc-select-arrow"><svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div></div></div><!----></mat-select><!----></div><!----><!----></div><!----></div><div class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"><div aria-atomic="true" aria-live="polite" class="mat-mdc-form-field-hint-wrapper"><!----><!----><div class="mat-mdc-form-field-hint-spacer"></div><!----></div></div></mat-form-field></div><hr role="presentation"><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----><!----></form></mat-card><!----><!----><mat-card class="mat-mdc-card mdc-card form-card p-0 border-0 mt-20 shadow-none"><button type="button" mat-raised-button="" class="btn mat-btn-lg btn-block btn-brand-orange mdc-button mdc-button--raised mat-mdc-raised-button mat-mdc-button-disabled mat-unthemed mat-mdc-button-base" mat-ripple-loader-uninitialized="" mat-ripple-loader-class-name="mat-mdc-button-ripple" mat-ripple-loader-disabled="" disabled="true"><span class="mat-mdc-button-persistent-ripple mdc-button__ripple"></span><span class="mdc-button__label"> Continue </span><span class="mat-focus-indicator"></span><span class="mat-mdc-button-touch-target"></span></button><!----><!----></mat-card></form>
```
and  after bot  opens 

```html
<div class="mat-mdc-text-field-wrapper mdc-text-field mdc-text-field--outlined mdc-text-field--no-label mdc-text-field--invalid"><!----><div class="mat-mdc-form-field-flex"><div matformfieldnotchedoutline="" class="mdc-notched-outline mdc-notched-outline--no-label"><div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div><div class="mat-mdc-notch-piece mdc-notched-outline__notch"><!----><!----><!----></div><div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div></div><!----><!----><!----><div class="mat-mdc-form-field-infix"><!----><mat-select role="combobox" aria-haspopup="listbox" formcontrolname="centerCode" appdefaultselect="" class="mat-mdc-select mat-mdc-select-required mat-mdc-select-empty ng-pristine ng-invalid mat-mdc-select-invalid ng-touched" aria-labelledby="mat-select-value-0" id="mat-select-0" tabindex="0" aria-expanded="false" aria-required="true" aria-disabled="false" aria-invalid="true"><div cdk-overlay-origin="" class="mat-mdc-select-trigger"><div class="mat-mdc-select-value" id="mat-select-value-0"><span class="mat-mdc-select-placeholder mat-mdc-select-min-line">Choose your Application Centre</span><!----><!----></div><div class="mat-mdc-select-arrow-wrapper"><div class="mat-mdc-select-arrow"><svg viewBox="0 0 24 24" width="24px" height="24px" focusable="false" aria-hidden="true"><path d="M7 10l5 5 5-5z"></path></svg></div></div></div><!----></mat-select></div><!----><!----></div><!----></div>
````

 will find 
```html
<div role="listbox" tabindex="-1" class="mat-select-panel-animations-enabled mat-mdc-select-panel mdc-menu-surface mdc-menu-surface--open mat-primary" id="mat-select-0-panel" aria-multiselectable="false"><mat-option role="option" class="mat-mdc-option mdc-list-item mat-mdc-option-active" id="AEX" aria-selected="false" aria-disabled="false"><!----><span class="mdc-list-item__primary-text"> Portugal Visa Application Center-Alexandria </span><!----><!----><div aria-hidden="true" mat-ripple="" class="mat-ripple mat-mdc-option-ripple mat-focus-indicator"></div></mat-option><mat-option role="option" class="mat-mdc-option mdc-list-item" id="CAI" aria-selected="false" aria-disabled="false"><!----><span class="mdc-list-item__primary-text"> Portugal Visa Application Center-Cairo </span><!----><!----><div aria-hidden="true" mat-ripple="" class="mat-ripple mat-mdc-option-ripple mat-focus-indicator"></div></mat-option><!----></div>
```