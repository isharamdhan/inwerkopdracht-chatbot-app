import type { RowDataPacket } from "mysql2/promise";

// Structure of one message row
export interface MessageRow extends RowDataPacket {
  id: string;
  session_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: Date;
}
