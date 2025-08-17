import React, { useState, ChangeEvent, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { InputField } from '../components/InputField/InputField';
import { DataTable } from '../components/DataTable/DataTable';
import Button from '../Button/Button';
import Modal from '../Modal/Modal';
import { useTheme } from '../context/ThemeContext';
import type { Column, Filter } from '../components/DataTable/DataTable.types';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  created: string;
}

const sampleData: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2025-08-16T09:24:11', created: '2025-01-15T14:30:00' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', lastLogin: '2025-08-15T18:42:33', created: '2025-02-21T11:15:00' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor', status: 'inactive', lastLogin: '2025-08-10T11:09:45', created: '2025-03-05T09:45:00' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'User', status: 'active', lastLogin: '2025-08-17T07:51:22', created: '2025-03-18T16:20:00' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'inactive', lastLogin: '2025-08-05T14:33:09', created: '2025-04-02T13:10:00' },
  { id: 6, name: 'Eva Garcia', email: 'eva@example.com', role: 'User', status: 'active', lastLogin: '2025-08-16T20:11:19', created: '2025-04-15T10:05:00' },
  { id: 7, name: 'David Lee', email: 'david@example.com', role: 'Admin', status: 'active', lastLogin: '2025-08-17T08:45:37', created: '2025-05-07T09:30:00' },
  { id: 8, name: 'Grace Wang', email: 'grace@example.com', role: 'Editor', status: 'active', lastLogin: '2025-08-14T16:22:41', created: '2025-05-21T14:45:00' },
  { id: 9, name: 'Tom Wilson', email: 'tom@example.com', role: 'Viewer', status: 'inactive', lastLogin: '2025-08-02T10:18:05', created: '2025-06-09T11:20:00' },
  { id: 10, name: 'Sofia Martinez', email: 'sofia@example.com', role: 'User', status: 'active', lastLogin: '2025-08-15T19:27:33', created: '2025-06-30T15:55:00' },
];

const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5,
      ease: "easeInOut" as const
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.3
    }
  }
};

