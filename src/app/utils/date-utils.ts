import { StringUtils } from './string-utils';

export class DateUtils {

    private static monthNames = [
        'January', 'Febraury', 'March', 'April', 'May', 'June', 'July', 
        'August', 'September', 'October', 'November', 'December'
    ];

    /**
     * Check if value is a date object
     */
    public static isDate(value: any): boolean {
        return value && typeof value === 'object' && value instanceof Date;
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
        return `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }

    /**
     * Convert date string to a date object
     * @param dateString The date string to be converted to a date object
     * 
     * @returns The date object represented by the string
     */
    public static fromResponseFormat(dateString: string): Date {
        dateString = dateString.trim();
        if (!dateString || typeof dateString !== 'string') {
            console.warn('Parsing date failed');
            return null;
        }
        return new Date(Date.parse(dateString));
    }

    /**
     * Convert given date object to the display format `dd MMM yyyy hh:mm`
     * @param date The date object to convert
     * @param shouldIncludeTime Should the formatted string contain time?
     * 
     * @returns Date in Display format
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