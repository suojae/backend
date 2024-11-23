export class UserEntity {
  id: string;
  nickname: string;
  themeAnimal: _Animal;
  password: string;
}

enum _Animal {
  Dog = 'dog',
  Cat = 'cat',
  Rabbit = 'rabbit',
  Hamster = 'hamster',
}
