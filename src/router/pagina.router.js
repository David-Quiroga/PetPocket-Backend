import express from "express";
import { mostrarPagina, mandarPagina } from '../controller/pagina.controller.js';

const router = express.Router();

router.get('/lista', mostrarPagina)
router.post('/crear', mandarPagina)

export default router