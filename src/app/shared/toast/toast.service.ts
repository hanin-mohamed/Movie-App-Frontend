import { Injectable, signal } from '@angular/core';

export type ToastType = 'success'|'error'|'info';
export interface Toast { id:number; type:ToastType; message:string; }

@Injectable({ providedIn: 'root' })
export class ToastService {
  private seq = 0;
  toasts = signal<Toast[]>([]);
  show(message:string, type:ToastType='info', duration=3000) {
    const id = ++this.seq;
    this.toasts.update(v => [...v, { id, type, message }]);
    setTimeout(() => this.dismiss(id), duration);
  }
  success(m:string,d?:number){ this.show(m,'success',d); }
  error(m:string,d?:number){ this.show(m,'error',d); }
  dismiss(id:number){ this.toasts.update(v => v.filter(t => t.id!==id)); }
}
