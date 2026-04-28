export type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
  scope?: string;
  [key: string]: unknown;
};

const parseBase64Url = (value: string) => {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};

export const decodeJwt = (token: string): JwtPayload | null => {
  const [, payload] = token.split('.');
  if (!payload) return null;

  try {
    return JSON.parse(parseBase64Url(payload)) as JwtPayload;
  } catch {
    return null;
  }
};

export const isJwtExpired = (token: string, offsetSeconds = 30) => {
  const payload = decodeJwt(token);
  if (!payload?.exp) return false;

  return payload.exp * 1000 <= Date.now() + offsetSeconds * 1000;
};

export const getJwtPermissions = (token: string) => {
  const payload = decodeJwt(token);
  const permissions = payload?.permissions;
  const roles = payload?.roles;
  const scope = payload?.scope;

  return [
    ...(Array.isArray(permissions) ? permissions : []),
    ...(Array.isArray(roles) ? roles.map((role) => `role:${role}`) : []),
    ...(typeof scope === 'string' ? scope.split(/\s+/).filter(Boolean) : [])
  ];
};

export const hasPermission = (token: string, required?: string | string[]) => {
  if (!required || required.length === 0) return true;

  const requiredPermissions = Array.isArray(required) ? required : [required];
  const userPermissions = getJwtPermissions(token);

  if (userPermissions.length === 0) return true;
  if (userPermissions.includes('*') || userPermissions.includes('role:admin')) return true;

  return requiredPermissions.every((permission) => userPermissions.includes(permission));
};
