import { TestBed } from "@angular/core/testing";
import { UserService } from "./user.service";
import { ApiService } from "./api.service";
import { of } from "rxjs";
import { User, UserRole } from "../models/user.model";

describe("UserService", () => {
  let service: UserService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;

  const mockUser: User = {
    id: 1,
    email: "user@example.com",
    role: UserRole.ADMIN,
  };

  beforeEach(() => {
    apiServiceSpy = jasmine.createSpyObj("ApiService", [
      "get",
      "post",
      "put",
      "delete",
    ]);

    TestBed.configureTestingModule({
      providers: [
        UserService,
        { provide: ApiService, useValue: apiServiceSpy },
      ],
    });

    service = TestBed.inject(UserService);
  });

  it("should fetch users", () => {
    apiServiceSpy.get.and.returnValue(of([mockUser]));

    service.getUsers().subscribe((users) => {
      expect(users.length).toBe(1);
      expect(users[0].email).toBe("user@example.com");
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/users/");
  });

  it("should fetch a single user by ID", () => {
    apiServiceSpy.get.and.returnValue(of(mockUser));

    service.getUser(1).subscribe((user) => {
      expect(user.id).toBe(1);
      expect(user.role).toBe(UserRole.ADMIN);
    });

    expect(apiServiceSpy.get).toHaveBeenCalledWith("/api/users/1");
  });

  it("should create a user", () => {
    const newUser = { email: "new@example.com", role: UserRole.VIEWER };
    apiServiceSpy.post.and.returnValue(of(mockUser));

    service.createUser(newUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    expect(apiServiceSpy.post).toHaveBeenCalledWith("/api/users/", newUser);
  });

  it("should update a user", () => {
    const updateUser = { role: UserRole.EDITOR };
    apiServiceSpy.put.and.returnValue(of(mockUser));

    service.updateUser(1, updateUser).subscribe((user) => {
      expect(user).toEqual(mockUser);
    });

    expect(apiServiceSpy.put).toHaveBeenCalledWith("/api/users/1", updateUser);
  });

  it("should delete a user", () => {
    apiServiceSpy.delete.and.returnValue(of({ success: true }));

    service.deleteUser(1).subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    expect(apiServiceSpy.delete).toHaveBeenCalledWith("/api/users/1");
  });
});
