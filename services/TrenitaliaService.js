const axios = require("axios");
const Settings = require("../models/Settings");

class TrenitaliaService {
  constructor() {
    this.baseURL = "https://www.lefrecce.it";
    this.authURL = `${this.baseURL}/PicoAuth/api/auth/login`;
    this.tripsURL = `${this.baseURL}/Channels.Website.BFF.WEB/website/travel/solutions`;
    this.detailsURL = `${this.baseURL}/Channels.Website.BFF.WEB/website/travel/reopen`;
    this.pdfURL = `${this.baseURL}/Channels.Website.BFF.WEB/website/post/purchase/pdf`;
  }

  async authenticate() {
    try {
      const settings = await Settings.findOne();
      if (
        !settings ||
        !settings.trenitalia.username ||
        !settings.trenitalia.password
      ) {
        throw new Error("Trenitalia credentials not configured");
      }

      if (
        settings.trenitalia.token &&
        settings.trenitalia.tokenExpiry &&
        new Date() < settings.trenitalia.tokenExpiry
      ) {
        return settings.trenitalia.token;
      }

      const response = await axios.post(
        this.authURL,
        {
          userName: settings.trenitalia.username,
          password: settings.trenitalia.password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      const { access_token, expires_in } = response.data;

      settings.trenitalia.token = access_token;
      settings.trenitalia.tokenExpiry = new Date(
        Date.now() + expires_in * 1000,
      );
      await settings.save();

      return access_token;
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async getTrips(year, month) {
    try {
      const token = await this.authenticate();

      const fromDate = `01/${month.toString().padStart(2, "0")}/${year}`;
      const toDate =
        new Date(year, month, 0).getDate().toString().padStart(2, "0") +
        `/${month.toString().padStart(2, "0")}/${year}`;

      const response = await axios.post(
        this.tripsURL,
        {
          travelGroup: "TICKET",
          searchType: "DEPARTURE_DATE",
          fromDate: fromDate,
          toDate: toDate,
          code: "",
          limit: 100,
          offset: 0,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data.solutions || [];
    } catch (error) {
      throw new Error(`Failed to fetch trips: ${error.message}`);
    }
  }

  async getTicketDetails(resourceId) {
    try {
      const token = await this.authenticate();

      const response = await axios.get(
        `${this.detailsURL}?resourceId=${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ticket details: ${error.message}`);
    }
  }

  async downloadPDF(resourceId) {
    try {
      const token = await this.authenticate();

      const response = await axios.get(
        `${this.pdfURL}?resourceId=${resourceId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          responseType: "arraybuffer",
        },
      );

      return response.data;
    } catch (error) {
      throw new Error(`Failed to download PDF: ${error.message}`);
    }
  }
}

module.exports = TrenitaliaService;
