import { Body, Controller, Get, Post, Param, Delete, Put } from '@nestjs/common';
import { BookService } from './book.service';
import { BookDocument } from './book.model'
import { CreateBookDto } from './dto/create-book.dto';


@Controller('api/book')
export class BookController {
    constructor(private readonly bookService : BookService) {}

    @Post()
    create(@Body() data : CreateBookDto) : Promise<BookDocument> {
        return this.bookService.create(data);
    }

    @Get()
    async findAll(): Promise<BookDocument[]> {
        return this.bookService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) : Promise<BookDocument> {
        return this.bookService.getBook(id);
    }

    @Delete(':id')
    deleteOne(@Param('id') id: string) : Promise<BookDocument> {
        return this.bookService.deleteBook(id);
    }

    @Put(':id')
    updateOne(@Param('id') id: string, @Body() data: CreateBookDto){
        return this.bookService.updateBook(id, data);
    }
}
