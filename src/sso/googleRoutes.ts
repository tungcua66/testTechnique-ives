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
  passport.authenticate("google", { failureRedirect: "/auth/google/failure" }),
  (req, res) => {
    const user = req.user as any;
    const userId = user.userId;

    // generate OAuth2 auth code
    const code = createAuthorizationCode(
      "task-client",
      "http://localhost:3000/client/callback",
      userId
    );

    res.redirect(`/client/callback?code=${code.code}`);
  }
);

export default router;
