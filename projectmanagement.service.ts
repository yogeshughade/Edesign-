// import { Injectable, EventEmitter, Output } from '@angular/core';
// import { DataService } from '../shared/services/data.service';
// import {Dexie} from 'dexie/dist/dexie';
// import { IProject, IAssociateFileUpload, IAnonymousProject } from '../shared/models/Project.model';
// import { Observable,Subject } from 'rxjs';
// import { ConfigurationService } from '../shared/services/configuration.service';
// import { DatePipe, formatCurrency } from '@angular/common';
// import { SavedState } from '../shared/models/SavedState.model';
// import { environment } from 'src/environments/environment';
// import { HttpClient } from '@angular/common/http';
// import { LanguageService } from '../shared/services/language.service';
// import JSZip from 'JSZip';
// import FileSaver from 'file-saver';
// import { ProgressBarService } from '../shared/services/progress.bar.service';
// import { IDocument } from '../shared/models/document.model';
// import { DocumentsService } from '../documents/documents.service';
// import { ICountrySpec, IProjectNotification } from '../shared/models/countrySpec.model';
// import { CountryService } from '../shared/services/country.service';
// import { promise } from 'protractor';
// import { edesignConstants } from 'src/modules/shared/models/edesign.constants';
// import { StorageService } from 'src/modules/shared/services/storage.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class projectmanagementservice 
// {
//   db:Dexie;
//   countrySpec: ICountrySpec;
//   tbl_projects:any;
//   edesignprojectmanagementdb="edesignprojectmanagementdb";
//   _config:any;
//   status: boolean;
//   _urls:any;
//   ts: any;
//   tsRoot: any;
//   loadDocument: boolean;
//   private projectManagementLoaded=new Subject();
//   private nextProjectSource=new Subject();
//   nextProjectSet$=this.nextProjectSource.asObservable();
//   projectManagementIsReady$=this.projectManagementLoaded.asObservable();
//   public showCustomization:EventEmitter<boolean>;
//   today= new Date();
//   todaysDateTime = '';

//   constructor(private dataService:DataService,
//     private _configService:ConfigurationService,private datePipe: DatePipe,
//     private progressBar: ProgressBarService,private storageService:StorageService,
//     private _http: HttpClient,private _languageService:LanguageService, private countryservice:CountryService,

//     )
//   {
//     this.showCustomization=new EventEmitter<boolean>();
//     this._urls=this._configService.getUrlsObject();
//     this.todaysDateTime = this.datePipe.transform(this.today, 'ddMMyyyy_hhmmss ');
//     this.ts = _languageService.getTranslationObject();
//     this.tsRoot = _languageService.getTranslationRoot();
//     this.tsRoot.onLangChange.subscribe(e => {
//       this.ts = _languageService.getTranslationObject();
//     });
//   }

//   async isGuidedMode(): Promise<boolean> {
//     let project: IProject = await this.getCurrentProject();
//     return project.guideMe;
//   }

//  async loadProjectDatabase(){
//     var t=await new Dexie("edesignprojectmanagementdb").open();
//     this.tbl_projects=await t.table("tbl_projects");
//   }

//   getProjectList():Observable<IProject[]>{ 
//     let countryCode=this.countryservice.getBaseCountryCode();
//        var result=this.dataService.get<IProject[]>(
//          this._configService.geturl(
//           this._urls.PROJECT_MANAGEMENT.BASE,
//            this._urls.PROJECT_MANAGEMENT.GET_PROJECT_LIST,
//            -1,countryCode
//            ));
//            result.subscribe(pl=>{
//               this.tbl_projects.clear().then(()=>{
                
//                 for(var i=0;i<pl.length;i++)
//                 {
//                    pl[i].isCurrent=0;
//                    pl[i].savedState=1;
//                    pl[i].isNewProject=0;
//                    this.tbl_projects.put(pl[i]);
//                 }
              
//               });
//            });

//        return result;
//   }

//  getProject(projectId:number):Observable<IProject>{
//    var result=this.dataService.get<IProject>(this._configService.geturl(this._urls.PROJECT_MANAGEMENT.GET_PROJECT_BY_ID,projectId));
//    return result;
//  }


//  async saveCurrentProjectDetails( ):Promise<IProject>{
//   var project:IProject=<IProject>{};
//  var document:IDocument=<IDocument>{};
//  //check if current project is new
//  var isNewProject=await this.isCurrentProjectNew_local();
//    //Get local project details 
//  var currentProject= await this.getCurrentProject();
//  //document = await this.documentservice.getDocumentData();
//  var projectSaveUrl= this._configService.geturl(this._urls.PROJECT_MANAGEMENT.BASE);
//    if (isNewProject) {
//      //step 1 create project to service
//        var res1 = this.dataService.post<IProject>(projectSaveUrl,{currentProject, document} );
//        project = await res1.toPromise() as any;    
//    }
//    else {
//      //update this project
//      //console.log(JSON.stringify(currentProject));
//      var res2 = this.dataService.putWithId(projectSaveUrl, currentProject);
//      project = await res2.toPromise() as any;
//    }
 
