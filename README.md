# 🏡 Rommie Match


Aplicación web para conectar **estudiantes** que buscan roomie y **propietarios (landlords)** que publican departamentos / habitaciones.

Incluye:

- Registro e inicio de sesión por rol:
  - 👨‍🎓 `STUDENT`
  - 🏠 `LANDLORD`
  - 🛠️ `ADMIN` (solo gestión básica)
- Entorno estudiante:
  - Ver otros estudiantes
  - Ver departamentos disponibles
  - Editar su perfil
  - Buzón de mensajes (enviar y responder)
- Entorno landlord:
  - Gestionar sus departamentos (CRUD)
  - Editar perfil
  - Buzón de mensajes (responder a estudiantes)
- Sistema de mensajes internos con referencia opcional a un departamento.

---

## 🧱 Tecnologías

### Backend
- Java 17+
- Spring Boot (Maven)
- Spring Data JPA + Hibernate
- MySQL 8
- REST API (`/api/...`)

### Frontend
- Angular 16+ (standalone components)
- TailwindCSS (diseño en tonos pastel)
- TypeScript

Estructura del proyecto:

```bash
roomiematch/
├─ backend/          # Proyecto Spring Boot
└─ frontend/
   └─ rommie-match/  # Proyecto Angular
```
### ✅ Requisitos previos
Git

Java JDK 17 (o superior)

Maven 3.9+

Node.js 18+ (recomendado 18 o 20) y npm

MySQL 8
- Tener un servidor corriendo en localhost puerto 3306.

- Conocer un usuario y contraseña (por ejemplo, root / tu_password

- 
#### Conf backend
abre: backend/src/main/resources/application.yml y modifica tu user name y password de mySQL


#### Conf fronend

cd frontend/rommie-match:
```bash
npm install
```
Revisa el archivo: frontend/rommie-match/proxy.conf.json, debe ser algo asi:
```bash
{
  "/api": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true
  }
}
```

Desde frontend/rommie-match ejecutar
```bash
npm start
```

