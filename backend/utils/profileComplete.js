export const applyProfileComplete = (user) => {
  if (user.height && user.goal && user.activity && user.mode) {
    user.profileComplete = "Complete";
  }

  return user;
};
