import Usuario from "../models/UsuarioModel.js";
import bcrypt from "bcrypt";
import { response } from "express";
import jwt from "jsonwebtoken";
import Cargo from "../models/CargoModel.js";
import sendMail from '../utils/email.js';
import { generateResetToken } from '../utils/passwordService.js'


const get = async (req , res) => {
    
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
            const response = await Usuario.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados encontrados',
                data: response,
            });
        }

        const response = await Usuario.findOne({
            where: {
                id: id
            }
        });

        if(!response){
            return res.status(404).send('Nao achou');
        }

        return res.status(200).send({
            message: 'Dados encontrados',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const create = async (corpo) => {
    try {
        const {
            nome,
            email,
            cpf,
            password,
            estudante,
            idCargo,
        } = corpo;

        const verificaEmail = await Usuario.findOne({
            where:{
                email,
            }
        });

        if(verificaEmail){
            return res.status(400).send({
                message: 'Já existe um usuario com esse email.',
            });
        };

        const passwordHash = await bcrypt.hash(password, 10);
        console.log(passwordHash);

        const response = await Usuario.create({
            nome,
            email,
            cpf,
            passwordHash,
            estudante,
            idCargo,
        });

        return response;

    } catch (error) {
        throw new Error (error.message);
    }
};

const update = async (corpo , id) => {

    try {
        
        const response = await Usuario.findOne({
            where:{
                id
            }
        });

        if(!response){
            throw new Error ('Nao achou');
        }

        Object.keys(corpo).forEach((item)=> response[item] = corpo[item]);
        await response.save();

        return response;

    } catch (error) {
        throw new Error (error.message);
    }
};

const persist = async (req , res ) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
            const response = await create (req.body);
            return res.status(200).send({
                message: 'Criado com sucesso',
                data: response,
            });
        };

        const response = await update (req.body, id);
        return res.status(201).send({
            message: 'atualizado com sucesso',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    };
};

const destroy = async (req , res ) => {

    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    try {
        
        if(!id){
            return res.status(400).send('Informa ae paezao');
        };
        
        const response = await Usuario.findOne({
            where: {
                id
            }
        });

        if(!response){
            throw res.status(400).send('Nao achou');
        };

        await response.destroy();

        return res.status(200).send({
            message: 'Registro excluido',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    };
};

const login = async (req , res) => {

    try {
        
        const {
            email,
            password,
        } = req.body;

        const user = await Usuario.findOne({
            where: {
                email,
            }
        });

        if(!user){
            return res.status(400).send({
                message: 'Usuário ou senha incorreto.',
            });
        };

        const comparacaoSenha = await bcrypt.compare(password, user.passwordHash);

        if(comparacaoSenha){

            const token = jwt.sign({

                idUsuario: user.id,
                nome: user.nome,
                email: user.email,
                idCargo: user.idCargo

            }, process.env.TOKEN_KEY, {expiresIn: '8h'});

            return res.status(200).send({
                message: 'Sucesso',
                response: token,
            });

        }else{
            return res.status(400).send({
                message: 'Usuário ou senha incorreto.',
            });
        };


    } catch (error) {
        
        throw new Error (error.message);

    }


};

const getDataByToken = async (req , res) => {

    try {
        const authHead = req.headers.authorization;

        if(!authHead){
            return res.status(400).send({
                message: 'Token errado ou nao informado',
            });
        }

        const token = authHead.split(' ')[1];

        if(!token){
            return res.status(400).send({
                message: 'Token errado ou nao informado',
            });
        }

        const user = jwt.verify(token, process.env.TOKEN_KEY);
        

        const usuario = await Usuario.findOne({
            where: {
                id: user.idUsuario
            },
            include: {
                model: Cargo,
                as: 'cargo',
                attributes: ['descricao'] 
            }
        });

        if(!usuario){
            return res.status(400).send({
                message: 'Usuario nao encontrado.',
            });
        };





        return res.status(200).send({
            data: {
                nome: usuario.nome,
                email: usuario.email,
                cargo: usuario.cargo.descricao
            }
        });



    } catch (error) {
        
        return res.status(500).send({
            message: 'Ocorreu um erro!'
        });

    }

};

const forgotPassword = async (req , res) => {
    const { email } = req.body;

    try {

        const user = await Usuario.findOne({
            where: {
                email
            }
        });

        if(!user){
            return res.status(404).send({
                message: 'E-mail sem usuario cadastrado!'
            });
        };

        const { token , expires } = generateResetToken();

        await user.update({

            resetToken: token,
            resetTokenExpire: expires,

        });

        const emailBody = `
            <h3>Olá ${user.nome},</h3>
            <p>Use o código abaixo para redefinir sua senha:</p>
            <p><strong>${token}</strong></p>
            <p>Este código expira em 30 minutos !!</p>
        `;

        await sendMail(user.email, emailBody, 'Recuperacao de senha');

        return res.status(200).send({
            message: 'E-mail enviado com sucesso'
          });
        
    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};

const resetPassword = async (req , res) =>{
    const { token, newPassword } = req.body;

    try {
        if(!token || !newPassword){
            return res.status(400).send({
                message: 'Token ou senha não informados.'
            });
        };

        const user = await Usuario.findOne({
            where: {
                resetToken: token,
            }
        });

        if(!user){
            return res.status(400).send({
                message: 'Token inválido ou não encontrado!'
            });
        };


        const currentTime = new Date();

        if(currentTime > user.resetTokenExpire){
            return res.status(400).send({
                message: 'O token de recuperacao expirou !!'
            });
        };

        const newPasswordHash = await bcrypt.hash(newPassword, 10);

        await user.update({
            passwordHash: newPasswordHash,
            resetToken: null,
            resetTokenExpire: null
        });


        return res.status(200).send({
            message: 'Senha atualizada com sucesso!'
        });


    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }

}



export default {
    get, 
    persist,
    destroy,
    login,
    getDataByToken,
    forgotPassword,
    resetPassword,
}