// backend/server.js
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

//  CONFIG
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || 'proyecto_db';

//  CORS 
  // Allows requests from production and local dev origins.
  // Regex pattern covers all Vercel preview deployments automatically.
  // This API is read-only.
app.use(cors({
  origin: [
    'https://zero-trail.vercel.app',
    /\.vercel\.app$/,
    'http://localhost:5173',
    'http://localhost:3000'
  ],
  methods: ['GET'],
  credentials: true
}));

app.use(express.json());

  // Connects using dbName option instead of embedding it in the URI.
mongoose.connect(DB_URI, { dbName: DB_NAME })
  .then(() => console.log(`connected to db ${DB_NAME}`))
  .catch(err => console.error('connection error:', err.message));

// SCHEMA and MODEL 
  // Manufacturer and Model are indexed to speed up the search tool in GET /items.
  // No write endpoints exist, so no validation rules are enforced at schema level.
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

// ROUTES

  // Health check — confirms the server is running.
app.get('/', (req, res) => {
  res.send(' backend server is running correctly');
});

  // Returns a paginated, optionally filtered and sorted list of vehicles.
  // Query params: busqueda (string), sortField, sortOrder ('asc'|'desc'), page, limit.
  // Special regex characters in busqueda are escaped before use to prevent injection.
  // countDocuments and find run in parallel to reduce total response time.
  // .lean() returns plain JS objects instead of Mongoose documents — faster serialization.
app.get('/items', async (req, res) => {
  try {
    const { busqueda, sortField, sortOrder } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    let filtro = {};
    if (busqueda) {
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
      sortObj = { createdAt: -1 }; // Default: newest first
    }

    const [items, totalItems] = await Promise.all([
      Item.find(filtro).sort(sortObj).skip(skip).limit(limit).lean(),
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

  // Groups all records by Manufacturer + Model, nesting each year as a child entry.
  // allowDiskUse enables the aggregation to spill to disk if the result set grows large.
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
    ]).allowDiskUse(true);

    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Error en la agregación' });
  }
});

// --- SERVER START ---
  // Binds to 0.0.0.0 to accept connections on all network interfaces.
app.listen(PORT, '0.0.0.0', () => {
  console.log(`📡 Servidor listo en puerto ${PORT}`);
});