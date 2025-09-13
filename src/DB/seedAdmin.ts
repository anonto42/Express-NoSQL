import { User } from '../app/modules/user/user.model';
import config from '../config';
import { USER_ROLES } from '../enums/user';
import { logger } from '../shared/logger';

export class Seeder {
  public static async seedSuperAdmin(): Promise<void> {
    const payload = {
      name: 'Administrator',
      email: config.super_admin.email,
      role: USER_ROLES.ADMIN,
      password: config.super_admin.password,
      verified: true,
    };

    const adminExists = await User.findOne({ email: payload.email, role: USER_ROLES.ADMIN });
    if (!adminExists) {
      await User.create(payload);
      logger.info('✨ Super Admin account created successfully!');
    }
  }
}
