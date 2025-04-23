import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import PadraoLugar from "./PadraoLugarModel.js";



const Sala = sequelize.define(

    'salas',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        observacao:{
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

Sala.belongsTo(PadraoLugar, {
    as: 'padraoLugar',
    foreignKey: {
        name: 'idPadraoLugares',
        field: 'id_padrao_lugares',
        allowNull: false,
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
});


export default Sala;