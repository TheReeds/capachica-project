import { ApplicationConfig, EnvironmentProviders, importProvidersFrom, ENVIRONMENT_INITIALIZER, inject, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withViewTransitions } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

import { RegisterComponent } from './features/auth/register/register.component';
import { ThemeService } from './core/services/theme.service';

function initializeTheme() {
  return () => {
    const themeService = inject(ThemeService);
    themeService.initializeTheme();
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes,withViewTransitions(), withComponentInputBinding()), 
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),
    provideAnimations(),
    { 
      provide: ENVIRONMENT_INITIALIZER,
      useFactory: initializeTheme,
      multi: true
    }
  ]
};
