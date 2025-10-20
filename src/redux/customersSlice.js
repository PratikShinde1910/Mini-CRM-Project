import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';



export const fetchCustomers = createAsyncThunk(
  'customers/fetch',
  async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
    try {
      const res = await api.get('/customers', { params: { page, limit, search } });
      return res.data; 
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const addCustomer = createAsyncThunk(
  'customers/add',
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post('/customers', payload);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const updateCustomer = createAsyncThunk(
  'customers/update',
  async ({ id, updates }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/customers/${id}`, updates);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const deleteCustomer = createAsyncThunk(
  'customers/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/customers/${id}`);
      return id;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const customersSlice = createSlice({
  name: 'customers',
  initialState: {
    items: [],
    page: 1,
    limit: 10,
    total: 0,
    search: '',
    loading: false,
    error: null,
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
      state.page = 1;
    },
    resetCustomers(state) {
      state.items = [];
      state.page = 1;
      state.total = 0;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        const { data, total, page, limit } = action.payload;
        state.page = page;
        state.limit = limit;
        state.total = total;
        
        if (page === 1) state.items = data;
        else state.items = [...state.items, ...data];
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addCustomer.pending, (state) => {
        state.error = null;
      })
      .addCase(addCustomer.fulfilled, (state, action) => {
        state.items = [action.payload, ...state.items];
        state.total += 1;
        state.error = null;
      })
      .addCase(addCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(updateCustomer.pending, (state) => {
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        const idx = state.items.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
        state.error = null;
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.error = action.payload;
      })
      
      .addCase(deleteCustomer.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.items = state.items.filter((c) => c.id !== action.payload);
        state.total = Math.max(0, state.total - 1);
        state.error = null;
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { setSearch, resetCustomers } = customersSlice.actions;
export default customersSlice.reducer;
