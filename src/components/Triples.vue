<template>
  <v-container>
    <v-row class="text-center">
      <v-col class="d-flex" cols="12" sm="6">
        <v-select :items="scales" v-model="scale" label="Key"></v-select>
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
import { createTriples } from "./music";
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
    scale: "F major",
    minNote: "C4",
    maxNote: "G5",
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
  mounted() {
    this.generate();
  },
  methods: {
    generate() {
      const input = createTriples(this.scale, this.minNote, this.maxNote);
      const notes = input.map(([a, b]) => "(" + a + "2 " + b + "2" + ")").join(" | ");
      const lastNote = input[input.length - 1][0] + "4";
      this.tune = `
X:4
T:Thirds
M:4/4
L:1/4
Q:100
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
