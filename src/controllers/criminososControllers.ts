import type { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { validaErrors } from "../errors/validationErrors.js";


const prisma = new PrismaClient();

export const obterCriminosos = async (req: Request, res: Response) => {
    const criminosos = await prisma.criminosos.findMany()

    res.status(200).json(criminosos)
}

export const RegistrarCriminoso = async (req: Request,res: Response) =>  {
    const {cpf,nome,sobrenome,situacao,antecedentes} = req.body

    const errors = []

    if(!cpf){
        errors.push({
            message: 'CPF é um campo obrigatório.',
            field: 'cpf'
        })
    }

    if(!nome){
        errors.push({
            message: 'Nome é um campo obrigatório.',
            field: 'nome'
        })
    }

    if(!sobrenome){
        errors.push({
            message: 'Sobrenome é um campo obrigatório.',
            field: 'sobrenome'
        })
    }

    if(!situacao){
        errors.push({
            message: 'Situação é um campo obrigatório.',
            field: 'situacao'
        })
    }

    if(!antecedentes){
        errors.push({
            message: 'Antecedentes é um campo obrigatório.',
            field: 'antecedentes'
        })
    }

     if(errors.length > 0){
        throw new validaErrors(errors)
    }

    const novoCriminoso = await prisma.criminosos.create({
        data: {
            cpf,
            nome,
            sobrenome,
            situacao,
            antecedentes
        }
    })
    res.status(201).json(novoCriminoso)
}

export const atualizarCriminoso = async (req:Request, res: Response) => {
    const {id} = req.params;
    const{cpf,nome,sobrenome,situacao,antecedentes} = req.body;

    const errors = []

    if(!cpf){
        errors.push({
            message: 'CPF é um campo obrigatório.',
            field: 'cpf'
        })
    }

    if(!nome){
        errors.push({
            message: 'Nome é um campo obrigatório.',
            field: 'nome'
        })
    }

    if(!sobrenome){
        errors.push({
            message: 'Sobrenome é um campo obrigatório.',
            field: 'sobrenome'
        })
    }

    if(!situacao){
        errors.push({
            message: 'Situação é um campo obrigatório.',
            field: 'situacao'
        })
    }

    if(!antecedentes){
        errors.push({
            message: 'Antecednetes é um campo obrigatório.',
            field: 'antecedentes'
        })
    }

    if(errors.length > 0){
        throw new validaErrors(errors)
    }

    const updatedCriminoso = await prisma.criminosos.update({
        where:{id: id as string},
        data:{
            cpf,
            nome,
            sobrenome,
            situacao,
            antecedentes
        }
    })
    res.status(200).json(updatedCriminoso)
}

export const removerCriminoso = async (req: Request, res: Response) => {
    const {id} = req.params

    const errors = []

    if(!id){
        errors.push({
            message: 'Id obrigatório na requisição.',
            field: 'id'
        })
    }

    if(errors.length > 0){
        throw new validaErrors(errors)
    }

    await prisma.criminosos.delete({
        where: {id: id as string}
    })
    res.status(200).json('Criminoso deletado com sucesso!.')
}