export const buildAuthResponsePayload = ({
  user,
  token,
  refreshToken,
  sessionId,
}) => ({
  success: true,
  needsOnboarding: !user.height || !user.weight || !user.activity,
  nextStep: !user.height || !user.weight || !user.activity ? "onboarding" : "dashboard",
  data: {
    userId: user.id,
    email: user.email,
    token,
    refresh: refreshToken,
    sessionId,
  },
});
