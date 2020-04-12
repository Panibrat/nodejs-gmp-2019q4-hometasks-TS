import { trimUserData } from './helpers';

describe('trimUserData helper function', () => {
    it('Should return object with proper arguments', () => {
        const id = '1';
        const login = 'Sasha';
        const age = 22;
        const reqObj = {
            id,
            login,
            age,
            password: '123asdf',
            token: 'asfdasdfsadfasdfasddf'
        };

        const result = trimUserData(reqObj);

        expect(result).toEqual({id, login, age});
    });
});
