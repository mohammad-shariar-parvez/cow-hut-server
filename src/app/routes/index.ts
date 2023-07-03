import express from 'express';
import { UserRoutes } from '../modules/user/user.routes';
import { CowRoutes } from '../modules/cow/cow.routes';
import { OrderRoutes } from '../modules/order/order.routes';
import { AdminRoutes } from '../modules/admin/admin.route';
const router = express.Router();

const moduleRoutes = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/cows',
    route: CowRoutes,
  },
  {
    path: '/orders',
    route: OrderRoutes,
  },
  {
    path: '/admins',
    route: AdminRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));

export default router;
