import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { GenericResponse, TaskItem, TaskListResponse } from '../models';
import { DateUtils } from '../utils/date-utils';

@Injectable({
    providedIn: 'root'
})
export class TaskManagerService {    
    private API_URL: string;
    private API_KEY: string;
    
    public tasks$: BehaviorSubject<TaskItem[]>;
    public error$: BehaviorSubject<string>;
    public isLoading$: BehaviorSubject<boolean>;
    
    constructor(private httpClient: HttpClient) { 
        this.API_URL = environment.apiUrl;
        this.API_KEY = environment.apiKey;

        this.tasks$ = new BehaviorSubject([]);
        this.error$ = new BehaviorSubject("");
        this.isLoading$ = new BehaviorSubject(false);

        this.fetchTasks();
    }

    /**
     * Fetch all tasks. `tasks$` will be updated with the results.
     */
    public fetchTasks(): void {
        this.isLoading$.next(true);
        this.httpClient.get<TaskListResponse>(`${this.API_URL}/list`, {
            headers: {
                AuthToken: this.API_KEY,
            }
        }).pipe(finalize(() => this.isLoading$.next(false))).subscribe(response => {
            if (response.status === 'success') {
                this.tasks$.next(response.tasks.map(t => {
                    t.created_on = t.created_on && DateUtils.fromResponseFormat(t.created_on as any);
                    t.due_date = t.due_date && DateUtils.fromResponseFormat(t.due_date as any);
                    t.priority = t.priority && parseInt(t.priority as any);
                    t.assigned_to = t.assigned_to && parseInt(t.assigned_to as any);
                    return t;
                }));
            } else {
                this.error$.next(response.error || 'Unknown error, please try reloading the page');
            }
        }, (error: HttpErrorResponse) => {
            console.error(error);
            this.error$.next(error.message);
        });
    }

    /**
     * Delete a task
     * @param taskId ID of the task to be deleted 
     * 
     * @retuns Observable result of the delete operation
     */
    public deleteTask(taskId: string): Observable<GenericResponse> {
        let requestBody = new FormData();
        requestBody.set('taskid', taskId);
        return this.httpClient.post<GenericResponse>(`${this.API_URL}/delete`, requestBody, {
            headers: {
                AuthToken: this.API_KEY,
            }
        }).pipe(tap(response => {
            if (response.status === 'success') {
                this.tasks$.next(this.tasks$.getValue().filter(task => task.id !== taskId));
            }
        }));
    }
}
