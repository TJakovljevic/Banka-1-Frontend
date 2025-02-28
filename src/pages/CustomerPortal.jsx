import React, { useState, useEffect } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import SearchDataTable from "../components/common/SearchDataTable";
import EditModal from "../components/common/EditModal";
import { 
    fetchCustomers, 
    fetchCustomerById, 
    updateCustomer,
    createCustomer
} from "../Axios";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddButton from "../components/common/AddButton";

const CustomerPortal = () => {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    // Correct the naming to match the pattern in EmployeePortal
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [newCustomer, setNewCustomer] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        phoneNumber: "",
        address: "",
        birthDate: "",
        gender: "MALE",
        password: ""
    });

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'firstName', headerName: 'First name', width: 130 },
        { field: 'lastName', headerName: 'Last name', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'phoneNumber', headerName: 'Phone', width: 150 },
    ];
    
    useEffect(() => {
        loadCustomers();
    }, []);
    
    const loadCustomers = async () => { 
        try {
            setLoading(true);
            const data = await fetchCustomers();
            const rowData = data.data.rows;
            
            const formattedRows = rowData.map((row) => ({
                id: row.id,
                firstName: row.firstName,
                lastName: row.lastName,
                email: row.email,
                phoneNumber: row.phoneNumber,
                // Store original data for potential updates
                originalData: { ...row }
            }));
            
            setRows(formattedRows);
        } catch (err) {
            console.error(err);
            setError("Failed to load customers data");
        } finally {
            setLoading(false);
        }
    };

    const formatLogDate = (log) => {
        if (typeof log !== "string" && typeof log !== "number") return String(log);
      
        const strLog = String(log);
        
        if (strLog.length === 8) {
          // Extract year, month, and day
          const year = strLog.slice(0, 4);
          const month = strLog.slice(4, 6);
          const day = strLog.slice(6, 8);
          
          return `${year}-${month}-${day}`; // Output format: YYYY-MM-DD
        }
      
        return strLog; // Return as-is if not in expected format
    };

    const handleRowClick = async (row) => {
        try {
            const response = await fetchCustomerById(row.id);
            
            const customerData = response.data || response;
           
            // Create a clean customer object
            const cleanCustomerData = {
                id: row.id,
                firstName: customerData.firstName,
                lastName: customerData.lastName,
                username: customerData.username,
                email: customerData.email,
                phoneNumber: customerData.phoneNumber,
                address: customerData.address,
                birthDate: formatLogDate(customerData.birthDate),
                gender: customerData.gender
            };

            setSelectedCustomer(cleanCustomerData);
            setIsEditModalOpen(true);
        } catch (error) {
            toast.error(`Error fetching customer details: ${error.message}`);
        }
    };

    const handleSaveCustomer = async (updatedCustomerData) => {
        try {
            // Map to the expected API format
            const customerPayload = {
                ime: updatedCustomerData.firstName,
                prezime: updatedCustomerData.lastName,
                username: updatedCustomerData.username,
                datum_rodjenja: transformDateForApi(updatedCustomerData.birthDate),
                pol: updatedCustomerData.gender,
                email: updatedCustomerData.email,
                broj_telefona: updatedCustomerData.phoneNumber,
                adresa: updatedCustomerData.address,
                // Only include password if it's provided in the form
                ...(updatedCustomerData.password && { password: updatedCustomerData.password })
            };
            
            await updateCustomer(updatedCustomerData.id, customerPayload);
            setIsEditModalOpen(false);
            toast.success('Customer updated successfully');
            loadCustomers();
        } catch (error) {
            toast.error(`Failed to update customer: ${error.message}`);
        }
    };

    const transformDateForApi = (dateString) => {
        // Skip if empty
        if (!dateString) return null;
      
        try {
          // Expecting "DD-MM-YYYY" => split by '-'
          const [day, month, year] = dateString.split('-');
          
          // Validate we got three parts
          if (!day || !month || !year) return null;
          
          // Construct "YYYYMMDD" and parse it as a number
          const resultString = `${year}${month}${day}`; // "20020302"
          
          // Optionally add further checks for valid day/month/year ranges
          return Number(resultString);
          
        } catch (error) {
          console.error('Error converting date:', error);
          return null;
        }
      };

    // Add create customer handler
    const handleCreateCustomer = async (customerData) => {
        try {
            const customerPayload = {
                ime: customerData.firstName,
                prezime: customerData.lastName,
                username: customerData.username,
                datum_rodjenja: transformDateForApi(customerData.birthDate),
                pol: customerData.gender,
                email: customerData.email,
                broj_telefona: customerData.phoneNumber,
                adresa: customerData.address,
                password: customerData.password || "defaultPassword123" 
            };
    
            await createCustomer(customerPayload);
            setIsCreateModalOpen(false);
            toast.success('Customer created successfully');
            loadCustomers();
        } catch (error) {
            toast.error(`Failed to create customer: ${error.message}`);
        }
    };
    

    const customerFormFields = [
        { name: 'firstName', label: 'First Name', required: true },
        { name: 'lastName', label: 'Last Name', required: true },
        { name: 'username', label: 'Username', required: true },
        { name: 'email', label: 'Email', required: true, type: 'email' },
        { name: 'phoneNumber', label: 'Phone Number' },
        { name: 'address', label: 'Address' },
        { name: 'birthDate', label: 'Birth Date', type: 'date' },
        { name: 'gender', label: 'Gender', type: 'select', options: [
            { value: 'MALE', label: 'Male' },
            { value: 'FEMALE', label: 'Female' },
            { value: 'OTHER', label: 'Other' }
        ] }
    ];

    // Add password field for customer creation
    const createCustomerFormFields = [
        ...customerFormFields,
        { name: 'password', label: 'Password', type: 'password', required: true }
    ];
    
    return (
        <div>
            <Sidebar/>
            <div style={{ padding: '20px', marginTop: '64px' }}>
                <h2>Customer Management</h2>
                {loading ? (
                    <p>Loading customer data...</p>
                ) : error ? (
                    <p>Error: {error}</p>
                ) : (
                    <SearchDataTable 
                        rows={rows} 
                        columns={columns} 
                        checkboxSelection={false}
                        onRowClick={handleRowClick}
                        actionButton={<AddButton onClick={() => setIsCreateModalOpen(true)} label="Add Customer" />}
                    />
                )}

                {/* Edit Modal */}
                {selectedCustomer && (
                    <EditModal
                        open={isEditModalOpen}
                        onClose={() => setIsEditModalOpen(false)}
                        data={selectedCustomer}
                        formFields={customerFormFields}
                        onSave={handleSaveCustomer}
                        title="Edit Customer"
                    />
                )}

                {/* Create Modal */}
                <EditModal
                    open={isCreateModalOpen}
                    onClose={() => setIsCreateModalOpen(false)}
                    data={newCustomer}
                    formFields={createCustomerFormFields}
                    onSave={handleCreateCustomer}
                    title="Create New Customer"
                />

                <ToastContainer position="bottom-right" />
            </div>
        </div>
    );
}

export default CustomerPortal;