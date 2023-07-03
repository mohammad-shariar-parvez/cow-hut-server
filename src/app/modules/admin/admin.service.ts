import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin | null> => {
  const result = await Admin.create(adminData);
  console.log('ADMIN IS', result);

  return result;
};
export const AdminSevice = {
  createAdmin,
};

// let newUserData = null;
// const session = await mongoose.startSession();
// try {
//   session.startTransaction();
//   const newUser = await Admin.create([adminData], { session });
//   if (!newUser.length) {
//     throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create user');
//   }
//   newUserData = newUser[0];
//   await session.commitTransaction();
//   await session.endSession();
// } catch (error) {
//   await session.abortTransaction();
//   await session.endSession();
//   throw error;
// }
// if (newUserData) {
//   newUserData = await Admin.findOne({ _id: newUserData._id });
// }

// return newUserData;
