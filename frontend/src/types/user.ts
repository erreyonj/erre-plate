export interface User {
    id: string;
    name: string;
    email: string;
    role: 'customer' | 'chef' | 'admin';
    token: string;
}