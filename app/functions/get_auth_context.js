function getAuthContext(config, session) {
  const authEnabled = config.authentication || config.authentication_for_edit;
  const loggedIn = authEnabled ? session.loggedIn : false;
  const username = authEnabled ? session.username : null;
  const canEdit = authEnabled
    ? loggedIn && config.allow_editing
    : config.allow_editing;

  return { loggedIn, username, canEdit };
}

// Exports
export default getAuthContext;
