export const TOKEN_KEY = "Books-Token";
export const ROLE_KEY = "User-Role";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const isAdminAuthenticated = () => localStorage.getItem(ROLE_KEY) === 'admin';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const login = data => {
  localStorage.setItem(TOKEN_KEY, data.token);
  localStorage.setItem(ROLE_KEY, data.user.role);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ROLE_KEY);
};
