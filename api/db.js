import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

// Determinar si estamos en test o desarrollo
const envFile = process.env.NODE_ENV === 'test'
  ? path.resolve('./api/.env.test')
  : path.resolve('./api/.env');

// Cargar el archivo correcto
dotenv.config({ path: envFile });

// // Mostrar la URI que se va a usar (opcional, para depurar)
// console.log(`🌐 Mongo URI (${process.env.NODE_ENV || 'dev'}):`, process.env.MONGO_URL || process.env.MONGO_URL_TEST);

// Seleccionar la URI según el entorno
const mongoURI = process.env.NODE_ENV === 'test'
  ? process.env.MONGO_URL_TEST
  : process.env.MONGO_URL;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log(`🟢 MongoDB conectado (${process.env.NODE_ENV || 'dev'})`);
  } catch (error) {
    console.error('🔴 Error al conectar con MongoDB:', error.message);
    process.exit(1);
  }
};
