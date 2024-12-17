import { Component, Renderer2, AfterViewInit, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { StartUpService } from './shared/services/startup.service';
import { filter } from 'rxjs/operators';
import { GATrackingId } from 'src/environments/environment.js';
import { BrowserhandlerService } from './shared/services/browserhandler.service';
import { CountryService } from './shared/services/country.service';

declare var ga; 
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  
  title = 'mySchneider eDesign';
  ismobileDevice:boolean;
 
  constructor(private renderer:Renderer2, @Inject(DOCUMENT) private document: HTMLDocument,
  private router:Router, private startupService:StartUpService,private browserHandler: BrowserhandlerService,private countryService: CountryService)
  
  
  {
    document.getElementById("initialLoader").remove();
     let isLangugeFilePresent =  this.countryService.isLangugeFilePresent;
     this.ismobileDevice = this.browserHandler.mobileDeviceCheck();

     // if window.screen.width < 1024 and country present then load error page
     if(this.ismobileDevice && isLangugeFilePresent){
      this.router.navigate(["/errorpage"],{replaceUrl: true}); 
      return;
      // if window.screen.width < 1024 and country not present then load notsupported page
     }else if(this.ismobileDevice && !isLangugeFilePresent){
      this.router.navigate(["/notsupported"],{replaceUrl: true});
      // if country not present then load notsupported page
     }else if (!isLangugeFilePresent) {
        this.router.navigate(["/notsupported"],{replaceUrl: true});
      } else {
        if (this.startupService.reloadRequired == true) {
          //In case new data is loaded then make sure user is taken to the projectmanagement screen
          this.router.navigate([""]);
        }
    }
      
    

    //  const navEndEvents = router.events.pipe(
    //     filter(event => event instanceof NavigationEnd), 
    //   );
      
    //    navEndEvents.subscribe((event: NavigationEnd) => {
    //    ga('config', GATrackingId.TrackingId, {
    //         'page_path': 'HOME-PAGE'
    //     });
    //   }); 
  }

  ngAfterViewInit(): void {
    window["loadGoogleTagManager"]();
  }  
}
