import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateRequestDto {
    @ApiProperty({
        description: '변경할 유저 닉네임',
        example: 'new_nickname123',
        required: false,
    })
    @IsOptional()
    @IsString()
    @Length(1, 10, { message: '닉네임은 1자 이상, 10자 이하로 입력해야 합니다.' })
    nickname?: string;

    @ApiProperty({
        description: '변경할 캐릭터 ID',
        example: 'hamster',
        required: false,
    })
    @IsOptional()
    @IsString()
    characterId?: string;

    @ApiProperty({
        description: '동의 약관 여부',
        example: true,
        required: false,
    })
    @IsOptional()
    @IsBoolean()
    termsAgreed?: boolean;
}
