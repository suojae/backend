import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NicknameCheckResponseDto {
    @ApiProperty({
        description: '중복 여부',
        example: false,
    })
    @IsBoolean()
    @IsNotEmpty()
    isDuplicate: boolean;

    @ApiProperty({
        description: '추가적인 메시지',
        example: '사용 가능한 닉네임입니다.',
    })
    @IsString()
    @IsNotEmpty()
    message: string;
}
