
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

export function createFoo() {
    return Collection.range(1, 10)
        .map(() => randomScaleNote('F major', 'C4', 'G5').name)
        .map(n => [n, transpose(n, '3M')]) // TODO: take minor if it's part of the scale
        .map(([a, b]) => [AbcNotation.scientificToAbcNotation(a), AbcNotation.scientificToAbcNotation(b)]) // TODO: if note or enharmonic is in scale -> use scale value without alteration
}

