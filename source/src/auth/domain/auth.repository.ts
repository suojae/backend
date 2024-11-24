export interface IAuthRepository {
  saveAuthData(data: any): Promise<any>;
}