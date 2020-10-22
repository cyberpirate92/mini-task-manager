import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TaskItem } from '../models';
import { TaskManagerService } from '../services/task-manager.service';

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent {

    @Input() taskItem: TaskItem;
    @Output() onDelete: EventEmitter<TaskItem>;

    public isLoading: boolean;
    
    constructor(private taskManager: TaskManagerService) { 
        this.onDelete = new EventEmitter();
        this.isLoading = false;
    }
    
    public deleteSelf() {
        this.isLoading = true;
        this.taskManager.deleteTask(this.taskItem.id).subscribe({
            next: response => {
                console.log(response);
            }
        });
    }
}
