import { IsString, IsNumber } from 'class-validator';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsString()
  group: string;

  @IsNumber()
  level: number;
}
