import { IAdmin } from './admin.interface';
import { Admin } from './admin.model';

const createAdmin = async (adminData: IAdmin): Promise<IAdmin> => {
  const result = await Admin.create(adminData);
  console.log('ADMIN IS', result);

  return result;
};
export const AdminSevice = {
  createAdmin,
};
