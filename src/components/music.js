
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

function triple(scale, note) {
    const ns = Scale.get(scale).notes
    const major = transpose(note, '3M')
    const minor = transpose(note, '3m')
    const scaleContains = x => ns.indexOf(Note.pitchClass(x)) !== -1

    let tripleNote = major
    if (scaleContains(major) || scaleContains(Note.enharmonic(major))) { tripleNote = major }
    else if (scaleContains(minor) || scaleContains(Note.enharmonic(minor))) { tripleNote = minor }

    console.debug('using ', tripleNote == minor ? 'minor' : 'major', 'triple note', tripleNote)
    return tripleNote;
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

export function createFoo() {
    return Collection.range(1, 10)
        .map(() => randomScaleNote('F major', 'C4', 'G5').name)
        .map(n => [n, triple('F major', n)])
        .map(([a, b]) => [toAbc('F major', a), toAbc('F major', b)])
}