export function ComponentDemo() {
  const [activeTab, setActiveTab] = useState<'inputField' | 'dataTable' | 'buttons' | 'modal'>('inputField');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRows, setSelectedRows] = useState<User[]>([]);
  const [isBasicModalOpen, setIsBasicModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isLargeModalOpen, setIsLargeModalOpen] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState('2025-08-17 13:43:59');
  const { mode, setMode, isDark } = useTheme();

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const formattedDate = now.toISOString().replace('T', ' ').substring(0, 19);
      setCurrentDate(formattedDate);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);

  const filters: Filter[] = [
    {
      key: 'role',
      label: 'Filter by Role',
      options: [
        { label: 'Admin', value: 'Admin' },
        { label: 'User', value: 'User' },
        { label: 'Editor', value: 'Editor' },
        { label: 'Viewer', value: 'Viewer' },
      ]
    },
    {
      key: 'status',
      label: 'Filter by Status',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Inactive', value: 'inactive' },
      ]
    }
  ];

  const columns: Column<User>[] = [
    { key: 'name', title: 'Name', dataIndex: 'name', sortable: true, searchable: true },
    { key: 'email', title: 'Email', dataIndex: 'email', sortable: true, searchable: true },
    { key: 'role', title: 'Role', dataIndex: 'role', sortable: true },
    { 
      key: 'status', 
      title: 'Status', 
      dataIndex: 'status', 
      sortable: true,
      render: (value: any) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value === 'active' 
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
            : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
        }`}>
          {value}
        </span>
      ),
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        return date.toLocaleString();
      }
    },
    {
      key: 'actions',
      title: 'Actions',
      dataIndex: 'id',
      render: (_, record) => (
        <div className="flex space-x-2">
          <Button 
            size="xs" 
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              // Action logic here
            }}
          >
            Edit
          </Button>
          <Button 
            size="xs" 
            variant="danger"
            onClick={(e) => {
              e.stopPropagation();
              // Action logic here
            }}
          >
            Delete
          </Button>
        </div>
      )
    }
  ];

  const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleRowSelect = (rows: User[]) => {
    setSelectedRows(rows);
  };

  const toggleLoading = () => {
    setDemoLoading(!demoLoading);
    // Simulate async operation
    if (!demoLoading) {
      setTimeout(() => setDemoLoading(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <header className="bg-white dark:bg-gray-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <motion.h1 
                className="text-3xl font-bold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
              >
                React Component Library
              </motion.h1>
              <motion.p 
                className="mt-1 text-sm text-gray-500 dark:text-gray-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Last updated: {currentDate} by dharmendra23101
              </motion.p>
            </div>
            
            <motion.div 
              className="flex items-center mt-4 md:mt-0 space-x-4"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.3 }}
            >
              <span className="text-sm text-gray-500 dark:text-gray-400">Theme:</span>
              <motion.button
                onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}
                className="p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors duration-300"
                aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
            <nav className="-mb-px flex" aria-label="Tabs">
              {['inputField', 'dataTable', 'buttons', 'modal'].map((tab) => (
                <motion.button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  } w-1/4 py-4 px-1 text-center border-b-2 font-medium text-sm transition-colors duration-200`}
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1).replace(/([A-Z])/g, ' $1')}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="mt-6">
            <AnimatePresence mode="wait">
              {activeTab === 'inputField' && (
                <motion.div
                  key="inputField"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-10"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Standard Input</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <InputField
                        label="Email Address"
                        placeholder="Enter your email"
                        helperText="We'll never share your email with anyone else."
                        type="email"
                      />
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Password Input</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <form onSubmit={(e) => e.preventDefault()} className="max-w-md">
                        <InputField
                          label="Password"
                          placeholder="Enter your password"
                          type="password"
                          showPasswordToggle
                          helperText="Password must be at least 8 characters long."
                        />
                      </form>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Input Variants</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InputField
                          label="Outlined (Default)"
                          placeholder="Outlined input"
                          variant="outlined"
                        />
                        <InputField
                          label="Filled"
                          placeholder="Filled input"
                          variant="filled"
                        />
                        <InputField
                          label="Ghost"
                          placeholder="Ghost input"
                          variant="ghost"
                        />
                        <InputField
                          label="Floating Label"
                          placeholder="Type something..."
                          variant="floating"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Input States</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <InputField
                          label="Error State"
                          placeholder="Error input"
                          invalid
                          errorMessage="This field has an error"
                          defaultValue="Invalid data"
                        />
                        <InputField
                          label="Disabled State"
                          placeholder="You can't type here"
                          disabled
                          value="Disabled input"
                          onChange={() => {}}
                        />
                        <InputField
                          label="Loading State"
                          placeholder="Loading..."
                          loading
                        />
                        <InputField
                          label="With Character Count"
                          placeholder="Type here..."
                          maxLength={20}
                          showCharacterCount
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Input Sizes</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <InputField
                          label="Small Size"
                          placeholder="Small input"
                          size="sm"
                        />
                        <InputField
                          label="Medium Size (Default)"
                          placeholder="Medium input"
                          size="md"
                        />
                        <InputField
                          label="Large Size"
                          placeholder="Large input"
                          size="lg"
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Input with Icons</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                          label="With Left Icon"
                          placeholder="Search..."
                          leftIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                          }
                        />
                        <InputField
                          label="With Right Icon"
                          placeholder="Enter URL"
                          rightIcon={
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 015.656 0l4 4a4 4 0 01-5.656 5.656l-1.102-1.101" />
                            </svg>
                          }
                        />
                      </div>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">With Clear Button</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <InputField
                        label="Clearable Input"
                        placeholder="Type to clear"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        showClearButton
                        onClear={() => setSearchTerm('')}
                      />
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'dataTable' && (
                <motion.div
                  key="dataTable"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-8"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-white">Enhanced DataTable</h2>
                      <Button 
                        variant="primary" 
                        size="sm"
                        leftIcon={
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                          </svg>
                        }
                      >
                        Add User
                      </Button>
                    </div>
                    
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <DataTable
                        data={sampleData}
                        columns={columns}
                        selectable
                        onRowSelect={handleRowSelect}
                        searchable
                        searchPlaceholder="Search users..."
                        filters={filters}
                        pagination
                        pageSize={5}
                        loading={demoLoading}
                        exportable
                        stickyHeader
                        animationEnabled
                        customActions={
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            onClick={toggleLoading}
                            isLoading={demoLoading}
                          >
                            {demoLoading ? 'Loading...' : 'Simulate Loading'}
                          </Button>
                        }
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Responsive DataTable</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      This DataTable automatically adapts to different screen sizes. Try resizing your browser window!
                    </p>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'buttons' && (
                <motion.div
                  key="buttons"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-10"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Button Variants</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-4">
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="outline">Outline</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="link">Link</Button>
                        <Button variant="success">Success</Button>
                        <Button variant="danger">Danger</Button>
                        <Button variant="warning">Warning</Button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Button Sizes</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap items-center gap-4">
                        <Button size="xs">Extra Small</Button>
                        <Button size="sm">Small</Button>
                        <Button size="md">Medium</Button>
                        <Button size="lg">Large</Button>
                        <Button size="xl">Extra Large</Button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Button States</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Button isLoading>Loading</Button>
                        <Button disabled>Disabled</Button>
                        <Button isActive>Active</Button>
                        <Button fullWidth>Full Width</Button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Button with Icons</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-wrap gap-4">
                        <Button 
                          leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                            </svg>
                          }
                        >
                          Add Item
                        </Button>
                        <Button 
                          variant="outline"
                          rightIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          }
                        >
                          Show More
                        </Button>
                        <Button 
                          variant="ghost"
                          leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                          }
                        >
                          Play Video
                        </Button>
                        <Button 
                          variant="danger"
                          leftIcon={
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          }
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Button Elevations & Shapes</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="mb-6">
                        <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Elevations</h3>
                        <div className="flex flex-wrap gap-4">
                          <Button elevation="none">No Shadow</Button>
                          <Button elevation="sm">Small Shadow</Button>
                          <Button elevation="md">Medium Shadow</Button>
                          <Button elevation="lg">Large Shadow</Button>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-md font-medium mb-3 text-gray-700 dark:text-gray-300">Shapes</h3>
                        <div className="flex flex-wrap gap-4">
                          <Button rounded="none">Square</Button>
                          <Button rounded="sm">Small Rounded</Button>
                          <Button rounded="md">Medium Rounded</Button>
                          <Button rounded="lg">Large Rounded</Button>
                          <Button rounded="full">Fully Rounded</Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === 'modal' && (
                <motion.div
                  key="modal"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="space-y-10"
                >
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Modal Component</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">
                          Click the buttons below to open different types of modals with animations.
                        </p>
                        
                        <div className="flex flex-wrap gap-4">
                          <Button onClick={() => setIsBasicModalOpen(true)}>
                            Basic Modal
                          </Button>
                          <Button onClick={() => setIsFormModalOpen(true)} variant="outline">
                            Form Modal
                          </Button>
                          <Button onClick={() => setIsLargeModalOpen(true)} variant="secondary">
                            Large Modal
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <h2 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">Modal Features</h2>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                      <div className="space-y-4">
                        <p className="text-gray-600 dark:text-gray-400">
                          Our modal component includes the following features:
                        </p>
                        
                        <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400">
                          <li>Multiple animation presets (fade, slide, scale, flip)</li>
                          <li>Various sizes (xs, sm, md, lg, xl, 2xl, full)</li>
                          <li>Optional footer section</li>
                          <li>Close on overlay click (configurable)</li>
                          <li>Close on ESC key (configurable)</li>
                          <li>Scrollable content (inside or outside)</li>
                          <li>Centered content option</li>
                          <li>Focus trap for accessibility</li>
                        </ul>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Modal components */}
      <Modal
        isOpen={isBasicModalOpen}
        onClose={() => setIsBasicModalOpen(false)}
        title="Basic Modal"
        animationPreset="scale"
      >
        <p className="text-gray-600 dark:text-gray-400">
          This is a basic modal with just a title and content. It uses a scale animation preset.
        </p>
        <div className="mt-4">
          <Button onClick={() => setIsBasicModalOpen(false)}>Close</Button>
        </div>
      </Modal>

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        title="Form Modal"
        animationPreset="slide"
        footer={
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsFormModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setIsFormModalOpen(false)}>
              Submit
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            This modal uses a slide animation and includes a form with a footer for actions.
          </p>
          <InputField 
            label="Name"
            placeholder="Enter your name"
            required
          />
          <InputField 
            label="Email"
            placeholder="Enter your email"
            type="email"
            required
          />
          <InputField
            label="Message"
            placeholder="Enter your message"
            helperText="Optional: Include any additional information"
          />
        </div>
      </Modal>

      <Modal
        isOpen={isLargeModalOpen}
        onClose={() => setIsLargeModalOpen(false)}
        title="Large Modal with Scrollable Content"
        size="2xl"
        animationPreset="fade"
        scrollBehavior="inside"
        centerContent
      >
        <div className="space-y-6">
          <p className="text-gray-600 dark:text-gray-400">
            This is a large modal with scrollable content. It demonstrates the scrollBehavior="inside" option and centerContent option.
          </p>
          
          <div className="rounded-lg overflow-hidden">
            <img src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80" 
                 alt="Demo" 
                 className="w-full h-auto rounded-lg" />
          </div>
          
          <p className="text-gray-600 dark:text-gray-400">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.
          </p>
          
          <p className="text-gray-600 dark:text-gray-400">
            Mauris sollicitudin fermentum libero. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nam commodo suscipit quam. Nulla consequat massa quis enim. In dui magna, posuere eget, vestibulum et, tempor auctor, justo.
          </p>
          
          <p className="text-gray-600 dark:text-gray-400">
            Cras sagittis. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Sed lectus. Duis vel nibh at velit scelerisque suscipit. Vivamus euismod mauris.
          </p>
          
          <div className="flex justify-center">
            <Button onClick={() => setIsLargeModalOpen(false)} variant="primary" size="lg">
              Close Modal
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default ComponentDemo;