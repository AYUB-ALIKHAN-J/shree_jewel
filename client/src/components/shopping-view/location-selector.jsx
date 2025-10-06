import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";

function LocationSelector({ formData, setFormData, setStatesData, setCitiesData }) {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load countries on component mount
    const loadCountries = async () => {
      try {
        const response = await fetch('/api/common/countries');
        const data = await response.json();
        if (data.success) {
          setCountries(data.data);
        }
      } catch (error) {
        console.error('Error loading countries:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCountries();
  }, []);

  useEffect(() => {
    // Load states when country changes
    if (formData.country) {
      const loadStates = async () => {
        try {
          console.log("Loading states for country:", formData.country);
          const response = await fetch(`/api/common/countries/states/${encodeURIComponent(formData.country)}`);
          const data = await response.json();
          console.log("States response:", data);
          if (data.success) {
            setStates(data.data);
            setStatesData(data.data); // Update parent state
          } else {
            console.error("Failed to load states:", data.message);
          }
        } catch (error) {
          console.error('Error loading states:', error);
        }
      };

      loadStates();
      // Reset state and city when country changes
      setFormData(prev => ({ ...prev, state: '', city: '' }));
      setCities([]);
    }
  }, [formData.country, setFormData, setStatesData]);

  useEffect(() => {
    // Load cities when state changes
    if (formData.country && formData.state) {
      const loadCities = async () => {
        try {
          console.log("Loading cities for:", formData.country, formData.state);
          const response = await fetch(`/api/common/countries/cities/${encodeURIComponent(formData.country)}/${encodeURIComponent(formData.state)}`);
          const data = await response.json();
          console.log("Cities response:", data);
          if (data.success) {
            setCities(data.data);
            setCitiesData(data.data); // Update parent state
          } else {
            console.error("Failed to load cities:", data.message);
          }
        } catch (error) {
          console.error('Error loading cities:', error);
        }
      };

      loadCities();
      // Reset city when state changes
      setFormData(prev => ({ ...prev, city: '' }));
    }
  }, [formData.country, formData.state, setFormData, setCitiesData]);

  const handleCountryChange = (value) => {
    setFormData(prev => ({ ...prev, country: value }));
  };

  const handleStateChange = (value) => {
    setFormData(prev => ({ ...prev, state: value }));
  };

  const handleCityChange = (value) => {
    setFormData(prev => ({ ...prev, city: value }));
  };

  if (loading) {
    return <div className="space-y-3">
      <Label>Loading countries...</Label>
    </div>;
  }

  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="country">Country *</Label>
        <Select value={formData.country} onValueChange={handleCountryChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select a country" />
          </SelectTrigger>
          <SelectContent>
            {countries.map((country) => (
              <SelectItem key={country.isoCode} value={country.name}>
                {country.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {formData.country && states.length > 0 && (
        <div>
          <Label htmlFor="state">State *</Label>
          <Select value={formData.state} onValueChange={handleStateChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a state" />
            </SelectTrigger>
            <SelectContent>
              {states.map((state) => (
                <SelectItem key={state.isoCode} value={state.name}>
                  {state.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {formData.country && formData.state && cities.length > 0 && (
        <div>
          <Label htmlFor="city">City *</Label>
          <Select value={formData.city} onValueChange={handleCityChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}

export default LocationSelector; 