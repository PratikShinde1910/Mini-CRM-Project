import * as SecureStore from 'expo-secure-store';

const dummyCustomers = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@email.com',
    phone: '+1-555-0101',
    company: 'Tech Solutions Inc.',
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah.j@marketing.com',
    phone: '+1-555-0102',
    company: 'Creative Marketing Agency',
    createdAt: new Date('2024-02-20').toISOString(),
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'mchen@startup.io',
    phone: '+1-555-0103',
    company: 'Innovate Startup',
    createdAt: new Date('2024-03-10').toISOString(),
  },
  {
    id: 4,
    name: 'Emma Williams',
    email: 'emma.w@consulting.com',
    phone: '+1-555-0104',
    company: 'Business Consultants LLC',
    createdAt: new Date('2024-04-05').toISOString(),
  },
  {
    id: 5,
    name: 'David Rodriguez',
    email: 'david.r@finance.com',
    phone: '+1-555-0105',
    company: 'Financial Services Corp',
    createdAt: new Date('2024-05-12').toISOString(),
  },
  {
    id: 6,
    name: 'Lisa Anderson',
    email: 'lisa.anderson@retail.com',
    phone: '+1-555-0106',
    company: 'Retail Solutions Ltd',
    createdAt: new Date('2024-06-18').toISOString(),
  },
  {
    id: 7,
    name: 'James Taylor',
    email: 'j.taylor@manufacturing.com',
    phone: '+1-555-0107',
    company: 'Manufacturing Co.',
    createdAt: new Date('2024-07-22').toISOString(),
  },
  {
    id: 8,
    name: 'Jennifer Davis',
    email: 'jen.davis@healthcare.org',
    phone: '+1-555-0108',
    company: 'Healthcare Systems',
    createdAt: new Date('2024-08-30').toISOString(),
  },
  {
    id: 9,
    name: 'Robert Brown',
    email: 'r.brown@education.edu',
    phone: '+1-555-0109',
    company: 'Educational Institute',
    createdAt: new Date('2024-09-14').toISOString(),
  },
  {
    id: 10,
    name: 'Amanda Wilson',
    email: 'amanda.w@nonprofitorg.org',
    phone: '+1-555-0110',
    company: 'Nonprofit Organization',
    createdAt: new Date('2024-10-08').toISOString(),
  },
];

const dummyLeads = [
  {
    id: 1,
    customerId: 1,
    title: 'Website Development',
    description: 'Need a new company website with modern design',
    value: 15000,
    status: 'New',
    createdAt: new Date('2024-01-16').toISOString(),
  },
  {
    id: 2,
    customerId: 1,
    title: 'Mobile App Development',
    description: 'iOS and Android app for customer engagement',
    value: 25000,
    status: 'Contacted',
    createdAt: new Date('2024-02-01').toISOString(),
  },
  {
    id: 3,
    customerId: 2,
    title: 'Marketing Campaign',
    description: 'Digital marketing campaign for product launch',
    value: 8000,
    status: 'Converted',
    createdAt: new Date('2024-02-25').toISOString(),
  },
  {
    id: 4,
    customerId: 3,
    title: 'Cloud Migration',
    description: 'Migrate existing infrastructure to cloud',
    value: 35000,
    status: 'New',
    createdAt: new Date('2024-03-15').toISOString(),
  },
  {
    id: 5,
    customerId: 4,
    title: 'Business Analysis',
    description: 'Comprehensive business process analysis',
    value: 12000,
    status: 'Contacted',
    createdAt: new Date('2024-04-10').toISOString(),
  },
  {
    id: 6,
    customerId: 5,
    title: 'Financial Software',
    description: 'Custom financial tracking software',
    value: 22000,
    status: 'Lost',
    createdAt: new Date('2024-05-20').toISOString(),
  },
  {
    id: 7,
    customerId: 6,
    title: 'E-commerce Platform',
    description: 'Online shopping platform development',
    value: 18000,
    status: 'New',
    createdAt: new Date('2024-06-25').toISOString(),
  },
  {
    id: 8,
    customerId: 7,
    title: 'IoT Integration',
    description: 'Internet of Things sensors for manufacturing',
    value: 45000,
    status: 'Contacted',
    createdAt: new Date('2024-07-30').toISOString(),
  },
  {
    id: 9,
    customerId: 8,
    title: 'Patient Management System',
    description: 'Digital patient management and scheduling',
    value: 28000,
    status: 'Converted',
    createdAt: new Date('2024-09-05').toISOString(),
  },
  {
    id: 10,
    customerId: 9,
    title: 'Learning Management System',
    description: 'Online learning platform for students',
    value: 32000,
    status: 'New',
    createdAt: new Date('2024-09-20').toISOString(),
  },
];

/**
 * Populate AsyncStorage with dummy data for testing
 */
export const populateDummyData = async () => {
  try {
    console.log('Populating AsyncStorage with dummy data...');
    
    // Store customers
    await SecureStore.setItemAsync('dummy_customers', JSON.stringify(dummyCustomers));
    
    // Store leads
    await SecureStore.setItemAsync('dummy_leads', JSON.stringify(dummyLeads));
    
    // Store metadata
    const metadata = {
      customersCount: dummyCustomers.length,
      leadsCount: dummyLeads.length,
      lastUpdated: new Date().toISOString(),
    };
    await SecureStore.setItemAsync('dummy_metadata', JSON.stringify(metadata));
    
    console.log('Dummy data populated successfully!');
    console.log(`- ${dummyCustomers.length} customers`);
    console.log(`- ${dummyLeads.length} leads`);
    
    return { success: true, message: 'Dummy data populated successfully' };
  } catch (error) {
    console.error('Error populating dummy data:', error);
    return { success: false, message: error.message };
  }
};

/**
 * Get dummy customers from AsyncStorage
 */
export const getDummyCustomers = async () => {
  try {
    const customersJson = await SecureStore.getItemAsync('dummy_customers');
    return customersJson ? JSON.parse(customersJson) : [];
  } catch (error) {
    console.error('Error getting dummy customers:', error);
    return [];
  }
};

/**
 * Get dummy leads from AsyncStorage
 */
export const getDummyLeads = async () => {
  try {
    const leadsJson = await SecureStore.getItemAsync('dummy_leads');
    return leadsJson ? JSON.parse(leadsJson) : [];
  } catch (error) {
    console.error('Error getting dummy leads:', error);
    return [];
  }
};

/**
 * Get dummy data metadata
 */
export const getDummyMetadata = async () => {
  try {
    const metadataJson = await SecureStore.getItemAsync('dummy_metadata');
    return metadataJson ? JSON.parse(metadataJson) : null;
  } catch (error) {
    console.error('Error getting dummy metadata:', error);
    return null;
  }
};

/**
 * Clear all dummy data from AsyncStorage
 */
export const clearDummyData = async () => {
  try {
    await SecureStore.deleteItemAsync('dummy_customers');
    await SecureStore.deleteItemAsync('dummy_leads');
    await SecureStore.deleteItemAsync('dummy_metadata');
    console.log('Dummy data cleared successfully!');
    return { success: true, message: 'Dummy data cleared successfully' };
  } catch (error) {
    console.error('Error clearing dummy data:', error);
    return { success: false, message: error.message };
  }
};

export { dummyCustomers, dummyLeads };