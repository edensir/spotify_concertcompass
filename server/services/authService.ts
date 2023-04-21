import jwt from 'jsonwebtoken';

export const tokenVerify = (token: string): {data: string} => {
    try {
        const decoded = jwt.verify(token, 'ssapmoCtrecnoC');
        return decoded as {data: string};
      } catch(err) {
        console.log(err);
        throw err;
      }
}