<template>
  <v-data-table :headers="headers" :items="members" sort-by="surname" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat color="white">
        <v-toolbar-title>MY CREW</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div>September</div>
        <v-divider class="mx-4" inset vertical></v-divider>
        <div>
          {{ referenceDate }}<br />
          {{
            weekDays(referenceDate)
              .get('friday')
              .toLocaleString()
          }}
        </div>
        <v-btn color="primary" dark class="mb-2" @click="backWeek()">-</v-btn>
        <v-btn color="primary" dark class="mb-2" @click="goToday()">T</v-btn>
        <v-btn color="primary" dark class="mb-2" @click="forwardWeek()">+</v-btn>
        <div class="flex-grow-1"></div>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="primary" dark class="mb-2" v-on="on">New Member</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.surname" label="Surname"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <div class="flex-grow-1"></div>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.monday="{ item }">
      <v-text-field v-model="item.monday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.tuesday="{ item }">
      <v-text-field v-model="item.tuesday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.wednesday="{ item }">
      <v-text-field v-model="item.wednesday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.thursday="{ item }">
      <v-text-field v-model="item.thursday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.friday="{ item }">
      <v-text-field v-model="item.friday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.saturday="{ item }">
      <v-text-field v-model="item.saturday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.sunday="{ item }">
      <v-text-field v-model="item.sunday" placeholder="0.0"></v-text-field>
    </template>
    <template v-slot:item.total="{ item }">
      {{ totalHours(item) }}
    </template>
    <template v-slot:item.action="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        edit
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">Reset</v-btn>
    </template>
  </v-data-table>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  data: () => ({
    referenceDate: null,
    dialog: false,
    members: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      surname: '',
    },
    defaultItem: {
      name: '',
      surname: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    headers() {
      return [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Surname',
          align: 'left',
          sortable: true,
          value: 'surname',
        },
        { text: 'MON ' + this.weekDays(this.referenceDate).get('monday').day, value: 'monday' },
        { text: 'TUE ' + this.weekDays(this.referenceDate).get('tuesday').day, value: 'tuesday' },
        {
          text: 'WED ' + this.weekDays(this.referenceDate).get('wednesday').day,
          value: 'wednesday',
        },
        { text: 'THU ' + this.weekDays(this.referenceDate).get('thursday').day, value: 'thursday' },
        { text: 'FRI ' + this.weekDays(this.referenceDate).get('friday').day, value: 'friday' },
        { text: 'SAT ' + this.weekDays(this.referenceDate).get('saturday').day, value: 'saturday' },
        { text: 'SUN ' + this.weekDays(this.referenceDate).get('sunday').day, value: 'sunday' },
        { text: 'Total', value: 'total' },
        { text: 'Actions', value: 'action', sortable: false },
      ]
    },
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.referenceDate = DateTime.local()
      this.members = [
        {
          name: 'Enrique',
          surname: 'Mendoza Robaina',
        },
        {
          name: 'Ángel',
          surname: 'Bollo Heredia',
        },
        {
          name: 'Antonio',
          surname: 'Guerrero',
        },
        {
          name: 'Antonio',
          surname: 'Juanilla',
        },
        {
          name: 'Flor',
          surname: 'Fernández',
          monday: 0,
          tuesday: 0,
          wednesday: 0,
          thursday: 0,
          friday: 0,
          saturday: 0,
          sunday: 0,
        },
      ]
    },

    backWeek() {
      this.referenceDate = this.referenceDate.minus({ weeks: 1 })
    },
    goToday() {
      this.referenceDate = DateTime.local()
    },
    forwardWeek() {
      this.referenceDate = this.referenceDate.plus({ weeks: 1 })
    },
    today() {
      return DateTime.local().toLocaleString()
    },
    weekDays(date) {
      const referenceDate = date || DateTime.local()
      const weekDates = new Map()
      weekDates.set('monday', referenceDate.startOf('week'))
      weekDates.set('tuesday', referenceDate.startOf('week').plus({ days: 1 }))
      weekDates.set('wednesday', referenceDate.startOf('week').plus({ days: 2 }))
      weekDates.set('thursday', referenceDate.startOf('week').plus({ days: 3 }))
      weekDates.set('friday', referenceDate.startOf('week').plus({ days: 4 }))
      weekDates.set('saturday', referenceDate.startOf('week').plus({ days: 5 }))
      weekDates.set('sunday', referenceDate.startOf('week').plus({ days: 6 }))
      return weekDates
    },
    totalHours(item) {
      return (
        parseFloat(item.monday || 0) +
        parseFloat(item.tuesday || 0) +
        parseFloat(item.wednesday || 0) +
        parseFloat(item.thursday || 0) +
        parseFloat(item.friday || 0) +
        parseFloat(item.saturday || 0) +
        parseFloat(item.sunday || 0)
      )
    },
    editItem(item) {
      this.editedIndex = this.members.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      const index = this.members.indexOf(item)
      confirm('Are you sure you want to delete this item?') && this.members.splice(index, 1)
    },

    close() {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },

    save() {
      if (this.editedIndex > -1) {
        Object.assign(this.members[this.editedIndex], this.editedItem)
      } else {
        this.members.push(this.editedItem)
      }
      this.close()
    },
  },
}
</script>
