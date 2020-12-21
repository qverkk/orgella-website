import { useState } from "react";
import Layout from "../layout";
import ProfileMenu from "./profile/profilemenu";
import styles from "./navbar.module.css";
import { useRouter } from "next/router";

const preventDefault = (f) => (e) => {
  e.preventDefault();
  f(e);
};

export default function Navbar({ searchQuery }) {
  const router = useRouter();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("wszystko");
  const [profileMenu, setProfileMenu] = useState(false);

  const test = preventDefault(() => {
    router.push({
      pathname: "/search/listings",
      query: {
        query: query,
        category: category,
      },
    });
  });

  return (
    <header className={styles.navHeader}>
      <div className={styles.navPrimary}>
        <div className={styles.navName}>Orgella</div>
        <div className={styles.searchPrimary}>
          <form className={styles.navForm} onSubmit={test}>
            <input
              type="search"
              autoComplete="off"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="czego szukasz?"
              aria-autocomplete="both"
              className={styles.navSearchInput}
            />
            <select
              name="category"
              id="category"
              className={styles.navCategorySelect}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="wszystko">Wszystkie kategorie</option>
              <optgroup label="Kategorie">
                <option value="dom-i-ogrod">Dom i ogród</option>
                <option value="dziecko">Dziecko</option>
                <option value="elektronika">Elektronika</option>
                <option value="firma">Firma i usługi</option>
                <option value="kolekcje-i-sztuka">Kolekcje i sztuka</option>
                <option value="kultura-i-rozrywka">Kultura i rozrywka</option>
                <option value="moda">Moda</option>
                <option value="motoryzacja">Motoryzacja</option>
                <option value="nieruchomosci">Nieruchomości</option>
                <option value="sport-i-turystyka">Sport i turystyka</option>
                <option value="supermarket">Supermarket</option>
                <option value="uroda">Uroda</option>
                <option value="zdrowie">Zdrowie</option>
              </optgroup>
            </select>
            <button type="submit" className={styles.navSearchButton}>
              SZUKAJ
            </button>
          </form>
        </div>
        <div className={styles.navProfile}>
          <div className={styles.navProfileButtonSection}>
            <button
              className={styles.navProfileButton}
              onClick={(e) => setProfileMenu(!profileMenu)}
            >
              Profile
            </button>
          </div>
          {profileMenu ? (
            <div className={styles.navProfileExpandable}>
              <ProfileMenu />
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </header>
  );
}
