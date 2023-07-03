import { Request, RequestHandler, Response } from 'express';

import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';

import { IAdmin, IRefreshTokenResponse } from './admin.interface';
import { AdminSevice } from './admin.service';
import httpStatus from 'http-status';
import config from '../../../config';

const signupUser = catchAsync(async (req: Request, res: Response) => {
  const { ...user } = req.body;
  const result = await AuthSevice.signupUser(user);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User signed in successfully!',
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { ...loginData } = req.body;
  const result = await AuthSevice.loginAdmin(loginData);
  const { refreshToken, ...others } = result;

  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };
  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User logged in successfully !',
    data: others,
  });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  const result = await AuthSevice.refreshToken(refreshToken);

  // set refresh token into cookie
  const cookieOptions = {
    secure: config.env === 'production',
    httpOnly: true,
  };

  res.cookie('refreshToken', refreshToken, cookieOptions);

  sendResponse<IRefreshTokenResponse>(res, {
    statusCode: 200,
    success: true,
    message: 'User logged in successfully !',
    data: result,
  });
});

export const AuthController = { createAdmin, loginAdmin, refreshToken };
