// Institution DTOs
export interface InstitutionLoginDto {
  name: string;
  password: string;
}

export interface InstitutionResponseDto {
  name: string;
  created_at: string;
  updated_at: string;
}

// Professional DTOs
export interface CreateProfessionalDto {
  coren: string;
  password: string;
  name: string;
  photo?: string;
  institution_names?: string[];
}

export interface UpdateProfessionalDto {
  password?: string;
  name?: string;
  photo?: string;
  institution_names?: string[];
}

export interface ProfessionalResponseDto {
  coren: string;
  name: string;
  photo?: string;
  created_at: string;
  updated_at: string;
}

// Auth Response
export interface AuthResponse {
  access_token: string;
  token_type: string;
  expires_in?: number;
}

// API Error Response
export interface ApiErrorResponse {
  statusCode: number;
  message: string | string[];
  error: string;
}
