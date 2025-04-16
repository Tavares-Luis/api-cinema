import Filme from "../models/FIlmeModel";



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

const create = async (corpo) => {
    try {
        const {
            nome,
            descricao,
            autor,
            duracao,
        } = corpo;

        const response = await Filme.create({
            nome,
            descricao,
            autor,
            duracao,
        });

        return response;

    } catch (error) {
        throw new Error (error.message);
    }
};

const update = async (corpo , id) => {

    try {
        
        const response = await Filme.findOne({
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
            message: error.message
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
        
        const response = await Filme.findOne({
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

export default {
    get, 
    persist,
    destroy,
}