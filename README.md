# How to run the sample

1. `npm install`
1. `ng serve -o`

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

Smart component already exists. Create two dumb components. Dumb components handle only presentation.

```typescript
ng generate component Tasks/TaskList
ng generate component Tasks/NewTask
```

The smart component **Tasks** manages subscription to the store. The data is then sent as "@Input" properties of the dumb component. This helps us manage change detection strategy at the dumb component level. This would not have been possible if the dumb component subscribed to store changes directly.

### Subscribing to the store

The smart component **Tasks** can subscribe to the `tasks` property of the store by using the `@select` decorator.

```typescript
import { Observable } from "rxjs";
import { select } from '@angular-redux/store';
import { List } from "immutable";
import { Task } from "./models";

export class TasksComponent implements OnInit {

    @select("tasks") tasks$: Observable<List<Task>>;

}
```

The `@select()` annotation creates a subscription to the store. The variable `tasks$` ends with a `$` to indicate that it is a RxJS observable object. Normally it is required to unsubscribe from the store when this component is destroyed to prevent a memory leak. However, we can automate this by using the `| async` filter when using this property in the HTML template.

```html
<app-task-list [tasks]="tasks$ | async"></app-task-list>
```

### Invoking actions

The **Tasks** component injects the `TasksActions` service in its constructor. This way, methods in the component can invoke actions in response to user actions. E.g.:

```typescript
export class TasksComponent implements OnInit {
  
  constructor(private TasksActions: TasksActions) {}

  newTask(title: string) {
    this.TasksActions.addTask(title);
  }

}
```

## Adding Redux Middleware

In `app.module.ts`, we have initialized `NgRedux` in the module constructor. We have only passed 2 parameters so far, but we can pass in a 3rd parameter to initialize any middleware we like. E.g.:

```typescript
import { createLogger } from 'redux-logger'

...

ngRedux.configureStore(rootReducer, {}, [createLogger({ collapsed: true })]);
```

This should cause every action to get logged to browser console.

Similarly, you can install the **Redux Dev Tools** Chrome extension from the [Chrome web store](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd) and then enable a store enhancer provided by the ngRedux library.

```typescript
import { NgRedux, NgReduxModule, DevToolsExtension } from "@angular-redux/store";

...

let storeEnhancers = devTools.isEnabled() ? [devTools.enhancer] : [];
ngRedux.configureStore(rootReducer, {}, [createLogger({ collapsed: true })], storeEnhancers);
```
