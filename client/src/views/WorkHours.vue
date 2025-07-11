<template>
  <div class="space-y-8">
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div
        class="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0"
      >
        <div class="flex items-center space-x-3">
          <div
            class="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-6 h-6 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Orari di Lavoro</h1>
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center space-x-2">
            <span class="text-sm font-medium text-gray-700">Periodo:</span>
            <div class="flex items-center space-x-1">
              <div class="relative">
                <select
                  v-model="selectedMonth"
                  @change="loadWorkHours"
                  class="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option
                    v-for="month in months"
                    :key="month.value"
                    :value="month.value"
                  >
                    {{ month.label }}
                  </option>
                </select>
              </div>
              <div class="relative">
                <select
                  v-model="selectedYear"
                  @change="loadWorkHours"
                  class="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                >
                  <option v-for="year in years" :key="year" :value="year">
                    {{ year }}
                  </option>
                </select>
              </div>
            </div>
          </div>
          <button
            @click="saveAllWorkHours"
            :disabled="saving"
            class="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <svg
              v-if="saving"
              class="animate-spin w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clip-rule="evenodd"
              />
            </svg>
            <span v-if="saving">Salvataggio...</span>
            <span v-else>Salva Tutto</span>
          </button>
          <button
            @click="generatePDF"
            class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
          >
            <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fill-rule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                clip-rule="evenodd"
              />
            </svg>
            <span>Genera PDF</span>
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
      <WorkHoursCalendar
        ref="workHoursCalendar"
        :work-hours="workHours"
        :selected-month="selectedMonth"
        :selected-year="selectedYear"
        :settings="settings"
        @update-work-hour="updateWorkHour"
        @day-selected="selectDay"
      />
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div
            class="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                d="M9 12a1 1 0 102 0V7a1 1 0 10-2 0v5zm0 4a1 1 0 102 0 1 1 0 00-2 0z"
              />
              <path
                fill-rule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">Riepilogo Mensile</h2>
        </div>
        <div class="space-y-4">
          <div
            class="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg"
          >
            <span class="text-gray-700 font-medium">Ore totali:</span>
            <span class="font-bold text-blue-600 text-lg"
              >{{ summary.totalHours }}h</span
            >
          </div>
          <div
            class="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg"
          >
            <span class="text-gray-700 font-medium">Giorni lavorati:</span>
            <span class="font-bold text-green-600 text-lg">{{
              summary.workingDays
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg"
          >
            <span class="text-gray-700 font-medium">Giorni di ferie:</span>
            <span class="font-bold text-yellow-600 text-lg">{{
              summary.vacationDays
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg"
          >
            <span class="text-gray-700 font-medium">Giorni di malattia:</span>
            <span class="font-bold text-orange-600 text-lg">{{
              summary.sickDays
            }}</span>
          </div>
          <div
            class="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg"
          >
            <span class="text-gray-700 font-medium">Giorni di permesso:</span>
            <span class="font-bold text-purple-600 text-lg">{{
              summary.permitDays
            }}</span>
          </div>
        </div>
      </div>

      <div class="bg-white shadow-sm rounded-xl border border-gray-200 p-6">
        <div class="flex items-center space-x-3 mb-6">
          <div
            class="w-8 h-8 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fill-rule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <h2 class="text-xl font-bold text-gray-900">Permessi e Malattie</h2>
        </div>

        <div v-if="!selectedDayId" class="text-center py-8 text-gray-500">
          <svg
            class="mx-auto h-12 w-12 text-gray-400 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
          <p class="text-sm">
            Seleziona un giorno dalla tabella per caricare gli allegati
          </p>
        </div>

        <div v-else>
          <FileUpload
            :related-id="
              selectedDayData && selectedDayData._id
                ? selectedDayData._id
                : null
            "
            :related-date="selectedDayId"
            related-model="WorkHour"
            type="permit"
            @file-uploaded="onFileUploaded"
          />

          <div v-if="dayAttachments.length > 0" class="mt-6">
            <h3 class="text-sm font-medium text-gray-700 mb-3">
              File allegati:
            </h3>
            <div class="space-y-2">
              <div
                v-for="file in dayAttachments"
                :key="file._id"
                class="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border"
              >
                <div class="flex items-center space-x-3">
                  <div
                    class="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"
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
                  </div>
                  <span class="text-sm font-medium text-gray-900">{{
                    file.originalName
                  }}</span>
                </div>
                <div class="flex space-x-2">
                  <button
                    @click="downloadFile(file._id)"
                    class="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                  <button
                    @click="deleteFile(file._id)"
                    class="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fill-rule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clip-rule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WorkHoursCalendar from "@/components/WorkHoursCalendar.vue";
import FileUpload from "@/components/FileUpload.vue";
import { workHoursService, settingsService } from "@/services/api";

export default {
  name: "WorkHours",
  components: {
    WorkHoursCalendar,
    FileUpload,
  },
  data() {
    return {
      workHours: [],
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      selectedDayId: null,
      selectedDayData: null,
      dayAttachments: [],
      saving: false,
      settings: null,
      summary: {
        totalHours: 0,
        workingDays: 0,
        vacationDays: 0,
        sickDays: 0,
        permitDays: 0,
      },
      months: [
        { value: 1, label: "Gennaio" },
        { value: 2, label: "Febbraio" },
        { value: 3, label: "Marzo" },
        { value: 4, label: "Aprile" },
        { value: 5, label: "Maggio" },
        { value: 6, label: "Giugno" },
        { value: 7, label: "Luglio" },
        { value: 8, label: "Agosto" },
        { value: 9, label: "Settembre" },
        { value: 10, label: "Ottobre" },
        { value: 11, label: "Novembre" },
        { value: 12, label: "Dicembre" },
      ],
    };
  },
  computed: {
    years() {
      const currentYear = new Date().getFullYear();
      return Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    },
  },
  watch: {
    selectedMonth: {
      handler: "loadSummary",
    },
    selectedYear: {
      handler: "loadSummary",
    },
  },
  async mounted() {
    await this.loadSettings();
    await this.loadWorkHours();
    await this.loadSummary();
  },
  methods: {
    async loadSettings() {
      try {
        this.settings = await settingsService.getSettings();
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    },
    async loadWorkHours() {
      try {
        this.workHours = await workHoursService.getWorkHours(
          this.selectedYear,
          this.selectedMonth,
        );
      } catch (error) {
        console.error("Error loading work hours:", error);
      }
    },
    async loadSummary() {
      try {
        this.summary = await workHoursService.getSummary(
          this.selectedYear,
          this.selectedMonth,
        );
      } catch (error) {
        console.error("Error loading summary:", error);
      }
    },
    async updateWorkHour(workHour) {
      try {
        if (workHour._id) {
          await workHoursService.updateWorkHour(workHour._id, workHour);
        } else {
          await workHoursService.createWorkHour(workHour);
        }
        await this.loadWorkHours();
        await this.loadSummary();
      } catch (error) {
        console.error("Error updating work hour:", error);
      }
    },
    async selectDay(dayId, dayData) {
      this.selectedDayId = dayId;
      this.selectedDayData = dayData;

      if (dayId) {
        try {
          // Se il giorno ha un _id, carica gli allegati
          if (dayData && dayData._id) {
            this.dayAttachments = await workHoursService.getAttachments(
              dayData._id,
            );
          } else {
            // Se non ha _id, prova a trovarlo negli workHours esistenti
            const existingDay = this.workHours.find(
              (wh) => new Date(wh.date).toISOString().split("T")[0] === dayId,
            );
            if (existingDay) {
              this.dayAttachments = await workHoursService.getAttachments(
                existingDay._id,
              );
            } else {
              this.dayAttachments = [];
            }
          }
        } catch (error) {
          console.error("Error loading attachments:", error);
          this.dayAttachments = [];
        }
      }
    },
    async onFileUploaded() {
      // Ricarica i dati del giorno e la lista generale
      await this.loadWorkHours();
      if (this.selectedDayId) {
        await this.selectDay(this.selectedDayId, this.selectedDayData);
      }
    },
    async downloadFile(fileId) {
      try {
        const response = await fetch(`/api/files/${fileId}`);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "file";
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading file:", error);
      }
    },
    async deleteFile(fileId) {
      try {
        await fetch(`/api/files/${fileId}`, { method: "DELETE" });
        await this.selectDay(this.selectedDayId);
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    },
    async generatePDF() {
      try {
        const response = await fetch(
          `/api/pdf/work-hours/${this.selectedYear}/${this.selectedMonth}`,
        );
        if (!response.ok) {
          throw new Error("Errore durante la generazione del PDF");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orari-${this.selectedMonth}-${this.selectedYear}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Errore durante la generazione del PDF");
      }
    },
    async saveAllWorkHours() {
      this.saving = true;
      try {
        // Ottieni tutti i giorni del calendario dal componente figlio
        const calendarDays = this.$refs.workHoursCalendar.calendarDays;

        for (const day of calendarDays) {
          await this.updateWorkHour(day);
        }

        await this.loadSummary();
        alert("Tutti gli orari sono stati salvati con successo!");
      } catch (error) {
        console.error("Error saving all work hours:", error);
        alert("Errore durante il salvataggio degli orari");
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>
