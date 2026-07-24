import { IsString, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsString()
  stack: string;

  @IsString()
  @IsOptional()
  status?: string;
}
