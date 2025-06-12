import { PublicClientApplication, Configuration } from '@azure/msal-browser';

export const msalConfig: Configuration = {
  auth: {
    clientId: '5c016169-0ab4-4634-9bcb-9cb167164395',
    authority: 'https://login.microsoftonline.com/c00d2af6-31e9-4958-bff0-41bb72014bac',
    redirectUri: 'http://localhost:4200',
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: false,
  },
};
