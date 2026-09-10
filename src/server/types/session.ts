import type { RowDataPacket } from "mysql2/promise";

// Structure of one session row
export interface SessionRow extends RowDataPacket {
  id: string;
  title: string;
  created_at: Date;
}