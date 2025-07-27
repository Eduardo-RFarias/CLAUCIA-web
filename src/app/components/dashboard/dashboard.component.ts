import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';

// Angular Material imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';

import { AuthService } from '../../services/auth.service';
import { ProfessionalService } from '../../services/professional.service';
import {
  ProfessionalResponseDto,
  CreateProfessionalDto,
} from '../../models/api.models';
import { ProfessionalDialogComponent } from '../professional-dialog/professional-dialog.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatTableModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly professionalService = inject(ProfessionalService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Signals for reactive state
  public professionals = signal<ProfessionalResponseDto[]>([]);
  public isLoading = signal<boolean>(false);
  public currentInstitution = this.authService.currentInstitution;

  // Table configuration
  public displayedColumns: string[] = [
    'name',
    'coren',
    'created_at',
    'actions',
  ];

  ngOnInit(): void {
    this.loadProfessionals();
  }

  /**
   * Load all professionals
   */
  loadProfessionals(): void {
    this.isLoading.set(true);

    this.professionalService.getAllProfessionals().subscribe({
      next: (professionals) => {
        this.professionals.set(professionals);
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading professionals:', error);
        this.isLoading.set(false);
        this.snackBar.open('Error loading professionals', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Open dialog to create a new professional
   */
  openCreateDialog(): void {
    const dialogRef = this.dialog.open(ProfessionalDialogComponent, {
      width: '500px',
      data: {
        mode: 'create',
        institutionName: this.currentInstitution()?.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createProfessional(result);
      }
    });
  }

  /**
   * Open dialog to edit a professional
   */
  openEditDialog(professional: ProfessionalResponseDto): void {
    const dialogRef = this.dialog.open(ProfessionalDialogComponent, {
      width: '500px',
      data: {
        mode: 'edit',
        professional,
        institutionName: this.currentInstitution()?.name,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.updateProfessional(professional.coren, result);
      }
    });
  }

  /**
   * Create a new professional
   */
  private createProfessional(professionalData: CreateProfessionalDto): void {
    this.professionalService.createProfessional(professionalData).subscribe({
      next: (newProfessional) => {
        this.professionals.update((professionals) => [
          ...professionals,
          newProfessional,
        ]);
        this.snackBar.open('Professional created successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (error) => {
        console.error('Error creating professional:', error);
        const errorMessage =
          error.error?.message || 'Error creating professional';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Update a professional
   */
  private updateProfessional(coren: string, updates: any): void {
    this.professionalService.updateProfessional(coren, updates).subscribe({
      next: (updatedProfessional) => {
        this.professionals.update((professionals) =>
          professionals.map((p) =>
            p.coren === coren ? updatedProfessional : p,
          ),
        );
        this.snackBar.open('Professional updated successfully', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (error) => {
        console.error('Error updating professional:', error);
        const errorMessage =
          error.error?.message || 'Error updating professional';
        this.snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  /**
   * Delete a professional
   */
  deleteProfessional(professional: ProfessionalResponseDto): void {
    if (confirm(`Are you sure you want to delete ${professional.name}?`)) {
      this.professionalService
        .deleteProfessional(professional.coren)
        .subscribe({
          next: () => {
            this.professionals.update((professionals) =>
              professionals.filter((p) => p.coren !== professional.coren),
            );
            this.snackBar.open('Professional deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar'],
            });
          },
          error: (error) => {
            console.error('Error deleting professional:', error);
            const errorMessage =
              error.error?.message || 'Error deleting professional';
            this.snackBar.open(errorMessage, 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar'],
            });
          },
        });
    }
  }

  /**
   * Logout
   */
  logout(): void {
    this.authService.logout();
  }

  /**
   * Format date for display
   */
  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  /**
   * Check if image URL is valid
   */
  hasValidImage(imageUrl: string): boolean {
    return !!(
      imageUrl &&
      imageUrl.trim() &&
      (imageUrl.startsWith('http') || imageUrl.startsWith('/uploads/images/'))
    );
  }

  /**
   * Handle image load errors
   */
  onImageError(event: any): void {
    console.warn('Failed to load professional image:', event.target.src);
    // Hide the broken image by setting display none
    event.target.style.display = 'none';
  }
}
