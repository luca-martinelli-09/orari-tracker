<template>
  <div class="space-y-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-bold text-gray-900">Rimborsi Spese</h1>
      <div class="flex items-center space-x-4">
        <div class="flex items-center space-x-2">
          <span class="text-sm font-medium text-gray-700">Periodo:</span>
          <div class="flex items-center space-x-1">
            <div class="relative">
              <select
                v-model="selectedMonth"
                @change="loadExpenses"
                class="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
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
                @change="loadExpenses"
                class="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm font-medium text-gray-900 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors duration-200"
              >
                <option v-for="year in years" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>
        </div>
        <button
          @click="syncTrenitalia"
          :disabled="syncing"
          class="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
        >
          <span v-if="syncing">Sincronizzazione...</span>
          <span v-else>Sincronizza Trenitalia</span>
        </button>
        <button
          @click="showAddExpenseModal = true"
          class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Aggiungi Spesa
        </button>
        <button
          @click="generatePDF"
          class="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700"
        >
          Genera PDF
        </button>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg p-6">
      <h2 class="text-lg font-semibold mb-4">Riepilogo Mensile</h2>
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">Totale Spese</div>
          <div class="text-2xl font-bold text-gray-900">
            €{{ summary.totalAmount?.toFixed(2) || "0.00" }}
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">Numero Spese</div>
          <div class="text-2xl font-bold text-gray-900">
            {{ summary.count || 0 }}
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">Trasporti</div>
          <div class="text-2xl font-bold text-gray-900">
            €{{ summary.byType?.train?.toFixed(2) || "0.00" }}
          </div>
        </div>
        <div class="bg-gray-50 p-4 rounded-lg">
          <div class="text-sm text-gray-600">Altre Spese</div>
          <div class="text-2xl font-bold text-gray-900">
            €{{
              (summary.totalAmount - (summary.byType?.train || 0))?.toFixed(
                2,
              ) || "0.00"
            }}
          </div>
        </div>
      </div>
    </div>

    <div class="bg-white shadow rounded-lg overflow-hidden">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-lg font-semibold text-gray-900">Elenco Spese</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Data
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Tipo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Descrizione
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Importo
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Allegati
              </th>
              <th
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Azioni
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr
              v-for="expense in expenses"
              :key="expense._id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(expense.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getTypeClass(expense.type)"
                >
                  {{ getTypeLabel(expense.type) }}
                </span>
              </td>
              <td class="px-6 py-4 text-sm text-gray-900">
                {{ expense.description }}
                <div
                  v-if="expense.trenitalia && expense.trenitalia.pnr"
                  class="text-xs text-blue-600 mt-1"
                >
                  PNR: {{ expense.trenitalia.pnr }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  :class="
                    expense.amount === 0
                      ? 'text-red-600 font-semibold'
                      : expense.trenitalia && expense.amount > 0
                        ? 'text-green-600'
                        : ''
                  "
                >
                  €{{ expense.amount.toFixed(2) }}
                  <span
                    v-if="expense.amount === 0"
                    class="text-xs text-red-500 ml-1"
                    >(da aggiornare)</span
                  >
                  <span
                    v-else-if="expense.trenitalia && expense.amount > 0"
                    class="text-xs text-green-500 ml-1"
                    >(auto)</span
                  >
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                >
                  {{ expense.attachments?.length || 0 }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="editExpense(expense)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Modifica
                </button>
                <button
                  v-if="expense.amount === 0"
                  @click="quickUpdateAmount(expense)"
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  €uro
                </button>
                <button
                  @click="deleteExpense(expense._id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Elimina
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <ExpenseModal
      v-if="showAddExpenseModal || showEditExpenseModal"
      :expense="selectedExpense"
      @close="closeModal"
      @save="saveExpense"
    />
  </div>
</template>

<script>
import ExpenseModal from "@/components/ExpenseModal.vue";
import { expensesService } from "@/services/api";

export default {
  name: "Expenses",
  components: {
    ExpenseModal,
  },
  data() {
    return {
      expenses: [],
      selectedMonth: new Date().getMonth() + 1,
      selectedYear: new Date().getFullYear(),
      showAddExpenseModal: false,
      showEditExpenseModal: false,
      selectedExpense: null,
      syncing: false,
      summary: {},
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
  async mounted() {
    await this.loadExpenses();
    await this.loadSummary();
  },
  methods: {
    async loadExpenses() {
      try {
        this.expenses = await expensesService.getExpenses(
          this.selectedYear,
          this.selectedMonth,
        );
      } catch (error) {
        console.error("Error loading expenses:", error);
      }
    },
    async loadSummary() {
      try {
        this.summary = await expensesService.getSummary(
          this.selectedYear,
          this.selectedMonth,
        );
      } catch (error) {
        console.error("Error loading summary:", error);
      }
    },
    async syncTrenitalia() {
      this.syncing = true;
      try {
        const result = await expensesService.syncTrenitalia(
          this.selectedYear,
          this.selectedMonth,
        );
        const message = `Sincronizzati ${result.expenses.length} viaggi da Trenitalia.\n\nI prezzi sono stati recuperati automaticamente quando possibile. Verifica che tutti gli importi siano corretti e aggiorna manualmente quelli mancanti.`;
        alert(message);
        await this.loadExpenses();
        await this.loadSummary();
      } catch (error) {
        console.error("Error syncing Trenitalia:", error);
        alert("Errore durante la sincronizzazione con Trenitalia");
      } finally {
        this.syncing = false;
      }
    },
    formatDate(dateStr) {
      const date = new Date(dateStr);
      return date.toLocaleDateString("it-IT");
    },
    getTypeClass(type) {
      const classes = {
        train: "bg-blue-100 text-blue-800",
        transport: "bg-green-100 text-green-800",
        meal: "bg-yellow-100 text-yellow-800",
        accommodation: "bg-purple-100 text-purple-800",
        other: "bg-gray-100 text-gray-800",
      };
      return classes[type] || classes.other;
    },
    getTypeLabel(type) {
      const labels = {
        train: "Treno",
        transport: "Trasporto",
        meal: "Pasto",
        accommodation: "Alloggio",
        other: "Altro",
      };
      return labels[type] || "Altro";
    },
    editExpense(expense) {
      this.selectedExpense = { ...expense };
      this.showEditExpenseModal = true;
    },
    async quickUpdateAmount(expense) {
      const amount = prompt("Inserisci l'importo della spesa (€):", "0.00");
      if (amount !== null && !isNaN(parseFloat(amount))) {
        try {
          const updatedExpense = { ...expense, amount: parseFloat(amount) };
          await expensesService.updateExpense(expense._id, updatedExpense);
          await this.loadExpenses();
          await this.loadSummary();
        } catch (error) {
          console.error("Error updating amount:", error);
          alert("Errore durante l'aggiornamento dell'importo");
        }
      }
    },
    async deleteExpense(id) {
      if (confirm("Sei sicuro di voler eliminare questa spesa?")) {
        try {
          await expensesService.deleteExpense(id);
          await this.loadExpenses();
          await this.loadSummary();
        } catch (error) {
          console.error("Error deleting expense:", error);
        }
      }
    },
    async saveExpense(expense) {
      try {
        if (expense._id) {
          await expensesService.updateExpense(expense._id, expense);
        } else {
          await expensesService.createExpense(expense);
        }
        await this.loadExpenses();
        await this.loadSummary();
        this.closeModal();
      } catch (error) {
        console.error("Error saving expense:", error);
      }
    },
    closeModal() {
      this.showAddExpenseModal = false;
      this.showEditExpenseModal = false;
      this.selectedExpense = null;
    },
    async generatePDF() {
      try {
        const response = await fetch(
          `/api/pdf/expenses/${this.selectedYear}/${this.selectedMonth}`,
        );
        if (!response.ok) {
          throw new Error("Errore durante la generazione del PDF");
        }

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `rimborsi-${this.selectedMonth}-${this.selectedYear}.pdf`;
        a.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error generating PDF:", error);
        alert("Errore durante la generazione del PDF");
      }
    },
  },
};
</script>
