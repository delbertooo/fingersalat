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
      <Thirds/>
    </v-main>
  </v-app>
</template>

<script>
import Thirds from './components/Thirds';

export default {
  name: 'App',

  components: {
    Thirds,
  },

  data: () => ({
    //
  }),
};
</script>
