import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Cargo from "./CargoModel.js";



const Usuario = sequelize.define(

    'usuarios',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nome:{
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        email:{
            type: DataTypes.STRING(100),
            allowNull: false,
            unique: true,
        },
        passwordHash:{
            type: DataTypes.TEXT,
            allowNull: false,
        },
        cpf:{
            type: DataTypes.STRING(14),
            allowNull: false,
            unique: true,
        },
        estudante: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
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

Usuario.belongsTo(Cargo, {
    as: 'cargo',
    foreignKey: {
        name: 'idCargo',
        field: 'id_cargos',
        type: DataTypes.INTEGER, // Tipo da chave estrangeira
        allowNull: false,
    },
    onUpdate: 'NO ACTION',
    onDelete: 'NO ACTION',
});

export default Usuario;