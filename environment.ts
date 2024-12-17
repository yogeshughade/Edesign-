export const gateway= {
  IPAddress:"localhost",
  port:"7010",
  protocol:"http",
}

export const apiEndpoint=gateway.protocol+"://"+gateway.IPAddress+":"+gateway.port;


export const productSelector ={
  productSelectorListing :apiEndpoint+ "/api/v1/ProductSelector/ProductSelectorRange/{rangeValue}",
  productSelector: apiEndpoint+"/api/v1/ProductSelector/{psId}",
  GetCataloglist:apiEndpoint+"/api/v1/ProductSelector/Cataloglist/{rangeValue}/{countryCode}/{Criteria}",
  productSelectorlist:apiEndpoint+"/api/v1/ProductSelector/ProductSelectorlist/{rangeValue}/{countrycode}",
  productImage:"https://gw-api.schneider-electric.com/sc/products/image/{reference}"
}

export const wdSelectionGuide={
  selectionApi:"https://gw-api-emea.schneider-electric.com/sc/v2.5/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID",
  catlogApi:"https://gw-api-emea.schneider-electric.com/sc/v2.5/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID"
  // selectionApi:"https://selectconfig-ppr.schneider-electric.com/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID",
  // catlogApi:"https://selectconfig-ppr.schneider-electric.com/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID"
}


export const IDMSSecrets={
  app: "eDesignV2",
  clientId: "de9509826f5a4b6568fae312706ad02ea787365b153e150bce4dbdac713608fe5c56b000D4C00000019jRUAQ",
  redirectUri: "https://localhost:4201/",
  baseUrl:"https://secureidentity-preprod.schneider-electric.com",
  } 
  // export const IDMSSecrets={
  //   app: "eDesignV2",
  //   clientId: "3MVG9ahGHqp.k2_xWoKZZKzfq3kFJ5AEpb6XSDzgQyGMRAQLHd8XgXvcq034pjmONIz7uYp5dz.F8SSr2tgoi",
  //   redirectUri: "https://localhost:4200",
  //   baseUrl:"https://sitbfo19-secommunities.cs17.force.com",
  // }

  export const IDMSUrls = {
    login: IDMSSecrets.baseUrl + "/identity/idplogin?app=" + IDMSSecrets.app + "&response_type=code&client_id=" +
      IDMSSecrets.clientId + "&redirect_uri=" + IDMSSecrets.redirectUri,
    logout: IDMSSecrets.baseUrl + "/identity/IDMS_IDPSloInit?RelayState=" + IDMSSecrets.redirectUri + "&app=" + IDMSSecrets.app,
    registration: IDMSSecrets.baseUrl + "/identity/userregistrationwork?app=" + IDMSSecrets.app,
    resetPwd: IDMSSecrets.baseUrl + "/identity/IDMSRequestPasswordReset?app=" + IDMSSecrets.app,
    profile_update_uri: IDMSSecrets.baseUrl + "/identity/UserProfile?app=" + IDMSSecrets.app
  }
export const environment = {
  isAuthenticationRequired:true,
  version:'api/v1',
  production: false,
  environment: "development",
   apiEndpoint:apiEndpoint,
   ProductSelector:{
    productSelectorListing :productSelector.productSelectorListing,
    productSelector:productSelector.productSelector,
    productSelectorlist:productSelector.productSelectorlist,
    productImage:productSelector.productImage,
    wdSelectionGuide:wdSelectionGuide,
    GetCataloglist:productSelector.GetCataloglist,

  },
  SPIMBaseUrl: gateway.protocol + "://" + gateway.IPAddress + ":7010/api/v1/projectmanagement", 
  getDBVersions:getDBVersions
  
}

function getDBVersions(){
 //for every schema change or data change add version_count_N here
 let version_count_1={version:1,description:"v1 version for new dev environment"};
     let version_count_2={version:1,description:"v1 version for new dev environment"};
     let version_count_3={version:1,description:"v1 version for new dev environment"};
     let version_count_4={version:1,description:"v1 version for new dev environment"};
     let version_count_5={version:1,description:"v1 version for new dev environment"};
     let version_count_6={version:1,description:"v1 version for new dev environment"};
     let version_count_7={version:1,description:"v1 version for new dev environment"};
     let version_count_8={version:1,description:"v1 version for new dev environment"};
     let version_count_9={version:1,description:"v1 version for new dev environment"};
     let version_count_10={version:1,description:"v1 version for new dev environment"};
     let version_count_11={version:1,description:"v1 version for new dev environment"};
     let version_count_12={version:1,description:"v1 version for new dev environment"};
     let version_count_13={version:1,description:"v1 version for new dev environment"};
     let version_count_14={version:1,description:"v1 version for new dev environment"};
     let version_count_15={version:1,description:"v1 version for new dev environment"};
     let version_count_16={version:1,description:"v1 version for new dev environment"};
     let version_count_17={version:1,description:"v1 version for new dev environment"};
     let version_count_18={version:1,description:"v1 version for new dev environment"};
     let version_count_19={version:1,description:"v1 version for new dev environment"};
     let version_count_20={version:1,description:"v1 version for new dev environment"};
     let version_count_21={version:1,description:"v1 version for new dev environment"};
     let version_count_22={version:1,description:"v1 version for new dev environment"};
     let version_count_23={version:1,description:"v1 version for new dev environment"};
     let version_count_24={version:1,description:"v1 version for new dev environment"};
     let version_count_25={version:1,description:"v1 version for new dev environment"};
     let version_count_26={version:1,description:"v1 version for new dev environment"};

     let versions=[];
     versions.push(version_count_1);
     versions.push(version_count_2);
     versions.push(version_count_3);
     versions.push(version_count_4);
     versions.push(version_count_5);
     versions.push(version_count_6);
     versions.push(version_count_7);
     versions.push(version_count_8);
     versions.push(version_count_9);
     versions.push(version_count_10);
     versions.push(version_count_11);
     versions.push(version_count_12);
     versions.push(version_count_13);
     versions.push(version_count_14);
     versions.push(version_count_15);
     versions.push(version_count_16);
     versions.push(version_count_17);
     versions.push(version_count_18);
     versions.push(version_count_19);
     versions.push(version_count_20);
     versions.push(version_count_21);
     versions.push(version_count_22);
     versions.push(version_count_23);
     versions.push(version_count_24);
     versions.push(version_count_25);
     versions.push(version_count_26);
    return versions;
}

export const GATrackingId ={
  TrackingId :"UA-156018034-1"
}

export const spimSettings= 
{
  BearerToken:'Bearer jhSR12buTp1k9kyLzXY7FIeDU98I1PK4',
  SPIMUrl:"https://gw-api-ppr-emea.schneider-electric.com/spim/3.1"
}
export const myschneiderPortal={
  myschneiderPortal:"https://pprod.d19dpgcs1g8vj2.amplifyapp.com/myschneider/"
}
export const feedBackSettings={
hideFeedback:true
}