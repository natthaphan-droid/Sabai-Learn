import { read, utils, writeFileXLSX } from 'xlsx';
import { usernameValue, textValue } from '../../backend-worker/src/domain.js';

const heading = value => String(value || '').replace(/[\s–—-]/g, '');
export function readRoster(bytes) {
  const workbook = read(bytes, { type: 'array', cellFormula: true, sheetRows: 5001 });
  return workbook.SheetNames.map(name => {
    const sheet = workbook.Sheets[name], range = utils.decode_range(sheet['!fullref'] || sheet['!ref'] || 'A1');
    if (range.e.r >= 5000 || range.e.c >= 100) throw new Error('ไฟล์ต้องไม่เกิน 5,000 แถวและ 100 คอลัมน์');
    const rows = utils.sheet_to_json(sheet, { header: 1, raw: false, defval: '', blankrows: true, range: 0 });
    const formulas = new Set(Object.keys(sheet).filter(key => sheet[key]?.f));
    const headerRow = Math.max(0, rows.findIndex(row => row.some(value => ['รหัสนักเรียน','เลขประจำตัว','เลขประจำตัวนักเรียน','เลขฯ'].includes(heading(value)))));
    const headers = rows[headerRow] || [];
    const idColumn = Math.max(0, headers.findIndex(value => ['รหัสนักเรียน','เลขประจำตัว','เลขประจำตัวนักเรียน','เลขฯ'].includes(heading(value))));
    const nameColumn = Math.max(0, headers.findIndex(value => ['ชื่อ','ชื่อสกุล','ชื่อนามสกุล'].includes(heading(value))));
    return { name, rows, formulas, headerRow, idColumn, nameColumn };
  });
}
export function rosterRows(sheet, { headerRow, idColumn, nameColumn, lastNameColumn = -1, fromFile = false }) {
  if (idColumn === nameColumn || lastNameColumn === idColumn || lastNameColumn === nameColumn) throw new Error('เลือกคอลัมน์รหัส ชื่อ และนามสกุลให้ต่างกัน');
  const result = [], used = new Set(), headers = sheet.rows[headerRow] || [];
  let classroom = null;
  sheet.rows.forEach((row, index) => {
    const match = row.join(' ').match(/ชั้นมัธยมศึกษาปีที่\s*(\d+)\s*\/\s*(\d+)\s+ภาคเรียนที่\s*([12])\s+ปีการศึกษา\s*(\d{4})/);
    if (match) classroom = { grade: `ม.${match[1]}`, room: match[2], term: Number(match[3]), year: match[4] };
    if (index <= headerRow) return;
    const username = String(row[idColumn] || '').trim(), name = [row[nameColumn], lastNameColumn < 0 ? '' : row[lastNameColumn]].filter(Boolean).join(' ').trim();
    if (!username && !name) return;
    if (heading(username) === heading(headers[idColumn]) && heading(row[nameColumn]) === heading(headers[nameColumn])) return;
    try {
      for (const column of [idColumn, nameColumn, lastNameColumn].filter(n => n >= 0)) if (sheet.formulas.has(utils.encode_cell({ r: index, c: column }))) throw new Error('ใช้ข้อความแทนสูตรในคอลัมน์รหัสและชื่อ');
      usernameValue(username); textValue(name, 'ชื่อนักเรียน', 150);
      if (used.has(username)) throw new Error(`รหัส ${username} ซ้ำในไฟล์`);
      if (fromFile && !classroom) throw new Error('ไม่พบชั้น ห้อง ภาคเรียน และปีในหัวเอกสาร');
      used.add(username); result.push({ username, name, classroom: fromFile ? classroom : null, row: index + 1 });
    } catch (error) { throw new Error(`แถว ${index + 1}: ${error.message}`); }
  });
  if (!result.length || result.length > 1000) throw new Error('เลือกไฟล์ที่มีรายชื่อ 1–1,000 คน');
  return result;
}
export function downloadRoster(name, rows) {
  const workbook = utils.book_new(), sheet = utils.aoa_to_sheet(rows);
  sheet['!cols'] = rows[0].map((_, index) => ({ wch: index === 1 ? 38 : 24 }));
  utils.book_append_sheet(workbook, sheet, 'รายชื่อ');
  writeFileXLSX(workbook, name);
}
