import { Pipe } from "@angular/core";
import { TaskItem } from '../models';
import { DateUtils } from '../utils/date-utils';

@Pipe({
    name: 'taskFilter'
})
export class TaskFilterPipe {
    public transform(tasks: TaskItem[], filterString: string, dateRange: Date[] = []): TaskItem[] {
        const isValidDateRange =  dateRange && dateRange.length >= 2 && DateUtils.isDate(dateRange[0]) && DateUtils.isDate(dateRange[1]);
        console.log('is-valid-daterange', dateRange, isValidDateRange);
        if (isValidDateRange) {
            tasks = tasks.filter(x => x.due_date >= dateRange[0] && x.due_date <= dateRange[1]);
        }
        filterString = filterString.trim().toLowerCase();
        if (filterString) {
            tasks = tasks.filter(task => this.combineStrings(task).indexOf(filterString) >= 0);
        }
        return tasks;
    }

    /**
     * Combine all strings in object to make filtering easy
     * @param obj
     * 
     * @returns all strings in object joined as a single string
     */
    private combineStrings(obj: object): string {
        if (!obj || typeof obj !== 'object') {
            return '';
        }
        return Object.keys(obj).reduce((acc, key) => {
            if (obj[key] && typeof obj[key] === 'string') {
                acc += obj[key].toLowerCase();
            }
            return acc;
        }, '');
    }
}