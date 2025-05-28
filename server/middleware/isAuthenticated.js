import jwt from 'jsonwebtoken';

const isAuthenticated = (req, res, next) => {
    try {
        const token= req.cookies.token || req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(401).json({
                success: false,
                message: "User are not authenticated"
            })
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(401).json({
                success: false,
                message: "Invalid token"
            });
        }
        req.id= decoded.userId;
        next();

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
        
    }
}

export default isAuthenticated;