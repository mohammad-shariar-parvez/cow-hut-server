import express from 'express';
import { requestValidation } from '../../middleware/validationRequest';
import { AdminValidation } from './admin.validation';
import { AdminController } from './admin.contoller';

const router = express.Router();

router.post(
  '/',
  requestValidation.validateRequest(AdminValidation.createAdminZodSchema),
  AdminController.createAdmin
);

export const AdminRoutes = router;
