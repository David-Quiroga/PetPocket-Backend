import passport from 'passport'
import orm from '../Database/dataBase.orm.js'
import sql from '../Database/dataBase.sql.js'
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { descifrarDatos, cifrarDatos } from '../lib/encrypDates.js';
import { validationResult } from 'express-validator';

export const mostrarMensaje = async(req, res)=>{
     res.json('hola mundo');
}

export const registro = passport.authenticate("local.Signup", {
    successRedirect: "/closeSection",
    failureRedirect: "/registro",
    failureFlash: true,
    failureMessage: true
})

export const login = passport.authenticate("local.Signup", {
    successRedirect: "/ruta",
    failureRedirect: "/registro",
    failureFlash: true,
    failureMessage: true
})

export const CerrarSesion = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash("success", "Cerrada la Sesión con éxito.");
        res.redirect("/");
    });
};