const express = require("express");
const { Country, State, City } = require("country-state-city");

const router = express.Router();

// Get all countries
router.get("/", (req, res) => {
  try {
    const countries = Country.getAllCountries();
    res.status(200).json({
      success: true,
      data: countries,
    });
  } catch (error) {
    console.error("Error fetching countries:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching countries",
    });
  }
});

// Get states by country
router.get("/states/:countryName", (req, res) => {
  try {
    const { countryName } = req.params;
    console.log("Looking for country:", countryName);
    
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    
    console.log("Found country:", country);
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    const states = State.getStatesOfCountry(country.isoCode);
    console.log("States found:", states.length);
    
    res.status(200).json({
      success: true,
      data: states,
    });
  } catch (error) {
    console.error("Error fetching states:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching states",
    });
  }
});

// Get cities by country and state
router.get("/cities/:countryName/:stateName", (req, res) => {
  try {
    const { countryName, stateName } = req.params;
    const country = Country.getAllCountries().find(
      (c) => c.name.toLowerCase() === countryName.toLowerCase()
    );
    
    if (!country) {
      return res.status(404).json({
        success: false,
        message: "Country not found",
      });
    }

    const state = State.getStatesOfCountry(country.isoCode).find(
      (s) => s.name.toLowerCase() === stateName.toLowerCase()
    );
    
    if (!state) {
      return res.status(404).json({
        success: false,
        message: "State not found",
      });
    }

    const cities = City.getCitiesOfState(country.isoCode, state.isoCode);
    res.status(200).json({
      success: true,
      data: cities,
    });
  } catch (error) {
    console.error("Error fetching cities:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching cities",
    });
  }
});

module.exports = router; 