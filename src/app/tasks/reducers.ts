import { List } from "immutable";
import { Task } from "./models";
import { AnyAction } from "redux";
import { TasksActions, IAddTaskAction, ITaskAction } from "./actions";

export const tasksReducer = (tasks: List<Task> = List<Task>(), action: AnyAction): List<Task> => {
    switch (action.type) {

        case TasksActions.ADD_TASK: {
            let task: Task = (action as IAddTaskAction).payload;
            return tasks.push(task);
        }

        case TasksActions.TOGGLE_TASK: {
            let id: number = (action as ITaskAction).payload;
            let index = tasks.findIndex(task => task.id == id);
            return tasks.update(index, toggleTask);
        }

        case TasksActions.REMOVE_TASK: {
           let id: number = (action as ITaskAction).payload;
           let index = tasks.findIndex(task => task.id == id);
           return tasks.delete(index); 
        }
    }
    return tasks;
}

function toggleTask(task:Task) {
    return {
        ...task,
        done: !task.done
    }
}
