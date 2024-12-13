import React, { useEffect, useState } from "react";
import apiClient from "../../axiosConfig";
import { Container, Card, Table } from "react-bootstrap";
import { BarChart, Bar, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const Dashboard = () => {
    const [dashboard, setDashboard] = useState({
        totalBook: 0,
        overdueBooks: [],
        category: {},
        activeMember: {},
        workflowStatus: [],
        totalProcess: {}
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

        // Fetch dashboard data
        apiClient.get('/Dasboard/', {
            headers: {
                Authorization: token ? `Bearer ${token}` : ''
            }
        })
        .then((response) => {
            setDashboard(response.data);
            setLoading(false);
        })
        .catch((err) => {
            setError("Failed to load user details.");
            setLoading(false);
        });
    }, []);

    // Total Books
    const totalBooks = dashboard.totalBook;

    // Active Members - Convert to array for BarChart
    const activeMembers = Object.entries(dashboard.activeMember).map(([userId, borrowCount]) => ({
        name: userId, // Use the actual user name or ID here
        borrowCount
    }));

    // Overdue Books - Format for table
    // Overdue Books - Format for table
    const overdueBooks = Array.isArray(dashboard.overdueBooks)
    ? dashboard.overdueBooks.map((item) => ({
        borrowId: item.borrowId,
        bookTitle: item.bookTitle,
        dueDate: item.dueDate,
        penalty: item.penalty,
        userName: item.userName
    }))
    : [];  

    // Books per Category - Prepare data for PieChart
    const bookCategories = Object.entries(dashboard.category).map(([category, count]) => ({
        name: category,
        value: count
    }));

    // Workflow Status - Prepare data for table
    const workflowStatuses = Array.isArray(dashboard.workflowStatus)
    ? dashboard.workflowStatus.map((status, index) => ({
        key: index,
        requestId: status.requestId,
        bookTitle: status.bookTitle,
        applicantName: status.applicantName,
        status: status.status,
        currentStep: status.currentStep
    }))
    : [];

    // Process by Status - Prepare data for PieChart
    const processStatus = Object.entries(dashboard.totalProcess).map(([status, count]) => ({
        name: status,
        value: count
    }));

    return (
        <Container style={{ height: '400px' }}>
            {/* Total Books Card */}
            <Card className="mb-3">
                <Card.Body>
                    <Card.Title>Total Books</Card.Title>
                    <Card.Text>{totalBooks}</Card.Text>
                </Card.Body>
            </Card>

            {/* Active Members - Bar Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={activeMembers} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Bar dataKey="borrowCount" fill="#0d6efd" />
                </BarChart>
            </ResponsiveContainer>

            {/* Overdue Books - Table */}
            <Card className="mt-4 mb-3">
                <Card.Body>
                    <Card.Title>Overdue Books</Card.Title>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Borrow ID</th>
                                <th>Book Title</th>
                                <th>User Name</th>
                                <th>Due Date</th>
                                <th>Penalty</th>
                            </tr>
                        </thead>
                        <tbody>
                            {overdueBooks.map((item) => (
                                <tr key={item.borrowId}>
                                    <td>{item.borrowId}</td>
                                    <td>{item.bookTitle}</td>
                                    <td>{item.userName}</td>
                                    <td>{item.dueDate}</td>
                                    <td>{item.penalty}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Workflow Status - Table */}
            <Card className="mt-4 mb-3">
                <Card.Body>
                    <Card.Title>Workflow Status</Card.Title>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Request ID</th>
                                <th>Book Title</th>
                                <th>Applicant Name</th>
                                <th>Status</th>
                                <th>Current Step</th>
                            </tr>
                        </thead>
                        <tbody>
                            {workflowStatuses.map((status) => (
                                <tr key={status.key}>
                                    <td>{status.requestId}</td>
                                    <td>{status.bookTitle}</td>
                                    <td>{status.applicantName}</td>
                                    <td>{status.status}</td>
                                    <td>{status.currentStep}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Card.Body>
            </Card>

            {/* Books per Category - Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={bookCategories}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {bookCategories.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>

            {/* Process by Status - Pie Chart */}
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={processStatus}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={120}
                        fill="#82ca9d"
                        dataKey="value"
                    >
                        {processStatus.map((entry, index) => (
                            <Cell key={`cell-${index}`} />
                        ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </Container>
    );
};

export default Dashboard;