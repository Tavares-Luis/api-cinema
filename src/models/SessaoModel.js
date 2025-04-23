import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Filme from "./FilmeModel.js";
import Sala from "./SalaModel.js";

const Sessao = sequelize.define(

    'sessoes',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        lugares: {
            type: DataTypes.JSONB,
            allowNull: false,
            defaultValue: [],
        },
        dataInicio:{
            field: 'data_inicio',
            type: DataTypes.DATE,
            allowNull: false,
        },
        dataFinal:{
            field: 'data_final',
            type: DataTypes.DATE,
            allowNull: false,
        },
        preco:{
            type: DataTypes.NUMERIC(5, 2),
            allowNull: false,
            defaultValue: 0,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'update_at',
    }

);


// Relacionamento: Sessao pertence a um Filme
Sessao.belongsTo(Filme, {
    as: 'filme',
    foreignKey: {
        name: 'idFilme',
        field: 'id_filme',
        allowNull: false,
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
});

// Sessao pertence a Sala (idSala)
Sessao.belongsTo(Sala, {
    as: 'sala',
    foreignKey: {
        name: 'idSala',
        field: 'id_sala',
        allowNull: false,
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
});


export default Sessao;