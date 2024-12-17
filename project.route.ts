import { Routes } from '@angular/router';
//import { ProjectManagementComponent } from './projectmanagement/project.management.component';
import { Projectmanagement2Component } from './projectmanagement2/projectmanagement2.component';
import { ProjectlayoutComponent } from './projectlayout/projectlayout.component';
import { ProjectConfigurationComponent } from './projectconfiguration/project.configuration.component';
import { ProjectCustomizeComponent } from './projectcustomize/projectcustomize.component';
import { AuthenticationGuard } from '../shared/services/authentication.guard';
import { FAQComponent } from './faq/faq.component';


export const projectRoutes:Routes = [
    {
        path:'',
       // component:ProjectManagementComponent,
       component:Projectmanagement2Component,
        canActivate:[AuthenticationGuard]
    },
    {
        path:'faq',
        component:FAQComponent,
        canActivate:[AuthenticationGuard]
    },
    {
        path:'project',
        component:ProjectlayoutComponent,
        children:[
            {
                path:'dwellingselection',
                component:ProjectConfigurationComponent
            },
            {
                path:'productlist',
                loadChildren:() => import('src/modules/bom/bom/bom.module').then(m => m.BomModule)
            },
            {
                path:'carttransfer',
                loadChildren:() => import( 'src/modules/carttransfer/carttransfer.module').then(m => m.CartTransferModule )
            },
            {
                path:'documents',
                loadChildren:() => import('src/modules/documents/documents.module').then(m => m.DocumentsModule)
            },
            {
                path:'configuration',
                component:ProjectCustomizeComponent,
                children:[
                    {
                        path:'switchesandsockets',
                        loadChildren:() => import('src/modules/wiringdevice/wiringdevice.module').then(m => m.WiringdeviceModule)
                    },
                    {
                        path:'switchboard',
                        loadChildren:() => import('src/modules/project/projectcustomize/finalDistribution/finaldistribution.module').then(m => m.FinaldistributionModule)
                    },
                    {
                    path:'communication',
                    loadChildren:() => import('src/modules/vdi.configuration/vdi.configuration.module').then(m => m.vdiConfigurationModule)
                    }
                ]
            }
        ]
    }
];