//  await this.tbl_projects.where("id").equals(currentProject.id).modify({savedState:SavedState.NOCHANGE});
//  return project;
// }
// async modifyConfigurationStatus(project:IProject,socketsFlag:boolean,electricalFlag:boolean){
//    project.wdConfigurationCheck = socketsFlag;
//    project.fdConfigurationCheck = electricalFlag;
//    project.savedState=SavedState.UPDATED;
//    let projectobject= JSON.stringify(project);
//    localStorage.setItem('projectobject', projectobject);
//   // await this.tbl_projects.where("id").equals(project.id).modify(project); 
// }

// deleteProject(projectId:number){
//   let countryCode= this.countryservice.getBaseCountryCode();
//   var projectdeleteUrl= this._configService.geturl(this._urls.PROJECT_MANAGEMENT.BASE,projectId['projectId']+"/"+countryCode);
//   var del=this.dataService.delete(projectdeleteUrl);
//   return del;
// }

// async deleteProject_local(projectId:number){
//   var currentProject=await this.tbl_projects.toArray();
//   var deleteProject=currentProject.find(t=>t.projectId==projectId);
//   return await this.tbl_projects.delete(deleteProject.id);
// }

//  async getCurrentProject():Promise<any>{
//   //  if(this.tbl_projects!=undefined)
//   //  {
//   //   var currentProject=await this.tbl_projects.toArray();
//   //   return currentProject.find(i=>i.isCurrent==1);
//   //  }
//   let currentProject=  localStorage.getItem('projectobject');
//   currentProject= JSON.parse(currentProject);
//   return currentProject;
//   }

// async getCurrentProjectId():Promise<number>{
//   let currentProject=await this.getCurrentProject();
//   return currentProject.projectId;
// }

//  clearAllProjects(){
//   return this.tbl_projects.clear();
//  }


//  async createNewProject_local():Promise<IProject>{
//   let newProject:IProject=<IProject>{};
//  // var length=await this.tbl_projects.count();
//   newProject.email="";
//   newProject.phoneNumber=null;
//   newProject.address="";
//   newProject.projectDescription="";
//   newProject.projectCity="";
//   newProject.projectPostalCode=null;
//   newProject.street="";
//   newProject.clientFirstName="";
//   newProject.clientLastName="";
//   newProject.clientCity="";
//   newProject.clientPostalCode=null;
//   newProject.countryCode=null;
//   newProject.projectType=null;
//  // newProject.projectName="Project "+ (length +1);
//   newProject.projectName = this.ts.PROJECT+ this.todaysDateTime;
//   newProject.configTitle = this.ts.QUOTE+ this.todaysDateTime;
//   newProject.savedState=0;
//   newProject.isNewProject=true;
//   newProject.guideMe=true;
//   newProject.fdConfigurationCheck=true;
//   newProject.wdConfigurationCheck=true;
//   newProject.isElectricalContextDone=false;
//   newProject.spimProjectId = "";
//   newProject.notifications=await this.getNotificationId();
//   newProject.vat=this.countrySpec.vat;
//   newProject.wdRangeId=this.countrySpec.wdProductSpec.defaultWDRangeId;
//   newProject.fdRangeId=this.countrySpec.wdProductSpec.defaultFDRangeID;
//   newProject.labelAtBottom=false;
//   newProject.wsConfigurationCheck=this.getWiserAvailable();
//   newProject.vdiConfigurationCheck=this.getVdiAvailable();
//   await this.resetCurrentToNone_local();
//   newProject.isCurrent=1;
//   let projectobject= JSON.stringify(newProject);
//   localStorage.setItem('projectobject', projectobject);
//  // await this.tbl_projects.put(newProject);
//   this.nextProjectSource.next();
//   return newProject;
//  }
//  getWiserAvailable(){
//  let value = sessionStorage.getItem("isWiserAvailable");
//  return value =="true"?true :false;
//  }
//  getVdiAvailable(){
//   let value = sessionStorage.getItem("isvdiAvailable");
//   return value =="true"?true :false;
//   }

//  async resetCurrentToNone_local(){
//    if(this.tbl_projects==null)
//    {
//      return;
//    }
//    var array= await this.tbl_projects.toArray();
//    for(var i=0;i<array.length;i++)
//    {
//      await this.tbl_projects.update(array[i].id,{isCurrent:0});
//    }
//  }

