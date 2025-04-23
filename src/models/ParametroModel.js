import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";


const Parametro = sequelize.define(

    'parametros',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        chave:{
            type: DataTypes.STRING(250),
            allowNull: false,
            unique: true,
        },
        valor: {
            type: DataTypes.DOUBLE,
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

export default Parametro;