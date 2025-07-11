<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Impostazioni</h1>
      <button
        @click="saveSettings"
        :disabled="saving"
        class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
      >
        <span v-if="saving">Salvataggio...</span>
        <span v-else>Salva Impostazioni</span>
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Credenziali Trenitalia</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Username</label
            >
            <input
              v-model="settings.trenitalia.username"
              type="text"
              placeholder="Il tuo username Trenitalia"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Password</label
            >
            <input
              v-model="settings.trenitalia.password"
              type="password"
              placeholder="La tua password Trenitalia"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div v-if="settings.trenitalia.token" class="text-sm text-gray-600">
            <span class="font-medium">Token Status:</span>
            <span
              class="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="
                isTokenValid
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              "
            >
              {{ isTokenValid ? "Valido" : "Scaduto" }}
            </span>
          </div>

          <button
            @click="testTrenitaliaConnection"
            :disabled="testing"
            class="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
          >
            <span v-if="testing">Test in corso...</span>
            <span v-else>Test Connessione</span>
          </button>
        </div>
      </div>

      <div class="bg-white shadow rounded-lg p-6">
        <h2 class="text-lg font-semibold mb-4">Orari Predefiniti</h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Inizio Mattina</label
            >
            <input
              v-model="settings.workHours.defaultMorningStart"
              type="time"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fine Mattina</label
            >
            <input
              v-model="settings.workHours.defaultMorningEnd"
              type="time"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Inizio Pomeriggio</label
            >
            <input
              v-model="settings.workHours.defaultAfternoonStart"
              type="time"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Fine Pomeriggio</label
            >
            <input
              v-model="settings.workHours.defaultAfternoonEnd"
              type="time"
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Giorni Festivi Personalizzati</h2>
      <div class="space-y-4">
        <div class="flex items-center space-x-4">
          <input
            v-model="newHoliday.date"
            type="date"
            class="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <input
            v-model="newHoliday.name"
            type="text"
            placeholder="Nome del giorno festivo"
            class="flex-1 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <button
            @click="addHoliday"
            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Aggiungi
          </button>
        </div>

        <div
          v-if="settings.holidays.customHolidays.length > 0"
          class="space-y-2"
        >
          <div
            v-for="(holiday, index) in settings.holidays.customHolidays"
            :key="index"
            class="flex items-center justify-between p-2 bg-gray-50 rounded"
          >
            <div>
              <span class="font-medium">{{ holiday.name }}</span>
              <span class="text-sm text-gray-500 ml-2">{{
                formatDate(holiday.date)
              }}</span>
            </div>
            <button
              @click="removeHoliday(index)"
              class="text-red-600 hover:text-red-800"
            >
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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

    <div
      v-if="message"
      class="rounded-md p-4"
      :class="
        messageType === 'success'
          ? 'bg-green-50 text-green-800'
          : 'bg-red-50 text-red-800'
      "
    >
      {{ message }}
    </div>
  </div>
</template>

<script>
import { settingsService } from "@/services/api";

export default {
  name: "Settings",
  data() {
    return {
      settings: {
        trenitalia: {
          username: "",
          password: "",
          token: "",
          tokenExpiry: null,
        },
        workHours: {
          defaultMorningStart: "08:30",
          defaultMorningEnd: "13:00",
          defaultAfternoonStart: "14:00",
          defaultAfternoonEnd: "17:30",
        },
        holidays: {
          customHolidays: [],
        },
      },
      newHoliday: {
        date: "",
        name: "",
      },
      saving: false,
      testing: false,
      message: "",
      messageType: "success",
    };
  },
  computed: {
    isTokenValid() {
      if (!this.settings.trenitalia.tokenExpiry) return false;
      return new Date() < new Date(this.settings.trenitalia.tokenExpiry);
    },
  },
  async mounted() {
    await this.loadSettings();
  },
  methods: {
    async loadSettings() {
      try {
        this.settings = await settingsService.getSettings();
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    },
    async saveSettings() {
      this.saving = true;
      try {
        await settingsService.updateSettings(this.settings);
        this.showMessage("Impostazioni salvate con successo", "success");
      } catch (error) {
        console.error("Error saving settings:", error);
        this.showMessage(
          "Errore durante il salvataggio delle impostazioni",
          "error",
        );
      } finally {
        this.saving = false;
      }
    },
    async testTrenitaliaConnection() {
      this.testing = true;
      try {
        await settingsService.updateSettings(this.settings);

        const response = await fetch("/api/expenses/sync-trenitalia", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
          }),
        });

        if (response.ok) {
          this.showMessage("Connessione a Trenitalia riuscita", "success");
          await this.loadSettings();
        } else {
          this.showMessage("Errore di connessione a Trenitalia", "error");
        }
      } catch (error) {
        console.error("Error testing Trenitalia connection:", error);
        this.showMessage("Errore durante il test della connessione", "error");
      } finally {
        this.testing = false;
      }
    },
    addHoliday() {
      if (this.newHoliday.date && this.newHoliday.name) {
        this.settings.holidays.customHolidays.push({
          date: this.newHoliday.date,
          name: this.newHoliday.name,
        });
        this.newHoliday.date = "";
        this.newHoliday.name = "";
      }
    },
    removeHoliday(index) {
      this.settings.holidays.customHolidays.splice(index, 1);
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("it-IT");
    },
    showMessage(message, type) {
      this.message = message;
      this.messageType = type;
      setTimeout(() => {
        this.message = "";
      }, 5000);
    },
  },
};
</script>
