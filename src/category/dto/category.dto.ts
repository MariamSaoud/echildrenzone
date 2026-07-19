import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum CategoryTypeEnum {
  ENTERTAIMENT = 'ENTERTAIMENT',
  EDUCATIONAL = 'EDUCATIONAL',
}
export class AddCategory {
  @ApiProperty({
    description: 'The main classification category type',
    enum: CategoryTypeEnum,
    example: CategoryTypeEnum.EDUCATIONAL,
  })
  @IsNotEmpty()
  @IsEnum(CategoryTypeEnum)
  type: CategoryTypeEnum;

  @ApiProperty({
    description: 'The specific sub-type or genre name',
    example: 'Mathematics or Action Movies',
  })
  @IsNotEmpty()
  @IsString()
  specificType: string;
}
export class updateCategory extends PartialType(AddCategory) {}
