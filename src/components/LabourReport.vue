<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex xs12>
        <Table />
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Table from './Table'

export default {
  components: {
    Table,
  },
  data: () => ({}),
  methods: {},
}
</script>
