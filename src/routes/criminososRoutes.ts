import { Router } from "express";
import { validaToken } from "../middlewares/authMiddlewares.js";
import {obterCriminosos, RegistrarCriminoso, atualizarCriminoso,removerCriminoso} from '../controllers/criminososControllers.js'


const router = Router()

router.get('/criminosos', validaToken, obterCriminosos)

router.post('/criminosos', validaToken, RegistrarCriminoso)

router.put('/criminosos/:id', validaToken, atualizarCriminoso)

router.delete('/criminosos/:id', validaToken, removerCriminoso)

export default router