//  async setCurrentProjectbyId_local(projectId:number):Promise<boolean>{
  
//    await this.resetCurrentToNone_local();
//    var array=await this.tbl_projects.toArray();
//    var project=array.find(a=>a.projectId==projectId);
  
//    if(projectId!=0 || projectId!=undefined)
//    {
//    await this.tbl_projects.update(project.id,{isCurrent:1});
//    }
//    this.nextProjectSource.next();
//    return;
//    return true;
//  }

//  async setCurrentProject_local(project:IProject):Promise<boolean>{
//   var lastModified =  (new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]);
//   var allProjects=await this.tbl_projects.toArray();
//   var current =allProjects.find(i=>i.isCurrent==1);
//   (current as IProject).isCurrent=1;
//   (current as IProject).projectId=project.projectId;
//   (current as IProject).isNewProject=false;
//   (current as IProject).lastModified = lastModified;
//   (current as IProject).spimProjectId=project.spimProjectId;
//   await this.tbl_projects.where(":id").equals(current.id).modify(current);
//   this.nextProjectSource.next();
//   return true;
// }

// async modifyGuideMeStatus(project:IProject,guideMeStatus:boolean){

//   project.guideMe = guideMeStatus;
//   // this code is for now.. once wd manual mode enabled we need to change
//   //if(!guideMeStatus){
//     project.vdiConfigurationCheck = guideMeStatus;
//  // }
//   project.wdConfigurationCheck = true;
//   project.fdConfigurationCheck = true;
//   project.savedState=SavedState.UPDATED;
//   await this.tbl_projects.where("id").equals(project.id).modify(project); 
// }

 
//  async getSavedStateOfCurrentProject_local():Promise<boolean>{
//     const count=await this.tbl_projects.count();
//     if(count>0){
//       var array= await this.tbl_projects.where(":isCurrent").equals(1);
//       return array[0].savedState as boolean;
//     }
//     else{
//       return false;
//     }
//   }

//   async isCurrentProjectNew_local():Promise<boolean>{
//      var currentProject=await this.tbl_projects.toArray();
//      var project= currentProject.find(i=>i.isCurrent==1);
//      return (project.isNewProject==1)?true:false;
//    }

//    async updateProject_local(project:IProject):Promise<boolean>{
//     var array=await this.tbl_projects.toArray();
//     var projectBasic=null;
//     if(project.projectId!=undefined && project.projectId!=0)
//     {
//       projectBasic=array.find(a=>a.projectId==project.projectId);
//     }
//     else
//     {
//       //this is a new project which is edited
//       projectBasic=array.find(i=>i.isCurrent==1);
//       projectBasic.projectName=project.projectName;
//     }
//     // await this.tbl_projects.update(projectBasic.id,project);
//     await this.tbl_projects.where("id").equals(projectBasic.id).modify(project); 
//     return true;
//    }
  
//   async getProjects_local():Promise<IProject[]>{
//      var ps= await this.tbl_projects.toArray();
//      return ps;
//    }

		
//   UploadAssociatedFile(objectToUpload:IAssociateFileUpload): Observable<IAssociateFileUpload[]>{		
//     return this._http.post<IAssociateFileUpload[]>(environment.SPIMBaseUrl + "/UploadFile",objectToUpload);		
//   }		
//   deleteFile(projectId: number, fileId: string): Observable<IAssociateFileUpload[]>		
//   {		
//     return this._http.delete<IAssociateFileUpload[]>(environment.SPIMBaseUrl + `/DeleteAssociatedFile/${projectId}/${fileId}`);		
//   }		
//   downloadAssociatedFile(fileId: string , filename: string)  {		
//     return this._http.get(environment.SPIMBaseUrl + `/DownloadFile/${fileId}/${filename}`);
//   }

//   async updateElectricalContexttoDone():Promise<boolean>{
//     var currentProject=await this.tbl_projects.toArray();
//     var project= currentProject.find(i=>i.isCurrent==1);
//     await this.tbl_projects.update(project.id,{isElectricalContextDone:true});
//     return true;
//   }

//     async getupdateElectricalContexttoDone():Promise<boolean>{
//       var currentProject=localStorage.getItem('projectobject');
//       var project= JSON.parse(currentProject);
//       return project.isElectricalContextDone;
//     }

