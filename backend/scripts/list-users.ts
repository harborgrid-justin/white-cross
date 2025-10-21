import 'reflect-metadata';
import { sequelize } from '../src/config/sequelize';
import { User } from '../src/database/models/core/User';

(async () => {
  try {
    await sequelize.authenticate();
    console.log('DB connected');
    const users = await User.findAll({ attributes: ['id','email','firstName','lastName','role','isActive'] });
    console.log(JSON.stringify(users.map(u=>u.get()), null, 2));
  } catch (err) {
    console.error('Error querying users:', err);
  } finally {
    await sequelize.close();
  }
})();
