import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './app/msal.config';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './app/auth.interceptor';
import { routes } from './app/app.routes';
import { MSAL_INSTANCE, MsalService } from '@azure/msal-angular';


function MSALInstanceFactory() {
  const instance = new PublicClientApplication(msalConfig);
  instance.initialize();
  return instance;
}

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: MSAL_INSTANCE,
      useFactory: MSALInstanceFactory,
    },
    MsalService,
  ]
}).catch(err => console.error(err));

