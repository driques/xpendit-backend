import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { Expense } from '../../domain/models';
import { CsvRow } from '../../application/interfaces/ICsvRow';

export class CsvExpenseReader {
  read(path: string): Expense[] {
    const file = fs.readFileSync(path);
    return this.parseCsv(file);
  }

  readFromBuffer(buffer: Buffer): Expense[] {
    return this.parseCsv(buffer);
  }

  private parseCsv(input: Buffer): Expense[] {
    const records: CsvRow[] = parse(input, {
      columns: true,
      skip_empty_lines: true,
    });
    return records.map(
      (row) =>
        new Expense(
          row.gasto_id,
          Number(row.monto),
          row.moneda,
          row.fecha,
          row.categoria,
        ),
    );
  }
}
