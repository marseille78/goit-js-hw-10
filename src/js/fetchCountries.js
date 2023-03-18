const BASE_URL = "https://restcountries.com/v3.1/name";
const FILTER = "fields=name,capital,population,flags,languages;";

export const fetchCountries = (name) => {
  return fetch(`${BASE_URL}/${name}?${FILTER}`)
    .then(res => {
      if (!res.ok) {
        throw new Error('test');
      }
      return res.json();
    });
}