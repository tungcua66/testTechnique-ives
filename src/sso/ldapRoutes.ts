import { Router } from "express";
import { ldapLogin } from "./ldapController";

const router = Router();

router.post("/ldap", ldapLogin);

export default router;
