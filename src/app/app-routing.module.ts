import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserRole } from "./core/models/user.model";
import { AuthGuard } from "./core/guards/auth.guard";
import { RoleGuard } from "./core/guards/role.guard";

const routes: Routes = [
  {
    path: "auth",
    loadChildren: () =>
      import("./features/auth/auth.module").then((m) => m.AuthModule),
  },
  {
    path: "documents",
    loadChildren: () =>
      import("./features/documents/documents.module").then(
        (m) => m.DocumentsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "users",
    loadChildren: () =>
      import("./features/users/users.module").then((m) => m.UsersModule),
    canActivate: [AuthGuard, RoleGuard],
    data: { role: UserRole.ADMIN },
  },
  {
    path: "ingestions",
    loadChildren: () =>
      import("./features/ingestions/ingestions.module").then(
        (m) => m.IngestionsModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "",
    redirectTo: "documents",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
