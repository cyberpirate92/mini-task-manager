import { Component, OnDestroy, OnInit } from '@angular/core';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskBoard } from './models';
import { User } from './models/user';
import { TaskManagerService } from './services/task-manager.service';
import { UsersService } from './services/users.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    
    public users: User[];
    public searchTerm: string;
    public isLoading: boolean;
    public destroy$: Subject<any>;
    
    public boards: TaskBoard[] = [{
        title: 'Low Priority',
        priority: 3,
        items: [],
    }, {
        title: 'Medium Priority',
        priority: 2,
        items: [],
    }, {
        title: 'High Priority',
        priority: 1,
        items: [],
    }];
    
    constructor(private taskService: TaskManagerService, private userService: UsersService) {
        this.destroy$ = new Subject();
        this.searchTerm = '';
        this.users = [];
    }
    
    public ngOnInit(): void {
        forkJoin([this.userService.fetchAll(), this.taskService.fetchAll()]).subscribe({
            next: resultArray => {
                this.initializeSubscriptions();
            }, error: error => {
                console.error('Initializion failed', error);
            }
        });
    }
    
    public initializeSubscriptions(): void {
        this.userService.users$.pipe(takeUntil(this.destroy$)).subscribe({
            next: userList => this.users = userList,
        });
        
        this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe({
            next: tasks => {
                console.log(tasks);
                this.boards.forEach(board => board.items = []);
                tasks.forEach(task => {
                    let board = this.boards.find(board => board.priority === task.priority);
                    if (board) {
                        board.items.push(task);
                    } else {
                        console.warn(`No board found for priority ${task.priority}`);
                    }
                });
            }
        });
        
        this.taskService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe({
            next: value => this.isLoading = value
        });
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
