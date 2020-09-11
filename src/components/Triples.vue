<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="d-flex" cols="12">
        <v-select :items="scales" v-model="scale" label="Key"></v-select>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-range-slider
          label="Range"
          v-model="range"
          :min="0"
          :max="notes.length - 1"
          thumb-label="always"
        >
          <template v-slot:thumb-label="{ value }">{{ notes[value] }}</template>
        </v-range-slider>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-slider
          label="Speed"
          v-model="speed"
          :min="40"
          :max="220"
          hint="BPM"
          persistent-hint
          thumb-label="always"
        ></v-slider>
      </v-col>
      <v-col class="d-flex" cols="12">
        <v-btn icon v-on:click="generate" x-large>
          <v-icon>mdi-cached</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row class="text-center">
      <v-col cols="12">
        <div id="midi" class="abcjs-large"></div>
      </v-col>
      <v-col cols="12">
        <div>
          <div id="paper"></div>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "abcjs/abcjs-midi.css";
import abcjs from "abcjs/midi";
import { createTriples, notesBetween } from "./music";
export default {
  name: "Triples",

  data: () => ({
    progress: {},
    _tune: "",
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
    generate() {
      const input = createTriples(
        this.scale,
        this.notes[this.range[0]],
        this.notes[this.range[1]]
      );
      const notes = input
        .map(([a, b]) => "(" + a + "2 " + b + "2" + ")")
        .join(" | ");
      const lastNote = input[input.length - 1][0] + "4";
      this.tune = `
X:4
T:Thirds
M:4/4
L:1/4
Q:${this.speed}
K: ${this.scale}
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
