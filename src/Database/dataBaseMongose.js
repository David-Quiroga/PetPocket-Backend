import mongoose from 'mongoose';
import { MONGODB_URI } from '../keys.js';
// 5. Exportar modelos (ajusta las rutas según tu estructura
import clienteModel from '../models/mongo/cliente.js';
import citaModel from '../models/mongo/cita.js';
import mascotaModel from '../models/mongo/mascota.js';
import feedBackModel from '../models/mongo/feedback.js';
import pageModel from '../models/mongo/page.js';  
import productoModel from '../models/mongo/producto.js';
import propietarioModel from '../models/mongo/propietario.js';
import servicioModel from '../models/mongo/servicio.js';
import reservaModel from '../models/mongo/reserva.js';

// 1. Configuración de eventos de conexión
mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose conectado a MongoDB en:', mongoose.connection.host);
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Error de conexión en Mongoose:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  Mongoose desconectado de MongoDB');
});

// 2. Función de conexión mejorada
const connectDB = async () => {
  try {
    // Codificar contraseña por si contiene caracteres especiales
    const encodedPassword = encodeURIComponent('0987021692@Rj');
    const connectionURI = MONGODB_URI.replace('<PASSWORD>', encodedPassword);

    await mongoose.connect(connectionURI, {
      connectTimeoutMS: 10000, // 10 segundos de timeout
      socketTimeoutMS: 45000, // 45 segundos
    });
    
    console.log('🚀 MongoDB conectado correctamente');
  } catch (err) {
    console.error('💥 FALLA CRÍTICA en conexión MongoDB:', err.message);
    process.exit(1); // Termina la aplicación con error
  }
};

// 3. Manejo de cierre de aplicación
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('🔌 Conexión a MongoDB cerrada por terminación de la app');
    process.exit(0);
  } catch (err) {
    console.error('Error al cerrar conexión MongoDB:', err);
    process.exit(1);
  }
});

// 4. Iniciar conexión inmediatamente (como solicitaste)
connectDB();


const modules = {
  clienteModel,
  citaModel,
  mascotaModel,
  feedBackModel,
  pageModel,  
  productoModel,
  propietarioModel,
  servicioModel,
  reservaModel 
}


// 6. Exportar todos los modelos
export default modules;
