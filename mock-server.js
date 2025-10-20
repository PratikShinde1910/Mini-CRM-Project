const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Mock database (in-memory)
let users = [];
let customers = [];
let leads = []; // { id, customerId, title, description, status, value, createdAt }
let tokenCounter = 1;
let customerCounter = 1;
let leadCounter = 1;

// Helper function to generate mock JWT token
const generateToken = (user) => `mock-jwt-token-${tokenCounter++}-${user.id}`;

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  const tokenMatch = token.match(/mock-jwt-token-\d+-(\d+)/);
  if (!tokenMatch) return res.status(401).json({ message: 'Invalid token' });
  const userId = parseInt(tokenMatch[1]);
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ message: 'User not found' });
  req.user = { id: user.id, name: user.name, email: user.email };
  next();
};

// Seed with some demo data for easier testing
const seedData = () => {
  if (customers.length === 0) {
    for (let i = 1; i <= 35; i++) {
      customers.push({
        id: customerCounter++,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+1-555-000${String(i).padStart(2, '0')}`,
        company: `Company ${Math.ceil(i / 3)}`,
        ownerId: 1,
      });
    }
  }
  if (leads.length === 0 && customers.length > 0) {
    const statuses = ['New', 'Contacted', 'Converted', 'Lost'];
    for (const c of customers) {
      for (let j = 0; j < 2; j++) {
        const status = statuses[(c.id + j) % statuses.length];
        leads.push({
          id: leadCounter++,
          customerId: c.id,
          title: `Lead ${c.id}-${j + 1}`,
          description: `Opportunity for ${c.name}`,
          status,
          value: Math.round(Math.random() * 5000 + 500),
          createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
        });
      }
    }
  }
};
seedData();

// Auth endpoints
app.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  const existingUser = users.find((u) => u.email === email);
  if (existingUser) return res.status(400).json({ message: 'User already exists with this email' });
  const newUser = { id: users.length + 1, name, email, password };
  users.push(newUser);
  const token = generateToken(newUser);
  const userResponse = { id: newUser.id, name: newUser.name, email: newUser.email };
  res.status(201).json({ message: 'User registered successfully', token, user: userResponse });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: 'Invalid email or password' });
  const token = generateToken(user);
  const userResponse = { id: user.id, name: user.name, email: user.email };
  res.json({ message: 'Login successful', token, user: userResponse });
});

app.get('/verify-token', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Customers endpoints
app.get('/customers', authenticate, (req, res) => {
  const { page = 1, limit = 10, search = '' } = req.query;
  const p = parseInt(page);
  const l = parseInt(limit);
  const term = String(search).toLowerCase();
  let filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(term) || c.email.toLowerCase().includes(term)
  );
  const total = filtered.length;
  const start = (p - 1) * l;
  const data = filtered.slice(start, start + l);
  res.json({ data, total, page: p, limit: l });
});

app.post('/customers', authenticate, (req, res) => {
  const { name, email, phone, company } = req.body;
  if (!name || !email) return res.status(400).json({ message: 'Name and email are required' });
  const exists = customers.find((c) => c.email === email);
  if (exists) return res.status(400).json({ message: 'Customer with this email already exists' });
  const customer = { id: customerCounter++, name, email, phone: phone || '', company: company || '', ownerId: req.user.id };
  customers.push(customer);
  res.status(201).json(customer);
});

app.put('/customers/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Customer not found' });
  customers[idx] = { ...customers[idx], ...req.body };
  res.json(customers[idx]);
});

app.delete('/customers/:id', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const idx = customers.findIndex((c) => c.id === id);
  if (idx === -1) return res.status(404).json({ message: 'Customer not found' });
  customers.splice(idx, 1);
  // delete associated leads
  leads = leads.filter((l) => l.customerId !== id);
  res.status(204).send();
});

// Leads endpoints
// Get all leads with pagination and filtering
app.get('/leads', authenticate, (req, res) => {
  const { page = 1, limit = 10, search = '', status = '' } = req.query;
  const p = parseInt(page);
  const l = parseInt(limit);
  const term = String(search).toLowerCase();
  
  let filtered = leads.filter((lead) => {
    const matchesSearch = lead.title.toLowerCase().includes(term) || 
                         lead.description.toLowerCase().includes(term);
    const matchesStatus = !status || lead.status === status;
    return matchesSearch && matchesStatus;
  });
  
  const total = filtered.length;
  const start = (p - 1) * l;
  const data = filtered.slice(start, start + l);
  
  res.json({ leads: data, total, page: p, limit: l });
});

app.get('/customers/:id/leads', authenticate, (req, res) => {
  const id = parseInt(req.params.id);
  const { status } = req.query; // optional filter
  let list = leads.filter((l) => l.customerId === id);
  if (status) list = list.filter((l) => l.status === status);
  res.json(list);
});

app.post('/customers/:id/leads', authenticate, (req, res) => {
  const customerId = parseInt(req.params.id);
  const c = customers.find((c) => c.id === customerId);
  if (!c) return res.status(404).json({ message: 'Customer not found' });
  const { title, description, status, value } = req.body;
  if (!title || !status) return res.status(400).json({ message: 'Title and status are required' });
  const lead = {
    id: leadCounter++,
    customerId,
    title,
    description: description || '',
    status,
    value: Number(value) || 0,
    createdAt: new Date().toISOString(),
  };
  leads.push(lead);
  res.status(201).json(lead);
});

app.put('/leads/:leadId', authenticate, (req, res) => {
  const leadId = parseInt(req.params.leadId);
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return res.status(404).json({ message: 'Lead not found' });
  leads[idx] = { ...leads[idx], ...req.body };
  res.json(leads[idx]);
});

app.delete('/leads/:leadId', authenticate, (req, res) => {
  const leadId = parseInt(req.params.leadId);
  const idx = leads.findIndex((l) => l.id === leadId);
  if (idx === -1) return res.status(404).json({ message: 'Lead not found' });
  leads.splice(idx, 1);
  res.status(204).send();
});

// Dashboard stats
app.get('/dashboard/leads-stats', authenticate, (req, res) => {
  const byStatus = leads.reduce((acc, l) => {
    acc[l.status] = (acc[l.status] || 0) + 1;
    return acc;
  }, {});
  const totalValue = leads.reduce((sum, l) => sum + (Number(l.value) || 0), 0);
  res.json({ byStatus, totalValue });
});

app.listen(PORT, () => {
  console.log(`Mock API server running on http://localhost:${PORT}`);
  console.log('Available endpoints:');
  console.log('POST /register - Register a new user');
  console.log('POST /login - Login user');
  console.log('GET /verify-token - Verify authentication token');
  console.log('GET /customers?page=&limit=&search=');
  console.log('POST /customers');
  console.log('PUT /customers/:id');
  console.log('DELETE /customers/:id');
  console.log('GET /leads?page=&limit=&search=&status= - Get all leads');
  console.log('GET /customers/:id/leads?status=');
  console.log('POST /customers/:id/leads');
  console.log('PUT /leads/:leadId');
  console.log('DELETE /leads/:leadId');
  console.log('GET /dashboard/leads-stats');
});
