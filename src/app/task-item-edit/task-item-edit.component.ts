import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskItem } from '../models';
import { User } from '../models/user';
import { UsersService } from '../services/users.service';

@Component({
    selector: 'app-task-item-edit',
    templateUrl: './task-item-edit.component.html',
    styleUrls: ['./task-item-edit.component.scss']
})
export class TaskItemEditComponent implements OnInit {

    @Input() priority: number;
    @Output() onCancel: EventEmitter<any>;
    @Output() onSave: EventEmitter<TaskItem>;
    
    public destroy$: Subject<any>;
    public users: User[];
    public selectedUser: User;
    public editForm: FormGroup;
    
    constructor(private userService: UsersService) { 
        this.onCancel = new EventEmitter();
        this.onSave = new EventEmitter();
        this.destroy$ = new Subject();
        this.users = [];
        this.editForm = new FormGroup({
            message: new FormControl('', [Validators.required]),
            assigned_to: new FormControl(''),
            due_date: new FormControl()
        });
    }
    
    ngOnInit(): void {
        this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe({
            next: userList => this.users = userList,
        });
    }

    public save(): void {
        if (this.editForm.valid) {
            let user = this.users.find(u => u.id === this.editForm.get('assigned_to').value);
            this.onSave.emit({
                priority: this.priority,
                assigned_to: user && parseInt(user.id),
                created_on: new Date(),
                due_date: new Date(this.editForm.get('due_date').value),
                message: this.editForm.get('message').value,
                assigned_name: user && user.name,
                id: null,
            });
            this.editForm.reset();
        }
    }

    public edit(): void {

    }

    public onCancelled() {
        this.onCancel.emit();
        this.editForm.reset();
    }

    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
