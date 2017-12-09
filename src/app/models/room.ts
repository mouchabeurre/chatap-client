export interface ROOM {
  id: string;
  name?: string;
  owner: string;
  date: Date;
  feed?: string;
  threads: [string];
  guests: [{
    user: string,
    privilege: string
  }];
  suggestions?: [{
    kind: string,
    user: string,
    message: string
  }];
  whitelisted?: [string];
}