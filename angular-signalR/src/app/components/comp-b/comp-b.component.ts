import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comp-b',
  standalone: true,
  imports: [CommonModule],
  providers: [SignalRService],
  templateUrl: './comp-b.component.html',
  styleUrl: './comp-b.component.scss',
})
export class CompBComponent {
  constructor(public signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }
}
