import { GenericResponse } from './generic-response';
import { User } from './user';

export interface UserResponse extends GenericResponse {
    users: User[];
}