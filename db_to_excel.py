"""Export all tables from a SQLite database into an Excel workbook.

Usage:
    python db_to_excel.py --db data.db --out output.xlsx

Dependencies:
    pip install pandas openpyxl

This script will create one worksheet per table. Sheet names are sanitized to fit Excel's limits.
"""

from __future__ import annotations
import argparse
import sqlite3
import re
import sys
from typing import Iterable

try:
    import pandas as pd
except Exception as e:
    print("This script requires pandas and openpyxl. Install with: pip install pandas openpyxl")
    raise


EXCEL_SHEET_MAX_LEN = 31
INVALID_SHEET_CHARS = re.compile(r"[:\\/?*\[\]]")


def list_tables(conn: sqlite3.Connection) -> list[str]:
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name;")
    rows = cur.fetchall()
    return [r[0] for r in rows]


def sanitize_sheet_name(name: str, existing: set[str]) -> str:
    # Remove invalid chars
    s = INVALID_SHEET_CHARS.sub("", name)
    s = s[:EXCEL_SHEET_MAX_LEN]
    # Ensure uniqueness by appending a counter if needed
    base = s or "sheet"
    candidate = base
    i = 1
    while candidate in existing:
        suffix = f"_{i}"
        allowed_len = EXCEL_SHEET_MAX_LEN - len(suffix)
        candidate = (base[:allowed_len] + suffix) if len(base) > allowed_len else base + suffix
        i += 1
    existing.add(candidate)
    return candidate


def table_to_df(conn: sqlite3.Connection, table_name: str) -> pd.DataFrame:
    cur = conn.cursor()
    cur.execute(f"SELECT * FROM \"{table_name}\";")
    cols = [d[0] for d in cur.description] if cur.description else []
    rows = cur.fetchall()
    return pd.DataFrame(rows, columns=cols)


def export_db_to_excel(db_path: str, out_path: str) -> None:
    conn = sqlite3.connect(db_path)
    try:
        tables = list_tables(conn)
        if not tables:
            print(f"No tables found in database: {db_path}")
            return

        used_sheets: set[str] = set()
        # Use context manager to ensure ExcelWriter is properly closed (modern pandas)
        with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
            for table in tables:
                print(f"Exporting table: {table}")
                df = table_to_df(conn, table)
                sheet_name = sanitize_sheet_name(table, used_sheets)
                # If table is empty, still create an empty sheet with headers if available
                df.to_excel(writer, sheet_name=sheet_name, index=False)

        print(f"Export complete: {out_path}")
    finally:
        conn.close()


def parse_args(argv: Iterable[str] | None = None) -> argparse.Namespace:
    p = argparse.ArgumentParser(description="Export all tables from a SQLite database into an Excel workbook")
    p.add_argument("--db", required=True, help="Path to the SQLite database file (e.g., data.db)")
    p.add_argument("--out", default="output.xlsx", help="Path to output Excel file (default: output.xlsx)")
    return p.parse_args(argv)


def main(argv: Iterable[str] | None = None) -> int:
    args = parse_args(argv)
    try:
        export_db_to_excel(args.db, args.out)
        return 0
    except Exception as exc:
        print(f"Error: {exc}")
        return 2


if __name__ == "__main__":
    raise SystemExit(main())
