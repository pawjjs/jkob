import argon2 from 'argon2';

export function createUserRepository(db) {

    const saveUser = db.prepare('INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)');
    const existsByUsername = db.prepare('SELECT COUNT(*) FROM users WHERE username = ?');
    const checkLoginAndPassword = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');

    return {
        async save(user) {
            if(existsByUsername.run(user.username)) {
                throw new Error("Użytkownik o podanej nazwie istnieje.");
            }
            const passwordHash = await argon2.hash(user.password);
            const ok = await argon2.verify(passwordHash, user.password); 
            return saveUser.run(user.username, passwordHash, user.email, user.created_at);
        },

        async existsByUsername(username) {
            const result = existsByUsername.run(username);
            return result > 0;
        },

        async checkLoginAndPassword(username, password) {
            const user = checkLoginAndPassword.run(username, password);
            if(user != null) {
                return user;
            } else {
                console.log("Nie znaleziono użytkownika o podanej nazwie lub hasło jest niepoprawne.");
            }
        }
    }
}