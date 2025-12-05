import { Router } from "express";
import passport from "passport";
import "../sso/googleStrategy";
import { createAuthorizationCode } from "../services/oauthService";

const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/auth/google/failure",
    session: false,
  }),
  (req, res) => {
    const user = req.user as any;

    if (!user || !user.userId) {
      return res.status(500).json({ error: "missing_google_user" });
    }

    (req as any).user = { userId: user.userId };

    const code = createAuthorizationCode(
      "task-client",
      "http://localhost:3000/client/callback",
      user.userId
    );

    return res.redirect(`/client/callback?code=${code.code}`);
  }
);

router.get("/google/failure", (_req, res) => {
  res.status(401).json({ error: "google_auth_failed" });
});

export default router;
