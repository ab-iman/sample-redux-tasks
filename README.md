# NgRedux Example: Tasks

## Create a new Angular application

```
ng new
```

## Install npm dependencies

```
npm install --save @angular-redux/store immutable redux redux-logger
```

## Store Setup

### Create store

1. Create `app/store.ts`
1. Start with an empty interface. The `IAppState` interface represents the data type of the entire store.

   ```typescript
   export interface IAppState {
   }
   ```

1. Create a root reducer placeholder
    ```typescript
    import { combineReducers } from "redux";

    export const rootReducer = combineReducers({
        // Add child reducers here
    });
    ```

### Add module dependency

1. Open `app.module.ts`
1. Import modules
    ```typescript
    import { NgReduxModule, NgRedux } from "@angular-redux/store";
    ```
1. Add `NgReduxModule` to the `imports` array


### Initialize Angular-redux

1. Import store into `app.module.ts`
    ```typescript
    import { IAppState, RootReducer } from "./store";
    ```
1. Add a `constructor` to the `AppModule` class

    ```typescript
    constructor() {
        // ToDo: Initialize ngRedux
    }
    ```
1. Inject `ngRedux` into the constructor
    ```typescript
    constructor(ngRedux: NgRedux<IAppState>) {
        ngRedux.configureStore(rootReducer, {});
    }
    ```



## Create component **Tasks**

*Tasks* is a smart component that manages a few dumb components we will create in the future.
```
ng generate component Tasks
```
This will create a folder with a component within.

### Define first action within **Tasks**

The first step in an Redux application is to define actions used in the system. Store structure comes later.

Create a new Angular service within the `Tasks` folder called `actions.ts`. This service will contain Action Creators. The service can then be injected into any Angular component in the future that would like to invoke these tasks. 

```typescript
import { IAppState } from "../store";

@Injectable()
export class TasksActions {
    static ADD_TASK = "TASKS/ADD";

    constructor(private ngRedux: NgRedux<IAppState>) 
    {
    }

    private counter: number = 1;

    addTask(title: string) 
    {
        // create task object
        let task = { 
            id: this.counter++,
            title,
            done: false 
        };
        
        // create action
        let action: IAddTaskAction = {
            type: TaskActions.ADD_TASK,
            payload: task
        };

        // dispatch action to store
        this.ngRedux.dispatch(action);
    }
}

interface IAddTaskAction extends Action {
    payload: Task
}
```

Create a file called `models.ts`

```typescript
export interface Task {
    id: number,
    title: string,
    done: boolean
}
```

### Define all other actions with **Tasks**

```typescript
import { Injectable } from "@angular/core";
import { Task } from "./models";
import { NgRedux } from "@angular-redux/store";
import { IAppState } from "../store";
import { Action } from "redux";


@Injectable()
export class TasksActions {
    static ADD_TASK = "TASKS/ADD";
    static TOGGLE_TASK = "TASKS/TOGGLE";
    static REMOVE_TASK = "TASKS/REMOVE";

    constructor(private ngRedux: NgRedux<IAppState>) {
    }

    private counter: number = 1;

    addTask(title: string) {

        // create task object
        let task: Task = { 
            id: this.counter++,
            title,
            done: false
        }

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

export interface ITaskAction extends Action {
    payload: number
}

export interface IAddTaskAction extends Action {
    payload: Task
}

```

### Design the Store

List of tasks using immutable List.

```typescript
export interface IAppState {
    tasks?: List<Task>
}
```

Add reducer for tasks
```typescript
import { tasksReducer } from "./tasks/reducers";

export const rootReducer = combineReducers({
    tasks: tasksReducer
})
```

### Create a reducer for Tasks

Create a file `tasks/reducers.ts`

```typescript
import { List } from "immutable";
import { AnyAction } from "redux";
import { Task } from "./models";
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
};


function toggleTask(task:Task) {
    return {
        ...task,
        done: !task.done
    };
}
```

## Smart component **Tasks**

Smart component already exists. Create two dumb components.

```typescript
ng generate component Tasks/TaskList
ng generate component Tasks/NewTask
```

