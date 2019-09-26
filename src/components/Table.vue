<template>
  <div>
    <v-data-table :headers="headers" :items="membersHours" sort-by="surname" class="elevation-1">
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-toolbar-title>MY CREW</v-toolbar-title>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div>{{ referenceDate.monthLong.toUpperCase() }}</div>
          <v-divider class="mx-4" inset vertical></v-divider>
          <div>
            Week {{ referenceDate.weekNumber }},
            {{
              weekDays(referenceDate)
                .get('weekday0')
                .toLocaleString()
            }}
            to
            {{
              weekDays(referenceDate)
                .get('weekday6')
                .toLocaleString()
            }}
          </div>

          <div class="flex-grow-1">
            <v-btn class="mb-2 mx-2" @click="backWeek()">-</v-btn>
            <v-btn class="mb-2 mx-2" @click="goToday()">Today</v-btn>
            <v-btn class="mb-2 mx-2" @click="forwardWeek()">+</v-btn>
          </div>
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
      <template v-slot:item.weekday0="{ item }">
        <v-text-field
          v-model="item.weekday0"
          placeholder="0.0"
          @keyup="commitDay(item, 0)"
        ></v-text-field>
      </template>
      <template v-slot:item.weekday1="{ item }">
        <v-text-field
          v-model="item.weekday1"
          placeholder="0.0"
          @keyup="commitDay(item, 1)"
        ></v-text-field>
      </template>
      <template v-slot:item.weekday2="{ item }">
        <v-text-field
          v-model="item.weekday2"
          placeholder="0.0"
          @keyup="commitDay(item, 2)"
        ></v-text-field>
      </template>
      <template v-slot:item.weekday3="{ item }">
        <v-text-field
          v-model="item.weekday3"
          placeholder="0.0"
          @keyup="commitDay(item, 3)"
        ></v-text-field>
      </template>
      <template v-slot:item.weekday4="{ item }">
        <v-text-field
          v-model="item.weekday4"
          placeholder="0.0"
          @keyup="commitDay(item, 4)"
        ></v-text-field>
      </template>
      <template v-slot:item.weekday5="{ item }">
        <v-text-field
          v-model="item.weekday5"
          placeholder="0.0"
          @keyup="commitDay(item, 5)"
        ></v-text-field>
      </template>
      <template v-slot:item.weekday6="{ item }">
        <v-text-field
          v-model="item.weekday6"
          placeholder="0.0"
          @keyup="commitDay(item, 6)"
        ></v-text-field>
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

    <v-btn class="ma-2" @click="resetCalendar()">Reset Calendar</v-btn>
  </div>
</template>

<script>
import { DateTime, Interval } from 'luxon'

