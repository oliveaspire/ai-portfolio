import { IsString } from 'class-validator';

export class TrackVisitDto {
  @IsString()
  path: string;

  @IsString()
  sessionId: string;
}
