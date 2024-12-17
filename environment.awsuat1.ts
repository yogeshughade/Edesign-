export const gateway= {
    IPAddress:window.location.origin,
    port:"",
    protocol:"https",
  }
  
  export const apiEndpoint=window.location.origin+"/apigateway";
  

  export const productSelector ={
    productSelectorListing :apiEndpoint+ "/api/v1/ProductSelector/ProductSelectorRange/{rangeValue}",
    productSelector: apiEndpoint+"/api/v1/ProductSelector/{psId}",
    productImage:"https://gw-api.schneider-electric.com/sc/products/image/{reference}",
    productSelectorlist:apiEndpoint+"/api/v1/ProductSelector/ProductSelectorlist/{rangeValue}/{countrycode}",
    GetCataloglist:apiEndpoint+"/api/v1/ProductSelector/Cataloglist/{rangeValue}/{countryCode}/{Criteria}"
  }
  
  export const wdSelectionGuide={
    selectionApi:"https://gw-api-emea.schneider-electric.com/sc/v2.5/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID",
    catlogApi:"https://gw-api-emea.schneider-electric.com/sc/v2.5/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID"
    // selectionApi:"https://selectconfig-ppr.schneider-electric.com/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID",
    // catlogApi:"https://selectconfig-ppr.schneider-electric.com/selectionguides/searchbyid/EDESIGN/GLOBAL_ID/COUNTRY_ID/LANGUAGE_ID"
  }
  
  // export const IDMSSecrets={
  //   app: "eDesignV2",
  //   clientId: "3MVG9ahGHqp.k2_xWoKZZKzfq3kFJ5AEpb6XSDzgQyGMRAQLHd8XgXvcq034pjmONIz7uYp5dz.F8SSr2tgoi",
  //   redirectUri: "https://dev2.edesign-home.se.com:446/",
  //   baseUrl:"https://sitbfo19-secommunities.cs17.force.com",
  // } 

    export const IDMSSecrets={
    app: "eDesignV2",
    clientId: "de9509826f5a4b6568fae312706ad02ea787365b153e150bce4dbdac713608fe5c56b000D4C00000019jRUAQ",
    redirectUri: "https://uat1.edesign-home.se.com",
    baseUrl:"https://secureidentity-preprod.schneider-electric.com",
    } 

  
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
    production: true,
    environment: "development",
     apiEndpoint:apiEndpoint,
     ProductSelector:{
      productSelectorListing :productSelector.productSelectorListing,
      productSelector:productSelector.productSelector,
      productSelectorlist:productSelector.productSelectorlist,
      productImage:productSelector.productImage,
      wdSelectionGuide:wdSelectionGuide,
      GetCataloglist:productSelector.GetCataloglist
    },
    SPIMBaseUrl: apiEndpoint + "/api/v1/projectmanagement", 
  
  };
  
  
  export const GATrackingId ={
    TrackingId :"UA-156018034-1"
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
    hideFeedback:false
    }