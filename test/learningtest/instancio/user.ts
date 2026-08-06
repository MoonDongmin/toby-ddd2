import { UserStatus } from './user-status';

export class User {
  private _id: number | null;
  private _name: string;
  private _email: string;
  private _status: UserStatus;

  constructor(
    id: number | null,
    name: string,
    email: string,
    status: UserStatus,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._status = status;
  }

  get id(): number | null {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get status(): UserStatus {
    return this._status;
  }
}
