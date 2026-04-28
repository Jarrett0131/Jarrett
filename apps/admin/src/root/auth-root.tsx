import type { FC, PropsWithChildren } from 'react';
import { Navigate, matchRoutes, useLocation } from 'react-router-dom';
import PageForbidden from '@shared/components/403';
import { hasPermission, isJwtExpired } from '@shared/auth/jwt';
import useAppStore, { clearAuth, selectToken } from '@shared/store/app-store';
import router from '@admin/router';

type RouteHandle = {
  permissions?: string | string[];
};

const AuthRoot: FC<PropsWithChildren> = ({ children }) => {
  const token = useAppStore(selectToken);
  const location = useLocation();
  const nextURL = location.pathname + location.search;
  const matchResult = matchRoutes(router.routes, nextURL);
  const isNotFound = matchResult?.at(-1)?.route.path === '*';

  if (!token || isJwtExpired(token)) {
    if (token) clearAuth();

    if (isNotFound) {
      return <Navigate to="/login" replace />;
    }

    return <Navigate to={`/login?from=${nextURL}`} replace />;
  }

  const requiredPermissions = matchResult?.reduce<string[]>((permissions, match) => {
    const routePermissions = (match.route.handle as RouteHandle | undefined)?.permissions;
    if (!routePermissions) return permissions;

    return permissions.concat(routePermissions);
  }, []);

  if (!hasPermission(token, requiredPermissions)) {
    return <PageForbidden />;
  }

  return <>{children}</>;
};

export default AuthRoot;
