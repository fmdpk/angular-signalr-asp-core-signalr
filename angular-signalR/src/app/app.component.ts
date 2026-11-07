import { Component, OnInit } from '@angular/core';
import { SignalRService } from './services/signalr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h1>Real-Time Price Updates</h1>
      <h2>EUR/USD: {{ signalRService.messages$ | async | json }}</h2>
    </div>
  `,
  styles: [
    `
      .container {
        text-align: center;
        padding: 50px;
        font-family: Arial;
      }
    `,
  ],
})
export class AppComponent implements OnInit {
  constructor(public signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }
}
