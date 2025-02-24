import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap'
@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent {

  @Input() successMessage: string = 'Action successful!';
  @Input() modalType: 'success' | 'failure' = 'success';
  @Input() reloadFlag: boolean = false;

  constructor() { }

  onClose() {
    console.log('Modal closed');
  }

  open() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  close() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.hide();
    }
  }

  reloadForNewMember() {
    window.location.reload();
  }

  getModalClass(): string {
    return this.modalType === 'success' ? 'modal-success' : 'modal-failure';
  }
}
