import { Injectable, EventEmitter, Injector } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ClientDetails, Configurations, IAnonymousProject, IAssociateFileUpload, IClientDetails, ICustomFieldsMap, IextendedInfo, IProject, Iquote, IStates, Project , IStatesAndDescription } from '../shared/models/Project.model';
import { CountryService } from '../shared/services/country.service';
import { DataService } from '../shared/services/data.service';
import { DataBackendService } from '../shared/services/databackend.service';
import { ProjectStoreService } from '../shared/services/project.save.service';
import { UserPropertiesService } from '../shared/services/user-properties.service';
import { edesignConstants } from 'src/modules/shared/models/edesign.constants';
import { ICountrySpec } from '../shared/models/countrySpec.model';
import { apiEndpoint, environment, spimSettings } from 'src/environments/environment';
import { projectcustomizeservice } from 'src/modules/project/projectcustomize/project.customize.service';
import { ConfigurationService } from '../shared/services/configuration.service';
import { DatePipe } from '@angular/common';
import { StorageService } from '../shared/services/storage.service';
import { ProgressBarService } from '../shared/services/progress.bar.service';
import { HttpClient } from '@angular/common/http';
import { LanguageService } from '../shared/services/language.service';
import Dexie from 'dexie';
import { IDocument } from '../shared/models/document.model';
import { SavedState } from '../shared/models/SavedState.model';
import JSZip from 'jszip';
import FileSaver from 'file-saver';
import { unescape } from 'querystring';
import { UserService } from '../shared/services/user.service';


@Injectable({
  providedIn: 'root'
})
export class Projectmanagement2Service {
  private nextProjectSource = new Subject();
  providers: [edesignConstants]
  nextProjectSet$ = this.nextProjectSource.asObservable();
  countrySpec: ICountrySpec;
  public getprojectActions = new EventEmitter<any>();
  public onCreateNewProjectQuoteScopes  = new EventEmitter<any>();
  public refereshProjectList = new EventEmitter();
  public updateProjectHeaders = new EventEmitter<any>();
  public openProjectCreateModal = new EventEmitter<any>(); 
  public getNewQuoteStatus = new EventEmitter();
  public getProjectListRefresh = new EventEmitter();

//-----projectManagementservice------------
db:Dexie;
tbl_projects:any;
edesignprojectmanagementdb="edesignprojectmanagementdb";
_config:any;
status: boolean;
_urls:any;
ts: any;
tsRoot: any;
loadDocument: boolean;
private projectManagementLoaded=new Subject();
projectManagementIsReady$=this.projectManagementLoaded.asObservable();
public showCustomization:EventEmitter<boolean>;


//-----projectManagementservice------------

  constructor(private dataService:DataService,
    private countryservice: CountryService, 
    private inservice: Injector,
     private dataBackendService: DataBackendService,
    private _configService:ConfigurationService,private datePipe: DatePipe,
    private progressBar: ProgressBarService,private storageService:StorageService,
    private projectcustomizeservice: projectcustomizeservice,
    private _http: HttpClient,
    private _languageService:LanguageService,  
    private userservice:UserService
    
    ) {

    //-----projectManagementservice------------
    this.showCustomization=new EventEmitter<boolean>();
    this._urls=this._configService.getUrlsObject();
    this.ts = _languageService.getTranslationObject();
    this.tsRoot = _languageService.getTranslationRoot();
    this.tsRoot.onLangChange.subscribe(e => {
      this.ts = _languageService.getTranslationObject();
    });
   
    
  }

