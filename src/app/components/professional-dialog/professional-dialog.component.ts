import { Component, inject, Inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

// Angular Material imports
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import {
  CreateProfessionalDto,
  UpdateProfessionalDto,
  ProfessionalResponseDto,
} from '../../models/api.models';

interface DialogData {
  mode: 'create' | 'edit';
  professional?: ProfessionalResponseDto;
  institutionName?: string;
}

@Component({
  selector: 'app-professional-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './professional-dialog.component.html',
  styleUrl: './professional-dialog.component.scss',
})
export class ProfessionalDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly dialogRef = inject(
    MatDialogRef<ProfessionalDialogComponent>,
  );

  public professionalForm: FormGroup;
  public isLoading = signal<boolean>(false);
  public isEditMode: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.isEditMode = data.mode === 'edit';

    this.professionalForm = this.fb.group({
      coren: [
        { value: data.professional?.coren || '', disabled: this.isEditMode },
        [Validators.required, Validators.pattern(/^COREN-[A-Z]{2}-\d+$/)],
      ],
      name: [
        data.professional?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      password: [
        '',
        this.isEditMode ? [] : [Validators.required, Validators.minLength(6)],
      ],
      institution_names: [[data.institutionName]],
    });
  }

  /**
   * Get form control error message
   */
  getErrorMessage(controlName: string): string {
    const control = this.professionalForm.get(controlName);

    if (control?.hasError('required')) {
      return `${this.getFieldLabel(controlName)} is required`;
    }

    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `${this.getFieldLabel(
        controlName,
      )} must be at least ${minLength} characters`;
    }

    if (control?.hasError('pattern') && controlName === 'coren') {
      return 'COREN must follow format: COREN-XX-123456';
    }

    return '';
  }

  /**
   * Get field label for error messages
   */
  private getFieldLabel(controlName: string): string {
    const labels: { [key: string]: string } = {
      coren: 'COREN',
      name: 'Name',
      password: 'Password',
    };
    return labels[controlName] || controlName;
  }

  /**
   * Submit the form
   */
  onSubmit(): void {
    if (this.professionalForm.valid) {
      const formValue = this.professionalForm.value;

      if (this.isEditMode) {
        // For edit mode, only send changed fields
        const updates: UpdateProfessionalDto = {};

        if (formValue.name !== this.data.professional?.name) {
          updates.name = formValue.name;
        }

        if (formValue.password) {
          updates.password = formValue.password;
        }

        if (formValue.institution_names?.length > 0) {
          updates.institution_names = formValue.institution_names;
        }

        this.dialogRef.close(updates);
      } else {
        // For create mode, send all data
        const professionalData: CreateProfessionalDto = {
          coren: formValue.coren,
          name: formValue.name,
          password: formValue.password,
          institution_names: formValue.institution_names || [],
        };

        this.dialogRef.close(professionalData);
      }
    }
  }

  /**
   * Cancel and close dialog
   */
  onCancel(): void {
    this.dialogRef.close();
  }

  /**
   * Check if form has changes (for edit mode)
   */
  hasChanges(): boolean {
    if (!this.isEditMode) return true;

    const formValue = this.professionalForm.value;
    return (
      formValue.name !== this.data.professional?.name || !!formValue.password
    );
  }
}
