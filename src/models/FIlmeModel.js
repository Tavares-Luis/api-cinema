import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";

const Filme = sequelize.define(

    'filmes',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        descricao: {
            type: DataTypes.STRING(250),
            allowNull: false,
        },
        autor:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        duracao: {
            type: DataTypes.INTEGER,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    }


);


export default Filmes;