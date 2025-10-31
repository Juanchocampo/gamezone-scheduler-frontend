export interface AuthResponse {
  access_token: string;
  user:         User;
}

export interface User {
  email:    string;
  name:     string;
  username: string;
  document: string;
  id:       string;
  roles:    Role[];
}

export interface Role {
  name: string;
}

export interface UserMapped {
  email:    string;
  name:     string;
  username: string;
  document: string;
  id:       string;
  roles:    string[];
}