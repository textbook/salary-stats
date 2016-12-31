import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'sst-person',
  templateUrl: './person.component.html',
  styleUrls: ['./person.component.scss']
})
export class PersonComponent implements OnInit {

  @Input() person: any = {};

  constructor() { }

  ngOnInit() {
  }

}
