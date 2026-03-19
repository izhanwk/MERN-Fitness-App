export function isProfileComplete(user) {
  return Boolean(user?.height && user?.goal && user?.activity && user?.mode);
}

export function sanitizeUser(user) {
  const source = typeof user?.toObject === "function" ? user.toObject() : user;
  if (!source) {
    return null;
  }

  const safeUser = { ...source };
  delete safeUser.password;
  delete safeUser.refreshtoken;
  delete safeUser.__v;
  return safeUser;
}
