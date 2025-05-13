export interface User{
    id: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: Omit<User, 'password'>;    
}