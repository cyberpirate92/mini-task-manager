import { Pipe } from "@angular/core";
import { TaskItem } from '../models';

@Pipe({
    name: 'taskFilter'
})
export class TaskFilterPipe {
    public transform(tasks: TaskItem[], filterString: string): TaskItem[] {
        filterString = filterString.trim().toLowerCase();
        return tasks.filter(task => this.combineStrings(task).indexOf(filterString) >= 0);
    }

    /**
     * Combine all strings in object to make filtering easy
     * @param obj
     * 
     * @returns all strings in object joined as a single string
     */
    public combineStrings(obj: object): string {
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