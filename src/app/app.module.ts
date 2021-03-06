import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgRedux, NgReduxModule, DevToolsExtension } from "@angular-redux/store";
import { createLogger } from 'redux-logger'

import { AppComponent } from './app.component';
import { IAppState, rootReducer } from './store';
import { TasksComponent } from './tasks/tasks.component';
import { TasksActions } from './tasks/actions';
import { TaskListComponent } from './Tasks/task-list/task-list.component';
import { NewTaskComponent } from './Tasks/new-task/new-task.component';

@NgModule({
  declarations: [
    AppComponent,
    TasksComponent,
    TaskListComponent,
    NewTaskComponent
  ],
  imports: [
    BrowserModule,
    NgReduxModule
  ],
  providers: [
    TasksActions
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(ngRedux: NgRedux<IAppState>, devTools: DevToolsExtension) {
    let middleware = [createLogger({ collapsed: true })];
    let storeEnhancers = devTools.isEnabled() ? [devTools.enhancer()] : [];
    ngRedux.configureStore(rootReducer, {}, middleware, storeEnhancers);
  }
}
