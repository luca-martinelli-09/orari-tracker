<template>
  <div class="overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Giorno
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Mattina Inizio
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Mattina Fine
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Pomeriggio Inizio
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Pomeriggio Fine
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Ore Totali
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Tipo
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Note
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Allegati
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr
          v-for="day in calendarDays"
          :key="day.date"
          :class="getDayClass(day)"
          @click="selectDay(day)"
        >
          <td
            class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
          >
            {{ formatDate(day.date) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <input
              v-if="day.dayType === 'working'"
              v-model="day.morningStart"
              @change="updateDay(day)"
              type="time"
              class="w-full text-sm border-gray-300 rounded-md"
            />
            <span v-else class="text-sm text-gray-500">-</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <input
              v-if="day.dayType === 'working'"
              v-model="day.morningEnd"
              @change="updateDay(day)"
              type="time"
              class="w-full text-sm border-gray-300 rounded-md"
            />
            <span v-else class="text-sm text-gray-500">-</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <input
              v-if="day.dayType === 'working'"
              v-model="day.afternoonStart"
              @change="updateDay(day)"
              type="time"
              class="w-full text-sm border-gray-300 rounded-md"
            />
            <span v-else class="text-sm text-gray-500">-</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <input
              v-if="day.dayType === 'working'"
              v-model="day.afternoonEnd"
              @change="updateDay(day)"
              type="time"
              class="w-full text-sm border-gray-300 rounded-md"
            />
            <span v-else class="text-sm text-gray-500">-</span>
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
            {{ day.totalHours }}h
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="day.dayType"
              @change="updateDay(day)"
              class="text-sm border-gray-300 rounded-md"
            >
              <option value="working">Lavorativo</option>
              <option value="weekend">Weekend</option>
              <option value="holiday">Festivo</option>
              <option value="vacation">Ferie</option>
              <option value="sick">Malattia</option>
              <option value="permit">Permesso</option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <input
              v-model="day.notes"
              @change="updateDay(day)"
              type="text"
              placeholder="Note..."
              class="w-full text-sm border-gray-300 rounded-md"
            />
          </td>
          <td class="px-6 py-4 whitespace-nowrap text-center">
            <div
              v-if="day.attachments && day.attachments.length > 0"
              class="inline-flex items-center space-x-1"
            >
              <svg
                class="w-4 h-4 text-blue-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="text-xs text-blue-600 font-medium">{{
                day.attachments.length
              }}</span>
            </div>
            <span v-else class="text-xs text-gray-400">-</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { holidaysService } from "@/services/api";

export default {
  name: "WorkHoursCalendar",
  props: {
    workHours: {
      type: Array,
      default: () => [],
    },
    selectedMonth: {
      type: Number,
      required: true,
    },
    selectedYear: {
      type: Number,
      required: true,
    },
    settings: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      holidays: [],
      selectedDayId: null,
    };
  },
  computed: {
    calendarDays() {
      const daysInMonth = new Date(
        this.selectedYear,
        this.selectedMonth,
        0,
      ).getDate();
      const days = [];

      for (let i = 1; i <= daysInMonth; i++) {
        const date = new Date(
          this.selectedYear,
          this.selectedMonth - 1,
          i,
          12,
          0,
          0,
          0,
        );
        const dateStr = date.toISOString().split("T")[0];

        const existingWorkHour = this.workHours.find(
          (wh) => new Date(wh.date).toISOString().split("T")[0] === dateStr,
        );

        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        const isHoliday = this.holidays.some((h) => h.date === dateStr);
        const isCustomHoliday = this.settings?.holidays?.customHolidays?.some(
          (h) => new Date(h.date).toISOString().split("T")[0] === dateStr,
        );

        let dayType = "working";
        if (isWeekend) dayType = "weekend";
        if (isHoliday || isCustomHoliday) dayType = "holiday";

        // Usa gli orari predefiniti dalle impostazioni se disponibili
        const defaultMorningStart =
          this.settings?.workHours?.defaultMorningStart || "08:30";
        const defaultMorningEnd =
          this.settings?.workHours?.defaultMorningEnd || "13:00";
        const defaultAfternoonStart =
          this.settings?.workHours?.defaultAfternoonStart || "14:00";
        const defaultAfternoonEnd =
          this.settings?.workHours?.defaultAfternoonEnd || "17:30";

        const day = {
          date: dateStr,
          morningStart: defaultMorningStart,
          morningEnd: defaultMorningEnd,
          afternoonStart: defaultAfternoonStart,
          afternoonEnd: defaultAfternoonEnd,
          totalHours: 0,
          dayType: dayType,
          notes: "",
          ...existingWorkHour,
        };

        if (day.dayType === "working") {
          day.totalHours = this.calculateTotalHours(day);
        }

        days.push(day);
      }

      return days;
    },
  },
  async mounted() {
    await this.loadHolidays();
  },
  watch: {
    selectedYear: {
      handler: "loadHolidays",
      immediate: true,
    },
  },
  methods: {
    async loadHolidays() {
      try {
        this.holidays = await holidaysService.getHolidays(this.selectedYear);
      } catch (error) {
        console.error("Error loading holidays:", error);
        this.holidays = [];
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const dayOfWeek = date.getDay();

      // Giorni della settimana in italiano
      const dayNames = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];
      const dayName = dayNames[dayOfWeek];

      return `${day}/${month} ${dayName}`;
    },
    getDayClass(day) {
      const classes = ["cursor-pointer", "transition-all", "duration-200"];

      const dayId = day._id || day.date;
      const isSelected = dayId === this.selectedDayId;

      if (isSelected) {
        classes.push(
          "bg-blue-50",
          "border-l-4",
          "border-l-blue-500",
          "shadow-sm",
          "relative",
        );
      } else {
        classes.push("hover:bg-gray-50", "border-l-4", "border-l-transparent");

        if (day.dayType === "weekend")
          classes.push("bg-slate-50", "text-slate-700");
        if (day.dayType === "holiday")
          classes.push("bg-red-50", "text-red-800");
        if (day.dayType === "vacation")
          classes.push("bg-amber-50", "text-amber-800");
        if (day.dayType === "sick")
          classes.push("bg-orange-50", "text-orange-800");
        if (day.dayType === "permit")
          classes.push("bg-emerald-50", "text-emerald-800");
      }

      return classes;
    },
    calculateTotalHours(day) {
      if (day.dayType !== "working") return 0;

      const morningHours = this.calculateHours(
        day.morningStart,
        day.morningEnd,
      );
      const afternoonHours = this.calculateHours(
        day.afternoonStart,
        day.afternoonEnd,
      );

      return morningHours + afternoonHours;
    },
    calculateHours(start, end) {
      if (!start || !end) return 0;

      const startTime = new Date(`1970-01-01T${start}:00`);
      const endTime = new Date(`1970-01-01T${end}:00`);

      return (endTime - startTime) / (1000 * 60 * 60);
    },
    updateDay(day) {
      if (day.dayType === "working") {
        day.totalHours = this.calculateTotalHours(day);
      } else {
        day.totalHours = 0;
      }

      this.$emit("update-work-hour", day);
    },
    selectDay(day) {
      this.selectedDayId = day._id || day.date;
      this.$emit("day-selected", day._id || day.date, day);
    },
  },
};
</script>
