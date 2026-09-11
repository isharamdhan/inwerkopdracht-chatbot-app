import type { RowDataPacket } from "mysql2/promise";

// Structure of one system prompt row
export interface SystemPromptRow extends RowDataPacket {
  id: number;
  content: string;
  updated_at: Date;
}
