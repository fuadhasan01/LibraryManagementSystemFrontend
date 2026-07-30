import { CommonModule } from "@angular/common";
import { ConfirmationModalComponent } from "./components/confirmation-modal/confirmation-modal.component";
import { LoadingSpinnerComponent } from "./components/loading-spinner/loading-spinner.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HasRoleDirective } from "./directives/has-role.directive";
import { TruncatePipe } from "./pipes/truncate.pipe";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";


@NgModule({
  declarations: [
    NavbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    ConfirmationModalComponent,
    HasRoleDirective,
    TruncatePipe
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NavbarComponent,
    SidebarComponent,
    LoadingSpinnerComponent,
    ConfirmationModalComponent,
    HasRoleDirective,
    TruncatePipe
  ]
})
export class SharedModule { }