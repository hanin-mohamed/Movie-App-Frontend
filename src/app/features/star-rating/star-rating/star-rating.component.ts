import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-stars',
  imports: [CommonModule],
  template: `
  <div class="stars">
    <span *ngFor="let s of [1,2,3,4,5]" (click)="click(s)" [class.active]="s<=value">★</span>
  </div>`,
  styles: [`.stars{cursor:pointer}.stars span{font-size:22px;opacity:.4}.stars span.active{opacity:1}`]
})
export class StarRatingComponent {
  @Input() value = 0;
  @Output() valueChange = new EventEmitter<number>();
  click(v:number){ this.value = v; this.valueChange.emit(v); }
}
