import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TaskItem } from '../models';
import { TaskManagerService } from '../services/task-manager.service';
import { UsersService } from '../services/users.service';

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit, OnChanges {

    @Input() taskItem: TaskItem;
    @Output() onDelete: EventEmitter<TaskItem>;

    public inEditMode: boolean;
    public isLoading: boolean;
    public isOverdue: boolean;
    public userDisplayPicture: string;
    public readonly priorities = this.taskManager.PRIORITIES;
    
    constructor(private taskManager: TaskManagerService, private userService: UsersService) { 
        this.onDelete = new EventEmitter();
        this.isLoading = false;
        this.isOverdue = false;
        this.inEditMode = false;
        this.userDisplayPicture = environment.defaultDisplayPicture;
    }

    public ngOnInit(): void {
        this.refresh();
    }

    public ngOnChanges(): void {
        this.refresh();
    }

    public refresh(): void {
        const now = new Date();
        this.isOverdue = this.taskItem.due_date && this.taskItem.due_date < now;
        this.userDisplayPicture = this.userService.getUserById(this.taskItem?.assigned_to)?.picture;
    }

    public updateSelf(updatedTaskItem: TaskItem): void {
        this.taskManager.updateTask(updatedTaskItem).subscribe();
    }
    
    public deleteSelf(): void {
        this.isLoading = true;
        this.taskManager.deleteTask(this.taskItem.id).subscribe({
            next: response => {
                console.log(response);
            }
        });
    }

    public onDragStart(event: DragEvent): void {
        event.dataTransfer.setData('task', JSON.stringify(this.taskItem));
        event.dataTransfer.dropEffect = 'move';
    }

    public onDragComplete(event: DragEvent): void {
        console.log(event);
    }
}