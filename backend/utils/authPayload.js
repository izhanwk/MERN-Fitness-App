export const buildAuthResponsePayload = ({
  user,
  token,
  refreshToken,
  sessionId,
}) => ({
  success: true,
  needsOnboarding: !user.height || !user.weight || !user.activity,
  data: {
    userId: user.id,
    email: user.email,
    token,
    refresh: refreshToken,
    sessionId,
  },
});
