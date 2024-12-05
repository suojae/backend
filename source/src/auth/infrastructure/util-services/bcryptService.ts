import {Injectable, InternalServerErrorException} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
    private readonly saltRounds = 10;

    /**
     * 비밀번호를 해싱합니다
     * @param password 원본 비밀번호
     * @returns 해싱된 비밀번호
     * @throws InternalServerErrorException 해싱 중 오류 발생 시
     */
    async hashPassword(password: string): Promise<string> {
        try {
            return await bcrypt.hash(password, this.saltRounds);
        } catch (err) {
            throw new InternalServerErrorException(
                '비밀번호 해싱 중 오류가 발생했습니다.',
            );
        }
    }

    /**
     * 원본 비밀번호와 해싱된 비밀번호를 비교합니다
     * @param password 원본 비밀번호
     * @param hashedPassword 해싱된 비밀번호
     * @returns 비밀번호가 일치여부 (boolean)
     * @throws InternalServerErrorException 비교 중 오류 발생 시
     */
    async comparePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        try {
            return await bcrypt.compare(password, hashedPassword);
        } catch (err) {
            throw new InternalServerErrorException(
                '비밀번호 비교 중 오류가 발생했습니다.',
            );
        }
    }
}
