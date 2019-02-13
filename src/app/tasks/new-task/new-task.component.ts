import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.css']
})
export class NewTaskComponent implements OnInit {

  @Output() add = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  addTask(desc) {
    this.add.emit(desc.value);
    desc.value = '';
    desc.focus();
    return false;
  }


}
