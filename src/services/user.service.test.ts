import { Op } from 'sequelize';
import { UserService} from './user.service';
import HttpError from 'standard-http-error';

jest.mock('../models/user.model');
import { User } from '../models/user.model';

jest.mock('bcryptjs');
import bcrypt from 'bcryptjs';

jest.mock('jsonwebtoken');
import jwt from 'jsonwebtoken';

describe('User Service Class: getAll', () => {
    const resp = [
        {
            id: '1',
            login: 'Sasha',
            age: 22,
        },
        {
            id: '2',
            login: 'Masha',
            age: 33,
        },
    ];

    const options = {
        where: {
            isDeleted: false,
        },
        attributes: ['id', 'login', 'age'],
        limit: null,
        order: ['login']
    };

    beforeEach(() => {
        User.findAll.mockResolvedValue(resp);
    });

    it('should fetch all users', async () => {
        const data = await UserService.getAll();

        expect(User.findAll).toBeCalledWith(options);
        expect(data).toEqual(resp);
    });

    it('should fetch users by login', async () => {
        const search = 'Sasha';
        options.where = {
            isDeleted: false,
            login: {[Op.like]: `${search}%`},
        };

        await UserService.getAll(search);

        expect(User.findAll).toBeCalledWith(options);
    });

    it('should fetch limited number of users by login', async () => {
        const search = 'Masha';
        const limit = 3;
        options.where = {
            isDeleted: false,
            login: {[Op.like]: `${search}%`},
        };
        options.limit = limit;

        await UserService.getAll(search, limit);

        expect(User.findAll).toBeCalledWith(options);
    });

    it('should throw HttpError if now user is found', async () => {
        User.findAll.mockResolvedValue([]);

        expect(UserService.getAll()).rejects.toBeInstanceOf(HttpError);
        expect(UserService.getAll()).rejects.toEqual(new HttpError(404, 'Can\'t find any user from Database :('));
    });

    it('should throw Error if request is rejected', async () => {
        User.findAll.mockRejectedValue(new Error);

        expect(UserService.getAll()).rejects.toBeInstanceOf(Error);
    });
});

describe('User Service Class: getById', () => {
    let resp;
    const options = {
        where: {
            isDeleted: false,
        },
        attributes: ['id', 'login', 'age'],
    };

    beforeEach(() => {
        resp = [
            {
                id: '1',
                login: 'Sasha',
                age: 22,
            },
        ];
        User.findOne.mockResolvedValue(resp);
    });

    it('should fetch a user by id', async () => {
        const id = '1';
        options.where.id = id;

        const data = await UserService.getById(id);

        expect(User.findOne).toBeCalledWith(options);
        expect(data).toEqual(resp);
    });

    it('should throw an error if no user found', async () => {
        const id = '0';
        User.findOne.mockResolvedValue(null);

        expect(UserService.getById(id)).rejects.toBeInstanceOf(HttpError);
        expect(UserService.getById(id)).rejects.toEqual(new HttpError(404, 'User not found :('));
    });

    it('should throw an error if no user found (another way)', async () => {
        const id = '0';
        User.findOne.mockResolvedValue(null);

        expect.assertions(2);
        try {
            await UserService.getById(id);
        } catch (e) {
            expect(e).toBeInstanceOf(HttpError);
            expect(e).toEqual(new HttpError(404, 'User not found :('));
        }
    });

    it('should throw Error if request is rejected', async () => {
        User.findOne.mockRejectedValue(new Error);

        expect(UserService.getById('12345')).rejects.toBeInstanceOf(Error);
    });
});

describe('User Service Class: getByLogin', () => {
    let resp;
    const options = {
        where: {
            isDeleted: false,
        },
        attributes: ['id', 'login', 'password'],
    };

    beforeEach(() => {
        resp = [
            {
                id: '1',
                login: 'Masha',
                age: 32,
            },
        ];
        User.findOne.mockResolvedValue(resp);
    });

    it('should fetch a user by login', async () => {
        const login = 'Masha';
        options.where.login = login;

        const data = await UserService.getByLogin(login);

        expect(User.findOne).toBeCalledWith(options);
        expect(data).toEqual(resp);
    });

    it('should throw an error if no user found', async () => {
        const login = 'Masha';
        User.findOne.mockResolvedValue(null);

        expect(UserService.getByLogin(login)).rejects.toBeInstanceOf(HttpError);
        expect(UserService.getByLogin(login)).rejects.toEqual(new HttpError(404, 'User not found :('));
    });

    it('should throw Error if request is rejected', async () => {
        const login = 'Masha';
        User.findOne.mockRejectedValue(new Error);

        expect(UserService.getByLogin(login)).rejects.toBeInstanceOf(Error);
    });
});

