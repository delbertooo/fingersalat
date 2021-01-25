<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="d-flex">
        <v-select :items="scales" v-model="scale" label="Key"
          v-on:change="generate()"></v-select>
      </v-col>
      <v-col class="d-flex">
        <v-switch v-model="showFingering" label="Show fingering" v-on:change="generate(true)"></v-switch>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-range-slider
          label="Range"
          v-model="range"
          :min="0"
          :max="notes.length - 1"
          v-on:change="generate()"
          thumb-label="always"
        >
          <template v-slot:thumb-label="{ value }">{{ notes[value] }}</template>
        </v-range-slider>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-slider
          label="Speed"
          v-model="speed"
          v-on:change="generate(true)"
          :min="40"
          :max="220"
          hint="BPM"
          persistent-hint
          thumb-label="always"
        ></v-slider>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <v-btn icon v-on:click="generate()" x-large>
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <div id="midi"></div>
      </v-col>
      <v-col cols="12">
        <div>
          <div id="paper"></div>
        </div>
      </v-col>
    </v-row>
    <v-snackbar v-model="errorShown">
      {{ errorText }}

      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="errorShown = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>

  </v-container>
</template>

<script>
import "abcjs/abcjs-midi.css";
import abcjs from "abcjs/midi";
import { createThirds, notesBetween, fingering, NotesTooCloseException } from "./music";
export default {
  name: "Thirds",

  data: () => ({
    progress: {},
    errorShown: false,
    errorText: "",
    _tune: "",
    _generatedNotes: [],
    showFingering: false,
    scales: [
      "A major",
      "D major",
      "G major",
      "C major",
      "F major",
      "Bb major",
      "Eb major",
    ],
    notes: notesBetween("F#3", "C6"),
    scale: "F major",
    speed: 100,
    minNote: 0,
    maxNote: 0,
    range: [0, 0],
  }),
  computed: {
    tune: {
      get() {
        return this._tune;
      },
      set(tune) {
        this._tune = tune;
        const tunes = abcjs.renderAbc("paper", tune, {
          add_classes: true,
          responsive: "resize",
        });
        abcjs.renderMidi("midi", tune, {
          animate: {
            listener: this.animate,
            target: tunes[0],
          },
        });
      },
    },
  },
  created() {
    this.range = ["C4", "G5"].map(x => this.notes.indexOf(x));
  },
  mounted() {
    this.generate();
  },
  methods: {
    fingeringText(note) {
      if (!this.showFingering) {
        return ''
      }
      return fingering(note).map(x => `"_${x}"`).join('')
    },
    generate(shallow) {
      if (!shallow) {
        this.errorShown = false
        try {
          this._generatedNotes = createThirds(
            this.scale,
            this.notes[this.range[0]],
            this.notes[this.range[1]]
          )
        } catch (e) {
          console.error('error generating notes:', e)
          if (e instanceof NotesTooCloseException) {
            this.errorShown = true
            this.errorText = "Oops. The selected range is too close."
          }
        }
      }
      const input = this._generatedNotes
      const toNote = (generatedNote, length) => `${this.fingeringText(generatedNote.note)}${generatedNote.value}${length}`
      const notes = input
        .map(([a, b]) => `(${toNote(a, 2)} ${toNote(b, 2)})`)
        .join(" | ");
      const lastNote = toNote(input[input.length - 1][0], 4);
      this.tune = `
X:4
T:Thirds
M:4/4
L:1/4
Q:${this.speed}
K: ${this.scale}
V:T1 name="🎺 in Bb"   snm="🎺" transpose=-2
${notes} | ${lastNote} ||
`;
    },
    colorRange(range, color) {
      if (range && range.elements) {
        range.elements.forEach((set) => {
          set.forEach((item) => {
            item.setAttribute("fill", color);
          });
        });
      }
    },
    animate(lastRange, currentRange) {
      // This provides the actual visual note being played. It can be used to create the "bouncing ball" effect.
      this.colorRange(lastRange, "#000000"); // Set the old note back to black.
      this.colorRange(currentRange, "#3D9AFC"); // Set the currently sounding note to blue.
    },
  },
};
</script>
