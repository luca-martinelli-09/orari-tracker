import axios from "axios";

const API_BASE_URL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const workHoursService = {
  async getWorkHours(year, month) {
    const response = await api.get(`/work-hours?year=${year}&month=${month}`);
    return response.data;
  },

  async createWorkHour(workHour) {
    const response = await api.post("/work-hours", workHour);
    return response.data;
  },

  async updateWorkHour(id, workHour) {
    const response = await api.put(`/work-hours/${id}`, workHour);
    return response.data;
  },

  async deleteWorkHour(id) {
    const response = await api.delete(`/work-hours/${id}`);
    return response.data;
  },

  async getSummary(year, month) {
    const response = await api.get(`/work-hours/summary/${year}/${month}`);
    return response.data;
  },

  async getAttachments(id) {
    const response = await api.get(`/work-hours/${id}/attachments`);
    return response.data;
  },
};

export const expensesService = {
  async getExpenses(year, month) {
    const response = await api.get(`/expenses?year=${year}&month=${month}`);
    return response.data;
  },

  async createExpense(expense) {
    const response = await api.post("/expenses", expense);
    return response.data;
  },

  async updateExpense(id, expense) {
    const response = await api.put(`/expenses/${id}`, expense);
    return response.data;
  },

  async deleteExpense(id) {
    const response = await api.delete(`/expenses/${id}`);
    return response.data;
  },

  async syncTrenitalia(year, month) {
    const response = await api.post("/expenses/sync-trenitalia", {
      year,
      month,
    });
    return response.data;
  },

  async getSummary(year, month) {
    const response = await api.get(`/expenses/summary/${year}/${month}`);
    return response.data;
  },
};

export const holidaysService = {
  async getHolidays(year) {
    const response = await api.get(`/holidays/${year}`);
    return response.data;
  },
};

export const settingsService = {
  async getSettings() {
    const response = await api.get("/settings");
    return response.data;
  },

  async updateSettings(settings) {
    const response = await api.put("/settings", settings);
    return response.data;
  },
};

export default api;
