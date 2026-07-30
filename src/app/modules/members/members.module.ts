import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { MemberListComponent } from './member-list/member-list.component';
import { MembersRoutingModule } from './members-routing.module';
import { MemberFormComponent } from './member-form/member-form.component';
import { MemberDetailsComponent } from './member-details/member-details.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MembersRoutingModule,
    SharedModule
  ],
  declarations: [
    MemberListComponent,
    MemberFormComponent,
    MemberDetailsComponent
  ]
})
export class MembersModule { }