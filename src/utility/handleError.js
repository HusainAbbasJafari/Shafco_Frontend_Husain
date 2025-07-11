
import { set } from "nprogress";

export const handleError = (statusCode, router) => {
  if (!router || !statusCode) return;
     
  const routeMap = {
    400: '/error/400',
    401: '/error/401',
    402: '/error/402',
    403: '/error/403',
    404: '/error/404',
    409: '/error/409',
    419: '/error/419',
    429: '/error/429',
    500: '/error/500',
  };

  const route = routeMap[statusCode] || '/error/500';
  
  router.push(route);
};
