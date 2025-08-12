import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcrypt";
import { error } from "console";

const prisma = new PrismaClient();

//Get All Users

export async function getAllUsers(req:Request, res:Response){

    //Se tivermos varios utilizadores, para admins sera melhor paginar os resultados
    /**
     * 
     * No prisma a paginação é feita com os campos Skip e take
     * Ou seja salta x resultados e leva outros x
     * Aqui termos de definir a nossa pagina, o limit que será o nosso take ou seja quantos 
     * utilizadores termos por pagina, e o skip ou seja os utilizadores da pagina anterior
     * ou seja se tivermos na pagina 2, iremos saltar 10 utilizadores
     * (2 -1) * 10  = 1 * 10 = 10
     * 
     */


    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    try {
        const users = await prisma.user.findMany({
            skip,
            take: limit,
            select: {id:true, name:true,email:true,created_at:true}
        })
        res.json(users);
    } catch (error: any) {
        res.status(500).json({error: error.message});
    }
}

// Obter utilizador por ID
export async function getUserById(req: Request, res: Response) {
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
    }
    try {
        const user = await prisma.user.findUnique({
            where: { id },
            select: { id: true, name: true, email: true, created_at: true }
        });
        if (!user) return res.status(404).json({ error: "Utilizador não encontrado" });
        res.json(user);
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
}



// Create User
//Testado
export async function createUser(req:Request, res:Response) {

    const expression: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

    //Definir os campos e retirar quais quer espaços
    const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : undefined;
    const password = typeof req.body.password === "string" ? req.body.password : undefined;


    if(!email || !password){
        return res.status(400).json({error: 'Email e password são obrigatorios'});
    }
    
    if(!expression.test(req.body.email))
        return res.status(400).json({ error: 'O email introduzido não tem um formato válido. Por favor, verifica e tenta novamente.' });


    try {
        //10 Rondas de encriptação, normal para desenvolvimento
        const passwordHash = await bcrypt.hash(password,10);

        const user = await prisma.user.create({
            data: {name,email, password: passwordHash}
        })
        res.status(201).json(user);
    } catch (error: any) {
            res.status(400).json({ error: error.message });

    }

}


export async function updateUser(req: Request, res: Response){
    const { id } = req.params;
    if (!id) {
        return res.status(400).json({ error: "ID é obrigatório" });
    }

    const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : undefined;


    try {
        //Lembrar que pedidos e funcções do prisma precisam do await antes
        const user = await prisma.user.update({
            where: {id},
            data: {name,email}
        });
        res.json(user);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}

export async function deleteUser(req:Request, res: Response) {
    const {id} = req.params;
    if(!id)
        return res.status(400).json({error: "ID é obrigatório"});

    try {
        await prisma.user.delete({where: {id}});
        res.json({message: "Utilizador eliminado como sucesso!"});
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }

}