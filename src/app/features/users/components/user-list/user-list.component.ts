import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../core/services/api.service';
import { User } from '../../../../core/models/user.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users = new MatTableDataSource<User>();
  displayedColumns: string[] = ['id', 'email', 'role'];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.apiService.get<{ users: User[] }>('/api/users/').subscribe({
      next: (data) => {
        this.users.data = data.users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      },
    });
  }
}
