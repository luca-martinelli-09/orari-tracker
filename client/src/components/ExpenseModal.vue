<template>
  <div
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
    @click="closeModal"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white"
      @click.stop
    >
      <div class="mt-3">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg font-medium text-gray-900">
            {{ expense?._id ? "Modifica Spesa" : "Aggiungi Spesa" }}
          </h3>
          <button @click="closeModal" class="text-gray-400 hover:text-gray-600">
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="saveExpense" class="space-y-4">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Data</label
              >
              <input
                v-model="form.date"
                type="date"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Tipo</label
              >
              <select
                v-model="form.type"
                required
                class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="train">Treno</option>
                <option value="transport">Trasporto</option>
                <option value="meal">Pasto</option>
                <option value="accommodation">Alloggio</option>
                <option value="other">Altro</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Descrizione</label
            >
            <input
              v-model="form.description"
              type="text"
              required
              placeholder="Descrizione della spesa..."
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Importo (€)</label
            >
            <input
              v-model.number="form.amount"
              type="number"
              step="0.01"
              min="0"
              required
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1"
              >Note</label
            >
            <textarea
              v-model="form.notes"
              rows="3"
              placeholder="Note aggiuntive..."
              class="w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Allegati</label
            >
            <FileUpload
              :related-id="form._id"
              related-model="Expense"
              type="expense_receipt"
              @file-uploaded="onFileUploaded"
            />

            <div
              v-if="form.attachments && form.attachments.length > 0"
              class="mt-4 space-y-2"
            >
              <div
                v-for="file in form.attachments"
                :key="file._id"
                class="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span class="text-sm">{{ file.originalName }}</span>
                <button
                  @click="removeAttachment(file._id)"
                  type="button"
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

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
            >
              Annulla
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
            >
              {{ expense?._id ? "Aggiorna" : "Salva" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import FileUpload from "@/components/FileUpload.vue";

export default {
  name: "ExpenseModal",
  components: {
    FileUpload,
  },
  props: {
    expense: {
      type: Object,
      default: null,
    },
  },
  data() {
    return {
      form: {
        date: new Date().toISOString().split("T")[0],
        type: "other",
        description: "",
        amount: 0,
        notes: "",
        attachments: [],
      },
    };
  },
  mounted() {
    if (this.expense) {
      this.form = {
        ...this.expense,
        date: new Date(this.expense.date).toISOString().split("T")[0],
      };
    }
  },
  methods: {
    closeModal() {
      this.$emit("close");
    },
    saveExpense() {
      this.$emit("save", this.form);
    },
    onFileUploaded(file) {
      if (!this.form.attachments) {
        this.form.attachments = [];
      }
      this.form.attachments.push(file);
    },
    async removeAttachment(fileId) {
      try {
        await fetch(`/api/files/${fileId}`, { method: "DELETE" });
        this.form.attachments = this.form.attachments.filter(
          (f) => f._id !== fileId,
        );
      } catch (error) {
        console.error("Error removing attachment:", error);
      }
    },
  },
};
</script>
