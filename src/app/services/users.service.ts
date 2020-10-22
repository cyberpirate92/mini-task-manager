import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models/user';
import { UserResponse } from '../models/users-response';

@Injectable({
    providedIn: 'root'
})
export class UsersService {    
    private API_URL: string;
    public users$: BehaviorSubject<User[]>;
    
    constructor(private httpClient: HttpClient) { 
        this.API_URL = environment.apiUrl;
        this.users$ = new BehaviorSubject<User[]>([]);
    }
    
    /**
    * Fetch all users. 
    * `users$` will be updated with the fetched list.
    * 
    * @returns observable of the response object
    */
    public fetchAll() {
        return this.httpClient.get<UserResponse>(`${this.API_URL}/listusers`, {
            headers: {
                AuthToken: environment.apiKey,
            }
        }).pipe(tap({
            next: response => {
                if (response.status !== 'success') {
                    console.error(response.error || 'Fetching user list failed: Unknown error');
                }
                if (response?.users?.length > 0) {
                    this.users$.next(response.users);
                }
            }, 
            error: (error: HttpErrorResponse) => {
                console.error('Error fetching user list', error);
            }
        }));
    }

    /**
     * Fetch user by User ID from cache
     * @param id User ID
     */
    public getUserById(id: number): User {
        return id ? this.users$.getValue().find(x => x.id == id.toString()) : null;
    }
}
