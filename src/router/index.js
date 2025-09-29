import express from "express";
import {mostrarMensaje} from '../controller/index.controller.js';


const router = express.Router();

router.get('/', mostrarMensaje)


export default router