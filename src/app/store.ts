import { combineReducers } from "redux";
import { List } from "immutable";
import { Task } from "./tasks/models";
import { tasksReducer } from "./tasks/reducers";

export interface IAppState {
    tasks?: List<Task>
}

export const rootReducer = combineReducers({
    tasks: tasksReducer
});
