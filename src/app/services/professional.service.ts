import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError, map } from 'rxjs';
import {
  CreateProfessionalDto,
  UpdateProfessionalDto,
  ProfessionalResponseDto,
} from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProfessionalService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  /**
   * Get all professionals
   */
  getAllProfessionals(): Observable<ProfessionalResponseDto[]> {
    return this.http
      .get<ProfessionalResponseDto[]>(`${this.API_URL}/professionals`)
      .pipe(
        map((professionals) =>
          professionals.map((p) => this.processImageUrl(p)),
        ),
        catchError((error) => {
          console.error('Error fetching professionals:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Get a professional by COREN
   */
  getProfessionalByCoren(coren: string): Observable<ProfessionalResponseDto> {
    return this.http
      .get<ProfessionalResponseDto>(
        `${this.API_URL}/professionals/${encodeURIComponent(coren)}`,
      )
      .pipe(
        map((professional) => this.processImageUrl(professional)),
        catchError((error) => {
          console.error('Error fetching professional:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Create a new professional
   */
  createProfessional(
    professional: CreateProfessionalDto,
  ): Observable<ProfessionalResponseDto> {
    return this.http
      .post<ProfessionalResponseDto>(
        `${this.API_URL}/professionals`,
        professional,
      )
      .pipe(
        map((professional) => this.processImageUrl(professional)),
        catchError((error) => {
          console.error('Error creating professional:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Update a professional
   */
  updateProfessional(
    coren: string,
    updates: UpdateProfessionalDto,
  ): Observable<ProfessionalResponseDto> {
    return this.http
      .patch<ProfessionalResponseDto>(
        `${this.API_URL}/professionals/${encodeURIComponent(coren)}`,
        updates,
      )
      .pipe(
        map((professional) => this.processImageUrl(professional)),
        catchError((error) => {
          console.error('Error updating professional:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Delete a professional
   */
  deleteProfessional(coren: string): Observable<void> {
    return this.http
      .delete<void>(
        `${this.API_URL}/professionals/${encodeURIComponent(coren)}`,
      )
      .pipe(
        catchError((error) => {
          console.error('Error deleting professional:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Process image URL to make it absolute
   */
  private processImageUrl(
    professional: ProfessionalResponseDto,
  ): ProfessionalResponseDto {
    if (
      professional.photo &&
      professional.photo.startsWith('/uploads/images/')
    ) {
      return {
        ...professional,
        photo: `${this.API_URL}${professional.photo}`,
      };
    }
    return professional;
  }

  /**
   * Get full image URL for display
   */
  getImageUrl(relativeUrl: string): string {
    if (!relativeUrl) return '';
    if (relativeUrl.startsWith('http')) return relativeUrl;
    if (relativeUrl.startsWith('/uploads/images/')) {
      return `${this.API_URL}${relativeUrl}`;
    }
    return relativeUrl;
  }
}
