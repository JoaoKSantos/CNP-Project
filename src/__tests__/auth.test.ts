import request from 'supertest';
import {app} from '../server.js';
import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient();

describe('Auth Endpoints', () => {
  const TEST_USER_EMAIL = 'teste@email.com'
  let usuarioTesteId: string;

  // --- PREPARAÇÃO E LIMPEZA ---
  // Roda antes de todos os testes para limpar o usuário de teste
  beforeAll(async () => {
    await prisma.usuarios.deleteMany({ where: { email: TEST_USER_EMAIL } });
  });

  // Roda após todos os testes para garantir que o banco esteja limpo
  afterAll(async () => {
    await prisma.usuarios.deleteMany({ where: { email: TEST_USER_EMAIL } });
    await prisma.usuarios.deleteMany({ where: { email: "teste2-updated@email.com" } });
    await prisma.usuarios.deleteMany({ where: { email: "teste2@email.com" } });
  });
  // -----------------------------

  // Teste 1: Falha de Validação (Password Ausente)
  it('should return 400 Bad Request if password is missing', async () => {
    const response = await request(app)
      .post('/api/usuarios')
      .send({
        email: TEST_USER_EMAIL,
        //password: "passowrd123"
      })
      .expect(400)

    expect(response.body.type).toBe('validaErrors');
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0].field).toBe('senha');
  });

  // Teste 2: Falha de Validação (Email Ausente)
  it('should return 400 Bad Request if email is missing', async () => {
    const response = await request(app)
      .post('/api/usuarios') // Use o endpoint correto para registro
      .send({
        // email: 'teste@exemplo.com', // O email está faltando propositalmente
        password: 'password123',
      })
      .expect(400); // Esperamos um status 400

    // Verificamos se o corpo da resposta está formatado corretamente pelo Custom Error
    expect(response.body.type).toBe('validaErrors');
    expect(response.body.errors).toBeInstanceOf(Array);
    expect(response.body.errors[0].field).toBe('email');
  });

  // Teste 2: Registro bem-sucedido
  it('should return 201 Created for a successful registration', async () => {
    const response = await request(app)
      .post('/api/usuarios') // Use seu endpoint correto
      .send({
        name: "Teste",
        email: TEST_USER_EMAIL, 
        password: 'password123',
      })
      .expect(201); 

    // O corpo da resposta deve ter um ID de usuário
    expect(response.body).toHaveProperty('id');
    //O corpo da resposta deve ter um nome
    expect(response.body).toHaveProperty('name');
    // email
    expect(response.body).toHaveProperty('email');
    // E nunca deve ter a senha
    expect(response.body).not.toHaveProperty('password');
    
    // Verificamos se o usuário realmente foi criado no banco
    const createdUser = await prisma.usuarios.findUnique({ where: { email: TEST_USER_EMAIL } });
    expect(createdUser).not.toBeNull();
  });

  //Teste 3: Atualização bem-sucedida
  it('should return 200 for a successful update', async ()=> {
    const usuarioTeste = await prisma.usuarios.create({
      data:{
        name:"Teste",
        email: "teste2@email.com",
        password: "password123"
      }
    });

    const response = await request(app)
      .patch(`/api/usuarios/${usuarioTeste.id}`)
      .send({
        name: 'Teste-updated',
        email: "teste2-updated@email.com",
        password: "password123-updated"
      })
      .expect(200)

    expect(response.body).toHaveProperty('id', usuarioTeste.id);
    expect(response.body).toHaveProperty('name', 'Teste-updated')
    expect(response.body).toHaveProperty('email', "teste2-updated@email.com")
    expect(response.body).not.toHaveProperty('password', "password123-updated")
  })
});