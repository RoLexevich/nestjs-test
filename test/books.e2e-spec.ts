import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { disconnect, Types } from 'mongoose';

import { AppModule } from '../src/app.module';
import { UserCreateDto } from 'src/auth/dto/create-user-dto';
import { Book } from 'src/book/book.interface';
import { User } from 'src/auth/users.model';

const id = new Types.ObjectId().toHexString();

const signUpDto: UserCreateDto = {
    email: 'a@a.ru',
    password: '111',
    firstname: 'Ivan',
    lastname: 'Ivanov',
};

const book: Partial<Book> = {
    id,
    title: 'New Book ',
    description: 'New Book Description',
    authors: 'John Black',
    favorite: '1',
};

const updateTitle = 'update Book';

describe('BooksController (e2e)', () => {
    let app: INestApplication;
    let token: string;
    let bookId: string;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();

        async function login() {
            const { body } = await request(app.getHttpServer())
                .post('api/users/signin')
                .send({
                    password: signUpDto.password,
                    email: signUpDto.email
                } as User);
            token = body.access_token;
            if (!token) {
                await request(app.getHttpServer())
                    .post('api/users/signup')
                    .send(signUpDto);
                login();
            }
        }
        login();
    });

    it('/books (GET)', () => {
        return request(app.getHttpServer()).get('/books').expect(200);
    });

    it('/books (POST) - success', async () => {
        return request(app.getHttpServer())
            .post('/books')
            .set('Authorization', 'Bearer ' + token)
            .send(book)
            .expect(201)
            .then(({ body }: request.Response) => {
                bookId = body._id;
                expect(bookId).toBeDefined();
            });
    });

    it('/books (POST) - fail', async () => {
        return request(app.getHttpServer())
            .post('/books')
            .send(book)
            .expect(401);
    });

    it('/books/:id (GET) - success', async () => {
        return request(app.getHttpServer())
            .get('/books/' + bookId)
            .expect(200);
    });

    it('/books/:id (GET) - fail:not found book', async () => {
        return request(app.getHttpServer())
            .get('/books/' + new Types.ObjectId().toHexString())
            .expect(404);
    });

    it('/books/:id (GET) - fail:not valid <id>', async () => {
        return request(app.getHttpServer())
            .get('/books/' + 1)
            .expect(400);
    });

    it('/books/:id (PUT) - success', async () => {
        const updateTitle = 'update Book';
        return await request(app.getHttpServer())
            .put('/books/' + bookId)
            .set('Authorization', 'Bearer ' + token)
            .send({ ...book, title: updateTitle })
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.title).toBe(book.title);
            });
    });

    it('/books/:id (PUT) - fail', async () => {
        return await request(app.getHttpServer())
            .put('/books/' + bookId)
            .send({ ...book, title: updateTitle })
            .expect(401);
    });

    it('/books/:id (DELETE) - success', async () => {
        return await request(app.getHttpServer())
            .delete('/books/' + bookId)
            .set('Authorization', 'Bearer ' + token)
            .expect(200)
            .then(({ body }: request.Response) => {
                expect(body.title).toBe(updateTitle);
            });
    });

    it('/books/:id (DELETE) - fail: not found', async () => {
        return await request(app.getHttpServer())
            .delete('/books/' + bookId)
            .set('Authorization', 'Bearer ' + token)
            .expect(404);
    });

    afterAll(() => {
        disconnect();
    });
});
