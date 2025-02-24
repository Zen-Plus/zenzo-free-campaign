import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-custom-input',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './custom-input.component.html',
  styleUrl: './custom-input.component.scss'
})
export class CustomInputComponent {
  @Input() type: string = 'text';
  @Input() id: string = '';
  @Input() name: string = '';
  @Input() value: string = '';
  //label
  @Input() label: string = '';
  @Input() for: string = '';

  @Output() valueChange = new EventEmitter<string>();

  onValueChange() {
    this.valueChange.emit(this.value);
  }

}
