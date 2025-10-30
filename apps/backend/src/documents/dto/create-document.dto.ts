import { Type } from 'class-transformer';
import { IsObject, IsString, ValidateNested } from 'class-validator';

class DocumentMetadataDto {
  @IsString()
  title: string;

  @IsString()
  author: string;
}

export class CreateDocumentDto {
  @IsString()
  content: string;

  @IsObject()
  @ValidateNested()
  @Type(() => DocumentMetadataDto)
  metadata: DocumentMetadataDto;
}
