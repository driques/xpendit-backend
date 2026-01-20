<p align="center">
  <img src="https://img.clerk.com/eyJ0eXBlIjoicHJveHkiLCJzcmMiOiJodHRwczovL2ltYWdlcy5jbGVyay5kZXYvdXBsb2FkZWQvaW1nXzM0a2R0Y3NKVEgyY2JhNGh1U1REZThKZnFySiJ9?width=200" width="120" alt="Xpendit Logo" />
</p>

# Xpendit Backend Challenge

Este repositorio contiene la solución al **Desafío Técnico de Xpendit**.  
Corresponde a una aplicación backend construida con **NestJS** y **TypeScript**, cuyo objetivo es **procesar, validar y clasificar gastos corporativos** a partir de distintas reglas de negocio.

La solución pone énfasis en **diseño limpio, testabilidad y separación de responsabilidades**, más que en el framework en sí.

---

## Arquitectura y Diseño

El diseño está fuertemente inspirado en **Clean Architecture** y **Domain-Driven Design (DDD)**.

### Principios Clave

- **Dominio Rico**  
  La lógica de negocio reside exclusivamente en la capa **Domain**, encapsulada en entidades, reglas y un motor de evaluación.  
  El dominio no depende de frameworks, I/O ni detalles de infraestructura.

- **Arquitectura Hexagonal (Puertos y Adaptadores)**  
  - El núcleo de la aplicación define **puertos** (interfaces) para interactuar con servicios externos.
  - Las integraciones (API de tipo de cambio, lectura de CSV, HTTP) se implementan como **adaptadores** en la capa de infraestructura.

- **Separación de Responsabilidades**
  - **Domain**: reglas de negocio puras y motor de evaluación.
  - **Application**: orquestación, casos de uso y procesamiento batch.
  - **Infra / API**: detalles técnicos (clientes HTTP, parsers CSV, controllers REST).

---

## Estrategia de Ramas (Contexto del Desafío)

El desarrollo se organizó en **ramas incrementales**, cada una correspondiente a una parte específica del desafío técnico:

1. **Part 1 – Dominio y Motor de Reglas**  
   - Implementación del `RuleEngine` y reglas de negocio.
   - Precedencia clara de estados: `REJECTED > PENDING > APPROVED`.
   - Tests unitarios del dominio.

2. **Part 2 – Integración con Exchange Rates**  
   - Integración real con la API de **Open Exchange Rates**.
   - Uso de un puerto (`ExchangeRateProvider`) para desacoplar la infraestructura.
   - Configuración mediante variables de entorno.

3. **Part 3 – Procesamiento Batch y CSV**  
   - Lectura y parseo de archivos CSV.
   - Enriquecimiento del contexto de evaluación.
   - Ejecución batch del motor de reglas.
   - Ejemplo funcional de ejecución (`main.ts`).

4. **Part 4 – API REST (Opcional / Extra)**  
   > Esta parte **no fue solicitada explícitamente en la prueba**.
   >
   > Se implementó como una extensión voluntaria para demostrar la flexibilidad de la arquitectura.

   - Exposición de un endpoint `POST` para subir archivos CSV.
   - Reutilización completa del dominio y la lógica batch.
   - Respuesta estructurada lista para ser consumida por un frontend.
   - Cliente frontend de demostración disponible en:  
      https://github.com/driques/xpendit-front/tree/master

## API Endpoints

La aplicación expone una API REST para procesar gastos. La URL base es `http://localhost:3000`.

### 1. Procesar Archivo por Defecto
Procesa el archivo `gastos_historicos.csv` ubicado en la raíz del proyecto.

- **URL:** `/expenses/process`
- **Método:** `GET`
- **Respuesta Exitosa:** `200 OK`
- **Ejemplo de Uso:**
  ```bash
  curl http://localhost:3000/expenses/process
  ```

### 2. Procesar Archivo Subido (Upload)
Permite subir un archivo CSV personalizado para ser procesado por el motor de reglas.

- **URL:** `/expenses/upload`
- **Método:** `POST`
- **Headers:** `Content-Type: multipart/form-data`
- **Body:**
  - `file`: Archivo CSV a procesar.
- **Respuesta Exitosa:** `201 Created`
- **Ejemplo de Uso:**
  ```bash
  curl -X POST -F "file=@/ruta/a/tu/archivo.csv" http://localhost:3000/expenses/upload
  ```

### Estructura de la Respuesta
Ambos endpoints devuelven un objeto JSON con el siguiente formato:

```json
{
  "stats": {
    "aprobados": 10,
    "pendientes": 5,
    "rechazados": 2,
    "anomalias": 1
  },
  "results": [
    {
      "expenseId": "exp-001",
      "status": "APROBADO",
      "alerts": []
    },
    {
      "expenseId": "exp-002",
      "status": "RECHAZADO",
      "alerts": ["EXPENSE_TOO_OLD"]
    }
  ]
}
```
---

## Manejo del Tiempo y Testabilidad

El cálculo de antigüedad de los gastos se realiza a través de un **puerto `Clock`**, evitando dependencias directas con el tiempo del sistema.

- `SystemClock`: implementación real (infraestructura).
- `FakeClock`: implementación usada en tests para lograr resultados deterministas.

Este enfoque permite tests confiables y reproducibles.

---

## Configuración (Variables de Entorno)

La aplicación requiere una API Key válida de **Open Exchange Rates** para la conversión de monedas.

Crear un archivo `.env` en la raíz del proyecto:
- PORT=3000
- OPEN_EXCHANGE_APP_ID=THIS-IS-A-TOKEN
- OPEN_EXCHANGE_BASE_URL=THIS-IS-EXCHANGE-URL

---

## Setup y Ejecución

### Prerrequisitos

Configurar las variables de entorno necesarias (puede usarse `.env.example` como referencia).

```bash
# Instalar dependencias
npm install
```
```bash
Ejecutar la Aplicación
# Modo desarrollo
npm run start
```

## Tests
El proyecto incluye tests unitarios para validar:
reglas de negocio
precedencia del motor
integraciones externas mockeadas
```bash
# Ejecutar tests
npm run test
```
