export function createUserController(userService) {
    return {
        async registerUser(req, res) {
                const { username, password, email } = req.body;
                const user = await userService.createUser(username, password, email);
                res.body(200);            
        }
    }
}