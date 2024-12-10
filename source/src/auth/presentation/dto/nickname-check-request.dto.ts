import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class NicknameCheckRequestDto {
    @ApiProperty({
        description: '중복 여부를 확인할 닉네임',
        example: 'new_nickname123',
    })
    @IsString()
    @IsNotEmpty({ message: '닉네임은 필수 입력 값입니다.' })
    @Length(1, 10, { message: '닉네임은 1자 이상, 10자 이하로 입력해야 합니다.' })
    nickname: string;
}
