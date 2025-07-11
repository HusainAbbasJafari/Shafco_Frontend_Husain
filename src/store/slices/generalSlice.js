import { createSlice } from "@reduxjs/toolkit";
import { set } from "nprogress";

const generalSlice = createSlice({
    name: "general",
    initialState: {
        categories: [],
        subCategories: [],
        selectedCategoryId: null,
        selectedSubCategoryId: null
    },
    reducers: {
        setCategories: (state, action) => {
            state.categories = action.payload;
        },
        setCatIds: (state, action) => {
            state.selectedCategoryId = action.payload.cid;
            state.selectedSubCategoryId = action.payload.scid;

        }

    },
});

export const { setCategories, setCatIds } = generalSlice.actions;
export default generalSlice.reducer;
