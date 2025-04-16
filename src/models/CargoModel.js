import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";


const Cargo = sequelize.define(

    'cargos',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        descricao:{
            type: DataTypes.STRING(250),
            allowNull: false,
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'update_at',
    }

);

export default Cargo;