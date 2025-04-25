import { NUMBER } from "sequelize";
import PadraoLugar from "../models/PadraoLugarModel.js";
import Sala from "../models/SalaModel.js";
import Sessao from "../models/SessaoModel.js";
import UsuarioSessao from "../models/UsuarioSessaoModel.js";


const get = async (req , res) => {
    
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
            const response = await Sessao.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados encontrados',
                data: response,
            });
        }

        const response = await Sessao.findOne({
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
            dataInicio,
            dataFinal,
            preco,
            idSala,
            idFilme
        } = corpo;

        const sala = await Sala.findByPk(idSala);
        
        const lugaresData = await PadraoLugar.findOne({
            where: { id: sala.idPadraoLugares }
        });

        if (!lugaresData) {
            throw new Error('Configuração de lugares não encontrada');
        }

        const response = await Sessao.create({
            lugares: lugaresData.lugares,
            dataInicio,
            dataFinal,
            preco,
            idFilme,
            idSala
        });

        return response;

    } catch (error) {
        throw new Error(error.message);
    }
};

const update = async (corpo , id) => {

    try {
        
        const response = await Sessao.findOne({
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
        
        const response = await Sessao.findOne({
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


const getFeedback = async (req , res) => {
    
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){

            return res.status(200).send({
                message: 'Informe o id',
            });
        }


        const comprasAssentos = await UsuarioSessao.findAll({
            
            where: {
                idSessao: id,
                status: 'Comprado',
            },
            attributes: ['valorAtual'],
           
        });
        const cancelAssentos = await UsuarioSessao.findAll({
            
            where: {
                idSessao: id,
                status: 'Cancelado',
            },
            attributes: ['valorAtual'],
           
        });

        const qtdComprada = comprasAssentos.length;
        const qtdCancelada = cancelAssentos.length;

        const valorCompras = comprasAssentos.reduce((acumulador, index) => acumulador + Number(index.valorAtual), 0);
        const valorCancel = cancelAssentos.reduce((acumulador, index) => acumulador + Number(index.valorAtual), 0);



        return res.status(200).send({
            message: 'Relatório',
            data: {
                vendas: {
                    valor: valorCompras,
                    quantidade: qtdComprada
                  },
                  cancelamentos: {
                    valor: valorCancel,
                    quantidade: qtdCancelada
                  }
            }
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    }
};


export default {
    get, 
    persist,
    destroy,
    getFeedback,
}