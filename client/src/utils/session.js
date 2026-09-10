export const getSessionToken = () => {
  let token = localStorage.getItem('tunein_session_token');
  if (!token) {
    token = 's_' + Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
    localStorage.setItem('tunein_session_token', token);
  }
  return token;
};
