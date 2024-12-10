import { Router } from '@remix-run/router';

let appRouter: Router | null = null;

export const setRouter = (router: Router) => {
  appRouter = router;
};

export const navigateTo = (path: string) => {
  if (appRouter) {
    appRouter.navigate(path); 
  } else {
    console.error('Router is not set');
  }
};
