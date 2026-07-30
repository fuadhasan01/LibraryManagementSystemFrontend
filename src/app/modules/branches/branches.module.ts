import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { BranchesRoutingModule } from './branches-routing.module';
import { SharedModule } from '../shared/shared.module';
import { BranchListComponent } from './branch-list/branch-list.component';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { BranchInventoryComponent } from './branch-inventory/branch-inventory.component';


@NgModule({
  declarations: [
    BranchListComponent,
    BranchFormComponent,
    BranchInventoryComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BranchesRoutingModule,
    SharedModule
  ]
})
export class BranchesModule { }