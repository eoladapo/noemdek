import dotenv from 'dotenv';
dotenv.config();

class Config {
  public DATABASE_URI: string | undefined;
  public JWT_SECRET: string | undefined;

  constructor() {
    this.DATABASE_URI = process.env.DATABASE_URI || '';
    this.JWT_SECRET = process.env.JWT_SECRET || '';
  }
}

export const config = new Config();
