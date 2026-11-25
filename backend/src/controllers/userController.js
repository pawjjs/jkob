import { body, validationResult } from "express-validator";

export function createUserController(userService) {
    return {
            async registerUser(req, res) {
                const { username, password, email } = req.body;
                await body("password")
                .isString().withMessage(`Hasło musi składać się z liter i cyfr.`)
                .isLength({ min: 8, max: 32 }).withMessage("Hasło musi mieć od 8 do 32 znaków")
                .run(req);

                await body("username")
                .isString().withMessage(`Nazwa użytkownika musi składać się z liter i cyfr.`)
                .isLength({ min: 5, max: 12 }).withMessage("Nazwa użytkownika musi mieć od 5 do 12 znaków")
                .run(req);

                await body("email")
                .isEmail().withMessage("Nieprawidłowy format adresu email")
                .isLength({max: 64}).withMessage("Adres email nie może przekraczać 64 znaków")
                .normalizeEmail()
                .run(req);
                
                const errors = await validationResult(req);
                if (!errors.isEmpty()) {
                    return res.status(400).json({ errors: errors.array() });
                }
                try {
                    const user = await userService.createUser(username, password, email);
                    console.log("Rejestracja przebiegła pomyślnie!")
                    return res.status(201).json({ message: "Rejestracja przebiegła pomyślnie!" }); 
                } catch (error) {
                    console.error("Błąd podczas rejestracji użytkownika:", error);
                    return res.status(500).json({ error: "Wystąpił błąd podczas rejestracji użytkownika." });
                }
        }
    }
}