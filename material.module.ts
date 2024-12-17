import {NgModule} from '@angular/core';

import {MatDialogModule} from '@angular/material/dialog'; ///////
import { MatIconModule } from '@angular/material/icon';

import {MatSelectModule} from '@angular/material/select'; ///
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  exports: [
   
    MatDialogModule,
  
    MatSelectModule,
    MatIconModule,
    MatSlideToggleModule
    
  ]
})
export class MaterialModule {}


/**  Copyright 2019 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */