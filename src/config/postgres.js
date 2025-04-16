import { Sequelize } from "sequelize";
import 'dotenv/config';

export const sequelize = new Sequelize(  //criar nova instancia do Sequelize, conexao com o banco (dados n fica expostos).
    process.env.POSTGRES_DB,
    process.env.POSTGRES_USERNAME,
    process.env.POSTGRES_PASSWORD,
    {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        dialect: 'postgres'
    }

);

