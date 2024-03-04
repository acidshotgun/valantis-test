import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { Api } from "./api";
import { API_PASS, API_URL, SHOW_LIMIT } from "./config";
import { useAsync } from "./hooks/useAsync";
import { useClass } from "./hooks/useClass";

export const App = () => {
  const api = useClass(Api, API_URL, API_PASS);
  const pageRef = useRef<HTMLInputElement>(null);
  const [page, setPage] = useState(0);
  const [brand, setBrand] = useState<string | null>(null);

  const [ids, loadingIds, errorIds, reload] = useAsync(
    () =>
      api.action("get_ids", {
        offset: page * SHOW_LIMIT,
        limit: SHOW_LIMIT + 1,
      }),
    [page]
  );

  const [items, loadingItems, errorItems] = useAsync(
    () => (ids ? api.action("get_items", { ids }) : null),
    [ids]
  );

  const [brands, loadingBrands, errorBrands] = useAsync(
    () =>
      api.action("get_fields", {
        field: "brand",
      }),
    []
  );

  const [brandIds, loadingBrandIds, errorBrandIds, brandReload] = useAsync(
    () => (brands ? api.action("filter", { brand: brand }) : null),
    [brand]
  );

  const [brandItems, loadingBrandItems, errorBrandItems] = useAsync(
    () => (brandIds ? api.action("get_items", { ids: brandIds }) : null),
    [brandIds]
  );

  // Все продукты под рендер
  const renderItems = useMemo(() => {
    if (!brand) {
      setBrand(null);
      if (!items) return [];

      const used = new Set<string>();

      return items
        .slice(0, 50)
        .filter((item) => (used.has(item.id) ? false : used.add(item.id)));
    }

    if (brandItems) {
      setPage(0);
      if (!brandItems) return [];

      const used = new Set<string>();

      return brandItems.filter((item) =>
        used.has(item.id) ? false : used.add(item.id)
      );
    }
  }, [items, brandItems]);

  // Бренды под рендер
  const renderBrands = useMemo(() => {
    if (!brands) return [];

    return Array.from(new Set(brands)).filter((brand) => brand !== null);
  }, [brands]);

  const goPage = useCallback(() => {
    const input = Number(pageRef.current?.value);
    setPage(isNaN(input) ? 0 : input);
  }, []);

  const loading =
    loadingIds ||
    loadingItems ||
    loadingBrands ||
    loadingBrandIds ||
    loadingBrandItems;
  const error =
    errorIds || errorItems || errorBrands || errorBrandIds || errorBrandItems;

  const hasPrev = useMemo(() => page > 0, [page]);
  const hasNext = useMemo(() => (items?.length ?? 0) > 50, [items]);

  useEffect(() => {
    if (error) {
      console.log(error);
      reload();
      brandReload();
    }
  }, [error]);

  return (
    <div className="page">
      <div className="header">
        <select
          className="brands"
          onChange={(e) => {
            setBrand(e.target.value);
          }}
        >
          <option value="" onClick={() => setBrand(null)}>
            Все бренды
          </option>
          {renderBrands.map((item, i) => {
            return (
              <option key={i} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <button
          disabled={loading || !hasPrev || brand !== null}
          onClick={setPage.bind(null, (v) => v - 1)}
        >
          prev
        </button>

        <button
          disabled={loading || !hasNext || brand !== null}
          onClick={setPage.bind(null, (v) => v + 1)}
        >
          next
        </button>

        <div className="title">
          <h3>Page:</h3>
          <div>
            <input
              disabled={loading}
              ref={pageRef}
              type="number"
              defaultValue={page}
              onKeyDown={(e) => e.key === "Enter" && goPage()}
              key={page}
            />
            <button disabled={loading || brand !== null} onClick={goPage}>
              Go
            </button>
          </div>
          {!loading && <h3>Items: {renderItems?.length}</h3>}
        </div>
      </div>
      <div className="content">
        {createElement(() => {
          if (loading) return <h1>Loading...</h1>;

          if (error)
            return (
              <>
                <h1>{`${error}`}</h1>
                <button onClick={reload}>Reload</button>
              </>
            );

          return (
            <div className="items">
              {renderItems?.length ? (
                renderItems?.map((item) => (
                  <div key={item.id} className="item">
                    <p>ID: {item.id}</p>
                    <p>BRAND: {item.brand}</p>
                    <p>PRODUCT: {item.product}</p>
                    <p>PRICE: {item.price}</p>
                  </div>
                ))
              ) : (
                <h1>No items</h1>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
