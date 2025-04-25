import { where } from "sequelize";
import Sessao from "../models/SessaoModel.js";
import Usuario from "../models/UsuarioModel.js";
import UsuarioSessao from "../models/UsuarioSessaoModel.js";
import salaController from "./salaController.js";
import Filme from "../models/FilmeModel.js";
import Sala from "../models/SalaModel.js";
import moment from 'moment-timezone';


const get = async (req , res) => {
    
    try {
        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
            const response = await UsuarioSessao.findAll({
                order: [['id', 'desc']],
            });

            return res.status(200).send({
                message: 'Dados encontrados',
                data: response,
            });
        }

        const response = await UsuarioSessao.findOne({
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
            idUsuario,
            idSessao,
        } = corpo;

        const sessao = await Sessao.findByPk(idSessao);

        const valorAtual = sessao.preco;

        const response = await UsuarioSessao.create({
            idUsuario,
            idSessao,
            valorAtual,
        });

        return response;

    } catch (error) {
        throw new Error (error.message);
    }
};

const update = async (corpo , id) => {

    try {
        
        const response = await UsuarioSessao.findOne({
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
        
        const response = await UsuarioSessao.findOne({
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

const getLugaresLivres = async (req, res) => {
    const id = req.params.id;
  
    try {
        const sessao = await Sessao.findOne({ 
            where: { id : id} ,
        });
  
      if (!sessao) {
        return res.status(404).send({ 
            message: "Sessão não encontrada" ,
        });
      }
  
      // Filtra os lugares onde não há idUsuario (vago)
      const lugaresLivres = sessao.lugares.filter((lugares) => lugares.ocupado === false);
  

      if(!lugaresLivres){
        return res.status(404).send('Nao achou lugares livres.');
     };


      return res.status(200).send({
        message: "Lugares livres encontrados",
        data: lugaresLivres,
      });

      


    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
};

/*2. post na usuario_sessoes para criar uma compra
	*informar o codigo do lugar
    * caso o lugar na sessao esdcolhida for vago adicionar ao objeto(lugar) mais uma chave chamada idUsuario com o id do usuario que fez a compra e criar a usuario_sessoes
    * caso lugar ocupado, devolver um erro e nao mudar nada no banco
* retornar sucesso ou erro, caso sucesso ja com a data e hora da sessao*/
const comprarIngresso = async (req, res) => {
    try {
        const { 
            idSessao, 
            idUsuario, 
            nomeLugar, 
        } = req.body;

        if (!idSessao || !idUsuario || !nomeLugar) {
            return res.status(400).send({ message: "Campos obrigatorios nao informados" });
        }

        const sessao = await Sessao.findOne({ where: { id: idSessao } });
        if (!sessao) {
            return res.status(404).send({ message: "Sessao nao encontrada" });
        }

        const usuario = await Usuario.findOne({ where: { id: idUsuario } });
        if (!usuario) {
            return res.status(404).send({ message: "Usuario nao encontrado" });
        }

        const lugares = sessao.toJSON().lugares;
        const indexLugar = lugares.findIndex(lugar => lugar.nomeLugar === nomeLugar);
       
        
        if (indexLugar === -1) {
            return res.status(404).send({ message: "Lugar nao encontrado na sessao" });
        }

        if (lugares[indexLugar].ocupado) {
            return res.status(400).send({ message: "Lugar ja esta ocupado" });
        }

        // Atualiza o lugar como ocupado
        lugares[indexLugar].ocupado = true;
        lugares[indexLugar].idUsuario = usuario.id;
        
    
        
        // Atualiza a sessão com o novo JSON
        sessao.lugares = lugares;
        await sessao.save();
        
        

        // Cria a entrada em usuarios_sessoes
        const novaCompra = await UsuarioSessao.create({
            idSessao: sessao.id,
            idUsuario: usuario.id,
            valorAtual: sessao.preco, // pode multiplicar depois se tiver quantidade
            status: "Comprado"
        });
    

        return res.status(201).send({
            message: "Ingresso comprado com sucesso!",
            data: {
                sessao: {
                    id: sessao.id,
                    dataInicio: sessao.dataInicio,
                    dataFinal: sessao.dataFinal
                },
                lugar: lugares[indexLugar],
                compra: novaCompra,
            }
        });

    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const cancelarIngresso = async (req, res) => {

    const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

    try {
        
        if(!id){
            return res.status(400).send('Informa o id do ingresso');
        };
        
        const response = await UsuarioSessao.findOne({
            where: {
                id
            }
        });
        

        if(!response){
            throw res.status(400).send('Compra não encontrada');
        };

    
        const idSessao = response.idSessao;
        const idUsuario = response.idUsuario;


        const sessao = await Sessao.findOne({ where: { id: idSessao } });

        if(!sessao){
            throw res.status(400).send('Sessao não encontrada');
        };


        const lugares = sessao.toJSON().lugares;
        const indexLugar = lugares.findIndex(lugar => lugar.idUsuario === idUsuario);
        console.log(lugares);
        console.log(indexLugar);
        
        



        if (indexLugar === -1) {
            return res.status(404).send({ message: "Lugar nao encontrado na sessao" });
        }

        if (!lugares[indexLugar].ocupado) {
            return res.status(400).send({ message: "Lugar esta vazio" });
        }

        // Atualiza o lugar como ocupado
        lugares[indexLugar].ocupado = false;
        lugares[indexLugar].idUsuario = null;

        response.status = "Cancelado";
        sessao.lugares = lugares;

        await sessao.save();
        await response.save();


        return res.status(200).send({
            message: 'Ingresso cancelado com sucesso',
            data: response,
        });

    } catch (error) {
        return res.status(500).send({
            message: error.message
        });
    };
};

// * Listar todas as sessoes compradas do usuario X, filme horario e sala

const listarUsuarioSessao = async (req , res) => {
    
    
    try {

        const id = req.params.id ? req.params.id.toString().replace(/\D/g, '') : null;

        if(!id){
           return res.status(404).send({
                message: 'Informe o id.',
            });
        }

        const comprasUsuario = await UsuarioSessao.findAll({
            
            where: {
                idUsuario: id,
            },
            include: [
                {
                    model: Sessao,
                    as: 'sessao',
                    include: [
                        {
                            model: Filme,
                            as: 'filme',
                            attributes: ['nome'],
                        },
                        {
                            model: Sala,
                            as: 'sala',
                            attributes: ['observacao'],
                        }
                    ],
                    attributes: ['dataInicio', 'dataFinal'],
                }
            ]
        });


        if(comprasUsuario.length===0){
            return res.status(404).send('Usuario não possui nenhuma sessão.');
        }


        const resultadoFormatado = comprasUsuario.map(compra=> {
            const sessao = compra.sessao;

            const filme = sessao.filme.nome;
            const sala = sessao.sala.observacao;


            const horarioInicio = moment(sessao.dataInicio).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm');
            const horarioFinal = moment(sessao.dataFinal).tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm')


            return {
                filme,
                sala,
                horarioInicio,
                horarioFinal,
            }
        });

        

        return res.status(200).send({
            message: 'Dados encontrados',
            data: resultadoFormatado,
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
    getLugaresLivres,
    comprarIngresso,
    cancelarIngresso,
    listarUsuarioSessao,
}