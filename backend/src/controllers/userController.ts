import { Request, Response } from "express";
import { PrismaClient } from "../../generated/prisma";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

//Get All Users

export async function getAllUsers(req:Request, res:Response){
    try {
        const users = await prisma.user.findMany({
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

export async function createUser(req:Request, res:Response) {
    //Definir os campos e retirar quais quer espaços
    const name = typeof req.body.name === "string" ? req.body.name.trim() : undefined;
    const email = typeof req.body.email === "string" ? req.body.email.trim().toLowerCase() : undefined;
    const password = typeof req.body.password === "string" ? req.body.password : undefined;


    if(!email || !password){
        return res.status(400).json({error: 'Email e password são obrigatorios'});
    }

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
        const user = prisma.user.update({
            where: {id},
            data: {name,email}
        });
        res.json(user);
    } catch (error: any) {
        return res.status(400).json({ error: error.message });
    }
}