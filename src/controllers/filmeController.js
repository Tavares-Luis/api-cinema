import fileUpload from "express-fileupload";
import Filme from "../models/FilmeModel.js";
import uploadFile from "../utils/uploadFile.js";
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const get = async (req , res) => {
    
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
            const response = await Filme.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados encontrados',
                data: response,
            });
        }

        const response = await Filme.findOne({
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

const create = async (req) => {
    try {
        const { 
            nome, 
            descricao, 
            autor, 
            duracao, 
        } = req.body;

        const response = await Filme.create({
            nome,
            descricao,
            autor,
            duracao,
        });

        if (req.files && req.files.imagemCartaz) {
            const file = req.files.imagemCartaz;
            if (!file.mimetype.startsWith('image/')) {
                throw new Error('Apenas imagens são arquivos válidos!');
            }

            const resultUpload = await uploadFile(file, {
                id: response.id,
                tipo: 'image',
                tabela: 'filmes',
            });
            console.log("//");
            console.log(resultUpload);

            if (resultUpload.type === 'success') {
                await response.update({
                    imagemCartaz: resultUpload.relativePath,
                });
            } else {
                throw new Error('Erro no upload da imagem: ' + resultUpload.message);
            }
        }
        return response; 
    } catch (error) {
        throw new Error(error.message); 

    }
};

const update = async (req, id) => {
    try {
        const __dirname = dirname(fileURLToPath(import.meta.url));

        const response = await Filme.findOne({ where: { id } });

        if (!response) {
            throw new Error('Filme não encontrado');
        }

        if (req.body && typeof req.body === 'object') {
            Object.keys(req.body).forEach((item) => {
                response[item] = req.body[item];
            });
        }
        
        if (req.files && req.files.imagemCartaz) {
            const file = req.files.imagemCartaz;
            
            if (!file.mimetype.startsWith('image/')) {
                throw new Error('Apenas imagens são arquivos válidos!');
            }
            
            if (response.imagemCartaz) {
                const oldPath = path.join(__dirname, '..','..', 'public', response.imagemCartaz);
                
                try {
                    await fs.unlink(oldPath);
                    console.log('Arquivo antigo excluído com sucesso');
                } catch (err) {
                    throw new Error('Erro ao excluir o arquivo antigo!');
                }
            }
            
            const resultUpload = await uploadFile(file, {
                id: response.id,
                tipo: 'image',
                tabela: 'filmes',
            });
            
            if (resultUpload.type === 'success') {
                await response.update({
                    imagemCartaz: resultUpload.relativePath,
                });
            } else {
                throw new Error('Erro no upload da imagem');
            }
        }
        await response.save();

        return response; 
    } catch (error) {
        throw new Error(error.message);
    }
};

const persist = async (req , res ) => {
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
            const response = await create (req, res);
            return res.status(200).send({
                message: 'Criado com sucesso',
                data: response,
            });
        };

        const response = await update (req, id, res);
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
        
        const __dirname = dirname(fileURLToPath(import.meta.url));

        if(!id){
            return res.status(400).send('Informa ae paezao');
        };
        
        const response = await Filme.findOne({
            where: {
                id
            }
        });

        if(!response){
            throw res.status(400).send('Nao achou');
        };

        if (response.imagemCartaz) {
            const oldPath = path.join(__dirname, '..', '..', 'public', response.imagemCartaz);

            try {
                await fs.unlink(oldPath);
                console.log('Arquivo antigo excluído com sucesso');
            } catch (err) {
                throw new Error('Erro ao excluir o arquivo antigo!');
            }
        }
        
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

export default {
    get, 
    persist,
    destroy,
}