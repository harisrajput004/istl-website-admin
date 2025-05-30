import { mergeApplicationConfig, ApplicationConfig, TransferState, makeStateKey } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { AuthService } from './auth/auth.service';
import { of } from 'rxjs';

const AUTH_STATE_KEY = makeStateKey<boolean>('authState');

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    {
      provide: AuthService,
      useFactory: (transferState: TransferState) => {
        const isAuthenticated = false;
        transferState.set(AUTH_STATE_KEY, isAuthenticated);
        
        return {
          isAuthenticated: isAuthenticated,
          loading$: of(false),
          checkAuthStatus: () => {},
          getJwtToken: () => null,
          isAuthenticated$: of(isAuthenticated)
        };
      },
      deps: [TransferState]
    }
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
