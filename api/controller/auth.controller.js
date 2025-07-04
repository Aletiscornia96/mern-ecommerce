import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from '../utils/error.js';
import jwt from 'jsonwebtoken';



export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validar que los campos no estén vacíos y que existan
    if (!username || !email || !password || username === '' || email === '' || password === '') {
       return next(errorHandler(400, 'Todos los campos son requeridos'));
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json('El correo ya está en uso');
    }    

    //Encriptar la pass
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Crear y guardar el nuevo usuario
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();
        return res.json('Registro exitoso');
    } catch (err) {
        return next(err);
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body

    if (!email || !password || email === '' || password === '') {
        return next(errorHandler(400, 'Todos los campos son requeridos'));
    }

    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, 'Usuario no encontrado'));
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, 'Contrasena invalida'));
        }
        const token = jwt.sign({ id: validUser._id, isAdmin: validUser.isAdmin }, process.env.JWT_SECRET);

        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, { httpOnly: true }).json(rest);
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            //si el usuario existe
            const token = jwt.sign({ id: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET);
            const { password, ...rest } = user._doc;
            res.status(200).cookie('access_token', token, {
                httpOnly: true,
            }).json(rest)
        } else {
            //si el usuario no existe
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            try {
                // Intentar guardar el nuevo usuario
                await newUser.save();

                // Generar token para el nuevo usuario
                const token = jwt.sign({ id: newUser._id, isAdmin: newUser.isAdmin }, process.env.JWT_SECRET);
                const { password, ...rest } = newUser._doc;

                res.status(200).cookie('access_token', token, {
                    httpOnly: true,
                }).json(rest);
            } catch (saveError) {
                // Captura cualquier error relacionado con la base de datos
                console.log('Error al guardar el usuario:', saveError);
                res.status(500).json({ message: 'Error al guardar el usuario en la base de datos' });
            }
        }
    } catch (error) {
        next(error)
    }
}