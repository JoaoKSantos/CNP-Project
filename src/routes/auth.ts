import {Router} from 'express';
import { validaToken } from '../middlewares/authMiddlewares.js';
import { login,consultaUsuarios,consultaUsuartioPorId,criarUsuario, atualizaUsuario,deletarUsuario, esqueciSenha, resetarSenha, logout } from '../controllers/authControllers.js';

const router = Router();

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Autentica um usuário e retorna um JWT.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login bem-sucedido. Retorna o token de acesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: O Token JWT de acesso (Bearer Token).
 *       401:
 *         description: Credenciais inválidas (email ou senha incorretos).
 */
router.post('/login', login)

/**
 * @swagger
 * /logout:
 *   post:
 *     summary: Encerra a sessão do usuário e limpa o token de autenticação (via cookie ou instrução ao cliente).
 *     tags: [Autenticação]
 *     responses:
 *       200:
 *         description: Sessão encerrada com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Sessão encerrada com sucesso.
 */
router.post('/logout', logout)

router.post('/esqueciSenha', esqueciSenha)

router.post('/resetarSenha', resetarSenha)

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Retorna os dados do perfil do usuário autenticado.
 *     tags: [Autenticação]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dados do perfil retornados com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                   description: Nome do usuário.
 *                 password:
 *                   type: string
 *                   description: Nome do usuário.
 *                 tokenRecuperacao:
 *                   type: string
 *                   description: Nome do usuário.
 *                 dataExpiraToken:
 *                   type: string
 *                   description: Nome do usuário.
 *       401:
 *         description: Não autorizado. Token faltando, inválido ou expirado.
 */
router.get('/usuarios', consultaUsuarios)

router.get('/usuarios/:id',consultaUsuartioPorId)

/**
 * @swagger
 * tags:
 *   - name: Autenticação
 *     description: Rotas de Registro, Login, Logout e Gestão de Sessão.
 */

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Registra um novo usuário no sistema.
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: O nome do usuário.
 *               email:
 *                 type: string
 *                 format: email
 *                 description: O email único do usuário.
 *               password:
 *                 type: string
 *                 format: password
 *                 description: A senha para o novo usuário.
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso. Retorna o ID do novo usuário.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID único do usuário.
 *                 name:  
 *                   type: string
 *                   description: Nome do usuario
 *                 email:
 *                   type: string
 *                   format: email
 *                   description: Email do usuario
 *                 password:
 *                   type: string
 *                   description: Senha do usuario
 *       400:
 *         description: Erro de validação. O email ou a senha estão faltando.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: './src/errors/validationErros.ts'
 */


router.post('/usuarios', criarUsuario)

router.patch('/usuarios/:id', atualizaUsuario)

router.delete('/usuarios/:id', deletarUsuario)

export default router;