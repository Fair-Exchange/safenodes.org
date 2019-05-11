import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.less']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {

      const updateCounter = () => {
          setTimeout(() => {
              odometer.innerHTML = Math.floor(Math.random() * 5000) + 1000  ;
              updateCounter();
          }, 4000);
      }

      updateCounter();
  }

}
