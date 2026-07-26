import { IsNotEmpty, IsOptional, IsString, IsUrl } from "class-validator";

export class CreateUserDto {
  @IsString({ message: "Ошибка валидации: telegramId должен быть в виде строки" })
  @IsNotEmpty()
  telegramId!: string;

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
