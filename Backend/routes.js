import authModule from './auth/auth.module.js';
import userModule from './user/user.module.js';

export default(app) => {
    app.use('/users', userModule.router);
    app.use('/auth', authModule.router);
};
