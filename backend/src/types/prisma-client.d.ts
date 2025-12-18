declare module "@prisma/client" {
  export class PrismaClient {
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    [k: string]: any;
  }
  export type Prisma = any;
  export type User = any;
  export type Task = any;
  export type Notification = any;
}