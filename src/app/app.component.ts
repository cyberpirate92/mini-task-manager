import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskGroup } from './models';
import { User } from './models/user';
import { TaskManagerService } from './services/task-manager.service';
import { UsersService } from './services/users.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    
    private _users: User[];
    
    public searchTerm: string;
    public isLoading: boolean;
    public destroy$: Subject<any>;
    public selectedTaskGroup: TaskGroup;
    public filterDateRange: Date[];
    
    /** 
    * Predefined task grouping configurations 
    */
    public readonly taskGroups: TaskGroup[] = [{
        displayName: 'Priority',
        propertyName: 'priority',
        values: this.taskService.PRIORITIES.map(x => x.value),
        displayLabels: this.taskService.PRIORITIES.map(x => x.label),
    },{
        displayName: 'Assigned To',
        propertyName: 'assigned_to',
        values: [],
        displayLabels: [],
        displayPictures: [],
    }];
    
    public get users(): User[] {
        return this._users;
    }
    
    public set users(list: User[]) {
        this._users = list;
        const taskGroup = this.taskGroups.find(g => g.propertyName === 'assigned_to');
        if (taskGroup) {
            taskGroup.values = [...list.map(x => x.id), false];
            taskGroup.displayLabels = [...list.map(x => x.name), 'Up for Grabs'];
            taskGroup.displayPictures = [...list.map(x => x.picture), '']
        }
    }
    
    constructor(private taskService: TaskManagerService, private userService: UsersService) {
        this.destroy$ = new Subject();
        this.searchTerm = '';
        this._users = [];
        this.isLoading = true;
        this.selectedTaskGroup = this.taskGroups[0];
        this.filterDateRange = [];
    }
    
    public ngOnInit(): void {
        forkJoin([this.userService.fetchAll(), this.taskService.fetchAll()]).subscribe({
            next: _ => {
                this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe({
                    next: users => this.users = users,
                });
            }, error: error => {
                console.error('Initializion failed', error);
            }, complete: () => {
                this.isLoading = false;
            }
        });
    }

    public onDateRangeChange(change: Date[]) {
        if (change && typeof change === 'object' && change instanceof Array) {
            this.filterDateRange = [...change];
            console.log(this.filterDateRange);
        } else {
            this.filterDateRange = [];
        }
    }
    
    public updateGrouping(taskGroup: TaskGroup) {
        this.selectedTaskGroup = taskGroup;
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
