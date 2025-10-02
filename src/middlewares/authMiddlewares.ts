import 'dotenv/config'
import jwt from 'jsonwebtoken'




// Middleware para proteger as rotas
export const validaToken = (req: any,res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]

    if(token == null){
        return res.status(401).json({
            error: 'Token não fornecido'
        })
    }
    jwt.verify(token,process.env.JWT_SECRET as string, (err: any, usuario: any) => {
        if(err){
            return res.status(403).json({
                error: 'Token inválido.',
            },console.log(err))
        }
        req.usuario = usuario
        next();
    })
}

