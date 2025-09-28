import orm from '../Database/dataBase.orm.js';
import sql from '../Database/dataBase.sql.js';
import mongo from '../Database/dataBaseMongose.js';
import { cifrarDatos, descifrarDatos } from '../lib/encrypDates.js';

// Función para descifrar de forma segura
const descifrarSeguro = (dato) => {
    try {
        return dato ? descifrarDatos(dato) : '';
    } catch (error) {
        console.error('Error al descifrar:', error);
        return '';
    }
};

// Mostrar todos los servicios activos
export const mostrarServicios = async (req, res) => {
    try {
        const [listaServicios] = await sql.promise().query(`
            SELECT * FROM servicios 
            WHERE estadoServicio = 'activo'
            ORDER BY createServicio DESC
        `);

        const serviciosCompletos = await Promise.all(
            listaServicios.map(async (servicio) => {
                const servicioMongo = await mongo.servicioModel.findOne({ 
                    idServicioSql: servicio.idServicio.toString()
                });

                return {
                    ...servicio,
                    nombreServicio: descifrarSeguro(servicio.nombreServicio),
                    descripcionServicio: descifrarSeguro(servicio.descripcionServicio),
                    detallesMongo: servicioMongo ? {
                        descripcionExtendida: servicioMongo.descripcionExtendida,
                        requisitos: servicioMongo.requisitos,
                        duracionMinutos: servicioMongo.duracionMinutos,
                        equipoNecesario: servicioMongo.equipoNecesario,
                        instruccionesPrevias: servicioMongo.instruccionesPrevias,
                        instruccionesPosteriores: servicioMongo.instruccionesPosteriores,
                        etiquetas: servicioMongo.etiquetas,
                        destacado: servicioMongo.destacado,
                        imagenUrl: servicioMongo.imagenUrl
                    } : null
                };
            })
        );

        return res.json(serviciosCompletos);
    } catch (error) {
        console.error('Error al mostrar servicios:', error);
        return res.status(500).json({ message: 'Error al obtener los servicios', error: error.message });
    }
};

// Crear nuevo servicio
export const crearServicio = async (req, res) => {
    try {
        const { 
            nombreServicio, descripcionServicio, precioServicio,
            descripcionExtendida, requisitos, duracionMinutos, equipoNecesario,
            instruccionesPrevias, instruccionesPosteriores, etiquetas, destacado, imagenUrl
        } = req.body;

        if (!nombreServicio || !descripcionServicio || precioServicio === undefined) {
            return res.status(400).json({ message: 'Nombre, descripción y precio son obligatorios' });
        }

        const nuevoServicio = await orm.servicio.create({
            nombreServicio: cifrarDatos(nombreServicio),
            descripcionServicio: cifrarDatos(descripcionServicio),
            precioServicio: precioServicio,
            estadoServicio: 'activo',
            createServicio: new Date().toLocaleString(),
        });

        await mongo.servicioModel.create({
            idServicioSql: nuevoServicio.idServicio.toString(),
            descripcionExtendida: descripcionExtendida || '',
            requisitos: requisitos || [],
            duracionMinutos: duracionMinutos || 60,
            equipoNecesario: equipoNecesario || [],
            instruccionesPrevias: instruccionesPrevias || '',
            instruccionesPosteriores: instruccionesPosteriores || '',
            etiquetas: etiquetas || [],
            destacado: destacado || false,
            imagenUrl: imagenUrl || ''
        });

        return res.status(201).json({ 
            message: 'Servicio creado exitosamente',
            idServicio: nuevoServicio.idServicio
        });

    } catch (error) {
        console.error('Error al crear servicio:', error);
        return res.status(500).json({ 
            message: 'Error al crear el servicio', 
            error: error.message 
        });
    }
};

// Actualizar servicio
export const actualizarServicio = async (req, res) => {
    try {
        const { idServicio } = req.params; // Suponiendo que el ID se pasa como parámetro en la URL
        const { 
            nombreServicio, descripcionServicio, precioServicio,
            descripcionExtendida, requisitos, duracionMinutos, equipoNecesario,
            instruccionesPrevias, instruccionesPosteriores, etiquetas, destacado, imagenUrl
        } = req.body;

        if (!nombreServicio || !descripcionServicio || precioServicio === undefined) {
            return res.status(400).json({ message: 'Nombre, descripción y precio son obligatorios' });
        }

        // Actualizar en la base de datos SQL
        await orm.servicio.update({
            nombreServicio: cifrarDatos(nombreServicio),
            descripcionServicio: cifrarDatos(descripcionServicio),
            precioServicio: precioServicio,
        }, {
            where: { idServicio }
        });

        // Actualizar en la base de datos MongoDB
        await mongo.servicioModel.updateOne(
            { idServicioSql: idServicio },
            {
                descripcionExtendida: descripcionExtendida || '',
                requisitos: requisitos || [],
                duracionMinutos: duracionMinutos || 60,
                equipoNecesario: equipoNecesario || [],
                instruccionesPrevias: instruccionesPrevias || '',
                instruccionesPosteriores: instruccionesPosteriores || '',
                etiquetas: etiquetas || [],
                destacado: destacado || false,
                imagenUrl: imagenUrl || ''
            }
        );

        return res.json({ message: 'Servicio actualizado exitosamente' });

    } catch (error) {
        console.error('Error al actualizar servicio:', error);
        return res.status(500).json({ 
            message: 'Error al actualizar el servicio', 
            error: error.message 
        });
    }
};


// Eliminar servicio (cambiar estado a inactivo)
export const eliminarServicio = async (req, res) => {
    try {
        const { idServicio } = req.params; // Suponiendo que el ID se pasa como parámetro en la URL

        // Marcar como inactivo en SQL
        await orm.servicio.update({
            estadoServicio: 'inactivo',
            updateServicio: new Date().toLocaleString(),
        }, {
            where: { idServicio }
        });

        // Marcar como inactivo en MongoDB
        await mongo.servicioModel.updateOne(
            { idServicioSql: idServicio },
            { estadoServicio: 'inactivo' }
        );

        return res.json({ message: 'Servicio eliminado exitosamente' });

    } catch (error) {
        console.error('Error al eliminar servicio:', error);
        return res.status(500).json({ 
            message: 'Error al eliminar el servicio', 
            error: error.message 
        });
    }
};


