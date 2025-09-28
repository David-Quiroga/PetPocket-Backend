import express from 'express';

import { 
    mostrarClientes, 
    crearCliente, 
    actualizarCliente, 
    eliminarCliente 
} from '../controller/cliente.controller.js';


const router = express.Router();


// Obtener todos los clientes
router.get('/lista', mostrarClientes);

// Crear nuevo cliente
router.post('/crear', crearCliente);

// Actualizar un cliente existente
router.put('/actualizar/:id', actualizarCliente);

// Eliminar (desactivar) un cliente
router.delete('/eliminar/:id', eliminarCliente);

export default router;
 