import httpStatus from 'http-status';
import ApiError from '../../../errors/ApiError';
import {
  IAdmin,
  ILoginUser,
  ILoginUserResponse,
  IRefreshTokenResponse,
} from './admin.interface';
import { Admin } from './admin.model';
import config from '../../../config';
import { Secret } from 'jsonwebtoken';
import { jwtHelpers } from '../../../helpers/jwtHelpers';
import { IUser } from '../user/user.interface';
import { User } from '../user/user.model';

const signupUser = async (user: IUser): Promise<IUser | null> => {
  const result = await User.create(user);
  return result;
};

const loginAdmin = async (payload: ILoginUser): Promise<ILoginUserResponse> => {
  const { phoneNumber, password } = payload;

  //  // access to our instance methods
  const isUserExist = await Admin.isUserExist(phoneNumber);
  console.log('is USER EXIST', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  if (
    isUserExist.password &&
    !(await Admin.isPasswordMatched(password, isUserExist.password))
  ) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Password is incorrect');
  }

  //create access token & refresh token

  const { id, role } = isUserExist;
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
  console.log('VARIFIED TOKEN', verifiedToken);

  const { id } = verifiedToken;

  // case- user deleted but he has refresh token
  // checking deleted user's refresh token

  const isUserExist = await Admin.isRefreshedAdminExist(id);
  console.log('IIIIDDD IDD', id);
  console.log('IS USER EXIST', isUserExist);

  if (!isUserExist) {
    throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist');
  }
  //generate new token

  const newAccessToken = jwtHelpers.createToken(
    {
      id: isUserExist.id,
      role: isUserExist.role,
    },
    config.jwt.secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    accessToken: newAccessToken,
  };
};

export const AuthSevice = {
  signupUser,
  loginAdmin,
  refreshToken,
};
