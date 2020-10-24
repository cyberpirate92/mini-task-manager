import { tokenName } from '@angular/compiler';
import { TokenizeResult } from '@angular/compiler/src/ml_parser/lexer';
import { StringUtils } from './string-utils';

export class DateUtils {

    private static RESPONSE_FORMAT = /^\d{4}-\d{1,2}-\d{1,2}\s\s*\d{1,2}:\d{1,2}:\d{1,2}$/;

    private static monthNames = [
        'January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 
        'August', 'September', 'October', 'November', 'December'
    ];

    /**
     * Check if value is a date object
     */
    public static isDate(value: any): boolean {
        return !!(value && typeof value === 'object' && value instanceof Date && !isNaN(value.valueOf()));
    }

    /**
     * Convert date object to `yyyy-MM-dd hh:mm:ss` format
     * @param date The date object
     * 
     * @returns The date string in `yyyy-MM-dd hh:mm:ss` format
     */
    public static toRequestFormat(date: Date): string {
        if (!this.isDate(date)) {
            console.warn('Failed to serialize date: Unrecognized date object');
            return '';
        } 
        const displayDate = `${date.getFullYear()}-${StringUtils.pad(date.getMonth()+1)}-${StringUtils.pad(date.getDate())}`;
        const displayTime = `${StringUtils.pad(date.getHours())}:${StringUtils.pad(date.getMinutes())}:${StringUtils.pad(date.getSeconds())}`;
        return `${displayDate} ${displayTime}`;
    }

    /**
     * Convert date string (ex: 2020-10-23 08:33:57) to a date object
     * 
     * @param dateString The date string to be converted to a date object
     * 
     * @returns The date object represented by the string
     */
    public static fromResponseFormat(dateString: string): Date {
        let date = null;
        if (dateString && typeof dateString === 'string' && this.RESPONSE_FORMAT.test(dateString)) {
            const [year, month, day, hours, minutes, seconds] = dateString.split(' ')
                .map((token, index) => token.split(index === 0 ? '-' : ':')
                .map(x => parseInt(x)))
                .reduce((acc, val) => acc.concat(...val), []);
            date = new Date(year, month-1, day, hours, minutes, seconds);
        }
        return date;
    }

    /**
     * Convert given date object to the display format `dd MMM yyyy hh:mm`
     * @param date The date object to convert
     * @param shouldIncludeTime Should the formatted string contain time?
     * 
     * @returns formatted date string
     */
    public static toDisplayFormat(date: Date, shouldIncludeTime = true): string {
        if (!this.isDate(date)) {
            return 'err';
        }
        const displayDate = `${StringUtils.pad(date.getDate())} ${this.monthNames[date.getMonth()].substr(0, 3)} ${date.getFullYear()}`;
        const displayTime = `${date.getHours()}:${date.getMinutes()}`;
        return shouldIncludeTime ? `${displayDate} ${displayTime}` : displayDate;
    }
}