  getProjectList(): Observable<IProject[]> {
   
    var res1 = this.dataBackendService.get<IProject>(spimSettings.SPIMUrl+"/projects", this.userservice.getHeaderParams());
  
    return res1;
  }
  async createProject(project2: IProject) {
    let project: IProject = <IProject>{};
    let currentProject:IProject=<IProject>{};
    let configstates:IStatesAndDescription=<IStatesAndDescription>{};
    currentProject= JSON.parse(this.storageService.getValue('projectobject')) as IProject;
    project = this.createNewProjectParams(project2,currentProject);
    project.isNewProject=false;
    var res1 = this.dataBackendService.post<IProject>(spimSettings.SPIMUrl+"/projects", project, this.userservice.getHeaderParams());
    let result = await res1.toPromise() as any;
    let configurationId = result.project.configurations[0].id;
    this.storageService.storeValue("configurationId",configurationId);
    this.storageService.storeValue("projectId",result.project.id);
    const service=this.inservice.get(ProjectStoreService);
    let pcddata = await service.fillPCDDetails(project);
    let formData=await this.convertPCDToFormData(pcddata)
    var tags: Array<string> = [edesignConstants.MEA];
    var applicationjson ="application/json"
    var quoteResult = this.dataBackendService.post<any>(spimSettings.SPIMUrl+`/files/configs/${configurationId}/file?fileName=${edesignConstants.Quote.quote_Json}&mimeType=${applicationjson}&description=${project2.configDescription}&tags=${tags}`,
    formData, this.userservice.getHeaderParams(), true);
    project.projectName = project2.projectName;
    project.title = project2.configTitle;
    project.configDescription = project2.configDescription;
    await this.updateProject_local(project);
    let configResult = await quoteResult.toPromise() as any;
    var states: Array<string> = []; 
    if(currentProject.wdConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.SWITCHES_SOCKETS);
    }
    if(currentProject.fdConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.ELECTRICAL_SWITCHBOARD);
    }
    if(currentProject.wsConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.WISER);
    }
    if(currentProject.vdiConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.VDI);
    }
    configstates.states=states;
    configstates.description = project2.configDescription;
    var statesUpdate = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/files/configs/${configurationId}`, configstates, this.userservice.getHeaderParams());
    await statesUpdate.toPromise() as any;
    return configResult;

  }
  updateFavProjectParams(project2){
    let project: IProject = <IProject>{};
    project = project2;
    return project;
  }
  //getquote
   getquote(configuration: any): Observable<any> {
    let fileId = configuration.files.find(e => e.fileName ==edesignConstants.Quote.quote_Json).id
    sessionStorage.setItem("fileID", fileId);
    var res1 = this.dataBackendService.get(spimSettings.SPIMUrl+`/files/${fileId}/content`, this.userservice.getHeaderParams());
   // var str2 = decodeURIComponent(escape(window.atob(await res1.toPromise())));
    res1.toPromise();
    
    return res1;
  }

  async updateProjectConfiguration(project2: IProject, currentProjectID, status: boolean) {

    let project: IProject = <IProject>{};
    //let quote: Iquote = <Iquote>{};
    let currentProject:IProject=<IProject>{};
    currentProject= JSON.parse(this.storageService.getValue('projectobject')) as IProject;
    project = this.updateProjectParams(project2,currentProject);
    if(!status){
      project.title = project2.configTitle;
    }
    var res1 = this.dataBackendService.post<IProject>(spimSettings.SPIMUrl+`/projects/${currentProjectID}/configuration`, project, this.userservice.getHeaderParams());
    let result = await res1.toPromise() as any;
    let configurationId = result.configuration.id;
    const service=this.inservice.get(ProjectStoreService);
    let pcddata = await service.fillPCDDetails(project);
     let formData= await this.convertPCDToFormData(pcddata);
    var tags: Array<string> = [edesignConstants.MEA];
    var applicationjson ="application/json"
    var quoteResult = this.dataBackendService.post<any>(spimSettings.SPIMUrl+`/files/configs/${configurationId}/file/overwrite?fileName=${edesignConstants.Quote.quote_Json}&mimeType=${applicationjson}&description=${project2.configDescription}&tags=${tags}`,
    formData, this.userservice.getHeaderParams(), true);
    let configResult = await quoteResult.toPromise() as any;
    currentProject.quoteId = configResult.configurationFile.configurationId as string;
    let projectObject = JSON.stringify(currentProject);
    this.storageService.storeValue('projectobject', projectObject);
    let configstates:IStatesAndDescription=<IStatesAndDescription>{};
    configstates.states=this.addConfigurationChecksToStates(currentProject);
    configstates.description = project2.configDescription;
    var statesUpdate = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/files/configs/${configurationId}`, configstates, this.userservice.getHeaderParams());
    await statesUpdate.toPromise() as any;
    return configResult;
  }

  async updateQuoteConfiguration(project2: IProject,configID: string) {
    let _currentProject:IProject=<IProject>{};
    _currentProject= JSON.parse(this.storageService.getValue('projectobject')) as IProject;
    var currentProject = this.updateProjectParams(project2,_currentProject);
    if (project2.projectId == undefined && configID == undefined) {
      project2.projectId = this.storageService.getValue("projectId") as any;
      configID = this.storageService.getValue("configurationId") as any;
    }
    let _updateProject = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/projects/${project2.projectId}`, currentProject, this.userservice.getHeaderParams());
    _updateProject = _updateProject.toPromise() as any;
    let configstates:IStatesAndDescription=<IStatesAndDescription>{};
    configstates.states=this.addConfigurationChecksToStates(_currentProject);
    configstates.description = project2.configDescription;
    var statesUpdate = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/files/configs/${configID}`, configstates, this.userservice.getHeaderParams());
    await statesUpdate.toPromise() as any;
    const service=this.inservice.get(ProjectStoreService);
    let pcddata = await service.fillPCDDetails(_currentProject);
    let formData=await this.convertPCDToFormData(pcddata);
    var tags: Array<string> = [edesignConstants.MEA];
    var applicationjson ="application/json"
    var res = this.dataBackendService.post<any>(spimSettings.SPIMUrl+`/files/configs/${configID}/file/overwrite?fileName=${edesignConstants.Quote.quote_Json}&mimeType=${applicationjson}&description=${project2.configDescription}&tags=${tags}`,
    formData, this.userservice.getHeaderParams(), true);
    let configResult = await res.toPromise() as any;
    return configResult;
  }
  deleteProject(projectID: any): Observable<any> {
    var res1 = this.dataBackendService.delete(spimSettings.SPIMUrl + `/projects/${projectID}`, this.userservice.getHeaderParams());
    return res1;
  }
   getWiserAvailable(){
    let value = false;
   if(this.projectcustomizeservice.getProductScopeData().filter(e=>e.productScopeName == edesignConstants.ProductScopes.SMART_HOME_SOLUTION_WISER).length>0) {
    value =true;
  } 
   return value;
   }
   getVdiAvailable(){
    let value = false;
   if(this.projectcustomizeservice.getProductScopeData().filter(e=>e.productScopeName == edesignConstants.ProductScopes.COFFRETDECOMMUNICATION).length>0) {
    value =true;
  } 
   return value;
  }
  getWDAvailable(){
      let value = false;
    if(this.projectcustomizeservice.getProductScopeData().filter(e=>e.productScopeName == edesignConstants.ProductScopes.SWITCHES_SOCKETS).length>0) {
      value =true;
    }
    return value;
  }    

  duplicateProject(projectID: any,newProjectName:string): Observable<any> {
   
    const body=JSON.stringify(newProjectName);
    var res1 = this.dataBackendService.post<IProject>(spimSettings.SPIMUrl+`/projects/${projectID}/duplicate`, body, this.userservice.getHeaderParams());
    return res1;
  }

  duplicateConfiguration(configuration: any) {
     
      let fileId = configuration.files.find(e => e.fileName == edesignConstants.Quote.quote_Json).id
      sessionStorage.setItem("fileID", fileId);
      var res1 =  this.dataBackendService.get<any>(spimSettings.SPIMUrl+`/files/${fileId}/content`, this.userservice.getHeaderParams());
      return res1;
  
  }

 async duplicateQuote(quote:any,project2, projectdetails:any,newConfigName)
  {
    let configstates:IStatesAndDescription=<IStatesAndDescription>{};
    let currentProject= JSON.parse(this.storageService.getValue('projectobject')) as IProject;
    let project = this.updateProjectParams(project2,currentProject);
    project.title=newConfigName;
    var res1 = this.dataBackendService.post<IProject>(spimSettings.SPIMUrl+`/projects/${projectdetails.id}/configuration`, project, this.userservice.getHeaderParams());
    let result = await res1.toPromise() as any;
    let configurationId = result.configuration.id;
    let pcddata = quote;
    let parsedData=JSON.parse(pcddata);
    let formData=await this.convertPCDToFormData(parsedData);
    var tags: Array<string> = [edesignConstants.MEA];
    var applicationjson ="application/json"
    var quoteResult = this.dataBackendService.post<any>(spimSettings.SPIMUrl+`/files/configs/${configurationId}/file?fileName=${edesignConstants.Quote.quote_Json}&mimeType=${applicationjson}&description=${project2.configDescription}&tags=${tags}`,
    formData, this.userservice.getHeaderParams(), true);
    quoteResult = await quoteResult.toPromise() as any;
    configstates.states=project2.states;
    configstates.description = project2.configDescription;
    var statesUpdate = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/files/configs/${configurationId}`, configstates,this.userservice.getHeaderParams());
    await statesUpdate.toPromise() as any;
    return quoteResult;
  }
 
  async updateProject(project2: IProject, currentProjectID, status: boolean) {
    let project: IProject = <IProject>{};
    let currentProject= JSON.parse(this.storageService.getValue('projectobject')) as IProject;
    if(status){
      project = this.updateFavProjectParams(project2 );
    }else{
      project = this.updateProjectParams(project2,currentProject);
    }
    var res1 = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/projects/${currentProjectID}`, project, this.userservice.getHeaderParams());
    return await res1.toPromise() as any;
  }
