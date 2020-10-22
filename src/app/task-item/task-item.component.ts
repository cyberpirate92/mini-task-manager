import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TaskItem } from '../models';
import { TaskManagerService } from '../services/task-manager.service';

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

    @Input() taskItem: TaskItem;
    @Output() onDelete: EventEmitter<TaskItem>;

    public isLoading: boolean;
    public isOverdue: boolean;
    
    constructor(private taskManager: TaskManagerService) { 
        this.onDelete = new EventEmitter();
        this.isLoading = false;
        this.isOverdue = false;
    }

    public ngOnInit(): void {
        const now = new Date();
        this.isOverdue = this.taskItem.due_date < now;
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
