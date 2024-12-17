//shared..module.ts

import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../material.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from '../app-routing.module';
import { SharedModule} from 'src/modules/shared/shared.module';
import { UserModule } from '../user/user.module';
import { ProjectConfigurationComponent} from './projectconfiguration/project.configuration.component';
//import { ProjectManagementComponent} from './projectmanagement/project.management.component';
import { ProjectCustomizeComponent} from './projectcustomize/projectcustomize.component';
import { ProjectlayoutComponent } from './projectlayout/projectlayout.component';

import { from } from 'rxjs';
import { RouterModule } from '@angular/router';
import { projectRoutes } from './project.route';
import { UiModule } from '../ui/ui/ui.module';
import {ImportanonymousprojecttComponent} from 'src/modules/reseller/importanonymousproject/importanonymousproject.component';
import { Resellermodule } from '../reseller/reseller.module';
import { Projectmanagement2Component } from './projectmanagement2/projectmanagement2.component';
import { IsEllipsisActiveDirective } from './projectcustomize/tooltip.directive';



@NgModule({
  declarations: [
    ProjectConfigurationComponent,
    ProjectCustomizeComponent, 
     ProjectlayoutComponent,ImportanonymousprojecttComponent, Projectmanagement2Component, IsEllipsisActiveDirective
     ],
  imports: [
    RouterModule.forChild(projectRoutes),
    CommonModule,MaterialModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    SharedModule,
    BlockUIModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

    NgbModule,
    UiModule,
    AppRoutingModule,
    UserModule,
    Resellermodule
  ],
  exports: [ProjectConfigurationComponent,ProjectCustomizeComponent,ImportanonymousprojecttComponent,Projectmanagement2Component,
    IsEllipsisActiveDirective],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class ProjectsModule { }
