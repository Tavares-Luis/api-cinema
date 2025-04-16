import { DataTypes } from "sequelize";
import { sequelize } from "../config/postgres.js";
import Cliente from "./ClienteModel.js";

const Emprestimo = sequelize.define(
    'emprestimos',
    {
        id:{
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        dataEmprestimo: {
            field: 'datas_emprestimos',
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW(),
        }
    },
    {
        freezeTableName: true,
        timestamps: true,
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    }
        
);

//criando conexao chave estrangeira de emprestimo com cliente.
Emprestimo.belongsTo(Cliente, {
    as: 'cliente',
    onUpdate: 'NO ACTION',    //nao deixa mexer (deletar em cascata).
    onDelete: 'NO ACTION',    //nao deixa mexer (deletar em cascata).
    foreignKey: {  //chave estrangeira.
        name: 'idCliente',  //nome que vai ser usado no js.
        allowNull: false,
        field: 'id_cliente', //nome no banco.
    }
});

export default Emprestimo;