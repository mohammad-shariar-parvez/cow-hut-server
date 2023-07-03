import { Request, RequestHandler, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { IAdmin } from './admin.interface';
import { AdminSevice } from './admin.service';
import httpStatus from 'http-status';

const createAdmin: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    console.log('Route hitted');
    const { ...adminData } = req.body;
    const result = await AdminSevice.createAdmin(adminData);

    sendResponse<IAdmin>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Admin created successfully!',
      data: result,
    });
  }
);

export const AdminController = { createAdmin };
