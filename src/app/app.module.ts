import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

// Angular Material Imports
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatTableModule } from "@angular/material/table";
import { MatSelectModule } from "@angular/material/select";

import { AppComponent } from "./app.component";

import { AppRoutingModule } from "./app-routing.module";
import { UsersModule } from "./features/users/users.module";
import { AuthModule } from "./features/auth/auth.module";
import { DocumentsModule } from "./features/documents/documents.module";
import { IngestionsModule } from "./features/ingestions/ingestions.module";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    AuthModule,
    DocumentsModule,
    UsersModule,
    IngestionsModule,
    // Angular Material Modules
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatMenuModule,
    MatTableModule,
    MatSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
