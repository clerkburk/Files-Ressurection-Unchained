import * as rd from "ts-instrumentality/road"

const f = new rd.TempFile()
f.isAt = "dfsfgds"

// let CONTROLLER: {
//   history: [target]

// = JSON.parse(
//   rd.Folder.home()
//     .createFileSync('controller.jsonc')
//     .readSync('utf-8')
//     .replace(/^\s*\/\/.*\n/, '')
// ) // true = added or modified, false = removed

// let ARCHIVE = new rd.Folder('./archive')


// Create a temporary folder that reflects the last state of the store by incrementing all changes
using STORE = new rd.TempFolder()
STORE.moveSync(new rd.Folder('./'))
for (let base of ARCHIVE.itSync(rd.Folder)) {
  const changes = JSON.parse(base.findSync('@changes.json', rd.File)!.readSync('utf-8'))
  for (const selected of base.listSync()) {
    if (!changes) {
      selected.copySync(STORE)
      continue
    }
    else if (changes[selected.name] === false)
      STORE.findSync(selected.name)!.deleteSync()
    else if (changes[selected.name] === true || selected.name !== '@changes.json')
      selected.copySync(STORE)
    else
      throw new Error(`Unexpected case for ${selected} with changes ${changes[selected.name]}`)
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