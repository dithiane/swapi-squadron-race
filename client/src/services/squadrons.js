import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";

const url = `http://localhost:4000`;

const initialState = {
    loading: false,
    error: null,
    data: null,
};

export const fetchSquadrons = createAsyncThunk(
    'squadrons/fetch',
    async () => {
        const response = await axios.get(`${url}/squadrons`);
        return response.data;
    }
);
export const deleteSquadron = createAsyncThunk(
    'squadrons/delete',
    async (initialPost) => {
        const { id } = initialPost;

        const response = await axios.delete(`${url}/squadron/${id}`)
        if (response?.status === 200) return initialPost;
        return `${response?.status}: ${response?.statusText}`;
    })

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
            const loadedSquadrons = action.payload.map(s => {
                s.id = s.squadron_id
                return s
            })
            state.error = null;
        });
        builder.addCase(fetchSquadrons.rejected, (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = action.error;
        });
        builder.addCase(deleteSquadron.fulfilled, (state, action) => {
            if (!action.payload?.id) {
                console.log('Delete could not complete')
                console.log(action.payload)
                return;
            }
            const { id } = action.payload;
            state.data.splice(state.data.findIndex(i => i.id === id), 1)
        })
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