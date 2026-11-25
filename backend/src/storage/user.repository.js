import argon2 from 'argon2';

export function createUserRepository(db) {

    const saveUserQuery = db.prepare('INSERT INTO users (username, password, email, created_at) VALUES (?, ?, ?, ?)');
    const existsByUsernameQuery = db.prepare('SELECT COUNT(*) AS count FROM users  WHERE username = ?');
    const checkLoginAndPasswordQuery = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?');
    const existsByEmailQuery = db.prepare('SELECT COUNT(*) AS count FROM users WHERE email = ?');

    
        async function existsByUsername(username) {
            return await existsByUsernameQuery.get(username).count > 0;
        }

        async function existsByEmail(email) {
            return await existsByEmailQuery.get(email).count > 0;
        }

        async function checkLoginAndPassword(username, password) {
            const user = await checkLoginAndPasswordQuery.run(username, password);
            if(user != null) {
                return user;
            } else {
                throw Error("Użytkownik o podanej nazwie nie istnieje.");
            }
        }

        async function save(user) {
            const passwordHash = await argon2.hash(user.password);
            const ok = await argon2.verify(passwordHash, user.password); 
            if(ok){
                return saveUserQuery.run(user.username, passwordHash, user.email, user.created_at);
            } else {
                console.error("Błąd");
            }
            
        }
        return { existsByUsername, existsByEmail, save };
    }
    