import { Pipe } from '@angular/core';
import { DateUtils } from '../utils/date-utils';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe {
    /**
     * Transform given date object to the default display format
     * @param date The date object to be transformed
     * @param showTime boolean indicating whether time should be included in the formatted result
     * 
     * @returns formatted date string
     */
    public transform(date: Date, showTime: boolean = true): string {
        return DateUtils.toDisplayFormat(date, showTime);
    }
}