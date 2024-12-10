import {IsNotEmpty, IsString} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export class SignInResponseDto {
    @ApiProperty({
        description: '새로 발급된 Access Token. Refresh Token Rotation(RTR) 방식을 사용하며, 기존 Access Token이 유효기간 내에 있다면 새로운 Refresh Token은 발급되지 않고 기존 Refresh Token이 그대로 유지됩니다. Access Token이 만료된 경우에는 새로운 Access Token과 Refresh Token이 모두 발급됩니다.',
        example: 'access_token_example',
    })
    @IsString()
    @IsNotEmpty()
    accessToken: string;

    @ApiProperty({
        description: '새로 발급된 Refresh Token. RTR 방식에 따라 Access Token이 만료된 경우에만 새로운 Refresh Token이 발급됩니다. 기존 Access Token이 유효한 경우에는 이 값은 발급되지 않습니다.',
        example: 'refresh_token_example',
    })
    @IsString()
    @IsNotEmpty()
    refreshToken: string;
}
