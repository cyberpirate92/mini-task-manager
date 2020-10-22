import { TaskBoard } from './task-board';
import { TaskItem } from './task-item';

export interface TaskDropEvent {
    /**
     * The task that is dropped
     */
    task: TaskItem;

    /**
     * The board it has been dropped to
     */
    board: TaskBoard;
}