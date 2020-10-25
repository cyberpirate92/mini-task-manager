import { Component, EventEmitter, Input, OnChanges, OnInit, Output, HostBinding } from '@angular/core';
import { environment } from 'src/environments/environment';
import { TaskItem } from '../models';
import { TaskManagerService } from '../services/task-manager.service';
import { UsersService } from '../services/users.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
    selector: 'app-task-item',
    templateUrl: './task-item.component.html',
    styleUrls: ['./task-item.component.scss'],
    animations: [
        trigger('enterLeaveTransition', [
            transition(':enter', [
                style({
                    opacity: 0,
                    transform: 'scale(0.75)'
                }),
                animate('0.25s', style({
                    opacity: 1,
                    transform: 'scale(1)'
                }))
            ]),
            transition(':leave', [
                animate('0.5s', style({
                    transform: 'scale(0.5)',
                    opacity: 0,
                }))
            ])
        ])
    ]
})
export class TaskItemComponent implements OnInit, OnChanges {
    
    @Input() taskItem: TaskItem;
    @Output() onDelete: EventEmitter<TaskItem>;
    
    private _inEditMode: boolean;
    
    public get inEditMode(): boolean {
        return this._inEditMode;
    }
    
    public set inEditMode(value: boolean) {
        this._inEditMode = value;
        this.taskManager.pauseSync$.next(value); /* Don't sync when editing something */
    }
    
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
        this.taskManager.deleteTask(this.taskItem.id).subscribe();
    }
    
    public onDragStart(event: DragEvent): void {
        event.dataTransfer.setData('task', JSON.stringify(this.taskItem));
        event.dataTransfer.dropEffect = 'move';
    }
    
    public onDragComplete(event: DragEvent): void {
        console.info(event);
    }
    
    public setEditMode(): void {
        this.inEditMode = true;
    }
}