import { IsString, IsNotEmpty } from 'class-validator';

export class AppleUserInfoRequestDto {
  @IsString()
  @IsNotEmpty()
  idToken: string;
}
