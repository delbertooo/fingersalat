
import { Note, Scale, Collection, AbcNotation, transpose } from "@tonaljs/tonal";


export function randomScaleNote(scale, min, max) {
    const ns = Scale.get(scale).notes
    const hs = [3, 4, 5, 6]
    const minNote = Note.get(min)
    const maxNote = Note.get(max)
    let n
    do {
        n = Note.get(Collection.shuffle(ns)[0] + Collection.shuffle(hs)[0])
        //console.debug('Iteration', n)
        if (n.empty) throw new Error('WTF?')
    } while (n.height > maxNote.height || n.height < minNote.height)
    return n
}

function third(scale, note) {
    const ns = Scale.get(scale).notes
    const major = transpose(note, '3M')
    const minor = transpose(note, '3m')
    const scaleContains = x => ns.indexOf(Note.pitchClass(x)) !== -1

    let thirdNote = major
    if (scaleContains(major) || scaleContains(Note.enharmonic(major))) { thirdNote = major }
    else if (scaleContains(minor) || scaleContains(Note.enharmonic(minor))) { thirdNote = minor }

    console.debug('using ', thirdNote == minor ? 'minor' : 'major', 'third note', thirdNote)
    return thirdNote;
}

function toAbc(scale, note) {
    const ns = Scale.get(scale).notes
    const scaleContains = x => ns.indexOf(Note.pitchClass(x)) !== -1

    let noteToConvert = note
    if (scaleContains(note)) {
        const n = Note.get(note)
        noteToConvert = n.letter + (n.oct ?? '')
    }
    console.debug('made', note, 'to', noteToConvert)
    return AbcNotation.scientificToAbcNotation(noteToConvert)
}

export function createThirds(scale, minNote, maxNote) {
    const realMaxNote = transpose(maxNote, '-3M')
    return Collection.range(1, 10)
        .map(() => randomScaleNote(scale, minNote, realMaxNote).name)
        .map(n => [n, third(scale, n)])
        .map(([a, b]) => [toAbc(scale, a), toAbc(scale, b)])
}

export function notesBetween(min, max) {
    const nMin = Note.get(min)
    const nMax = Note.get(max)
    if (nMin.height >= nMax.height) throw new Error('min >= max')
    const nextNote = note => {
        let n = note
        if (n.alt == -1) {
            n = Note.get(Note.enharmonic(n))
        }
        return Note.get(Note.simplify(n.pc + '#' + n.oct))
    }
    const r = []
    for (let currentNote = nMin; currentNote.height <= nMax.height; currentNote = nextNote(currentNote)) {
        r.push(currentNote.name)
    }
    return r
}

