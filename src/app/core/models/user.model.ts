export enum UserRole {
  ADMIN = "admin",
  EDITOR = "editor",
  VIEWER = "viewer",
}

export interface User {
  id: number;
  email: string;
  role: UserRole;
}
