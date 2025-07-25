# 🛒 MERN Ecommerce

Proyecto ecommerce fullstack con el stack **MERN**, desarrollado con enfoque profesional para portfolio técnico.  
Incluye autenticación real, arquitectura modular y testing robusto sobre los módulos claves.

---

## 📁 Variables de entorno

### `.env` (desarrollo)
```
MONGO_URL=mongodb+srv://admin123:admin123@cluster0.ddr9i.mongodb.net/ecommerce?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=ecommerce
```

### `.env.test` (testing automatizado)

```
MONGO_URL_TEST=mongodb+srv://admin123:admin123@cluster0.ddr9i.mongodb.net/ecommerce_test?retryWrites=true&w=majority
PORT=3000
JWT_SECRET=ecommerce
```

---
## ⚙️ Instalación rápida

Para clonar y preparar el proyecto, ejecuta:

```bash
git clone https://github.com/Aletiscornia96/mern-ecommerce 
cd mern-ecommerce
npm install
```

---
## 🚀 Scripts disponibles


```bash 
npm run dev     # Inicia el entorno de desarrollo con nodemon
npm test        # Ejecuta los tests con entorno aislado
```


---
🧪 Testing incluido
Se cubren los módulos Auth, Category y Product con tests automatizados usando Jest + Supertest, incluyendo:
- 🔐 Autenticación con JWT real y manejo de cookies
- ✅ Validaciones completas y mensajes sincronizados
- 🛂 Lógica de roles: user vs admin
- 🧼 Seeds dinámicos y base de datos limpia en cada test
- 🧱 Sin uso de mocks artificiales: flujos reales y reproducibles
El resto del proyecto esta preparado y sigue una arquitectura  para sumar cobertura progresivamente.


🧭 Arquitectura del proyecto
- Modularización por dominio: routes, controllers, models
- Validaciones robustas con mensajes centralizados
- Helpers reutilizables para testing y seed automático
- Dashboard Admin con métricas agregadas
- Código escalable, mantenible y preparado para CI/CD

📚 Stack Tecnológico
| Backend | Frontend | Testing | 
| Node.js | React + Vite | Jest + Supertest | 
| Express | CSS Modules | MongoDB Memory Server | 
| MongoDB + Mongoose | Axios | Cookie-parser, JWT | 


📌 Notas finales
Este proyecto no busca cubrir cada ruta con tests, sino mostrar criterio técnico, calidad en la cobertura y arquitectura lista para escalar.
Todo el testing se alinea con el backend real: sin mocks innecesarios, sin shortcuts falsos.