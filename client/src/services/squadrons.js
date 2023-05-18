import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
const initialState = {
    loading: false,
    error: null,
    data: null,
};

export const fetchSquadrons = createAsyncThunk(
    'squadrons/fetch',
    async () => {
        const url = `http://localhost:4000`;
        const response = await axios.get(`${url}/squadrons`);
        return response.data;
    }
);

export const squadronsSlice = createSlice({
    name: 'squadrons',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchSquadrons.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchSquadrons.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null;
        });
        builder.addCase(fetchSquadrons.rejected, (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = action.error;
        });
    }
})

const squadronsSelector = state => state.squadrons;

export const selectLoading = createSelector(
    squadronsSelector,
    squadrons => squadrons.loading
);

export const selectError = createSelector(
    squadronsSelector,
    squadrons => squadrons.error
);

export const selectData = createSelector(
    squadronsSelector,
    squadrons => squadrons.data
);


export default squadronsSlice.reducer;