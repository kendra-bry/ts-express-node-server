export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  friends?: number[];
  address?: Address;
}

export class Address {
  constructor(
    public street: string,
    public city: string,
    public state: string,
    public zip: string,
  ) {}
}