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
            field: 'password_hash',
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
        },
        resetToken: {
            field: 'reset_token',
            type: DataTypes.TEXT,
            allowNull: true
        },
        resetTokenExpire: {
            field: 'reset_token_expire',
            type: DataTypes.DATE,
            allowNull: true
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