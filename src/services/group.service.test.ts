import HttpError from 'standard-http-error';
import { GroupService} from './group.service';

jest.mock('../models/group.model');
import { Group } from '../models/group.model';

describe('Group Service Class: getAll', () => {
    const resp = [
        {
            id: 1,
            name: 'Admin',
            permissions: [
                'READ',
                'WRITE',
                'DELETE',
                'SHARE',
                'UPLOAD_FILES'
            ]
        },
        {
            id: 2,
            name: 'Reader',
            permissions: [
                'READ'
            ]
        },
    ];

    it('should returns all groups', async () => {
        Group.findAll.mockResolvedValue(resp);

        const data = await GroupService.getAll();

        expect(data).toEqual(resp);
    });

    it('should throw HttpError if now group is found', async () => {
        Group.findAll.mockResolvedValue([]);

        expect(GroupService.getAll()).rejects.toBeInstanceOf(HttpError);
        expect(GroupService.getAll()).rejects
            .toEqual(new HttpError(404, 'Can\'t find any group from Database :('));
    });

    it('should throw Error if request is rejected', async () => {
        Group.findAll.mockRejectedValue(new Error);

        expect(GroupService.getAll()).rejects.toBeInstanceOf(Error);
    });
});

describe('Group Service Class: getById', () => {
    const id = 1;
    const resp = {
        id: 1,
        name: 'Admin',
        permissions: [
            'READ',
            'WRITE',
            'DELETE',
            'SHARE',
            'UPLOAD_FILES'
        ]
    };

    it('should returns a group by id', async () => {
        Group.findByPk.mockResolvedValue(resp);

        const data = await GroupService.getById(id);

        expect(Group.findByPk).toBeCalledWith(id);
        expect(data).toEqual(resp);
    });

    it('should throw HttpError if now group is found', async () => {
        Group.findByPk.mockResolvedValue(null);

        expect(GroupService.getById(id)).rejects.toBeInstanceOf(HttpError);
        expect(GroupService.getById(id)).rejects.toEqual(new HttpError(404, 'Group is not found :('));
    });

    it('should throw Error if request is rejected', async () => {
        Group.findByPk.mockRejectedValue(new Error);

        expect(GroupService.getById(id)).rejects.toBeInstanceOf(Error);
    });
});

describe('Group Service Class: create', () => {
    const name = 'Assistant';
    const permissions = [
            'READ',
            'WRITE',
            'DELETE',
            'SHARE',
            'UPLOAD_FILES'
        ];
    const resp = {
        permissions,
        name,
        id: 1,
    };

    it('should create a group by arguments', async () => {
        Group.create.mockResolvedValue(resp);

        const data = await GroupService.create({name, permissions});

        expect(Group.create).toBeCalledWith({name, permissions});
        expect(data).toEqual(resp);
    });

    it('should throw Error if request is rejected', async () => {
        Group.create.mockRejectedValue(new Error);

        expect(GroupService.create({name, permissions})).rejects.toBeInstanceOf(Error);
    });
});

describe('Group Service Class: updateById', () => {
    const mockedSave = jest.fn();
    mockedSave.mockReturnThis();
    const id = 1;
    const name = 'Assistant';
    const permissions = [
        'READ',
        'WRITE',
        'DELETE',
        'SHARE',
        'UPLOAD_FILES'
    ];
    const resp = {
        permissions,
        name,
        id: 1,
        save: mockedSave,
    };
    const payload = {
        name: 'Creator',
        permissions: [
            'READ',
            'SHARE'
        ],
    };

    beforeEach(() => {
        Group.findByPk.mockResolvedValue(resp);
    });

    it('should find group by id and save it', async () => {
        await GroupService.updateById(id, payload);

        expect(Group.findByPk).toBeCalledWith(id);
        expect(mockedSave).toBeCalled();
    });

    it('should save a group with updated data', async () => {
        const data = await GroupService.updateById(id, payload);

        expect(data.name).toBe(payload.name);
        expect(data.permissions).toEqual(payload.permissions);
    });

    it('should throw HttpError if no group is found', async () => {
        Group.findByPk.mockResolvedValue(null);

        expect(GroupService.updateById(id, payload)).rejects.toBeInstanceOf(HttpError);
        expect(GroupService.updateById(id, payload)).rejects.toEqual(new HttpError(404, 'Group is not found :('));
    });

    it('should throw Error if request is rejected', async () => {
        Group.findByPk.mockRejectedValue(new Error);

        expect(GroupService.updateById(id)).rejects.toBeInstanceOf(Error);
    });
});

describe('Group Service Class: deleteById', () => {
    const mockedDestroy = jest.fn();
    mockedDestroy.mockReturnThis();
    const id = 1;

    const resp = {
        name: 'Assistant',
        permissions: [
            'SHARE',
            'UPLOAD_FILES',
        ],
        id: 1,
        destroy: mockedDestroy,
    };

    beforeEach(() => {
        Group.findByPk.mockResolvedValue(resp);
    });

    it('should find group by id and destroy it', async () => {
        await GroupService.deleteById(id);

        expect(Group.findByPk).toBeCalledWith(id);
        expect(mockedDestroy).toBeCalled();
    });

    it('should throw HttpError if no group is found', async () => {
        Group.findByPk.mockResolvedValue(null);

        expect(GroupService.deleteById(id)).rejects.toBeInstanceOf(HttpError);
        expect(GroupService.deleteById(id)).rejects.toEqual(new HttpError(404, 'Group is not found :('));
    });

    it('should throw Error if request is rejected', async () => {
        Group.findByPk.mockRejectedValue(new Error);

        expect(GroupService.deleteById(id)).rejects.toBeInstanceOf(Error);
    });
});
