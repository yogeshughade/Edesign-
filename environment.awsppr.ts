export const gateway= {
    IPAddress:"gw.ppr.edesign-home.se.com",
    port:"",
    protocol:"https",
  }
  
  export const apiEndpoint=gateway.protocol+"://"+gateway.IPAddress;
  
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
    clientId: "3MVG9M43irr9JAuzj6OYTqwCy2yrJ0VtWoG2ZRoKg2zCRghofEpFkf4VmmWsdF_ah5_hHksA2Ovl81FDezp2B",
    redirectUri: "https://ppr.edesign-home.se.com/",
    baseUrl:"https://secureidentity-uat.schneider-electric.com",
  }
  
  export const IDMSUrls={
    login: IDMSSecrets.baseUrl + "/identity/idplogin?app=" + IDMSSecrets.app + "&response_type=code&client_id=" +  
                                  IDMSSecrets.clientId + "&redirect_uri=" + IDMSSecrets.redirectUri ,
  
    logout: IDMSSecrets.baseUrl + "/identity/IDMS_IDPSloInit?RelayState=" + IDMSSecrets.redirectUri+ "&app=" + IDMSSecrets.app,
    registration : IDMSSecrets.baseUrl + "/identity/userregistrationwork?app=" + IDMSSecrets.app,
    resetPwd: IDMSSecrets.baseUrl + "/identity/IDMSRequestPasswordReset?app=" + IDMSSecrets.app,
    profile_update_uri: IDMSSecrets.baseUrl + "/identity/UserProfile?app=" + IDMSSecrets.app
  }
  
  export const environment = {
    isAuthenticationRequired:true,
    version:'api/v1',
    production: true,
    environment: "awspreprod",
     apiEndpoint:apiEndpoint,
     ProductSelector:{
      productSelectorListing :productSelector.productSelectorListing,
      productSelector:productSelector.productSelector,
      productImage:productSelector.productImage,
      wdSelectionGuide:wdSelectionGuide,
      productSelectorlist:productSelector.productSelectorlist,
      GetCataloglist:productSelector.GetCataloglist
    },
    SPIMBaseUrl: apiEndpoint + "/api/v1/projectmanagement", 
    getDBVersions:getDBVersions
  
  };
  
  function getDBVersions(){
    //for every schema change or data change add version_count_N here
       let version_count_1={version:1,description:"v1 version for new ppr environment"};
       let version_count_2={version:1,description:"v1 version for new ppr environment"};
       let version_count_3={version:1,description:"v1 version for new ppr environment"};
       let version_count_4={version:1,description:"v1 version for new ppr environment"};
       let version_count_5={version:1,description:"v1 version for new ppr environment"};
       let version_count_6={version:1,description:"v1 version for new ppr environment"};
       let version_count_7={version:1,description:"v1 version for new ppr environment"};
       let version_count_8={version:1,description:"v1 version for new ppr environment"};
       let version_count_9={version:1,description:"v1 version for new ppr environment"};
       let version_count_10={version:1,description:"v1 version for new ppr environment"};
       let version_count_11={version:1,description:"v1 version for new ppr environment"};

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
       return versions;
   }
  
  export const GATrackingId ={
    TrackingId :"UA-156018034-4"
  }
  export const myschneiderPortal={
    myschneiderPortal:"https://pprod.d19dpgcs1g8vj2.amplifyapp.com/myschneider/"
  }
  export const spimSettings= 
  {
    BearerToken:'Bearer jhSR12buTp1k9kyLzXY7FIeDU98I1PK4',
    SPIMUrl:"https://gw-api-ppr-emea.schneider-electric.com/spim/3.1"
  }
  export const feedBackSettings={
    hideFeedback:true
    }