//   async btoaEncoded (quote) {
//     var key="elitism scorecard conjuror niece"
//     var encryptedString = CryptoJS.AES.encrypt(quote, key).toString(); 
//     var newEncryptedQuote = {encryptedQuote: encryptedString , isEncrypted: true};
//     return btoa(JSON.stringify(newEncryptedQuote)); 
// }


  deleteProjectConfiguration(configId: any): Observable<any> {
    
    var res1 = this.dataBackendService.delete(spimSettings.SPIMUrl+`/files/configs/${configId}`, this.userservice.getHeaderParams());
    return res1;
  }
   getCurrentProject()
  {
    let currentProject:IProject
    var _currentProject=  this.storageService.getValue('projectobject');
    currentProject= JSON.parse(_currentProject) as IProject;
  return currentProject;
  }
 async updateV1Configuration(fileID)
  {
    let quote: Iquote = <Iquote>{};
   
    var tags: Array<string> = ['V1PopupFalse']; 
    quote.tags=tags
    quote.fileName = edesignConstants.Quote.quote_Json;
    quote.mimeType = "application/json";
    var res1 = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/files/${fileID}/encodedfile`, quote, this.userservice.getHeaderParams());
    var rquoteResult = await res1.toPromise() as any;
    return rquoteResult;
  }

  async updateElectricalContexttoDone(status?:boolean):Promise<boolean>{
    var currentProject=this.getCurrentProject();
    currentProject.isElectricalContextDone=true;
    if(status != undefined){
      currentProject.isElectricalContextDone=status;
    }
     let projectobject= JSON.stringify( currentProject);
     this.storageService.storeValue('projectobject', projectobject);
     return true;
  }

    async getupdateElectricalContexttoDone():Promise<boolean>{
      var currentProject=this.storageService.getValue('projectobject');
      var project= JSON.parse(currentProject);
      return project.isElectricalContextDone;
    }

    async modifyVDIConfigurationStatus(project:IProject,flag:boolean){
      let project1 = this.getCurrentProject();
     project1.vdiConfigurationCheck=flag;;
      let projectobject= JSON.stringify( project1);
      this.storageService.storeValue('projectobject', projectobject); 
   }
    async modifyWsConfigurationStatus(project:IProject,wiserFlag:boolean){
      let project1 = this.getCurrentProject();
     project1.wsConfigurationCheck=wiserFlag;;
      let projectobject= JSON.stringify( project1);
      this.storageService.storeValue('projectobject', projectobject);
   }
   async updateProject_local(project:IProject){
    let projectobject= JSON.stringify( project);
    this.storageService.storeValue('projectobject', projectobject); 
 }
   async updateQuoteconfigurationDetails(quoteConfig, quoteId){
  
     let quote : Iquote = <Iquote>{};
    let project2: IProject = <IProject>{};
    quote.title = quoteConfig.configTitle;
    quote.description = quoteConfig.configDescription;
    var statesUpdate = this.dataBackendService.putWithId(spimSettings.SPIMUrl+`/files/configs/${quoteId}`, quote, this.userservice.getHeaderParams());
    let _configResult= await statesUpdate.toPromise() as any;
    return _configResult;
   }
   async getCurrentProjectId():Promise<number>{
    let currentProject=await this.getCurrentProject();
    return currentProject.projectId;
  }
  
  //---------------------------ProjectManagementService--------------------------

async isGuidedMode(): Promise<boolean> {
    let project: IProject = await this.getCurrentProject();
    return project.guideMe;
  }


 
 getProject(projectId:number):Observable<IProject>{
   var result=this.dataService.get<IProject>(this._configService.geturl(this._urls.PROJECT_MANAGEMENT.GET_PROJECT_BY_ID,projectId));
   return result;
 }


//  async saveCurrentProjectDetails( ):Promise<IProject>{
//   var project:IProject=<IProject>{};
//  var document:IDocument=<IDocument>{};
//  //check if current project is new
//  //var isNewProject=await this.isCurrentProjectNew_local();
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
//  return project;
// }
async modifyConfigurationStatus(project:IProject,socketsFlag:boolean,electricalFlag:boolean){
   project.wdConfigurationCheck = socketsFlag;
   project.fdConfigurationCheck = electricalFlag;
   project.savedState=SavedState.UPDATED;
   let projectobject= JSON.stringify(project);
   this.storageService.storeValue('projectobject', projectobject);

}




 

 async setCurrentProject_local(project:IProject):Promise<boolean>{
  var lastModified =  (new Date(new Date().toString().split('GMT')[0]+' UTC').toISOString().split('.')[0]);
  var current =this.getCurrentProject();
  (current as IProject).isCurrent=1;
  (current as IProject).projectId=project.projectId;
  (current as IProject).isNewProject=false;
  (current as IProject).lastModified = lastModified;
  (current as IProject).spimProjectId=project.spimProjectId;
  await this.updateProject_local(current);
  this.nextProjectSource.next();
  return true;
}


async modifyGuideMeStatus(project:IProject,guideMeStatus:boolean){

  project.guideMe = guideMeStatus;
  // this code is for now.. once wd manual mode enabled we need to change
  //if(!guideMeStatus){
    project.vdiConfigurationCheck = guideMeStatus;
 // }
  // project.wdConfigurationCheck = guideMeStatus;
  // project.fdConfigurationCheck = guideMeStatus;
  project.savedState=SavedState.UPDATED;
  this.updateProject_local(project);

}

async modifyProjectConfigurationStatusOnManualMode(project:IProject){
//On manual mode, wiser and vdi configuration is false; wd and fd is true;
  project.guideMe = false; 
    project.vdiConfigurationCheck = false;
   project.wdConfigurationCheck = this.getWDAvailable();
   project.fdConfigurationCheck = true;
   project.wsConfigurationCheck = false;
  project.savedState=SavedState.UPDATED;
  this.updateProject_local(project);

}


   
 

		
  UploadAssociatedFile(objectToUpload:IAssociateFileUpload): Observable<IAssociateFileUpload[]>{		
    return this._http.post<IAssociateFileUpload[]>(environment.SPIMBaseUrl + "/UploadFile",objectToUpload);		
  }		
  deleteFile(projectId: number, fileId: string): Observable<IAssociateFileUpload[]>		
  {		
    return this._http.delete<IAssociateFileUpload[]>(environment.SPIMBaseUrl + `/DeleteAssociatedFile/${projectId}/${fileId}`);		
  }		
  downloadAssociatedFile(fileId: string , filename: string)  {		
    return this._http.get(environment.SPIMBaseUrl + `/DownloadFile/${fileId}/${filename}`);
  }

  downloadQuoteFile(fileId: string) : Observable<string> {
    var baseUrl = apiEndpoint + "/api/v1/project"; 		
    return this._http.get<string>(baseUrl + `/DownloadFile/${fileId}`);
  }

 
    getProductScopeForHomePage(currentProject:IProject){
      var Scopearray: String[] = [] as String[];
      var ScopeSwitchAndScoket = "";
      var ScopeElectricalswitchBoard = "";
      var ScopeWiser = "";
      var ScopeCommunication = "";
      if(currentProject.wdConfigurationCheck == true){
        ScopeSwitchAndScoket  = this.ts.PROJECT_CUSTOMIZATION.SOCKETS;
        Scopearray.push(ScopeSwitchAndScoket);
     }
     if(currentProject.fdConfigurationCheck == true){
      if(ScopeSwitchAndScoket.length > 0) {
        ScopeElectricalswitchBoard = this.ts.PROJECT_CUSTOMIZATION.ELECTRICAL_SWITCHBOARD;
          Scopearray.push(ScopeElectricalswitchBoard);
        }
        else{
          ScopeElectricalswitchBoard = this.ts.PROJECT_CUSTOMIZATION.ELECTRICAL_SWITCHBOARD;
          Scopearray.push(ScopeElectricalswitchBoard);
        }
      }
      if(currentProject.wsConfigurationCheck == true){
        ScopeWiser = this.ts.PROJECT_CUSTOMIZATION.SMART_HOME_SOLUTION.toUpperCase();
        Scopearray.push(ScopeWiser)
      }
      if(currentProject.vdiConfigurationCheck == true){
        ScopeCommunication = this.ts.PROJECT_CUSTOMIZATION.COFFRET_DECOMMUNICATION;
        Scopearray.push(ScopeCommunication)
      }
      return Scopearray;
      
    }
    
  downloadAllDocuments(files, contentType: string, projectName: string){
    let count = 0;
    let payload = files;
    let zip = new JSZip();
    files.forEach((file: IAssociateFileUpload) => {
      this.downloadAssociatedFile(file.fileId, file.fileName)
        .toPromise()
        .then(res => {
          var binary =res["fileName"].split(',')[1] !=undefined? atob(res["fileName"].split(',')[1]): atob(res["fileName"]);
          var array = [];
          for (var i = 0; i < binary.length; i++) {
            array.push(binary.charCodeAt(i));
          }

          const blob = new Blob([new Uint8Array(array)], { type: contentType });
          zip.file(file.fileName, blob);
          ++count;
          if (count == payload.length) {
            zip.generateAsync({
              type: 'blob'
            })
              .then(function (content) {
                FileSaver.saveAs(content, projectName + " " + new Date().toString().split(" ").slice(0, 4).join(" ") + '.zip');
               
              });
             
          }
         this.progressBar.stopSpinner();
        
        }
    
        )
      
    });
    
  }

  downloadFile(data: any, fileName: string) {
  var docDownload = document.createElement("a");
    if (fileName.indexOf("xlsx") > -1) {
      docDownload.href = "data:application/octet-stream;base64," + data.fileName;
    }
    else {
      docDownload.href = data.fileName;
    }
  docDownload.download = fileName;
  docDownload.click();
    

  }

 

  async insertAnonymousProject(project) {
    this.updateProject_local(project)
    this.nextProjectSource.next();
  }
  getAnonymousProject(projectCode): Observable<IAnonymousProject> {
    var projectSaveUrl = this._configService.geturl(
      this._urls.PROJECT_MANAGEMENT.BASE,
      this._urls.PROJECT_MANAGEMENT.ANONYMOUS
    );
    return this._http.get<IAnonymousProject>(projectSaveUrl + `/${projectCode}`);
  }

  async openAnonymousProject(projectCode, currentproject ,resellerState) :Promise<boolean>{
    let navigateToSwitchesAndSockets = true;
    currentproject.isCurrent = 1;
    currentproject.isNewProject=true;
     await this.insertAnonymousProject(currentproject);

    if (currentproject.wdConfigurationCheck && currentproject.fdConfigurationCheck) {
      navigateToSwitchesAndSockets = true;
    }
    else if (!currentproject.wdConfigurationCheck) {
      navigateToSwitchesAndSockets = false;
    }
    else if (currentproject.fdConfigurationCheck) {
      navigateToSwitchesAndSockets = false;
    }
    if(resellerState)
    {
    sessionStorage.setItem("code", projectCode);
    }

    return navigateToSwitchesAndSockets;
    //this.performProjectDataOperations(this.currentProject, this.currentProject, navigateToSwitchesAndSockets);
  }


  //#region  Set of duplicate codes created by developers
  createNewProjectParams(project2:IProject, currentProject:IProject) {

    let project: IProject = new Project(this.ts.PROJECT + this.getTodayTimeStramp()) as any;
    let clientDetails: IClientDetails = <IClientDetails>{};
    let customFieldsMap: ICustomFieldsMap = <ICustomFieldsMap>{};
    let extendedInfo:IextendedInfo=<IextendedInfo>{};
    clientDetails.firstName = project2.clientFirstName;
    clientDetails.lastName=project2.clientLastName;
    clientDetails.phone=project2.phoneNumber;
    clientDetails.email=project2.email;
    clientDetails.address=project2.address;

    extendedInfo.postalcode=project2.clientPostalCode;
    extendedInfo.city=project2.clientCity;
    extendedInfo.countryCode=project2.countryCode;
    clientDetails.extendedInfo=extendedInfo;
   
    customFieldsMap.appCountry = this.countryservice.getBaseCountryCode();// countryservice
    customFieldsMap.city=project2.projectCity;
    customFieldsMap.postalcode=project2.projectPostalCode;
    customFieldsMap.address=project2.street;
    customFieldsMap.isFavourite=project2.isFavourite as any;
    
    // project.fdConfigurationCheck=currentProject.fdConfigurationCheck;
    // project.wdConfigurationCheck=currentProject.wdConfigurationCheck;
    // project.vdiConfigurationCheck=currentProject.vdiConfigurationCheck;
    // project.wsConfigurationCheck=currentProject.wsConfigurationCheck;
    //var states: Array<string> = ["V2"]; 
    currentProject.customFieldsMap = customFieldsMap;
    currentProject.configTitle = project2.configTitle;
    //currentProject.projectName=project2.title;
    currentProject.lastModified=project.lastModified;
    currentProject.clientDetails=project.clientDetails;
    currentProject.clientDetails = clientDetails;
    currentProject.title = project2.projectName;
    currentProject.appId = edesignConstants.EDESIGNV2; // constants 

    //project.states=states;
    return currentProject;
  }
  updateProjectParams(project2, currentProject) {
    let project= currentProject;
    let clientDetails: IClientDetails = <IClientDetails>{};
    let customFieldsMap: ICustomFieldsMap = <ICustomFieldsMap>{};
    clientDetails.address=project2.address;
    let extendedInfo:IextendedInfo=<IextendedInfo>{};
    clientDetails.firstName = project2.clientFirstName;
    clientDetails.lastName=project2.clientLastName;
    clientDetails.phone=project2.phoneNumber;
    clientDetails.email=project2.email;
    clientDetails.address=project2.address;


    extendedInfo.postalcode=project2.clientPostalCode;
    extendedInfo.city=project2.clientCity;
    extendedInfo.countryCode=project2.countryCode;
    clientDetails.extendedInfo=extendedInfo;
    project.clientDetails = clientDetails;

    project.title = project2.projectName;
    project.appId = edesignConstants.EDESIGNV2; // constants 

    project.projectName=project2.projectName;
    customFieldsMap.appCountry = this.countryservice.getBaseCountryCode()// countryservice 

    customFieldsMap.city=project2.projectCity;
    customFieldsMap.postalcode=project2.projectPostalCode;
    customFieldsMap.address=project2.address;
    customFieldsMap.isFavourite =project2.isFavourite;
    project.customFieldsMap = customFieldsMap;

    if(project2.customFieldsMap != undefined && project2.clientDetails != undefined){
      project.customFieldsMap = project2.customFieldsMap;
      project.clientDetails = project2.clientDetails;
    }

    project.fdConfigurationCheck=currentProject.fdConfigurationCheck;
    project.wdConfigurationCheck=currentProject.wdConfigurationCheck;
    project.vdiConfigurationCheck=currentProject.vdiConfigurationCheck;
    project.wsConfigurationCheck=currentProject.wsConfigurationCheck;
    project.configTitle = project2.configTitle;
    if(project2.guideMe!=null)
    {
      project.guideMe=project2.guideMe;
    }
   
  

    return project;
  }

  async createNewProject_local(project:IProject, projectdetails ?:IProject, isNewProject?:boolean):Promise<IProject>{
    this.countrySpec=this.countryservice.getCountrySpec();
    if(projectdetails==null)
    {
      projectdetails=new Project( this.ts.PROJECT + this.getTodayTimeStramp()) as any;
    }
    if(project==null)
    {
      project =new Project(this.ts.PROJECT + this.getTodayTimeStramp()) as any;
    }
    let newProject=project;
    newProject.email= projectdetails.clientDetails.email !== undefined && projectdetails.clientDetails.email  ? projectdetails.clientDetails.email : null ;
    newProject.phoneNumber= projectdetails.clientDetails.phone? projectdetails.clientDetails.phone : null ;
    newProject.address= projectdetails.clientDetails.address? projectdetails.clientDetails.address : null ;
    newProject.projectDescription= projectdetails.customFieldsMap.description  ? projectdetails.customFieldsMap.description: null ;
    newProject.projectCity= projectdetails.customFieldsMap.city ? projectdetails.customFieldsMap.city: null ;
    newProject.projectPostalCode= projectdetails.customFieldsMap.postalcode ? projectdetails.customFieldsMap.postalcode: null ;
    newProject.street= projectdetails.customFieldsMap.address ? projectdetails.customFieldsMap.address: null ;
    newProject.isFavourite= projectdetails.customFieldsMap.isFavourite ? projectdetails.customFieldsMap.isFavourite: null as any;
    newProject.clientFirstName= projectdetails.clientDetails.firstName ? projectdetails.clientDetails.firstName : null;
    newProject.clientLastName= projectdetails.clientDetails.lastName ? projectdetails.clientDetails.lastName : null;
    if(projectdetails.clientDetails.extendedInfo!=null)
    {
      newProject.clientCity= projectdetails.clientDetails.extendedInfo.city ? projectdetails.clientDetails.extendedInfo.city : null;
      newProject.clientPostalCode= projectdetails.clientDetails.extendedInfo.postalcode ? projectdetails.clientDetails.extendedInfo.postalcode : null;
      newProject.countryCode= projectdetails.clientDetails.extendedInfo.countryCode ? projectdetails.clientDetails.extendedInfo.countryCode: null ;
    }
    
    newProject.projectType=null;
    newProject.configTitle = project.title;
    newProject.projectName = projectdetails.title;
    if(isNewProject !==undefined){
      if(isNewProject){
        newProject.projectName = this.ts.PROJECT + this.getTodayTimeStramp();

      }
      newProject.isNewProject=true;
      newProject.configTitle = this.ts.QUOTE + this.getTodayTimeStramp();
    }else{
      
      newProject.isNewProject=false;
    }
    newProject.title = newProject.configTitle;
    newProject.savedState=0;

    //Condition to make guided mode false by default only for denmark and make guided mode true for all other countries
    if(this.countrySpec.disableGuidedMode)
    {
      newProject.guideMe=false;
    }
    else{
      newProject.guideMe=true;
    }

    // configuration checks are assigned to true for new project
    newProject.fdConfigurationCheck=true;
    newProject.wdConfigurationCheck=this.getWDAvailable();
    newProject.wsConfigurationCheck=this.getWiserAvailable();
    newProject.vdiConfigurationCheck=this.getVdiAvailable();

    // configuration checks are assigned after retrieving the project from SPIM
    // if(project!=null && project.states!=undefined )
    // {
    //   newProject.fdConfigurationCheck= project.states.includes(edesignConstants.ProductScopes.ELECTRICAL_SWITCHBOARD)==true?true:false;
    //   newProject.wdConfigurationCheck= project.states.includes(edesignConstants.ProductScopes.SWITCHES_SOCKETS)==true?true:false;
    //   newProject.wsConfigurationCheck= project.states.includes(edesignConstants.ProductScopes.WISER)==true?true:false;
    //   newProject.vdiConfigurationCheck=project.states.includes(edesignConstants.ProductScopes.VDI)==true?true:false;
    // }

    newProject.isElectricalContextDone=false;
    newProject.spimProjectId = "";
    //newProject.isV1 = (projectdetails.appId == "mes-estudio")? true: false;
    //newProject.notifications=await this.getNotificationId();
    newProject.vat=(this.countrySpec !== undefined) ? this.countrySpec.vat: null;
    newProject.wdRangeId=(this.countrySpec !== undefined) ? this.countrySpec.wdProductSpec.defaultWDRangeId: null;
    newProject.fdRangeId=(this.countrySpec !== undefined) ? this.countrySpec.wdProductSpec.defaultFDRangeID : null;
    newProject.labelAtBottom=false;
    newProject.projectId=projectdetails.id as any;
    newProject.isCurrent=1;
    newProject.quoteId = project.id
    newProject.configDescription = project.description ? project.description: null ;
    let projectobject= JSON.stringify(newProject);
    this.storageService.storeValue('projectobject', projectobject);
    this.nextProjectSource.next();
    return newProject;
   }

   getTodayTimeStramp(){
    let today= new Date();
    let todaysDateTime = this.datePipe.transform(today, 'ddMMyyyy_hhmmss');
    return todaysDateTime;
   }

   // this function is to convert pcdobject into formdata to store in SPIM
   async convertPCDToFormData(pcddata)
   {
    const quoteBlob =new Blob([JSON.stringify(JSON.stringify(pcddata))], {type: 'text/plain'});
    const quoteFile = new File([quoteBlob], edesignConstants.Quote.quote_Json,{type: 'application/json'});
    var formData: any = new FormData();
    formData.append("fileData", quoteFile);
    formData.append("type", "application/json");
    return formData;
   }
   // add ConfigStates to show below Quotes in projectmanagement screen
   addConfigurationChecksToStates(currentProject)
   {
    var states: Array<string> = []; 
    if(currentProject.wdConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.SWITCHES_SOCKETS);
    }
    if(currentProject.fdConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.ELECTRICAL_SWITCHBOARD);
    }
    if(currentProject.wsConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.WISER);
    }
    if(currentProject.vdiConfigurationCheck==true)
    {
      states.push(edesignConstants.ProductScopes.VDI);
    }
    return states;
   }
   //#endregion duplicates

   downloadBlobFile(data: any, format: string) {
    const blob = new Blob([data], { type: format });
    const url = window.URL.createObjectURL(blob);
    var link = document.createElement('a');
    link.href = url;
    var date = new Date().toDateString();
    var time = new Date().toLocaleTimeString();
    link.download = edesignConstants.Quote.Quote+ "_" + date + "_" + time + ".json";
    link.click(); 
  }
}