import { Pipe } from '@angular/core';
import { DateUtils } from '../utils/date-utils';

@Pipe({
    name: 'dateFormat'
})
export class DateFormatPipe {
    public transform(date: Date): string {
        return DateUtils.toDisplayFormat(date);
    }
}