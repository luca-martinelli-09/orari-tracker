<template>
  <div class="border-2 border-dashed border-gray-300 rounded-lg p-6">
    <div class="text-center">
      <svg
        class="mx-auto h-12 w-12 text-gray-400"
        stroke="currentColor"
        fill="none"
        viewBox="0 0 48 48"
      >
        <path
          d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      <div class="mt-4">
        <label for="file-upload" class="cursor-pointer">
          <span class="mt-2 block text-sm font-medium text-gray-900">
            Carica un file
          </span>
          <input
            id="file-upload"
            name="file-upload"
            type="file"
            class="sr-only"
            @change="handleFileUpload"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
          />
        </label>
        <p class="mt-1 text-xs text-gray-500">
          PDF, DOC, DOCX, JPG, PNG, GIF fino a 10MB
        </p>
      </div>

      <div v-if="uploading" class="mt-4">
        <div class="flex items-center justify-center">
          <div
            class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"
          ></div>
          <span class="ml-2 text-sm text-gray-600"
            >Caricamento in corso...</span
          >
        </div>
      </div>

      <div v-if="uploadError" class="mt-4 text-sm text-red-600">
        {{ uploadError }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FileUpload",
  props: {
    relatedId: {
      type: String,
      default: null,
    },
    relatedDate: {
      type: String,
      default: null,
    },
    relatedModel: {
      type: String,
      default: "WorkHour",
    },
    type: {
      type: String,
      default: "permit",
    },
  },
  data() {
    return {
      uploading: false,
      uploadError: null,
    };
  },
  methods: {
    async handleFileUpload(event) {
      const file = event.target.files[0];
      if (!file) return;

      if (!this.relatedId && !this.relatedDate) {
        this.uploadError = "Seleziona prima un giorno";
        return;
      }

      this.uploading = true;
      this.uploadError = null;

      try {
        // Se non abbiamo un relatedId, dobbiamo prima creare/trovare il record WorkHour
        let workHourId = this.relatedId;

        if (!workHourId && this.relatedDate) {
          // Crea un nuovo WorkHour per questa data
          const workHourData = {
            date: this.relatedDate,
            morningStart: "08:30",
            morningEnd: "13:00",
            afternoonStart: "14:00",
            afternoonEnd: "17:30",
            dayType: "working",
          };

          const workHourResponse = await fetch("/api/work-hours", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(workHourData),
          });

          if (!workHourResponse.ok) {
            throw new Error("Errore durante la creazione del record orario");
          }

          const workHour = await workHourResponse.json();
          workHourId = workHour._id;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("relatedId", workHourId);
        formData.append("relatedModel", this.relatedModel);
        formData.append("type", this.type);

        const response = await fetch("/api/files/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Errore durante il caricamento del file");
        }

        const result = await response.json();
        this.$emit("file-uploaded", result);

        event.target.value = "";
      } catch (error) {
        this.uploadError = error.message;
      } finally {
        this.uploading = false;
      }
    },
  },
};
</script>
