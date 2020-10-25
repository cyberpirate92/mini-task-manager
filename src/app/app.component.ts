import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { scan, takeUntil } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';

import { environment } from 'src/environments/environment';
import { TaskGroup } from './models';
import { User } from './models/user';
import { Quote, QuotesService } from './services/quotes.service';
import { TaskManagerService } from './services/task-manager.service';
import { UsersService } from './services/users.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    animations: [
        trigger('loadingScreenExit', [
            transition(':enter', [
                style({
                    transform: 'scale(0.5)',
                    opacity: 0.5,
                }),
                animate('0.5s', style({
                    transform: 'scale(1)',
                    opacity: 1
                }))
            ]),
            transition(':leave', [
                animate('1s', style({
                    transform: 'scale(2.5)',
                    opacity: 0,
                }))
            ])
        ])
    ]
})
export class AppComponent implements OnInit, OnDestroy {
    
    private _users: User[];
    
    public searchTerm: string;
    public isLoading: boolean;
    public destroy$: Subject<any>;
    public selectedTaskGroup: TaskGroup;
    public filterDateRange: Date[];

    public loadingQuote: Quote;

    private intervalId: number;
    
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
    
    constructor(private taskService: TaskManagerService, private userService: UsersService, private quoteService: QuotesService) {
        this.destroy$ = new Subject();
        this.searchTerm = '';
        this._users = [];
        this.isLoading = true;
        this.selectedTaskGroup = this.taskGroups[0];
        this.filterDateRange = [];
        this.loadingQuote = this.quoteService.getRandomQuote();
    }
    
    public ngOnInit(): void {
        forkJoin([this.userService.fetchAll(), this.taskService.fetchAll()]).subscribe({
            next: _ => {
                this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe({
                    next: users => this.users = users,
                });
                // Refresh task list every 90 seconds
                this.intervalId = window.setInterval(() => {
                    this.taskService.fetchAll(true).subscribe();
                }, environment.syncInterval);
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
        } else {
            this.filterDateRange = [];
        }
    }

    public getQuote() {
        this.loadingQuote = this.quoteService.getRandomQuote();
    }
    
    public updateGrouping(taskGroup: TaskGroup) {
        this.selectedTaskGroup = taskGroup;
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
