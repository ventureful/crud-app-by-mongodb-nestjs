import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';

export class CreatePokemonDto {
  @IsInt()
  @IsPositive()
  @IsNotEmpty()
  no: number;
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name: string;
}
