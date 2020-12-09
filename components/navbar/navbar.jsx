import Layout from "../layout";
import styles from "./navbar.module.css";

export default function Navbar({ searchQuery }) {
  return (
    <header className={styles.navHeader}>
      <div className={styles.navPrimary}>
        <div className={styles.navName}>Orgella</div>
        <div className={styles.searchPrimary}>
          <form action="/listing" className={styles.navForm}>
            <input
              type="search"
              autoComplete="off"
              name="query"
              placeholder="czego szukasz?"
              aria-autocomplete="both"
              className={styles.navSearchInput}
            />
            <select
              name="category"
              id="category"
              className={styles.navCategorySelect}
            >
              <option value="/listing" selected="">
                Wszystkie kategorie
              </option>
              <optgroup label="Kategorie">
                <option value="/kategoria/dom-i-ogrod">Dom i ogród</option>
                <option value="/kategoria/dziecko">Dziecko</option>
                <option value="/kategoria/elektronika">Elektronika</option>
                <option value="/kategoria/firma">Firma i usługi</option>
                <option value="/kategoria/kolekcje-i-sztuka">
                  Kolekcje i sztuka
                </option>
                <option value="/kategoria/kultura-i-rozrywka">
                  Kultura i rozrywka
                </option>
                <option value="/kategoria/moda">Moda</option>
                <option value="/kategoria/motoryzacja">Motoryzacja</option>
                <option value="/kategoria/nieruchomosci">Nieruchomości</option>
                <option value="/kategoria/sport-i-turystyka">
                  Sport i turystyka
                </option>
                <option value="/kategoria/supermarket">Supermarket</option>
                <option value="/kategoria/uroda">Uroda</option>
                <option value="/kategoria/zdrowie">Zdrowie</option>
              </optgroup>
            </select>
            <button type="submit" className={styles.navSearchButton}>
              SZUKAJ
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}
