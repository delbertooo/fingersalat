<template>
  <v-app>
    <v-app-bar
      app
      color="primary"
      dark
    >
      <span class="title ml-3 mr-5">Finger<span class="font-weight-light">salat</span></span>

      <v-spacer></v-spacer>

    </v-app-bar>

    <v-main>
      <Triples/>
    </v-main>
  </v-app>
</template>

<script>
import Triples from './components/Triples';

export default {
  name: 'App',

  components: {
    Triples,
  },

  data: () => ({
    //
  }),
};
</script>
