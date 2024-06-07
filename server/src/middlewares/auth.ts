
import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import userRepository from '../repositories/UserRepository'
interface DecodedToken {
}

const verifyToken = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
  const authorizationHeader: string | undefined = req.headers['authorization'];
  if (!authorizationHeader) {
    res.status(403).json({ error: 'Token not provided' });
    return;
  }
  const token: string = authorizationHeader.split(' ')[1];
  console.log('worked',token);
  
  try {
    const decoded: DecodedToken = verify(token);
    const {userId} : any = decoded;
    console.log("User id ",userId)
    const user = await userRepository.findById(userId)
    console.log('working : ',user)
    if(user?.isBlocked){
        return res.status(400).json({ message: "User is blocked" });
    }
    next();
  } catch (err) {
    console.error('Token verification1 failed:',  (err as Error).message);
    res.status(401).json({ error: 'Failed to authenticate token' });
  }
};

const verify = (token: string): DecodedToken => {
  try {
    
    const decoded: DecodedToken = jwt.verify(token, process.env.JWT_SECRET as string) as DecodedToken;
    return decoded;
  } catch (err) {
    console.error('Token verification2 failed:', (err as Error).message);
    throw new Error('Token verification failed');
  }
};

export default verifyToken;
