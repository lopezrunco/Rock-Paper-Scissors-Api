# API REST con el framework Express

## Instrucciones

Crear archivo .env con variables de entorno

```bash
PORT=3000
JWT_KEY=8765tghj67t65gsbn5r65twsdfbr67633wfv
DB_HOST=localhost
DB_PORT=3306
DB_NAME=rpsgame
DB_USER=root
DB_PASSWORD=7623g7844erfe573wvb65
```

```bash
# Instalar dependencias
npm i

# Insertar datos de prueba
npm run seed

# Iniciar API
npm start
```

## Lógica base para definir ganador
Expandible añadiendo mas elementos al array, respetando los campos "id" y "losesTo"
```bash
[{ "id": 1, "name": "rock", "losesTo": 2 },
{ "id": 2, "name": "paper", "losesTo": 3 },
{ "id": 3, "name": "scissors", "losesTo": 1 }]
```