import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import {
  InstitutionLoginDto,
  AuthResponse,
  InstitutionResponseDto,
} from '../models/api.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly API_URL = environment.apiUrl;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly INSTITUTION_KEY = 'institution_data';

  // Signals for reactive state management
  public isAuthenticated = signal<boolean>(this.hasValidToken());
  public currentInstitution = signal<InstitutionResponseDto | null>(
    this.getStoredInstitution(),
  );

  constructor() {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  /**
   * Login with institution credentials
   */
  login(credentials: InstitutionLoginDto): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/auth/login/institution`, credentials)
      .pipe(
        tap((response) => {
          // Store token and update state
          this.storeToken(response.access_token);
          this.isAuthenticated.set(true);

          // Store institution data from the JWT token
          const institutionData = this.getInstitutionFromToken(
            response.access_token,
          );
          if (institutionData) {
            this.storeInstitution(institutionData);
            this.currentInstitution.set(institutionData);
          }
        }),
        catchError((error) => {
          console.error('Login failed:', error);
          return throwError(() => error);
        }),
      );
  }

  /**
   * Logout and clear all stored data
   */
  logout(): void {
    this.clearToken();
    this.clearInstitution();
    this.isAuthenticated.set(false);
    this.currentInstitution.set(null);
    this.router.navigate(['/login']);
  }

  /**
   * Get the stored JWT token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Check if user has a valid token
   */
  private hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Parse JWT token
      const payload = this.parseJwtPayload(token);
      if (!payload) return false;

      // Check if token has expiration and if it's still valid
      if (payload.exp) {
        const now = Math.floor(Date.now() / 1000);
        return payload.exp > now;
      }

      // If no expiration field, consider token valid if it has required fields
      return !!(payload.identifier && payload.role === 'institution');
    } catch {
      return false;
    }
  }

  /**
   * Parse JWT payload
   */
  private parseJwtPayload(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  }

  /**
   * Extract institution data from JWT token
   */
  private getInstitutionFromToken(
    token: string,
  ): InstitutionResponseDto | null {
    const payload = this.parseJwtPayload(token);
    if (!payload || !payload.identifier) return null;

    return {
      name: payload.identifier,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }

  /**
   * Store JWT token in localStorage
   */
  private storeToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Remove JWT token from localStorage
   */
  private clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Store institution data in localStorage
   */
  private storeInstitution(institution: InstitutionResponseDto): void {
    localStorage.setItem(this.INSTITUTION_KEY, JSON.stringify(institution));
  }

  /**
   * Get stored institution data
   */
  private getStoredInstitution(): InstitutionResponseDto | null {
    const data = localStorage.getItem(this.INSTITUTION_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Clear institution data from localStorage
   */
  private clearInstitution(): void {
    localStorage.removeItem(this.INSTITUTION_KEY);
  }

  /**
   * Check current authentication status and restore state
   */
  private checkAuthStatus(): void {
    const token = this.getToken();

    if (this.hasValidToken() && token) {
      // Token is valid, restore authentication state
      this.isAuthenticated.set(true);

      // If no institution data in memory, try to restore from token
      if (!this.currentInstitution()) {
        const storedInstitution = this.getStoredInstitution();
        if (storedInstitution) {
          this.currentInstitution.set(storedInstitution);
        } else {
          // Extract from token if not in localStorage
          const institutionFromToken = this.getInstitutionFromToken(token);
          if (institutionFromToken) {
            this.storeInstitution(institutionFromToken);
            this.currentInstitution.set(institutionFromToken);
          }
        }
      }
    } else {
      // Token is invalid or missing, clear all data
      this.logout();
    }
  }
}
