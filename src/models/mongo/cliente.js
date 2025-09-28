import mongoose from 'mongoose';

const clienteSchema = new mongoose.Schema({
    direccionCliente:String,
    telefonoCliente:String,
    emailCliente:String,
    tipoCliente: String,
    idClienteSql: String,
})

const cliente = mongoose.model('clientes', clienteSchema)

export default cliente 