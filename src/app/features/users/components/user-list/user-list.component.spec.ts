import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from "@angular/core/testing";
import { UserListComponent } from "./user-list.component";
import { ApiService } from "../../../../core/services/api.service";
import { of, throwError } from "rxjs";
import { User, UserRole } from "../../../../core/models/user.model";
import { MatTableModule } from "@angular/material/table";
import { MatCardModule } from "@angular/material/card";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

describe("UserListComponent", () => {
  let component: UserListComponent;
  let fixture: ComponentFixture<UserListComponent>;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockUsers: User[] = [
    { id: 1, email: "user1@example.com", role: UserRole.ADMIN },
    { id: 2, email: "user2@example.com", role: UserRole.VIEWER },
  ];

  beforeEach(async () => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", ["get"]);

    await TestBed.configureTestingModule({
      declarations: [UserListComponent],
      imports: [MatTableModule, MatCardModule, BrowserAnimationsModule],
      providers: [{ provide: ApiService, useValue: apiServiceSpy }],
    }).compileComponents();

    fixture = TestBed.createComponent(UserListComponent);
    component = fixture.componentInstance;
  });

  it("should create the component", () => {
    expect(component).toBeTruthy();
  });

  it("should load users on init", fakeAsync(() => {
    apiServiceSpy.get.and.returnValue(of({ users: mockUsers }));
    fixture.detectChanges();
    tick();

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/users/");
    expect(component.users.data.length).toBe(2);
    expect(component.users.data[0].email).toBe("user1@example.com");
  }));

  it("should handle error when loading users fails", fakeAsync(() => {
    spyOn(console, "error");
    apiServiceSpy.get.and.returnValue(
      throwError(() => new Error("API failure"))
    );
    fixture.detectChanges();
    tick();

    expect(console.error).toHaveBeenCalledWith(
      "Error loading users:",
      jasmine.any(Error)
    );
  }));
});
