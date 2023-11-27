import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { BookService } from './book.service';
import { BookSchema } from './book.model';
import { Book } from './book.interface';
import { CreateBookDto } from './dto/create-book.dto';

describe('BookService', () => {
    let service: BookService;
    const books: Partial<Book>[] = [
        {
            id: '1',
            title: 'New Book ',
            description: 'New Book Description',
            authors: 'John Black',
            favorite: '1',
        },
        {
            id: '2',
            title: 'New Book Again',
            description: 'New Book Description  Again',
            authors: 'John Black  Again',
            favorite: '2 Again',
        },
    ];

    const exec = { exec: jest.fn() };
    const create = jest.fn();
    const findOneAndUpdate = jest.fn();
    const findOneAndRemove = jest.fn();

    const booksRepositoryFactory = () => ({
        find: () => exec,
        findById: () => exec,
        create,
        findOneAndUpdate,
        findOneAndRemove,
    });

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                BookService,
                {
                    useFactory: booksRepositoryFactory,
                    provide: getModelToken(BookSchema.name),
                },
            ],
        }).compile();

        service = module.get<BookService>(BookService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('findByBookId working', async () => {
        const id = new Types.ObjectId().toHexString();
        booksRepositoryFactory()
            .findById()
            .exec.mockReturnValueOnce([{ bookId: id }]);
        const res = await service.getBook(id);
        expect(res[0].bookId).toBe(id);
    });

    it('findBooks working', async () => {
        booksRepositoryFactory().find().exec.mockReturnValueOnce(books);
        const res = await service.findAll();
        expect(res).toEqual(books);
    });

    it('create book working', async () => {
        booksRepositoryFactory().create.mockReturnValueOnce(books[0]);
        const res = await service.create(books[0] as CreateBookDto);
        expect(res).toEqual(books[0]);
    });
    it('update book working', async () => {
        booksRepositoryFactory().findOneAndUpdate.mockReturnValueOnce([
            books[1],
            books[1],
        ]);
        const res = await service.updateBook('0', books[1] as CreateBookDto);
        expect(res).toEqual([books[1], books[1]]);
    });

    it('delete book working', async () => {
        booksRepositoryFactory().findOneAndRemove.mockReturnValueOnce([
            books[1],
        ]);
        const res = await service.deleteBook('0');
        expect(res).toEqual([books[1]]);
    });
});
