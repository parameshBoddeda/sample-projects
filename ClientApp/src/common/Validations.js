export default class Validations {

    //... Required Field Validation
    static Required(value) {
        //... Returns true when the value is empty.
        return /^\s*$/.test(value) || /null/.test(value);
    }

    //... Email Format Field Validation
    static Email(value) {
        return /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/.test(value);
    }

    //... USA Zip Code Format (xxxxx or xxxxx-xxxx)
    static USAZip(value) {

        if (value === undefined || value === '')
            return true;

        return /^\d{5}(?:[-]\d{4})?$/.test(value);
    }

    //... Zip Code Format (xxxxxx)
    static Zip(value) {

        if (value === undefined || value === '')
            return true;

        return /^[1-9][0-9]{5}$/.test(value);
    }

    //... Numeric validation
    static Numeric(value) {

        if (value === undefined || value === '')
            return true;

        return /^[0-9]*$/.test(value);
    }

    //... Decimal validation
    static Decimal(value) {

        if (value === undefined || value === '')
            return true;

        return /^(([1-9]\d*)|0)(.0*[1-9](0*[1-9])*)?$/.test(value);
    }

    //... Currency validation (e.g. 100,000,000.00)
    static Currency(value) {

        if (value === undefined || value === '')
            return true;

        return /^([1-9]+\d{0,2}(\,\d{3})*|([1-9]+\d*))(\.\d{2})?$/.test(value);
    }

    static CurrencyWithZeroAllowed(value) {
        if (value === undefined || value === '')
            return true;

        return /^([0-9]+\d{0,2}(\,\d{3})*|([1-9]+\d*))(\.\d{2})?$/.test(value);
    }

    //Restrict all special characters Expept '
    static RestrictSpecialCharacters(value) {
        if (value === undefined || value === '')
            return true;
        return /^[a-zA-Z0-9\s]+$/.test(value);
    }

    //Allow only characters
    static AllowOnlyCharacters(value) {
        if (value === undefined || value === '')
            return true;
        return /^[a-zA-Z\s]+$/.test(value);
    }
    
    //Currency Code e.g $(USD)
    static CurrencyCode(value){
        if(value === undefined || value === '')
            return true;
        
        return /\([a-zA-Z]{3}\)$/.test(value);
    }
    //... etc.

    static Validate(control,value, rules) {

        let isValid = true;
        let validationResult = { isValid: true, validationMessage: null };

        if (!rules) {
            return validationResult;
        }

        //... Required Field Validation
        if (rules.Required && isValid) {
            isValid = !Validations.Required(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : control +' '+ 'value is required';
        }

        //... Email Format Field Validation
        if (rules.Email && isValid) {
            isValid = Validations.Email(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'email format is incorrect';
        }

        //... USA Zip Code Format (xxxxx or xxxxx-xxxx)
        if (rules.USAZip && isValid) {
            isValid = Validations.USAZip(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'zip code format is incorrect';
        }

        //... Zip Code Format (xxxxxx)
        if (rules.Zip && isValid) {
            isValid = Validations.Zip(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'zip code format is incorrect';
        }

        //... Numeric validation
        if (rules.Numeric && isValid) {
            isValid = Validations.Numeric(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'only numbers are allowed';
        }

        if (rules.Decimal && isValid) {
            isValid = Validations.Decimal(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'value is incorrect';
        }

        //... Currency validation
        if (rules.Currency && isValid) {
            isValid = Validations.Currency(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'value is incorrect';
        }

        //... Currency validation
        if (rules.CurrencyWithZeroAllowed && isValid) {
            isValid = Validations.CurrencyWithZeroAllowed(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'value is incorrect';
        }

        //... special character validation
        if (rules.RestrictSpecialCharacters && isValid) {
            isValid = Validations.RestrictSpecialCharacters(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'special character is not allowed';
        }

         //... special character validation
         if (rules.AllowOnlyCharacters && isValid) {
            isValid = Validations.AllowOnlyCharacters(value);
            validationResult.isValid = isValid;
            validationResult.validationMessage = (isValid) ? null : 'only characters allowed';
        }

        return validationResult;
    }
}
