export function createUserService(userRepository) {
    return {
         async createUser(username, password, email) {
            if(await userRepository.existsByUsername(username)) {
                throw Error("Użytkownik o podanej nazwie już istnieje.");
            }
            if(await userRepository.existsByEmail(email)) {
                throw Error("Użytkownik o podanym adresie email już istnieje.");
            }
            return await userRepository.save({ username, password, email, created_at: new Date().toISOString() });
    }
}
}