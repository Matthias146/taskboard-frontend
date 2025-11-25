import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SocketService {
  private socket: Socket;

  constructor() {
    this.socket = io('http://localhost:3000');
  }

  // Lauscher für Updates
  getTaskUpdates(): Observable<void> {
    return new Observable((observer) => {
      this.socket.on('tasks-update', (data) => {
        console.log('⚡ WebSocket Event empfangen:', data);
        observer.next();
      });
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
