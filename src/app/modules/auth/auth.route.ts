import express from 'express';
import { requestValidation } from '../../middleware/validationRequest';
import { AuthValidation } from './auth.validation';

const router = express.Router();

router.post(
  '/login',
  requestValidation.validateRequest(AuthValidation.loginZodSchema),
  AdminController.loginUser
);
router.post(
  '/signup',
  requestValidation.validateRequest(AuthValidation.sighnupZodSchema),
  AdminController.signupUser
);

router.post(
  '/refresh-token',
  requestValidation.validateRequest(AuthValidation.refreshTokenZodSchema),
  AdminController.refreshToken
);

export const AuthRoutes = router;