//     getProductScopeForHomePage(currentProject:IProject){
//       var Scopearray: String[] = [] as String[];
//       var ScopeSwitchAndScoket = "";
//       var ScopeElectricalswitchBoard = "";
//       if(currentProject.wdConfigurationCheck == true){
//         ScopeSwitchAndScoket  = this.ts.PROJECT_CUSTOMIZATION.SOCKETS;
//         Scopearray.push(ScopeSwitchAndScoket);
//      }
//      if(currentProject.fdConfigurationCheck == true){
//       if(ScopeSwitchAndScoket.length > 0) {
//         ScopeElectricalswitchBoard = this.ts.PROJECT_CUSTOMIZATION.ELECTRICAL_SWITCHBOARD;
//           Scopearray.push(ScopeElectricalswitchBoard);
//         }
//         else{
//           ScopeElectricalswitchBoard = this.ts.PROJECT_CUSTOMIZATION.ELECTRICAL_SWITCHBOARD;
//           Scopearray.push(ScopeElectricalswitchBoard);
//         }
//       }
//       return Scopearray;
      
//     }
    
//   downloadAllDocuments(files, contentType: string, projectName: string){
//     let count = 0;
//     let payload = files;
//     let zip = new JSZip();
//     files.forEach((file: IAssociateFileUpload) => {
//       this.downloadAssociatedFile(file.fileId, file.fileName)
//         .toPromise()
//         .then(res => {
//           var binary =res["fileName"].split(',')[1] !=undefined? atob(res["fileName"].split(',')[1]): atob(res["fileName"]);
//           var array = [];
//           for (var i = 0; i < binary.length; i++) {
//             array.push(binary.charCodeAt(i));
//           }

//           const blob = new Blob([new Uint8Array(array)], { type: contentType });
//           zip.file(file.fileName, blob);
//           ++count;
//           if (count == payload.length) {
//             zip.generateAsync({
//               type: 'blob'
//             })
//               .then(function (content) {
//                 FileSaver.saveAs(content, projectName + " " + new Date().toString().split(" ").slice(0, 4).join(" ") + '.zip');
               
//               });
             
//           }
//          this.progressBar.stopSpinner();
        
//         }
    
//         )
      
//     });
    
//   }

//   downloadFile(data: any, fileName: string) {
//   var docDownload = document.createElement("a");
//     if (fileName.indexOf("xlsx") > -1) {
//       docDownload.href = "data:application/octet-stream;base64," + data.fileName;
//     }
//     else {
//       docDownload.href = data.fileName;
//     }
//   docDownload.download = fileName;
//   docDownload.click();
    

//   }

//  async getNotificationId()
//   {
//     this.countrySpec = await this.countryservice.getCountrySpec();  
//     if(this.countrySpec.notifications==null) return;
//     let notificationIds: number[]=[];
//     for(let i=0; i<this.countrySpec.notifications['projectNotification'].length;i++)
//     {
//     notificationIds.push(this.countrySpec.notifications['projectNotification'][i].notificationId);
//     }
//     return notificationIds;
//   }

//   async insertAnonymousProject(project) {
//     await this.tbl_projects.put(project);
//     this.nextProjectSource.next();
//   }
//   getAnonymousProject(projectCode): Observable<IAnonymousProject> {
//     var projectSaveUrl = this._configService.geturl(
//       this._urls.PROJECT_MANAGEMENT.BASE,
//       this._urls.PROJECT_MANAGEMENT.ANONYMOUS
//     );
//     return this._http.get<IAnonymousProject>(projectSaveUrl + `/${projectCode}`);
//   }

//   async openAnonymousProject(projectCode, currentproject ,resellerState) :Promise<boolean>{
//     let navigateToSwitchesAndSockets = true;
//     currentproject.isCurrent = 1;
//     currentproject.isNewProject=true;
//      await this.insertAnonymousProject(currentproject);

//     if (currentproject.wdConfigurationCheck && currentproject.fdConfigurationCheck) {
//       navigateToSwitchesAndSockets = true;
//     }
//     else if (!currentproject.wdConfigurationCheck) {
//       navigateToSwitchesAndSockets = false;
//     }
//     else if (currentproject.fdConfigurationCheck) {
//       navigateToSwitchesAndSockets = false;
//     }
//     if(resellerState)
//     {
//     sessionStorage.setItem("code", projectCode);
//     }

//     return navigateToSwitchesAndSockets;
//     //this.performProjectDataOperations(this.currentProject, this.currentProject, navigateToSwitchesAndSockets);
//   }

//   duplicateProject(projectId:number){
//     var projectDuplicateUrl= this._configService.geturl(this._urls.PROJECT_MANAGEMENT.BASE+ `/copy/project/${projectId}`);
//     var duplicateProject=this.dataService.get(projectDuplicateUrl);
//     return duplicateProject;
//   }
//   async modifyWsConfigurationStatus(project:IProject,wiserFlag:boolean){
//     project.wsConfigurationCheck = wiserFlag;
//     project.savedState=SavedState.UPDATED;
    
//     await this.tbl_projects.where("id").equals(project.id).modify(project); 
//  }
// }


