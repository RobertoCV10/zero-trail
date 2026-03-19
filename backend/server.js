const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

// --- CONFIGURACIÓN ---
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'proyecto_db';

// --- MIDDLEWARE ---
app.use(cors({
  origin: [
    'https://tu-proyecto.vercel.app', // <--- REEMPLAZA CON TU URL DE VERCEL
    'http://localhost:5173',          // Para pruebas locales con Vite
    'http://localhost:3000'           // Para pruebas locales tradicionales
  ],
  methods: ['GET'], // Solo permitimos lectura para mayor seguridad
  credentials: true
}));

app.use(express.json());

// Conexión optimizada
mongoose.connect(DB_URI, { dbName: DB_NAME })
  .then(() => console.log(`✅ Conectado a la base de datos: ${DB_NAME}`))
  .catch(err => console.error('❌ Error de conexión:', err.message));

// --- ESQUEMA Y MODELO (Optimizado para Solo Lectura) ---
const itemSchema = new mongoose.Schema({
  Manufacturer: { type: String, index: true },
  Model: { type: String, index: true },
  Year: Number,
  Battery_Type: String,
  Battery_Capacity_kWh: Number,
  Range_km: Number,
  Charging_Type: String,
  Charge_Time_hr: Number,
  Price_USD: Number,
  Color: String,
  Country_of_Manufacture: String,
  Autonomous_Level: Number,
  CO2_Emissions_g_per_km: Number,
  Safety_Rating: Number,
  Units_Sold_2024: Number,
  Warranty_Years: Number,
}, { timestamps: true });

const Item = mongoose.model('Item', itemSchema);

// --- RUTAS / ENDPOINTS ---

app.get('/', (req, res) => {
  res.send('🚀 Backend de Autos Eléctricos (Producción) funcionando');
});

// 2. Obtener items con filtros y paginación (Optimizado con .lean())
app.get('/items', async (req, res) => {
  try {
    const { busqueda, sortField, sortOrder } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filtro = {};
    if (busqueda) {
      // Escapamos caracteres especiales para evitar errores en el Regex
      const safeSearch = busqueda.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filtro.$or = [
        { Manufacturer: { $regex: safeSearch, $options: 'i' } },
        { Model: { $regex: safeSearch, $options: 'i' } }
      ];
    }

    let sortObj = {};
    if (sortField) {
      sortObj[sortField] = sortOrder === 'asc' ? 1 : -1;
    } else {
      sortObj = { createdAt: -1 }; // Orden por defecto
    }

    // Ejecutamos búsqueda y conteo en paralelo para mejorar el tiempo de respuesta
    const [items, totalItems] = await Promise.all([
      Item.find(filtro)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .lean(), // <--- Convierte a JSON puro (mucho más rápido)
      Item.countDocuments(filtro)
    ]);

    res.json({
      items,
      currentPage: page,
      totalPages: Math.ceil(totalItems / limit),
      totalItems,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener los datos' });
  }
});

// 3. Agrupación (Optimizado)
app.get('/api/grouped-items', async (req, res) => {
  try {
    const grouped = await Item.aggregate([
      {
        $group: {
          _id: { Manufacturer: "$Manufacturer", Model: "$Model" },
          years: { $push: "$$ROOT" }
        }
      },
      {
        $project: {
          Manufacturer: "$_id.Manufacturer",
          Model: "$_id.Model",
          years: 1,
          _id: 0
        }
      }
    ]).allowDiskUse(true); // Útil si la base crece mucho
    
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Error en la agregación' });
  }
});

// --- INICIO DEL SERVIDOR ---
app.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 Servidor listo en puerto ${PORT}`);
});

