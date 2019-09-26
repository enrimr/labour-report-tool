<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>LABOUR REPORT TOOL</span>
        <span class="font-weight-light"> by coding.es</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
    </v-app-bar>

    <v-content>
      <LabourReport />
    </v-content>
  </v-app>
</template>

<script>
import LabourReport from './components/LabourReport'

export default {
  name: 'App',
  components: {
    LabourReport,
  },
  data: () => ({
    //
  }),
}
</script>
