import { Component, OnInit } from '@angular/core';
import { TasksActions } from './actions';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { Task } from './models';
import { select, NgRedux } from '@angular-redux/store';
import { IAppState } from '../store';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @select("tasks") tasks$: Observable<List<Task>>;

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private TaskActions: TasksActions
    ) { }

  ngOnInit() {
  }

  newTask(title: string) {
    this.TaskActions.addTask(title);
  }

  toggleTask(task: Task) {
    this.TaskActions.toggleTask(task.id);
  }

  removeTask(task: Task) {
    this.TaskActions.removeTask(task.id);
  }

}
