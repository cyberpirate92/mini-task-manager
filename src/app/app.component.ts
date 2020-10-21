import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TaskBoard } from './models';
import { TaskManagerService } from './services/task-manager.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

    public destroy$: Subject<any>;
    public isLoading: boolean;
    public searchTerm: string;

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

    constructor(private taskService: TaskManagerService) {
        this.destroy$ = new Subject();
        this.searchTerm = '';
    }

    public ngOnInit(): void {
        this.taskService.tasks$.pipe(takeUntil(this.destroy$)).subscribe(tasks => {
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
        });

        this.taskService.isLoading$.pipe(takeUntil(this.destroy$)).subscribe(value => this.isLoading = value);
    }

    public ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
