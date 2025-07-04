import jwt from "jsonwebtoken";
import {errorHandler} from './error.js';

export const verifyToken = (req, res, next) => {
    const token = req.cookies.access_token;
    if(!token){
        return next(errorHandler(401, 'Sin Autorizacion'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>{
        if(err){
            return next(errorHandler(401, 'Token Invalido'));
        }
        
        req.user = user;
        next();
    })
};

// Verifica si el usuario es el mismo que está logueado o si es admin
export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return next(errorHandler(403, 'No tienes permiso'));
    }
  });
};

// Solo admins pueden continuar
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      next();
    } else {
      return next(errorHandler(403, 'Acceso solo para administradores'));
    }
  });
};