import { Component, OnDestroy, OnInit } from '@angular/core';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { forkJoin, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskBoard, TaskDropEvent } from './models';
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
        title: 'High Priority',
        priority: 1,
    },{
        title: 'Medium Priority',
        priority: 2,
    },{
        title: 'Low Priority',
        priority: 3,
    }];
    
    constructor(private taskService: TaskManagerService, private userService: UsersService) {
        this.destroy$ = new Subject();
        this.searchTerm = '';
        this.users = [];
        this.isLoading = true;
    }
    
    public ngOnInit(): void {
        forkJoin([this.userService.fetchAll(), this.taskService.fetchAll()]).subscribe({
            next: _ => {
                // TODO: remove
            }, error: error => {
                console.error('Initializion failed', error);
            }, complete: () => {
                this.isLoading = false;
            }
        });
    }

    public handleDrop(event: TaskDropEvent) {
        if (event.task.priority !== event.board.priority) {
            console.log('Now this is interesting');
            event.task.priority = event.board.priority;
            this.taskService.updateTask(event.task).subscribe({
                next: response => {
                    console.log(response);
                }
            });
        } else {
            console.log('Dropped on the same board, how boring!');
        }
    }
    
    public ngOnDestroy(): void {
        this.destroy$.complete();
    }
}
