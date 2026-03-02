const countryInput = document.getElementById('country-input');
const searchBtn = document.getElementById('search-btn');
const spinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');


searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    if (country) searchCountry(country);
});

countryInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        const country = countryInput.value.trim();
        if (country) searchCountry(country);
    }
});


async function searchCountry(countryName) {
    try {
        // 1️⃣ Show loading spinner
        spinner.classList.remove('hidden'); // show spinner
        countryInfo.innerHTML = '';        // clear previous country info
        borderingCountries.innerHTML = ''; // clear previous borders
        errorMessage.textContent = '';     // clear previous errors


        // 2️⃣ Clear previous results
        // 3️⃣ Fetch country data from API
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        if (!response.ok) throw new Error('Country not found');
        const data = await response.json();
        const country = data[0];
        // 4️⃣ Update DOM with country info
        countryInfo.innerHTML = `
        <h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : 'N/A'}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">`;


        // 5️⃣ Fetch bordering countries if any
        if (country.borders && country.borders.length > 0) {
            for (const code of country.borders) {
                const borderResp = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResp.json();
                const borderCountry = borderData[0];

                // Update the bordering countries grid
                const div = document.createElement('div');
                div.innerHTML = `
                    <img src="${borderCountry.flags.svg}" alt="${borderCountry.name.common} flag" width="80">
                    <p>${borderCountry.name.common}</p>
                `;
                borderingCountries.appendChild(div);
            }
        }
        // 6️⃣ Update DOM with borders

        
    } catch (error) {
        // Show user-friendly error message
        errorMessage.textContent = error.message;
    } finally {
        // Hide spinner
        spinner.classList.add('hidden');
    }
}