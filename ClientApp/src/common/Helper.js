import Moment from 'moment';
import CultureInfo from './CultureInfo';
import APIHelper from './ApiHelper';
import APIURLConstants from "./ApiURLConstants";

const escapeRegExp = (value) => {
    return value.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

export default class Helper {
    static FormatDate(value) {
        return value ? Moment(value).format(CultureInfo.GetCultureInfo().DateFormat) : '';
    }

    static GetFormatedDate(value, format) {
        return value ? Moment(value).format(format) : '';
    }

    static FormatTime(value) {
        return value ? Moment(value).format(CultureInfo.GetCultureInfo().TimeFormat) : '';
    }

    static FormatDayWithDate(value) {
        return value ? Moment(value).format(CultureInfo.GetCultureInfo().DayWithDateFormat) : '';
    }

    static FormatDateToLocalTimeZone(value) {
        return value ? Moment(value).local().format(CultureInfo.GetCultureInfo().DateFormat) : '';
    }

    static FormatDateTime(value) {
        return value ? Moment(value).format(CultureInfo.GetCultureInfo().DateTimeFormat) : '';
    }

    static FormatDateTime24(value) {
        return value ? Moment(value).format(CultureInfo.GetCultureInfo().DateTimeFormat24) : '';
    }

    static FormatDateTimeToLocalTimeZone(value) {
        return value ? Moment(value).local().format(CultureInfo.GetCultureInfo().DateTimeFormat24) : '';
    }

    static FormatDateToMonthDateYear(value) {
        return value ? Moment(value).local().format(CultureInfo.GetCultureInfo().MonthDateYear) : 'TBD';
    }

    static FormatDateToMonthDateYearTime12(value) {
        return value ? Moment(value).local().format(CultureInfo.GetCultureInfo().MonthDateYearTime12) : 'TBD';
    }

    static FormatToIsoDate(value) {
        return value ? Moment(value).format(CultureInfo.GetCultureInfo().IsoFormat) : '';
    }

    static GetCurrentYear (){
        return new Date().getFullYear();
    }

    static AddYears(noOfYears, date) {
        if (date instanceof Date && !isNaN(date)){
            date.setFullYear(date.getFullYear() - noOfYears);
            return date;
        }
        else{
            let newDate = new Date(this.FormatDate(date));
            newDate.getFullYear(newDate.getFullYear() - noOfYears);
            return newDate;
        }
    }

    static FormatDateToMMDDYYYY(value) {
        return value ? Moment(value).local().format('MM/DD/YYYY') : 'TBD';
    }

    static FormatDateToYYYYMMDD(value) {
        return value ? Moment(value).format('YYYY-MM-DD') : '';
    }

    //Returns amount with Symbol - $12,345,678.90
    static ConvertToDollarFormat(value){
        if (!value || isNaN(value)) return '$0.00';

        let dollarUS = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });
        return dollarUS.format(value);
    }

    //Returns amount without Symbol - 12,345,678.90
    static ConvertToDollarFormatWithoutSymbol(value) {
        if (!value || isNaN(value)) return '0.00';

        let dollarUS = Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', currencyDisplay: 'code' });
        let result = dollarUS.format(value);

        return result.replace(/[a-z]{3}/i, "").trim();
    }

    static ConvertToUSNumberFormat(value) {
        if(!value || isNaN(value)) return 0;

        let numberUS = Intl.NumberFormat('en-US');
        return numberUS.format(value);
    }

    //... Returns a random Id string. Id length is based on the supplied length.
    static GetRandomId(length = 5) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

        for (var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    static IfDateIsNULL(inputDate) {
        var minDate = Moment.utc("01/01/0001"); // minimum value as per UTC

        var receiveDate = Moment(this.FormatDate(inputDate)); // replace with variable
        if (Moment.utc(receiveDate).isAfter(minDate)) {
            return false;
        }
        else {
            return true;
        }
    }

    static GetNameInitials(name) {
        if (!name) {
            return "--";
        }

        var iChars = "";
        name.replace(/[a-z]{2,}/gi, function (c) { iChars += c.charAt(0) });
        return iChars.toUpperCase();
    }

    static Validate(value, params) {
        let obj = { isValid: true, validationMessage: '' };

        if (params.Required && (value === null || value === '' || value.length === 0)) {
            obj.isValid = false;
            obj.validationMessage = 'Please enter value'
        }
        return obj;
    }

    static GetEmptyUser() {
        return {
            firstName: "",
            lastName: "",
            userName: "",
            userLevel: "",
            teamId: ""
        }
    }

    static GetRandomBackground() {
        const bgColor = ['#583d72', '#9f5f80', '#ffba93', '#ff8e71', '#c6ebc9', '#70af85', '#f0e2d0', '#aa8976', '#cd5d7d', '#f6ecf0', '#a7c5eb', '#949cdf', '#75cfb8', '#bbdfc8', '#f0e5d8', '#ffc478', '#1687a7', '#276678', '#726a95', '#719fb0', '#a0c1b8'];
        return bgColor[Math.floor(Math.random() * bgColor.length)];
    }

    static GetStringToColour(str) {
        if (!str) return '#bdbdbd';
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var colour = '#';
        for (var j = 1; j < 4; j++) {
            var value = (hash >> (j * (j + 4))) & 0xFF;
            colour += ('00' + value.toString(16)).substr(-2);
        }
        return colour;
    }

    static GroupBy(objArray, property) {
        return objArray.reduce((acc, obj) => {
            const key = obj[property];
            if (!acc[key]) {
                acc[key] = [];
            }
            // Add object to list for given key's value
            acc[key].push(obj);
            return acc;
        }, {});
    }

    //usage - array - objects list, fc - array contains properties. Below is the sample.
    //var result = groupBy(list, function(item){ return [item.lastname, item.age]; });
    static GroupByMultiple(array, fc) {
        var groups = {};
        array.forEach(function (o) {
            var group = JSON.stringify(fc(o));
            groups[group] = groups[group] || [];
            groups[group].push(o);
        });
        return Object.keys(groups).map(function (group) {
            return groups[group];
        })
    }

    static GroupAndSortBy(objArray, groupByProp, sortByProp) {
        let groups = objArray.reduce((acc, obj) => {
            const key = obj[groupByProp] ?? '';
            if (!acc[key]) {
                acc[key] = [];
            }
            // Add object to list for given key's value
            acc[key].push(obj);
            return acc;
        }, {});

        for (var key in groups)
            groups[key].sort(function (a, b) { var x = a[sortByProp], y = b[sortByProp]; return x === y ? 0 : x < y ? -1 : 1; });

        return groups;
    }

    static LogOutApplication(signoutURL) {

        //... Signout from the local application first.
        APIHelper.get(APIURLConstants.SIGNOUT).then(success => {
            if (success) {
                //... Redirect to the ADFS signout page for remote signout.
                window.location.href = `${signoutURL}`;
            }
        }).catch(err => {
            //... Redirect to the ADFS signout page for remote signout.
            window.location.href = `${signoutURL}`;
        });
    }

    static CheckClaim(roles, claims, permission) {

        //debugger;
        let haveClaim = false;
        if (!roles || roles == "" || claims == "")
            return false;

        const rolesJson = JSON.parse(roles);
        const claimsJson = JSON.parse(claims);
        rolesJson.forEach((roleJson) => {
            //console.log(role);

            if (!haveClaim) {

                let role = roleJson.RoleName.toUpperCase();
                let found = claimsJson.filter(x => x.RoleName.toUpperCase() === role && x.ClaimName === permission);
                if (found.length)
                    haveClaim = true;

            }

        });

        return haveClaim;
    }

    static CheckRole(roles, claimedRole) {

        //debugger;
        let haveRole = false;
        if (!roles || roles == "" || claimedRole == "")
            return false;

        const rolesJson = JSON.parse(roles);
        rolesJson.forEach((roleJson) => {
            //console.log(role);

            if (!haveRole) {
                let role = roleJson.RoleName.toUpperCase();
                haveRole = role === claimedRole;
            }

        });

        return haveRole;
    }

    //Helper function to check items in localStorage
    static checkInLocal = (key) => {
        let inLocal = false;
        if (localStorage.getItem(key))
            inLocal = true;

        return inLocal
    }
    //Helper function to check items in sessionStorage
    static checkInSession = (key) => {
        let inSession = false;
        if (sessionStorage.getItem(key))
            inSession = true;

        return inSession
    }
    static getCurrentDate = (separator = '/') => {

        let newDate = new Date()
        let date = newDate.getDate();
        let month = newDate.getMonth() + 1;
        let year = newDate.getFullYear();
        return `${date}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${year}`
        //return `${year}${separator}${month < 10 ? `0${month}` : `${month}`}${separator}${date}`
    }

    static getMinDate = (arr, propName) => {
        return new Date(Math.min(...arr.map(element => {return new Date(element[propName]);})));
    }

    static GetDistinct = (str)=>{
        if(!str || str === '') return '';

        return [...new Set(str.split(/[;,]/).map(item => item.trim()))].join(', ');
    }

    static padWithZero =(num, targetLength) => {
        if(!num || num === '') return '';
        if (!targetLength || targetLength === '') return num;
        
        return String(num).padStart(targetLength, '0');
    }

    static applyLocalFilter = (searchItem, restrictedFields, data) => {
        if(searchItem && searchItem.length > 2) {
            const searchRegex = new RegExp(escapeRegExp(searchItem.trim()), 'i');
            const filteredRows = data.filter((row) => {
                return Object.keys(row).some((field) => {
                    if (restrictedFields.length > 0) {
                        if (row[field] && (!restrictedFields.includes(field))) {
                            return searchRegex.test(row[field].toString());
                        }
                    } else {
                        if (row[field]) {
                            return searchRegex.test(row[field].toString());
                        }
                    }
                });
            });
            return filteredRows;
        } else {
            return data;
        }
    }
}