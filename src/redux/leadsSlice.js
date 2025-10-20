import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/api';


export const fetchLeads = createAsyncThunk(
  'leads/fetchLeads',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        ...(search && { search }),
        ...(status && { status }),
      });

      const response = await api.get(`/leads?${params}`);
      return {
        leads: response.data.leads || [],
        total: response.data.total || 0,
        page: response.data.page || page,
      };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);

export const fetchLeadsByCustomer = createAsyncThunk(
  'leads/fetchByCustomer',
  async ({ customerId, status }, { rejectWithValue }) => {
    try {
      const res = await api.get(`/customers/${customerId}/leads`, { params: { status } });
      return { customerId, leads: res.data };
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const addLead = createAsyncThunk(
  'leads/add',
  async ({ customerId, payload }, { rejectWithValue }) => {
    try {
      console.log('AddLead thunk called with:', { customerId, payload });
      
      const leadData = {
        ...payload,
        customerId,
        createdAt: new Date().toISOString(),
      };
      
      console.log('Lead data to send:', leadData);
      console.log('API endpoint:', `/customers/${customerId}/leads`);
      
      const res = await api.post(`/customers/${customerId}/leads`, leadData);
      console.log('API response:', res.data);
      
      return res.data;
    } catch (e) {
      console.error('AddLead API error:', {
        message: e.message,
        status: e.response?.status,
        statusText: e.response?.statusText,
        data: e.response?.data,
        config: e.config
      });
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const updateLead = createAsyncThunk(
  'leads/update',
  async ({ leadId, updates }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/leads/${leadId}`, updates);
      return res.data;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

export const deleteLead = createAsyncThunk(
  'leads/delete',
  async (leadId, { rejectWithValue }) => {
    try {
      await api.delete(`/leads/${leadId}`);
      return leadId;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || e.message);
    }
  }
);

const leadsSlice = createSlice({
  name: 'leads',
  initialState: {
    items: [], 
    byCustomer: {}, 
    page: 1,
    limit: 10,
    total: 0,
    search: '',
    statusFilter: '',
    loading: false,
    error: null,
    selectedLead: null,
  },
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload;
      state.page = 1; 
    },
    setStatusFilter: (state, action) => {
      state.statusFilter = action.payload;
      state.page = 1; 
    },
    setSelectedLead: (state, action) => {
      state.selectedLead = action.payload;
    },
    resetLeads: (state) => {
      state.items = [];
      state.page = 1;
      state.total = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder

    .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        const { leads, total, page } = action.payload;
        
        if (page === 1) {
          state.items = leads;
        } else {

          const existingIds = new Set(state.items.map(item => item.id));
          const newLeads = leads.filter(lead => !existingIds.has(lead.id));
          state.items = [...state.items, ...newLeads];
        }
        
        state.total = total;
        state.page = page;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      

      .addCase(fetchLeadsByCustomer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLeadsByCustomer.fulfilled, (state, action) => {
        state.loading = false;
        const { customerId, leads } = action.payload;
        state.byCustomer[customerId] = leads;
      })
      .addCase(fetchLeadsByCustomer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(addLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLead.fulfilled, (state, action) => {
        state.loading = false;
        const lead = action.payload;
        

        state.items.unshift(lead);
        state.total += 1;
        

        const list = state.byCustomer[lead.customerId] || [];
        state.byCustomer[lead.customerId] = [lead, ...list];
      })
      .addCase(addLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLead.fulfilled, (state, action) => {
        state.loading = false;
        const lead = action.payload;
        
        const itemIndex = state.items.findIndex(l => l.id === lead.id);
        if (itemIndex !== -1) {
          state.items[itemIndex] = lead;
        }
        
        const list = state.byCustomer[lead.customerId] || [];
        const idx = list.findIndex((l) => l.id === lead.id);
        if (idx !== -1) {
          list[idx] = lead;
          state.byCustomer[lead.customerId] = list;
        }
        
        if (state.selectedLead?.id === lead.id) {
          state.selectedLead = lead;
        }
      })
      .addCase(updateLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(deleteLead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLead.fulfilled, (state, action) => {
        state.loading = false;
        const leadId = action.payload;
        
        state.items = state.items.filter(lead => lead.id !== leadId);
        state.total -= 1;
        
        for (const key of Object.keys(state.byCustomer)) {
          const cid = Number(key);
          const list = state.byCustomer[cid];
          const idx = list.findIndex((l) => l.id === leadId);
          if (idx !== -1) {
            list.splice(idx, 1);
            break;
          }
        }
        
        if (state.selectedLead?.id === leadId) {
          state.selectedLead = null;
        }
      })
      .addCase(deleteLead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { 
  setSearch, 
  setStatusFilter, 
  setSelectedLead, 
  resetLeads, 
  clearError 
} = leadsSlice.actions;

export default leadsSlice.reducer;
