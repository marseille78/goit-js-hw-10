import './css/styles.css';
import { fetchCountries } from './js/fetchCountries';
import getRefs from './js/get-refs';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix';

const DEBOUNCE_DELAY = 300;

let refs;

document.addEventListener('DOMContentLoaded', () => {
  refs = getRefs();
  refs.field.value = "";
  clearData();

  refs.field.addEventListener('input', debounce((e) => {
    const text = e.target.value.trim();
    if (!text) return;
    fetchCountries(text)
      .then(renderResult)
      .catch(handleFetchError);
  }, DEBOUNCE_DELAY));
});

function renderResult(data) {
  const len = data.length;
  clearData();

  if (len > 10) {
    Notify.info("Too many matches found. Please enter a more specific name.");
  } else if (len <= 10 && len > 1) {
    refs.list.innerHTML = renderList(data);
  } else if (len === 1) {
    refs.info.innerHTML = renderCountry(data[0]);
  }
}

function handleFetchError() {
  Notify.failure("Oops, there is no country with that name");
  clearData();
}

function renderList(listCountries) {
  return listCountries.reduce((list, item) => {
    return list + renderItem(item);
  }, "");
}

function renderItem({flags: {svg: src}, name: {official: country}}) {
  return `
    <li>
      <img src='${src}' alt='${country}'>
      <span>${country}</span>
    </li>
  `;
}

function renderCountry({
  flags: {svg: src},
  name: {official: country},
  capital,
  population,
  languages
}) {
  return `
    <div class='country-info'>
      <h3>
        <img src='${src}' alt='${country}' />
        <span>${country}</span>
      </h3>
      <ul>
        <li><b>Capital:</b> ${capital.join(', ')}</li>
        <li><b>Population:</b> ${population}</li>
        <li><b>Languages:</b> ${Object.values(languages).join(', ')}</li>
      </ul>
    </div>
  `;
}

function clearData() {
  refs.list.innerHTML = "";
  refs.info.innerHTML = "";
}