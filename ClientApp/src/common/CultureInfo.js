const DATE_FORMAT = 'MM/DD/YYYY';
const TIME_FORMAT = 'hh:mm A';
const DATE_TIME_FORMAT = 'MM/DD/YYYY, h:mm A';
const DATE_TIME_FORMAT_24 = 'MM/DD/YYYY, HH:mm';
const DAY_DATE_FORMAT = 'ddd, MMM DD YYYY';
const MONTH_YEAR_FORMAT ='MM/YYYY';
const MONTH_DATE_YEAR = 'MMMM Do, YYYY';
const MONTH_DATE_YEAR_TIME_12 = 'MMMM Do hh:mm A';
const ISO_DATE_FORMAT = 'YYYY-MM-DD';

const info = {
    DateFormat: DATE_FORMAT,
    TimeFormat: TIME_FORMAT,
    DateTimeFormat: DATE_TIME_FORMAT,
    DateTimeFormat24: DATE_TIME_FORMAT_24,
    DayWithDateFormat: DAY_DATE_FORMAT,
    MonthWithYearFormat: MONTH_YEAR_FORMAT,
    MonthDateYear: MONTH_DATE_YEAR,
    MonthDateYearTime12: MONTH_DATE_YEAR_TIME_12,
    IsoFormat: ISO_DATE_FORMAT,
}

class CultureInfo {
    static GetCultureInfo() {
        return info;
    }
}

export default CultureInfo;