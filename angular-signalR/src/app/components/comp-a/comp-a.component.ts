import { Component } from '@angular/core';
import { SignalRService } from '../../services/signalr.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-comp-a',
  standalone: true,
  imports: [CommonModule],
  providers: [SignalRService],
  templateUrl: './comp-a.component.html',
  styleUrl: './comp-a.component.scss',
})
export class CompAComponent {
  constructor(public signalRService: SignalRService) {}

  ngOnInit(): void {
    this.signalRService.startConnection();
  }
}
