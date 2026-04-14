import fs from 'fs/promises'
import path from 'path'
import { ProgressEntryRow } from './progress'

const BACKUP_FILE_PATH = path.join(process.cwd(), 'backup_db.json')

export async function getBackupData(): Promise<ProgressEntryRow[]> {
  try {
    const fileContents = await fs.readFile(BACKUP_FILE_PATH, 'utf-8')
    return JSON.parse(fileContents) as ProgressEntryRow[]
  } catch (error) {
    // If the file doesn't exist or is invalid, return an empty array
    return []
  }
}

export async function saveToBackupData(payload: ProgressEntryRow): Promise<ProgressEntryRow> {
  const data = await getBackupData()
  
  const existingIndex = data.findIndex(row => row.day === payload.day)
  if (existingIndex >= 0) {
    data[existingIndex] = payload
  } else {
    data.push(payload)
  }

  await fs.writeFile(BACKUP_FILE_PATH, JSON.stringify(data, null, 2), 'utf-8')
  return payload
}
