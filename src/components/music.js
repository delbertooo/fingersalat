
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
    return {value: AbcNotation.scientificToAbcNotation(noteToConvert), note}
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

const fingeringMap = {
    "F#3": "123",
    "G3": "13",
    "G#3": "23",
    "A3": "12",
    "A#3": "1",
    "B3": "2",
    "C4": "0",
    "C#4": "123",
    "D4": "13",
    "D#4": "23",
    "E4": "12",
    "F4": "1",
    "F#4": "2",
    "G4": "0",
    "G#4": "23",
    "A4": "12",
    "A#4": "1",
    "B4": "2",
    "C5": "0",
    "C#5": "12",
    "D5": "1",
    "D#5": "2",
    "E5": "0",
    "F5": "1",
    "F#5": "2",
    "G5": "0",
    "G#5": "23",
    "A5": "12",
    "A#5": "1",
    "B5": "2",
    "C6": "0",
}

export function fingering(note) {
    const fingering = fingeringMap[note] || fingeringMap[Note.enharmonic(note)] || ''
    return fingering.split("")
}
