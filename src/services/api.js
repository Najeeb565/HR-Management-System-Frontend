import axios from 'axios';

// Mock data for demonstration
const mockAdmin = {
  id: '1',
  name: 'John Anderson',
  email: 'john.anderson@company.com',
  profilePic: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  role: 'System Administrator',
  department: 'IT Operations',
  phoneNumber: '+1 (555) 123-4567',
  address: '123 Business Ave, New York, NY 10001',
  dateOfBirth: '1985-03-15',
  hireDate: '2020-01-15',
  salary: 95000,
  permissions: ['User Management', 'System Configuration', 'Data Analytics', 'Security Management'],
  lastLogin: '2024-01-15T10:30:00Z',
  status: 'active',
  employeeId: 'EMP001'
};

const mockCompany = {
  id: '1',
  name: 'TechCorp Solutions',
  logo: 'https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=400',
  industry: 'Technology Services',
  founded: '2010-05-20',
  headquarters: 'San Francisco, California',
  website: 'https://techcorp-solutions.com',
  employees: 1250,
  revenue: '$125M',
  description: 'Leading provider of innovative technology solutions for enterprise clients worldwide.',
  ceo: 'Sarah Williams',
  contactEmail: 'contact@techcorp-solutions.com',
  contactPhone: '+1 (555) 987-6543'
};

export const fetchAdminProfile = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real application, this would be:
  // const response = await axios.get('/api/admin/profile');
  // return response.data;
  
  return mockAdmin;
};

export const fetchCompanyData = async () => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // In a real application, this would be:
  // const response = await axios.get('/api/company');
  // return response.data;
  
  return mockCompany;
};