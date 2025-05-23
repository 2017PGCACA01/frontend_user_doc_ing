import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiService } from "./api.service";
import { User } from "../models/user.model";

@Injectable({
  providedIn: "root",
})
export class UserService {
  constructor(private apiService: ApiService) {}

  getUsers(): Observable<User[]> {
    return this.apiService.get<User[]>("/api/users/");
  }

  getUser(id: number): Observable<User> {
    return this.apiService.get<User>(`/api/users/${id}`);
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.apiService.post<User>("/api/users/", user);
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`/api/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.apiService.delete(`/api/users/${id}`);
  }
}
