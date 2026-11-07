import { Injectable, OnDestroy } from '@angular/core';
import {
  HubConnection,
  HubConnectionBuilder,
  HubConnectionState,
  LogLevel,
} from '@microsoft/signalr';

import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SignalRService implements OnDestroy {
  private hubConnection!: HubConnection;

  private readonly hubUrl = 'https://localhost:7032/priceHub';

  private readonly messageSubject = new Subject<any>();

  private readonly connectionStateSubject =
    new BehaviorSubject<HubConnectionState>(HubConnectionState.Disconnected);

  // Public observables
  public messages$ = this.messageSubject.asObservable();

  public connectionState$ = this.connectionStateSubject.asObservable();

  constructor() {
    this.createConnection();
  }

  private createConnection(): void {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
      .configureLogging(LogLevel.Information)
      .build();

    this.registerEvents();
  }

  private registerEvents(): void {
    // Receive messages from the server
    this.hubConnection.on('ReceivePriceUpdate', (message: any) => {
      this.messageSubject.next(message);
      console.log(message);
    });

    // Connection is reconnecting
    this.hubConnection.onreconnecting(() => {
      this.connectionStateSubject.next(HubConnectionState.Reconnecting);
    });

    // Connection successfully reestablished
    this.hubConnection.onreconnected(() => {
      this.connectionStateSubject.next(HubConnectionState.Connected);
    });

    // Connection closed
    this.hubConnection.onclose(() => {
      this.connectionStateSubject.next(HubConnectionState.Disconnected);
    });
  }

  async startConnection(): Promise<void> {
    if (
      this.hubConnection.state === HubConnectionState.Connected ||
      this.hubConnection.state === HubConnectionState.Connecting
    ) {
      return;
    }

    try {
      await this.hubConnection.start();

      this.connectionStateSubject.next(HubConnectionState.Connected);

      console.log('SignalR connected successfully.');
    } catch (error) {
      this.connectionStateSubject.next(HubConnectionState.Disconnected);

      console.error('SignalR connection error:', error);

      throw error;
    }
  }

  async stopConnection(): Promise<void> {
    if (this.hubConnection.state !== HubConnectionState.Disconnected) {
      await this.hubConnection.stop();
    }
  }

  // Call server-side hub methods
  async sendMessage(message: string): Promise<void> {
    if (this.hubConnection.state !== HubConnectionState.Connected) {
      throw new Error('SignalR is not connected.');
    }

    await this.hubConnection.invoke('SendMessage', message);
  }

  ngOnDestroy(): void {
    this.messageSubject.complete();
    this.connectionStateSubject.complete();

    void this.hubConnection.stop();
  }
}
