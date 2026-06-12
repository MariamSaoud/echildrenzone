import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum CategoryTypeEnum {
  ENTERTAIMENT = 'ENTERTAIMENT',
  EDUCATIONAL = 'EDUCATIONAL',
}
export class AddCategory {
  @IsNotEmpty()
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;
  @IsNotEmpty()
  @IsString()
  specificType: string;
}
export class updateCategory extends PartialType(AddCategory) {}
