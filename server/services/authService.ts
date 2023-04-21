import jwt from 'jsonwebtoken';

export const tokenVerify = (token: string): string => {
    try {
        const decoded = jwt.verify(token, 'ssapmoCtrecnoC');
        console.log('decoded: ', decoded);
        return decoded as string;
      } catch(err) {
        console.log(err);
        throw err;
      }
}