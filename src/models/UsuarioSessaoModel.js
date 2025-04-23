import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Usuario from "./UsuarioModel.js";
import Sessao from "./SessaoModel.js";

const UsuarioSessao = sequelize.define(
    "usuarios_sessoes",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        valorAtual: {
            field: 'valor_atual',
            type: DataTypes.DOUBLE,
            allowNull: false,
            defaultValue: 0,
        },
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "update_at",
    }
);

// Associação: UsuarioSessao pertence a Sessao
UsuarioSessao.belongsTo(Sessao, {
    as: "sessao",
    foreignKey: {
        name: "idSessao",
        field: "id_sessao",
        allowNull: false,
    },
    onUpdate: "NO ACTION",
    onDelete: "NO ACTION",
});

// Associação: UsuarioSessao pertence a Usuario
UsuarioSessao.belongsTo(Usuario, {
    as: "usuario",
    foreignKey: {
        name: "idUsuario",
        field: "id_usuario",
        allowNull: false,
    },
    onUpdate: "NO ACTION",
    onDelete: "NO ACTION",
});

export default UsuarioSessao;