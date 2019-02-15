import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { List } from "immutable";
import { Task } from "../models";

@Component({
  selector: 'app-task-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {

  @Input() tasks: List<Task>;
  @Output() toggle = new EventEmitter<Task>();
  @Output() remove = new EventEmitter<Task>();


  constructor() { }

  ngOnInit() {
  }

  toggleTask(task: Task) {
    this.toggle.emit(task);
  }

  removeTask(task: Task) {
    this.remove.emit(task);
    return false;
  }


}
