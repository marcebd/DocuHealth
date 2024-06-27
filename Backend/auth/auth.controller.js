class AuthController {
    constructor(authService, userService) {
        this.authService = authService;
        this.userService = userService;
    }

    login = async (req, res) => {
        try {
            const {username, password} = req.body;
            const user = await this.userService.getUserByUsername(username);
            const { isValid, jwt } = await this.authService.login(user, password);
            if (isValid) {
                return res.status(200).send({jwt});
            }
            return res.status(401).send({error: 'Invalid username or password'});
        } catch(error) {
            return res.status(500).json({error: 'Internal Server Error' });
        }
    };
}

export default AuthController;
