import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { CreateDocumentDto } from './dto/create-document.dto';
import { DocumentsService } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Get()
  findAll() {
    return this.documentsService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const document = await this.documentsService.findById(id);
    if (!document) {
      throw new NotFoundException('Document not found');
    }
    return document;
  }

  @Post()
  create(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    body: CreateDocumentDto,
  ) {
    return this.documentsService.create(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    const deleted = await this.documentsService.delete(id);
    if (!deleted) {
      throw new NotFoundException('Document not found');
    }
    return true;
  }
}
