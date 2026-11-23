export function createUserRepository(userRepository) {
    return {
        async createUser(username, password, email) {
            if(username.length >= 5 && password.length >= 8) {
            return userRepository.save({ username, password, email, created_at: new Date().toISOString() });
        }
    }
}
}