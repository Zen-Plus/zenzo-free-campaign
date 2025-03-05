import { Component, OnInit, ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';
import { genderOptions, chronicIllnessesOptions, relationshipOptions, bloodGroupOptions } from '../utils/constants';
import { errorMessages } from '../utils/error-messages';
import { ModalComponent } from '../modal/modal.component';

@Component({
  selector: 'app-family-member',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ModalComponent],
  templateUrl: './family-member.component.html',
  styleUrl: './family-member.component.scss',
  providers: [ApiService]
})
export class FamilyMemberComponent implements OnInit{

  ngOnInit(): void {
    if (this.primaryMemberData) {
      console.log('Primary member data:', this.primaryMemberData);
    }
  }
  @ViewChild ('successModal') successModal!: ModalComponent;
  @Input() primaryMemberData: string = '';

  familyMemberForm: FormGroup;
  genderOptions = genderOptions;
  chronicIllnessesOptions = chronicIllnessesOptions;
  relationshipOptions = relationshipOptions;
  bloodGroupOptions = bloodGroupOptions;
  familyMembers: any[] = [];
  isEditing: boolean = false;
  currentEditIndex: number = -1;
  errorMessages = errorMessages;

  constructor(private fb: FormBuilder, private apiService: ApiService) {
  
    this.familyMemberForm = this.fb.group({
      firstName: ['', Validators.required],
      dob: ['', Validators.required],
      gender: [null, Validators.required],
      mobileNumber: [null, Validators.required],
      relationWithUser: [null, Validators.required],
      existingChronicIllness: [null],
      policyNumber: [null],
      bloodGroup: [null],
      preferredDoctorName: [null],
      preferredDoctorContact: [null]
    });
  }
  selectedChronicIllnesses: string[] = [];

  onDateChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    
    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(value);
    if (isValidDate) {
      this.familyMemberForm.get('dob')?.setErrors(null);
    } else {
      this.familyMemberForm.get('dob')?.setErrors({ pattern: true });
    }
  }

  openSuccessModal() {
    this.successModal.successMessage = 'Family Members Added Successfully';
    this.successModal.modalType = 'success';
    this.successModal.open();
  }

  openFailureModal() {
    this.successModal.successMessage = 'Something went wrong. Please try again.';
    this.successModal.modalType = 'failure';
    this.successModal.open();
  }

  onSelectChronicIllness(event: any) {
    const selectedValue = event.target.value;
    if (selectedValue && !this.selectedChronicIllnesses.includes(selectedValue)) {
      this.selectedChronicIllnesses.push(selectedValue);
    }
    const chronicIllnessString = this.selectedChronicIllnesses.join(', ');

    this.familyMemberForm.patchValue({
      existingChronicIllness: chronicIllnessString
    });
  }

  removeChronicIllness(illness: string) {
    const index = this.selectedChronicIllnesses.indexOf(illness);
    if (index > -1) {
      this.selectedChronicIllnesses.splice(index, 1);
    }
    const chronicIllnessString = this.selectedChronicIllnesses.join(', ');

    this.familyMemberForm.patchValue({
      existingChronicIllness: chronicIllnessString
    });
  }

  addFamilyMember() {
    if (this.familyMemberForm.valid) {
      const formData = this.familyMemberForm.value;
      if (formData.dob) {
        formData.dob = new Date(formData.dob).getTime();
      }
      formData.existingChronicIllness = this.selectedChronicIllnesses.join(', ');
      if (this.isEditing) {
        this.familyMembers[this.currentEditIndex] = formData;
        this.isEditing = false;
      } else {
        this.familyMembers.push(formData);
      }
      this.familyMemberForm.reset();
      this.selectedChronicIllnesses = []
    }
  }
  
  editFamilyMember(index: number) {
    this.isEditing = true;
    this.currentEditIndex = index;
    const member = this.familyMembers[index];
    
    const formattedDob = new Date(member.dob).toISOString().split('T')[0];
    this.selectedChronicIllnesses = member.existingChronicIllness.split(', ')
    this.familyMemberForm.patchValue({
      firstName: member.firstName,
      dob: formattedDob,
      gender: member.gender,
      mobileNumber: member.mobileNumber,
      relationWithUser: member.relationWithUser,
      illness: this.selectedChronicIllnesses,
      policyNumber: member.policyNumber,
      bloodGroup: member.bloodGroup,
      preferredDoctorName: member.preferredDoctorName,
      preferredDoctorContact: member.preferredDoctorContact

    });
  }

  removeFamilyMember(index: number) {
    this.familyMembers.splice(index, 1);
  }

  submitFamilyMembers() {
    console.log(this.familyMembers);
    this.apiService.addFamilyMembers(this.familyMembers, this.primaryMemberData).subscribe((response: any) => {
      this.openSuccessModal();
      this.primaryMemberData = ''
      this.familyMembers = [];
    }, (error) => {
      this.openFailureModal();
    });
  }
}
