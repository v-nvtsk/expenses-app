import React, { memo, useEffect } from "react";
import "./style.css";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, StoreRootState } from "../../store";
import { add, CategoryState, readAll } from "../../store/categorySlice";

export const Settings = memo(() => {
  const categoryState = useSelector<StoreRootState>((state) => state.category) as CategoryState;
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(readAll({}));
  }, []);

  const callbacks = {
    onSubmit: (ev: React.FormEvent<HTMLFormElement>) => {
      ev.preventDefault();

      const form = ev.currentTarget;
      const name = form.expenseName!.value;
      const parentId = form.parentCategory!.value;
      dispatch(add({ name, parentId }));
    },
  };
  return (
    <main className="page__settings">
      <div className="container">
        <h1>Settings</h1>
        <div>
          <form onSubmit={callbacks.onSubmit}>
            <fieldset>
              <legend>Add category</legend>
              <div>
                <label className="form-label mt-4" htmlFor="expenseName">
                  New category name
                </label>
                <input className="form-control" name="expenseName" type="text" id="expenseName" required />
              </div>
              <div>
                <label htmlFor="parentCategory" className="form-label mt-4">
                  Parent category
                </label>
                <select className="form-select" name="parentCategory" id="parentCategory" size={10} required>
                  <option value=""></option>
                  {categoryState.items.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.leveledName}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary mt-3">
                Add Category
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </main>
  );
});
