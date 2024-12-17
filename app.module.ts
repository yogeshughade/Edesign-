import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA, ErrorHandler } from '@angular/core';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { BlockUIModule } from 'ng-block-ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';


import { AppRoutingModule, routes } from './app-routing.module';
import { HomeModule } from './home/home.module';
//import { SharedModule } from './shared/shared.module'
import { AppComponent } from './app.component';
import { StartUpService } from './shared/services/startup.service';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AuthenticationGuard } from './shared/services/authentication.guard';
import { AuthenticationService } from './shared/services/authentication.service';


import {DatePipe} from '@angular/common';
import { MaterialModule } from './material.module';
import { InterceptorService } from './shared/services/interceptor.service';
import { PreloadAllModules, RouterModule } from '@angular/router';
import { GlobalErrorHandlerService } from './shared/services/globalErrorHandlerService.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    NgSelectModule,
    FormsModule,
    ReactiveFormsModule,
    Ng2SearchPipeModule,
    BlockUIModule.forRoot(),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    //AutocompleteLibModule,
    NgbModule,
   //SharedModule,
    HomeModule,
    // BomModule,
    // DocumentsModule,
    // ProjectsModule,
    // WiringdeviceModule,
    // FinaldistributionModule,
    // UserModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: { 
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    RouterModule.forRoot(routes,{
      preloadingStrategy: PreloadAllModules
    })
    // Only module that app module loads

  ],exports:[MaterialModule],
  providers: [
    AuthenticationGuard,
    AuthenticationService,
    DatePipe,
    { provide: APP_INITIALIZER, useFactory: startupProviderFactory, deps: [StartUpService], multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService}
  ],
    
  bootstrap: [AppComponent],
  schemas:[CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }

export function startupProviderFactory(startupService: StartUpService) {
  return () => startupService.configureStartupSettings();
}

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http);
}


