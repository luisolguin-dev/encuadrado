# ☕ CoffeeBoost MVP

¡Hola! 

Esta es la solución al desafío técnico de Encuadrado. Básicamente, es una plataforma para enviar "energía" (café o té). El objetivo era crear un flujo rápido, sin fricción y validando la hipótesis de retención desde el día uno.

## 🚀 El Stack
Fui por lo seguro y robusto para iterar rápido:
* **Framework:** Next.js
* **Base de Datos:** PostgreSQL (alojada en Supabase)
* **ORM:** Prisma
* **Estilos:** Tailwind CSS

---

## ¿Cómo correrlo en tu local?

### 1. Clona el repo

git clone [https://github.com/luisolguin-dev/encuadrado.git](https://github.com/luisolguin-dev/encuadrado.git)

cd encuadrado

2. Instala las dependencias

npm install

3. Configura las variables de entorno
Crea un archivo llamado .env en la raíz del proyecto. Necesitas pegar ahí la credencial de la base de datos (la envié por email). Debería verse algo así:

DATABASE_URL="postgresql://postgres.ahmakjwebdtqxmuxoruy:[password]@aws-0-us-west-2.pooler.supabase.com:6543/postgres?pgbouncer=true"

DIRECT_URL="postgresql://postgres.ahmakjwebdtqxmuxoruy:[password]@aws-0-us-west-2.pooler.supabase.com:5432/postgres"

4. Conecta Prisma

npx prisma generate

5. Correr la app

npm run dev

Abre http://localhost:3000 


📱 ¿Cómo probar la App?
El MVP simula los dos roles clave. En el Home verás dos botones grandes para entrar como quieras (sin login complejo, usamos Cookies para simular la sesión y hacerlo rápido):

Solicitor (Quien pide)
Ruta: /solicitor

Lo que puedes hacer:

Pedir un café o té.

Feature Clave: "Repetir Pedido". Si ya pediste antes, haz click en el botón "Repetir" del historial. Es vital para nuestros "Power Users".

Ver en tiempo real (recargando) si tu pedido fue tomado.

Provider (Quien entrega)
Ruta: /provider

Lo que puedes hacer:

Ver el "Marketplace" de pedidos disponibles (First-come, first-served).

Tomar un pedido (desaparece de la lista pública y se asigna a ti).

Marcar como entregado.


¡Cualquier duda me avisan! ✌️