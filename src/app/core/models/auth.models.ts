export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
