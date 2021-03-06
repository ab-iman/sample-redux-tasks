import { Component, OnInit } from '@angular/core';
import { TasksActions } from './actions';
import { Observable } from 'rxjs';
import { List } from 'immutable';
import { Task } from './models';
import { select } from '@angular-redux/store';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css']
})
export class TasksComponent implements OnInit {

  @select("tasks") tasks$: Observable<List<Task>>;

  constructor(
    private TasksActions: TasksActions
    ) { }

  ngOnInit() {
  }

  newTask(title: string) {
    this.TasksActions.addTask(title);
  }

  toggleTask(task: Task) {
    this.TasksActions.toggleTask(task.id);
  }

  removeTask(task: Task) {
    this.TasksActions.removeTask(task.id);
  }

}
