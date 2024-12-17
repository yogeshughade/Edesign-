import { NgModule } from '@angular/core';
import { Routes, RouterModule} from '@angular/router';
import { HomeComponent } from './home/home.component';

import { ProjectConfigurationComponent } from './project/projectconfiguration/project.configuration.component';
import { ProjectCustomizeComponent } from './project/projectcustomize/projectcustomize.component';
import { ProjectlayoutComponent } from './project/projectlayout/projectlayout.component';
import { AuthenticationGuard } from './shared/services/authentication.guard';
import { FAQComponent } from './project/faq/faq.component';

export const routes: Routes = [
  {
  path: '',
  loadChildren:() => import('src/modules/home/home.module').then(m => m.HomeModule),
  canActivate:[AuthenticationGuard]
  }
  // {
  //   canActivate: [AuthenticationGuard] 
  // }
];

@NgModule({
  // imports: [RouterModule.forRoot(routes)],
  // exports:[RouterModule]
})
export class AppRoutingModule { }