describe('User Service Class: create', () => {
    let resp;
    let credentials;

    beforeEach(() => {
        resp = [
            {
                id: '3',
                login: 'Dasha',
                age: 55,
                password: 'qwerY54321',
            },
        ];
        credentials = {
            login: 'Login',
            password: 'abC123',
            age: 44
        };
        User.create.mockResolvedValue(resp);
        bcrypt.genSaltSync.mockImplementation(salt => salt);
        bcrypt.hashSync.mockImplementation((pass, salt) => pass + salt);
    });

    it('should return instance of User', async () => {
        const data = await UserService.create(credentials);

        expect(data).toEqual(resp);
    });

    it('should hashed password properly', async () => {
        await UserService.create(credentials);

        expect( bcrypt.genSaltSync).toHaveBeenCalledWith(10);
        expect( bcrypt.hashSync).toHaveBeenCalledWith(credentials.password, 10);
        credentials.password = bcrypt.hashSync(credentials.password, 10);
        expect(User.create).toHaveBeenCalledWith(credentials);
    });

    it('should throw Error if request is rejected', async () => {
        User.create.mockRejectedValue(new Error);

        expect(UserService.create(credentials)).rejects.toBeInstanceOf(Error);
    });
});

describe('User Service Class: updateById', () => {
    let resp;
    let credentials;
    const id = '4';
    const mockedSave = jest.fn();
    mockedSave.mockReturnThis();
    const options = {
        where: {
            id: id,
            isDeleted: false,
        }
    };

    beforeEach(() => {
        resp = {
                id: '4',
                login: 'Pasha',
                age: 66,
                password: 'qwerY54321',
                save: mockedSave,
            };
        credentials = {
            login: 'Login',
            password: 'abC123',
            age: 44
        };
        User.findOne.mockResolvedValue(resp);
        bcrypt.genSaltSync.mockImplementation(salt => salt);
        bcrypt.hashSync.mockImplementation((pass, salt) => pass + salt);
    });

    it('should find user by id and save it', async () => {
        await UserService.updateById(id, credentials);

        expect(User.findOne).toBeCalledWith(options);
        expect(mockedSave).toBeCalled();
    });

    it('should save a user with updated data and hashed password', async () => {
        const data = await UserService.updateById(id, credentials);
        const hashedPassword = bcrypt.hashSync(credentials.password, 10);

        expect(data.login).toBe(credentials.login);
        expect(data.age).toBe(credentials.age);
        expect(data.password).toBe(hashedPassword);
    });

    it('should throw Error if request is rejected', async () => {
        User.findOne.mockRejectedValue(new Error);

        expect(UserService.updateById(id)).rejects.toBeInstanceOf(Error);
    });
});

describe('User Service Class: deleteById', () => {
    let resp;
    const id = '5';
    const mockedSave = jest.fn();
    mockedSave.mockReturnThis();
    const options = {
        where: {
            id: id,
            isDeleted: false,
        }
    };

    beforeEach(() => {
        resp = {
                id: '5',
                login: 'Tasha',
                age: 77,
                password: 'qwerY54321',
                save: mockedSave,
            };
        User.findOne.mockResolvedValue(resp);
    });

    it('should find user by id and save it', async () => {
        await UserService.deleteById(id);

        expect(User.findOne).toBeCalledWith(options);
        expect(mockedSave).toBeCalled();
    });

    it('should save a user with isDeleted = true', async () => {
        const data = await UserService.deleteById(id);

        expect(data.isDeleted).toBeTruthy();
    });

    it('should throw HttpError if user is not found', async () => {
        User.findOne.mockResolvedValue(null);

        expect(UserService.deleteById(id)).rejects.toBeInstanceOf(HttpError);
        expect(UserService.deleteById(id)).rejects.toEqual(new HttpError(404, 'User not found :('));
    });

    it('should throw Error if request is rejected', async () => {
        User.findOne.mockRejectedValue(new Error);

        expect(UserService.deleteById(id)).rejects.toBeInstanceOf(Error);
    });
});

describe('User Service Class: login', () => {
    let resp;
    const username = 'Masha';
    const password = '123abc';
    const options = {
        where: {
            isDeleted: false,
            login: 'Masha',
        },
        attributes: ['id', 'login', 'password'],
    };

    beforeEach(() => {
        resp = [
            {
                id: '1',
                login: 'Masha',
                age: 32,
                password: '123abc',
            },
        ];
        User.findOne.mockResolvedValue(resp);
    });

    it('should find user by login', async () => {
        bcrypt.compareSync.mockImplementation(() => true);

        await UserService.login(username, password);
        expect(User.findOne).toBeCalledWith(options);
    });

    it('should return token', async () => {
        const token = 'longToken';
        bcrypt.compareSync.mockImplementation(() => true);
        jwt.sign.mockImplementation(() => token);

        expect(UserService.login(username, password)).resolves.toEqual(token);
    });

    it('should throw HttpError if crypted password is wrong', async () => {
        bcrypt.compareSync.mockImplementation(() => false);

        expect(UserService.login(username, password)).rejects.toBeInstanceOf(HttpError);
        expect(UserService.login(username, password)).rejects.toEqual(new HttpError(401, 'Login or password is not correct :('));
    });

    it('should throw Error request is rejected', async () => {
        bcrypt.compareSync.mockImplementation(() => true);
        User.findOne.mockRejectedValue(new Error);

        expect(UserService.login(username, password)).rejects.toBeInstanceOf(Error);
    });
});
