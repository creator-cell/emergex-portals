export interface User {
    username?: string;
    email: string;
    phoneNumber?: string;
    role: 'super-admin' | 'client-admin';
    image?: string;
  }
  
  export interface AuthResponse {
    success: boolean;
    message: string;
    admin: User;
    token: string;
    error?:string
  }
  