export default {
  data: () => ({
    referenceDateStatic: null,
    dialog: false,
    contract: {},
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
    referenceDate() {
      return this.referenceDateStatic
    },
    calendar() {
      return this.$store.getters['storage/calendar']
    },
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    headers() {
      const referenceDate = this.referenceDate
      const weekDays = this.weekDays(referenceDate)
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
        {
          text: this.weekdayString(weekDays.get('weekday0')),
          value: 'weekday0',
          sortable: false,
        },
        { text: this.weekdayString(weekDays.get('weekday1')), value: 'weekday1', sortable: false },
        {
          text: this.weekdayString(weekDays.get('weekday2')),
          sortable: false,
          value: 'weekday2',
        },
        { text: this.weekdayString(weekDays.get('weekday3')), value: 'weekday3', sortable: false },
        { text: this.weekdayString(weekDays.get('weekday4')), value: 'weekday4', sortable: false },
        { text: this.weekdayString(weekDays.get('weekday5')), value: 'weekday5', sortable: false },
        { text: this.weekdayString(weekDays.get('weekday6')), value: 'weekday6', sortable: false },
        { text: 'Total', value: 'total', sortable: false },
        { text: 'Actions', value: 'action', sortable: false },
      ]
    },
    membersHours() {
      const referenceDate = this.referenceDate
      const startOfWeek = referenceDate.startOf('week')
      const endOfWeek = referenceDate.startOf('week').plus({ days: 7 })
      const i = Interval.fromDateTimes(startOfWeek, endOfWeek)
      const membersCopy = this.members
      membersCopy.map(item => {
        item.weekday0 = null
        item.weekday1 = null
        item.weekday2 = null
        item.weekday3 = null
        item.weekday4 = null
        item.weekday5 = null
        item.weekday6 = null
        return item
      })
      const result = this.calendar
        .filter(item => {
          return i.contains(DateTime.fromISO(item.date))
        })
        .reduce((total, currentValue, currentIndex, arr) => {
          const weekdayNumber = DateTime.fromISO(currentValue.date).weekday - 1
          membersCopy[currentValue.member]['weekday' + weekdayNumber] = currentValue.hours

          console.log(total, currentValue, currentIndex, arr)
          return membersCopy
        }, this.members)
      return result
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
      console.log(localStorage.calendar)
      this.contract = {
        contractId: 0,
        date: '',
        client: {
          clientId: 0,
          clientName: 'Santander',
        },
        project: {
          projectId: 0,
          projectName: 'Common APIs',
        },
      }
      this.referenceDateStatic = DateTime.local()
      this.members = [
        {
          id: 0,
          clientId: 'YZ3150735',
          name: 'Harry',
          surname: 'Bane',
          providerId: 'provider_ACME',
          providerName: 'ACME',
        },
        {
          id: 1,
          clientId: 'YZ3150407',
          name: 'Angel',
          surname: 'Sweet',
          providerId: 'provider_MEAC',
          providerName: 'MEAC',
          subcontractorId: 'provider_DOUBLE',
          subcontractorName: 'DOUBLE',
        },
        {
          id: 2,
          clientId: 'ZY3150409',
          name: 'Anthony',
          surname: 'Warrior',
          providerId: 'provider_MEAC',
          providerName: 'MEAC',
          subcontractorId: 'provider_SKY',
          subcontractorName: 'SKY',
        },
        {
          id: 3,
          clientId: 'ZY3150412',
          name: 'Joshep',
          surname: 'King',
          providerId: 'provider_MEAC',
          providerName: 'MEAC',
          subcontractorId: 'provider_COCO',
          subcontractorName: 'COCO',
        },
        {
          id: 4,
          clientId: 'ZY3151761',
          name: 'Flower',
          surname: 'Sun',
          providerId: 'provider_MEAC',
          providerName: 'MEAC',
          subcontractorId: 'provider_SKY',
          subcontractorName: 'SKY',
        },
      ]

      /*this.calendar =
       */
      /*this.$store.dispatch('storage/setCalendar', [
        { id: 0, member: 0, date: '2019-09-02', hours: '4.5' },
        { id: 1, member: 0, date: '2019-09-03', hours: '8.0' },
        { id: 2, member: 0, date: '2019-09-04', hours: '7.0' },
        { id: 3, member: 0, date: '2019-09-05', hours: '8' },
        { id: 4, member: 1, date: '2019-09-02', hours: '4.5' },
        { id: 5, member: 1, date: '2019-09-03', hours: '8.0' },
        { id: 6, member: 1, date: '2019-09-04', hours: '7.0' },
        { id: 7, member: 1, date: '2019-09-05', hours: '8' },
        { id: 8, member: 2, date: '2019-09-02', hours: '4.5' },
        { id: 9, member: 2, date: '2019-09-03', hours: '8.0' },
        { id: 10, member: 3, date: '2019-09-02', hours: '7.0' },
        { id: 11, member: 3, date: '2019-09-03', hours: '8' },
        { id: 12, member: 0, date: '2019-09-05', hours: '8' },
        { id: 13, member: 1, date: '2019-08-28', hours: '4.5' },
        { id: 14, member: 1, date: '2019-09-29', hours: '8.0' },
        { id: 15, member: 4, date: '2019-09-28', hours: '7.0' },
        { id: 16, member: 3, date: '2019-09-28', hours: '8' },
      ])*/

      //this.calendar = this.$store.getters['storage/calendar']
    },
    weekdayString(date) {
      return date.weekdayShort.toUpperCase() + ' ' + date.day
    },
    backWeek() {
      this.commitWeek()
      this.referenceDateStatic = this.referenceDate.minus({ weeks: 1 })
    },
    goToday() {
      this.commitWeek()
      this.referenceDateStatic = DateTime.local()
    },
    forwardWeek() {
      this.commitWeek()
      this.referenceDateStatic = this.referenceDate.plus({ weeks: 1 })
    },
    today() {
      return DateTime.local().toLocaleString()
    },
    weekDays(date) {
      const referenceDate = date || DateTime.local()
      const startOfWeekDate = referenceDate.startOf('week')
      const weekDates = new Map()
      weekDates.set('weekday0', startOfWeekDate)
      weekDates.set('weekday1', startOfWeekDate.plus({ days: 1 }))
      weekDates.set('weekday2', startOfWeekDate.plus({ days: 2 }))
      weekDates.set('weekday3', startOfWeekDate.plus({ days: 3 }))
      weekDates.set('weekday4', startOfWeekDate.plus({ days: 4 }))
      weekDates.set('weekday5', startOfWeekDate.plus({ days: 5 }))
      weekDates.set('weekday6', startOfWeekDate.plus({ days: 6 }))
      return weekDates
    },
    totalHours(item) {
      return (
        parseFloat(item.weekday0 || 0) +
        parseFloat(item.weekday1 || 0) +
        parseFloat(item.weekday2 || 0) +
        parseFloat(item.weekday3 || 0) +
        parseFloat(item.weekday4 || 0) +
        parseFloat(item.weekday5 || 0) +
        parseFloat(item.weekday6 || 0)
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
    commitWeek() {},
    commitDay(member, weekday) {
      if (!member['weekday' + weekday]) {
        console.log('Error with hours')
      }
      const calendarItem = {
        date: this.referenceDate
          .startOf('week')
          .plus({ days: weekday })
          .toISODate(),
        member: member.id,
        hours: member['weekday' + weekday],
      }
      this.$store.dispatch('storage/addCalendarItem', calendarItem)
    },
    resetCalendar() {
      this.$store.dispatch('storage/setCalendar', [])
      this.$router.push('home')
    },
  },
}
</script>

<style lang="scss" scoped>
table tbody tr:not(:last-child) {
  border-bottom: none;
  background-color: red;
}
</style>
