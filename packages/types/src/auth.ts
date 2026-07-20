export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  googleId: string | null;
  createdAt: string;
  updatedAt: string;
}

export type UserPublic = Pick<User, 'id' | 'username' | 'displayName' | 'avatarUrl'>;

export interface AuthTokens {
  accessToken: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  username: string;
  displayName: string;
  password: string;
}
