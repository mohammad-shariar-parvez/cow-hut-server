import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import {
  ILogin,
  ILoginResponse,
  IRefreshTokenResponse,
} from '../auth/auth.interface';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  const result = await Admin.create(adminData);
  return result;
};

const loginAdmin = async (payload: ILogin): Promise<ILoginResponse> => {
  const { phoneNumber, password } = payload;

  //  // access to our instance methods
  const isAdminExist = await Admin.isAdminExist(phoneNumber);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }
  if (
    isAdminExist.password &&
    !(await Admin.isPasswordMatched(password, isAdminExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { id, role } = isAdminExist;
  const accessToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );
  const refreshToken = jwtHelpers.createToken(
    { id, role },
    config.jwt.refresh_secret as Secret,
    config.jwt.refresh_expires_in as string
  );
  return {
    accessToken,
    refreshToken,
  };
};

const refreshToken = async (token: string): Promise<IRefreshTokenResponse> => {
  //verify token
  // invalid token - synchronous
  let verifiedToken = null;
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token,
      config.jwt.refresh_secret as Secret
    );
  } catch (err) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
  }
  // console.log('VARIFIED TOKEN', verifiedToken);

  const { id } = verifiedToken;

  // case- admin deleted but he has refresh token
  // checking deleted admin's refresh token

  const isAdminExist = await Admin.isRefreshedAdminExist(id);

  if (!isAdminExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Admin does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isAdminExist.id,
      role: isAdminExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AdminSevice = {
  createAdmin,
  loginAdmin,
  refreshToken,
};
