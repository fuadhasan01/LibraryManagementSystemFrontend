import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// Components
import { LoadingSpinnerComponent } from './components/loading-spinner/loading-spinner.component';
import { ConfirmationModalComponent } from './components/confirmation-modal/confirmation-modal.component';

// Directives
import { HasRoleDirective } from './directives/has-role.directive';

// Pipes
import { TruncatePipe } from './pipes/truncate.pipe';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

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