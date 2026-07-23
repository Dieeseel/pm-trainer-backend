import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserDto {
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "Ошибка валидации: telegramId должен быть в виде числа" }
  )
  @IsNotEmpty()
  telegramId!: number;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lasttName?: string;

  @IsString()
  @IsOptional()
  username?: string;

  @IsUrl()
  @IsOptional()
  photoUrl?: string;
}
