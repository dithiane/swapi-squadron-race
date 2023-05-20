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
        if (response?.status === 200) return response.data;
    })

export const updateSquadron = createAsyncThunk(
    'squadrons/update',
    async (initialPost) => {
        const { id, speed } = initialPost;

        const response = await axios.put(`${url}/squadron/${id}`, { speed })
        if (response?.status === 200) return response.data;
    })

export const createSquadron = createAsyncThunk(
    'squadrons/create',
    async (initialPost) => {
        const { name, speed, weight } = initialPost;
        const response = await axios.post(`${url}/squadrons/`, { name, speed, weight })
        if (response?.status === 200) return response.data;
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
            state.error = null;
        });
        builder.addCase(fetchSquadrons.rejected, (state, action) => {
            state.loading = false;
            state.data = null;
            state.error = action.error;
        });
        builder.addCase(deleteSquadron.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null
        })
        builder.addCase(updateSquadron.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null
        })
        builder.addCase(createSquadron.fulfilled, (state, action) => {
            state.loading = false;
            state.data = action.payload;
            state.error = null
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