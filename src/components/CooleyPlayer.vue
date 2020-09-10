<template>
  <v-container>
    <v-row class="text-center">
      <v-col cols="12">
        <v-btn icon v-on:click="generate">
          <v-icon>mdi-cached</v-icon>
        </v-btn>
        <v-textarea
          id="abc-source"
          solo
          label="Source"
          v-model="tune"
        ></v-textarea>
        <div class="listener-output">
          <div class="label">
            Currently Playing:
            <span class="abc-string">{{currentAbcFragment}}</span>
          </div>

          <div class="label">Parameters sent to listener callback:</div>
          <div>Progress: {{progress.progress }}</div>
          <div>Current Time: {{progress.currentTime }}</div>
          <div>Total Duration: {{progress.duration }}</div>
          <div>New Beat? {{progress.newBeat }}</div>
        </div>
        <div id="midi"></div>
        <div id="paper"></div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import "abcjs/abcjs-midi.css";
import abcjs from "abcjs/midi";
import {createFoo} from "./music"
export default {
  name: "CooleyPlayer",

  data: () => ({
    progress: {},
    currentAbcFragment: "(none)",
    tune:
      'X:1\nT: Cooley\'s\nM: 4/4\nL: 1/8\nR: reel\nK: Emin\nD2|:"Em"EB{c}BA B2 EB|~B2 AB dBAG|"D"FDAD BDAD|FDAD dAFD|\n"Em"EBBA B2 EB|B2 AB defg|"D"afe^c dBAF|1"Em"DEFD E2 D2:|2"Em"DEFD E2 gf||\n|:"Em"eB B2 efge|eB B2 gedB|"D"A2 FA DAFA|A2 FA defg|\n"Em"eB B2 eBgB|eB B2 defg|"D"afe^c dBAF|1"Em"DEFD E2 gf:|2"Em"DEFD E4|]\n',
  }),
  mounted() {
    //abcjs.renderAbc("paper", this.tune, {});
    new abcjs.Editor("abc-source", {
      canvas_id: "paper",
      generate_midi: true,
      midi_id: "midi",
      abcjsParams: {
        midiListener: this.listener,
        animate: {
          listener: this.animate,
        },
      },
    });
  },

  methods: {
    generate() {
      const input = createFoo()
      const notes = input.map(([a,b]) => a + "2 " + b + "2").join(' | ')
      const lastNote = input[input.length - 1][0] + "4"
      this.tune = `
X:4
T:Thirds
M:4/4
L:1/4
K:Bb
${notes} | ${lastNote} ||
`
    },
    listener(midiControl, progress) {
      // This provides a more linear view of the progress, for a progress bar or for an unrelated animation.
      this.progress = progress;
    },
    colorRange(range, color) {
      if (range && range.elements) {
        range.elements.forEach(set => {
          set.forEach(item => {
            item.setAttribute("fill", color);
          });
        });
      }
    },
    animate(lastRange, currentRange) {
      // This provides the actual visual note being played. It can be used to create the "bouncing ball" effect.
      this.colorRange(lastRange, "#000000"); // Set the old note back to black.
      this.colorRange(currentRange, "#3D9AFC"); // Set the currently sounding note to blue.
      if (currentRange)
        this.currentAbcFragment = this.tune.substring(
          currentRange.startChar,
          currentRange.endChar
        );
      else this.currentAbcFragment = "(none)";
    },
  },
};
</script>

<style>

.listener-output {
  border: 1px solid #888888;
  padding: 6px;
  border-radius: 4px;
  width: 460px;
  margin-bottom: 20px;
}

.abc-string {
  border: 1px solid #e9ef96;
  padding: 2px;
  height: 24px;
  width: 60px;
  display: inline-block;
  background: #fbf4b8;
}

</style>