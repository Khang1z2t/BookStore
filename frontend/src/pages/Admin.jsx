import React, {useEffect, useState} from "react";
import {
    Alert,
    CircularProgress,
    Paper,
    Table, TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from "@mui/material";
import {exportExcel, exportPdf, getAllUser} from "~/services/UserService";
import Button from "@mui/material/Button";
import {useAlerts} from "~/context/AlertsContext";

function Admin() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const {showAlert} = useAlerts();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUser();
                setUsers(response.data);
            } catch (error) {
                showAlert(error.message, 'error');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers().then(r => r);
    }, []);

    const exportToPDF = async () => {
        try {
            const response = await exportPdf();
            const blob = new Blob([response], {type: 'application/pdf'});
            const url = window.URL.createObjectURL(blob);
            window.open(url, "_blank");
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_report.pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting PDF:', error);
            showAlert(error.message, 'error');
        }
    }
    const exportToExcel = async () => {
        try {
            const response = await exportExcel();
            const blob = new Blob([response], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'user_report.xlsx');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error exporting Excel:', error);
            showAlert(error.message, 'error');
        }
    };

    return (
        <Paper sx={{padding: 3, maxWidth: 800, margin: "auto", marginTop: 4}}>
            <Typography variant="h5" gutterBottom>
                Danh Sách Người Dùng
            </Typography>

            <Button variant="contained" color="primary" sx={{marginRight: 2}} onClick={exportToExcel}>
                Export Excel
            </Button>
            <Button variant="contained" color="secondary" onClick={exportToPDF}>
                Export PDF
            </Button>

            {loading && <CircularProgress/>}
            {error && <Alert severity="error">{error}</Alert>}

            {!loading && !error && (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><b>STT</b></TableCell>
                                <TableCell><b>ID</b></TableCell>
                                <TableCell><b>Username</b></TableCell>
                                <TableCell><b>Họ và tên</b></TableCell>
                                <TableCell><b>Email</b></TableCell>
                                <TableCell><b>Địa chỉ</b></TableCell>
                                <TableCell><b>Số điện thoại</b></TableCell>
                                <TableCell><b>Ngày sinh</b></TableCell>
                                <TableCell><b>Ngày tham gia</b></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user, index) => (
                                <TableRow key={user.id}>
                                    <TableCell>{index + 1}</TableCell>
                                    <TableCell>{user.id}</TableCell>
                                    <TableCell>{user.username}</TableCell>
                                    <TableCell>{`${user.firstName} ${user.lastName}`.trim()}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.address || "Chưa có"}</TableCell>
                                    <TableCell>{user.phoneNumber || "Chưa có"}</TableCell>
                                    <TableCell>{new Date(user.dateOfBirth).toLocaleDateString('en-GB')}</TableCell>
                                    <TableCell>{new Date(user.createdAt).toLocaleDateString('en-GB')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Paper>
    );
}

export default Admin;