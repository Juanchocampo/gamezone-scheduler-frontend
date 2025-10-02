import { User, UserMapped } from "../interfaces/auth.interface";

export class UserRoleMap {
  static userRoleToArray(user: User): UserMapped {
    return {
      email: user.email,
      name: user.name,
      username: user.username,
      document: user.document,
      id: user.id,
      roles: user.roles.map((res) => res.name),
    };
  }

  static arrayUserRoleToArray(users: User[]): UserMapped[]{
    return users.map(UserRoleMap.userRoleToArray)
  }
}
