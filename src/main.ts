import path from "node:path";
import * as rd from "./road.ts"

interface Change {
  [path: string]: boolean
}

const ARCHIVE = new rd.Folder('./archive')

// Create a temporary folder that reflects the last state of the store by incrementing all changes
using STORE = new rd.TempFolder()
STORE.move_sync(new rd.Folder('./'))
for (const base of ARCHIVE.list_sync(rd.Folder)) {
  const changes = JSON.parse(base.find_sync('@changes.json', rd.File)?.read_sync('utf-8') || '{}') as Change
  for (const selected of base.list_sync()) {
    if (!changes) {
      selected.copy_sync(STORE)
      continue
    }
    else if (changes[selected.name()] === false)
      STORE.find_sync(selected.name())!.delete_sync()
    else if (changes[selected.name()] === true || selected.name() !== '@changes.json')
      selected.copy_sync(STORE)
  }
}

// const SWAP = new rd.Folder('./swap')
// const STORE = new rd.Folder('./storage')
// const ARCHIVE = new rd.Folder('./archive')
// const removed: string[] = []
// const added: string[] = []
// function compare(sharedName: string) {
//   const ogDir = new rd.Folder(STORE.join(sharedName))
//   const newDir = new rd.Folder(SWAP.join(sharedName))
//   for (const ogEntry of ogDir.list_sync()) {
//     const newEntry = newDir.find_sync(ogEntry.name())
//     if (!newEntry)
//       removed.push(ogEntry.isAt.slice(STORE.isAt.length+1))
//     else if ((ogEntry instanceof rd.File && newEntry instanceof rd.Folder) ||
//              (ogEntry instanceof rd.Folder && newEntry instanceof rd.File)) {
//       removed.push(ogEntry.isAt.slice(STORE.isAt.length+1))
//       added.push(newEntry.isAt.slice(SWAP.isAt.length+1))
//     }
//     else if (ogEntry instanceof rd.File && newEntry instanceof rd.File) {
//       if (!ogEntry.read_sync().equals(newEntry.read_sync())) {
//         removed.push(ogEntry.isAt.slice(STORE.isAt.length+1))
//         added.push(newEntry.isAt.slice(SWAP.isAt.length+1))
//       }
//     }
//     else if (ogEntry instanceof rd.Folder && newEntry instanceof rd.Folder)
//       compare(sharedName + '/' + ogEntry.name())
//     else
//       throw new Error(`Unexpected edge case for ${ogEntry} and ${newEntry}`)
//   }
//   for (const newEntry of newDir.list_sync())
//     if (!ogDir.find_sync(newEntry.name()))
//       added.push(newEntry.isAt.slice(SWAP.isAt.length+1))
// }