import type {Request,Response} from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from  'crypto'
import { validaErrors } from '../errors/validationErrors.js';


const prisma = new PrismaClient();

export const login = async (req: Request,res: Response) => {
    const {email,password} = req.body;

    try{
        const usuario = await prisma.usuarios.findUnique({
            where: {
                email,
            }
        })

        //Verifica se o usuario existe.
        if(!usuario)
        {
           return res.status(404).json({
                error: 'Usuario não encontrado. Credencias invalidas.'
            })
        }

        // Compara senha do usuario.
        const senhaMatch = await bcrypt.compare(password, usuario.password)

        if(!senhaMatch)
        {
            return res.status(401).json({
                error: 'Credencias invalidas.'
            })
        }

        //Criar token
        const token = jwt.sign({usuario:usuario.id}, process.env.JWT_SECRET as string, { expiresIn: '1h'})

        res.status(200).json({
            message: 'Login bem-sucedido',
            usuario: { id: usuario.id, name: usuario.name, email: usuario.email},
            token
        })
    }
    catch(error){
        res.status(500).json({
            error: 'Erro ao fazer login.'
        })
    }
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie('jwt');

    res.status(200).json({
        message: 'Sessão encerrada com sucesso.'
    })
}

export const esqueciSenha = async (req:Request, res: Response) => {
    try{
        const {email} = req.body;
        const usuario = await prisma.usuarios.findUnique({
            where:{
                email: email,
            }
        })

        if(!usuario){
            return res.status(200).json({
                message: 'Se um usuario com este e-mail for encontrado, um link de redefinição será enviado'
            })
        }

        const tokenRecuperacao = crypto.randomBytes(32).toString('hex');
        const dataExpiraToken = new Date()
        dataExpiraToken.setMinutes(dataExpiraToken.getMinutes() + 15)

        await prisma.usuarios.update({
            where:{email},
            data: {
                tokenRecuperacao,
                dataExpiraToken
            }
        })

        res.status(200).json({
            message: 'Se um usuario com este e-mail for encontrado, um link de redefinição será enviado'
        })
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            error: 'Erro no servidor'
        })
    }
}


export const resetarSenha =  async (req: Request, res: Response) => {
    try{
        const {email, tokenRecuperacao,newPassword} = req.body;

        const usuario = await prisma.usuarios.findUnique({
            where:{
                email,
                tokenRecuperacao
            }
        })
        if(!usuario)
        {
            return res.status(404).json({
                error: 'Usuario ou token invalido'
            })
        }

        if(!usuario.dataExpiraToken){
            return res.status(404).json({
                error: 'Token de recuperação invalido'
            })
        }
        
        if(usuario.dataExpiraToken < new Date())
        {
            await prisma.usuarios.update({
                where:{id:usuario.id},
                data:{
                    tokenRecuperacao: null,
                    dataExpiraToken: null
                }
            });
            return res.status(401).json({
                error: 'Token Expirado. Gere um novo.'
            })
        }

        const senhaHash = await bcrypt.hash(newPassword,10);

        await prisma.usuarios.update({
            where:{id:usuario.id},
            data:{
                password: senhaHash,
                tokenRecuperacao: null,
                dataExpiraToken: null
            }
        })

        res.status(200).json({
            messsage: 'Senha redefinida cmo sucesso!.'
        })


        
    }
    catch(error){
        console.log(error)
        res.status(500).json({
            error: 'Não foi possivel redefinir senha.'
        })
    }
    
}


export const consultaUsuarios = async (req: Request,res: Response) => {
    const {name} = req.query;
    try{
        const usuarios = await prisma.usuarios.findMany({
            where:{
                name:{
                    contains: name as string,
                    mode: 'insensitive'
                }
            }
        })
         if(!usuarios)
        {
            res.status(404).json({
                error: 'Usuario não encontrado'
            })
        }
        res.status(200).json(usuarios)
    }
    catch(error){
        res.status(500).json({
            errro: 'Erro ao buscar usuario.'
        })
    } 

}

export const consultaUsuartioPorId = async (req: Request,res: Response) => {
    const {id} = req.params;

    try{
        const usuarios = await prisma.usuarios.findFirst({
            where: {
                id: id as string
            }
        })
        if(!usuarios)
        {
            return res.status(404).json({
                error:'Usuario nao encontrado'
            })
        }
        res.status(200).json(usuarios)
    }
    catch(error){
        res.status(500).json({
            error: 'Erro ao buscar usuario.'
        })
    }
}

export const criarUsuario = async (req: Request,res: Response) => {
    const {name,email,password} = req.body;

    const errors = []

    if(!email){
        errors.push({
            message: 'O email é obrigatório',
            field: 'email'
        })
    }

    if(!password){
        errors.push({
            message: 'A senha é obrigatória',
            field: 'senha'
        })
    }

    if(errors.length > 0){
        throw new validaErrors(errors)
    }

    
    const senhaHash = await bcrypt.hash(password,10)

    const novoUsuario = await prisma.usuarios.create({
         data:{
            name,
            email,
            password: senhaHash,
        },
        select:{
            id:true,
            name: true,
            email: true
        }
    });
    res.status(201).json(novoUsuario);
}

export const atualizaUsuario = async (req: Request,res: Response) => {
    const {id} = req.params;
    const { name,email} = req.body;

    try{
        const updatedUsuario = await prisma.usuarios.update({
            where: {
                id: id as string
            },
            data: {
                name,
                email,
            }
        })
        res.status(200).json(updatedUsuario)
    }
    catch(error){
        res.status(404).json({
            error: 'Usuario não encontrado na atualização.'
        })
    }
}

export const deletarUsuario = async  (req: Request,res: Response) => {
    const {id} = req.params;

    try{
        const deletedUsuario = await prisma.usuarios.delete({
            where: {
                id: id as string
            }
        })
        res.status(200).json()
    }
    catch(error){
        res.status(404).json({
            error: 'Usuario não encontrado ou erro na exclusão.'
        })
    }
}