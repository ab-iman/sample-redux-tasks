import { Injectable } from "@angular/core";
import { Task } from "./models";
import { Action } from "redux";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";

@Injectable()
export class TasksActions {
    static ADD_TASK = "TASKS/ADD";
    static TOGGLE_TASK = "TASKS/TOGGLE";
    static REMOVE_TASK = "TASKS/REMOVE";

    constructor(private ngRedux: NgRedux<IAppState>) {

    }

    private counter: number = 1;

    addTask(title: string) {
        // create a new task
        let task: Task = {
            id: this.counter++,
            title,
            done: false
        };

        // create action
        let action: IAddTaskAction = {
            type: TasksActions.ADD_TASK,
            payload: task
        }

        // dispatch action to store
        this.ngRedux.dispatch(action);
    }

    toggleTask(id: number) {
        let action: ITaskAction = {
            type: TasksActions.TOGGLE_TASK,
            payload: id
        }
        this.ngRedux.dispatch(action);
    }

    removeTask(id: number) {
        let action: ITaskAction = {
            type: TasksActions.REMOVE_TASK,
            payload: id
        }
        this.ngRedux.dispatch(action);
    }

}

export interface IAddTaskAction extends Action {
    payload: Task
}

export interface ITaskAction extends Action {
    payload: number
}