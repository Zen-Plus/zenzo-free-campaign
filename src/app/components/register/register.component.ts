import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BannerComponent } from '../banner/banner.component';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { FamilyMemberComponent } from '../family-member/family-member.component';
import { ApiService } from '../../services/api/api.service';
import { genderOptions, chronicIllnessesOptions, bloodGroupOptions } from '../utils/constants';
import { errorMessages } from '../utils/error-messages';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, BannerComponent, FamilyMemberComponent, ModalComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [ApiService]
})

export class RegisterComponent {

  constructor(private fb: FormBuilder, private apiService: ApiService) { }
  @ViewChild('successModal') successModal!: ModalComponent;

  registrationForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: [''],
    dob: ['', Validators.required],
    gender: [''],
    address: ['', Validators.required],
    phoneNumber: ['', Validators.required],
    bloodGroup: [''],
    chronicIllness: [''],
    disabilities: [''],
    medications: [''],
    primaryDoctorName: [''],
    primaryDoctorContact: [''],
    preferredHospital: [''],
    insuranceProvider: [''],
    policyNumber: [''],
    policyExpiry: [''],
    coverageType: [''],
  });
  primaryMemberData: string = '';
  genderOptions = genderOptions;
  bloodGroupOptions = bloodGroupOptions;
  chronicIllnessesOptions = chronicIllnessesOptions;
  errorMessages = errorMessages;
  selectedChronicIllnesses: string[] = [];

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (isValidDate) {
      this.registrationForm.get('dob')?.setErrors(null);
    } else {
      this.registrationForm.get('dob')?.setErrors({ pattern: true });
    }
  }

  openSuccessModal() {
    this.successModal.successMessage = 'New User Added SuccessFully.';
    this.successModal.modalType = 'success';
    this.successModal.open();
    this.successModal.reloadFlag = true;
  }

  openFailureModal() {
    this.successModal.successMessage = 'Something went wrong. Please try again.';
    this.successModal.modalType = 'failure';
    this.successModal.open();
    this.successModal.reloadFlag = false;
  }

  onSelectChronicIllness(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue && !this.selectedChronicIllnesses.includes(selectedValue)) {
      this.selectedChronicIllnesses.push(selectedValue);
    }
  }

  // Remove a selected chronic illness
  removeChronicIllness(illness: string) {
    const index = this.selectedChronicIllnesses.indexOf(illness);
    if (index > -1) {
      this.selectedChronicIllnesses.splice(index, 1);
    }
  }

  addPrimaryMember() {
    const primaryMember = {
      firstName: this.registrationForm.value.firstName,
      lastName: this.registrationForm.value.lastName,
      dob: new Date(this.registrationForm.value.dob).getTime(),
      mobileNumber: this.registrationForm.value.phoneNumber,
      gender: this.registrationForm.value.gender,
      email: 'testing1@testing.com',
      address: this.registrationForm.value.address,
      bloodGroup: this.registrationForm.value.bloodGroup,
      existingChronicIllness: this.selectedChronicIllnesses.join(', '),
      disabilities: this.registrationForm.value.disabilities,
      medicationsTaking: this.registrationForm.value.medications,
      primaryDoctorName: this.registrationForm.value.primaryDoctorName,
      primaryDoctorContact: this.registrationForm.value.primaryDoctorContact,
      preferredHospital: this.registrationForm.value.preferredHospital,
      insuranceProvider: this.registrationForm.value.insuranceProvider,
      policyNumber: this.registrationForm.value.policyNumber,
      policyExpiryDate: new Date(this.registrationForm.value.policyExpiry).getTime(),
      coverageType: this.registrationForm.value.coverageType
    };

    this.apiService.addPrimaryMember(primaryMember).subscribe((response: any) => {
      this.primaryMemberData = response?.data
      this.registrationForm.reset();
      this.openSuccessModal();
    },
    (error) => {
      this.openFailureModal();
    }
  );
    
  }

}
