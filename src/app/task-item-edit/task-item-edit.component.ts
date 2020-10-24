import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskItem } from '../models';
import { User } from '../models/user';
import { TaskManagerService } from '../services/task-manager.service';
import { UsersService } from '../services/users.service';

@Component({
    selector: 'app-task-item-edit',
    templateUrl: './task-item-edit.component.html',
    styleUrls: ['./task-item-edit.component.scss']
})
export class TaskItemEditComponent implements OnInit {

    @Input() property: string;
    @Input() value: any;

    @Input() taskItem: TaskItem;

    @Output() onCancel: EventEmitter<any>;
    @Output() onSave: EventEmitter<TaskItem>;
    
    public destroy$: Subject<any>;
    public users: User[];
    public selectedUser: User;
    public editForm: FormGroup;
    public isBeingSaved: boolean;
    public readonly priorities = this.taskManager.PRIORITIES;
    
    constructor(private userService: UsersService, private taskManager: TaskManagerService) { 
        this.onCancel = new EventEmitter();
        this.onSave = new EventEmitter();
        this.destroy$ = new Subject();
        this.users = [];
        this.isBeingSaved = false;
        this.editForm = new FormGroup({
            message: new FormControl('', [Validators.required]),
            assigned_to: new FormControl('', [Validators.pattern(/^\d\d*$/)]),
            due_date: new FormControl(),
            priority: new FormControl(this.priorities[0].value.toString()),
        });
    }
    
    ngOnInit(): void {
        this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe({
            next: userList => this.users = userList,
        });
        if (this.property && this.value) {
            this.editForm.get(this.property).setValue(this.value);
        }
        if (this.taskItem) {
            this.editForm.get('message').setValue(this.taskItem.message || '');
            this.editForm.get('priority').setValue(this.taskItem.priority || '');
            this.editForm.get('assigned_to').setValue(this.taskItem.assigned_to || '');
            this.editForm.get('due_date').setValue(this.taskItem.due_date || '');
        }
    }

    public save(): void {
        if (this.editForm.valid) {
            let user = this.users.find(u => u.id === this.editForm.get('assigned_to').value);
            let dueDate = this.editForm.get('due_date').value;
            this.onSave.emit({
                priority: parseInt(this.editForm.get('priority').value),
                assigned_to: user && parseInt(user.id),
                created_on: new Date(),
                due_date: dueDate ? new Date(dueDate) : null,
                message: this.editForm.get('message').value,
                assigned_name: user && user.name,
                id: this.taskItem?.id || null,
            });
            this.isBeingSaved = true;
        }
    }

    public onCancelled() {
        this.onCancel.emit();
        this.editForm.reset();
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
