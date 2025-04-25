import jwt from 'jsonwebtoken';

export default (req, res, next) => {

    try {
        const authHead = req.headers.authorization;

        if(!authHead){
            return res.status(400).send({
                message: 'Token errado ou nao informado',
            });
        }

        const token = authHead.split(' ')[1];

        if(!token){
            return res.status(400).send({
                message: 'Token errado ou nao informado',
            });
        }

        const user = jwt.verify(token, process.env.TOKEN_KEY);

        if(user){
            next();
        }


    } catch (error) {
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).send({ message: 'Token inválido.' });
        }
    
        if (error.name === 'TokenExpiredError') {
            return res.status(401).send({ message: 'Token expirado.' });
        }

        return res.status(500).send({
            error: error.message,
        })

    }

};