'use client'

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { PatientDetailsDialog } from '@/components/patient-details-dialog';
import { AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react'
import { any } from 'zod';

// Interface for room data from API
interface Room {
  room_id: string;
  room_type: string;
  department_id: number;
  price_per_night: number;
  capacity: number;
  departments: {
    name: string;
  }
}

// Sample medicine stock data
const medicineStockData = [
  { id: 1, name: 'Paracetamol 500mg', currentStock: 15, minRequired: 50, status: 'Low' },
  { id: 2, name: 'Amoxicillin 250mg', currentStock: 0, minRequired: 30, status: 'Out of Stock' },
  { id: 3, name: 'Ibuprofen 400mg', currentStock: 8, minRequired: 40, status: 'Low' },
  { id: 4, name: 'Ciprofloxacin 500mg', currentStock: 3, minRequired: 25, status: 'Low' },
  { id: 5, name: 'Omeprazole 20mg', currentStock: 0, minRequired: 20, status: 'Out of Stock' }
];

const DoctorDashboard = () => {
    const [Doctordata, setDoctordata] = useState<any>(null);
    const [isLoading, setLoading] = useState(true);

    const [AppointmentData, setAppointmentData] = useState<any>(null);
    const [isAppointmentLoading, setAppointmentLoading] = useState(true);
    const [visibleAppointments, setVisibleAppointments] = useState(3); // For pagination
    const [initialRowsShown, setInitialRowsShown] = useState(true); // Track if only initial rows are shown

    const [roomsData, setRoomsData] = useState<Room[]>([]);
    const [isRoomsLoading, setRoomsLoading] = useState(true);

    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    // Load more appointments
    const loadMoreAppointments = () => {
      setVisibleAppointments(prev => prev + 3);
      setInitialRowsShown(false);
    };

    // Show less appointments
    const showLessAppointments = () => {
      setVisibleAppointments(3);
      setInitialRowsShown(true);
    };

    // Fetch doctor information
    useEffect(() => {
      fetch('/api/staff/me')
        .then((res) => res.json())
        .then((data) => {
          setDoctordata(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching doctor data:', error);
          setLoading(false);
        });
    }, []);

    // Fetch appointments
    useEffect(() => {
      fetch('/api/appointments')
        .then((res) => res.json())
        .then((data) => {
          setAppointmentData(data);
          setAppointmentLoading(false);
        })
        .catch(error => {
          console.error('Error fetching appointments:', error);
          setAppointmentLoading(false);
        });
    }, []);

    // Fetch rooms data
    useEffect(() => {
      fetch('/api/rooms?available=true')
        .then((res) => res.json())
        .then((data) => {
          setRoomsData(data);
          setRoomsLoading(false);
        })
        .catch(error => {
          console.error('Error fetching rooms data:', error);
          setRoomsLoading(false);
        });
    }, []);

    if (isLoading || isAppointmentLoading || isRoomsLoading) return <p>Loading...</p>;
    if (!Doctordata) return <p>No profile data</p>;

  // Function to handle row click
  const handleRowClick = (patient: typeof any) => {
    setSelectedPatient(patient);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-light-blue-50 p-6">
      <h1 className="text-2xl font-bold mb-6"> 👋 Hello, Dr. {Doctordata.users.first_name}!</h1>

      {/* Main Content */}
      <div className="w-full max-h-10xl overflow-shown mb-35">
        <div className="grid grid-cols-12 gap-6">

          {/* Left Column (Spans 8/12) */}
          <div className="col-span-8 grid grid-cols-1 gap-6" style={{ height: 'calc(100vh - 200px)' }}>
            {/* Appointments Section */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-black font-bold mb-4">Appointments</h2>
              <div className="overflow-auto max-h-[350px]">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr className="text-black">
                      <th className="border border-gray-300 p-2">Patient Name</th>
                      <th className="border border-gray-300 p-2">Case</th>
                      <th className="border border-gray-300 p-2">Patient Status</th>
                      <th className="border border-gray-300 p-2">Visit Date</th>
                      <th className="border border-gray-300 p-2">Case Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AppointmentData && AppointmentData.length > 0 ? (
                      AppointmentData.slice(0, visibleAppointments).map((patient: any) => (
                        <tr
                          key={patient.record_id}
                          className="text-black hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleRowClick(patient)}
                        >
                          <td className="border border-gray-300 p-2">{patient.patients.users.first_name} {patient.patients.users.last_name}</td>
                          <td className="border border-gray-300 p-2">{patient.symptoms || 'Not specified'}</td>
                          <td className="border border-gray-300 p-2">{patient.patient_status}</td>
                          <td className="border border-gray-300 p-2">{new Date(patient.visit_date).toLocaleDateString()}</td>
                          <td className="border border-gray-300 p-2">{patient.visit_status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="border border-gray-300 p-2 text-center" colSpan={5}>No appointments available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Buttons */}
              <div className="flex justify-center gap-4 mt-4">
                {AppointmentData && AppointmentData.length > 3 && (
                  <>
                    {AppointmentData.length > visibleAppointments && (
                      <Button onClick={loadMoreAppointments} variant="outline" size="sm">
                        Load More
                      </Button>
                    )}
                    {!initialRowsShown && (
                      <Button onClick={showLessAppointments} variant="outline" size="sm">
                        Show Less
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Medicine Stock Section */}
            <div className="bg-white p-4 shadow rounded">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-black font-bold">Medicine Stock</h2>
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  <span>Low Stock Alert</span>
                </Badge>
              </div>
              <div className="overflow-auto max-h-[250px]">
                <table className="w-full border-collapse">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr className="text-black">
                      <th className="border border-gray-300 p-2">Medicine Name</th>
                      <th className="border border-gray-300 p-2">Current Stock</th>
                      <th className="border border-gray-300 p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medicineStockData.map((medicine) => (
                      <tr key={medicine.id} className="text-black">
                        <td className="border border-gray-300 p-2">{medicine.name}</td>
                        <td className="border border-gray-300 p-2 text-center">{medicine.currentStock}</td>
                        <td className="border border-gray-300 p-2 text-center">
                          <Badge
                            variant={medicine.status === 'Out of Stock' ? 'destructive' : 'outline'}
                            className={medicine.status === 'Low' ? 'bg-amber-100 text-amber-800 hover:bg-amber-100' : ''}
                          >
                            {medicine.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Room Availability Section */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-black font-bold mb-4">Room Availability</h2>
              <div className="overflow-auto max-h-[200px]">
                <table className="w-full border-collapse border border-gray-300">
                  <thead className="sticky top-0 bg-gray-100">
                    <tr className="text-black">
                      <th className="border border-gray-300 p-2">Room</th>
                      <th className="border border-gray-300 p-2">Department</th>
                      <th className="border border-gray-300 p-2">Type</th>
                      <th className="border border-gray-300 p-2">Capacity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {roomsData.length > 0 ? (
                      roomsData.map((room) => (
                        <tr key={room.room_id} className="text-black">
                          <td className="border border-gray-300 p-2">{room.room_id}</td>
                          <td className="border border-gray-300 p-2">{room.departments.name}</td>
                          <td className="border border-gray-300 p-2">{room.room_type}</td>
                          <td className="border border-gray-300 p-2">{room.capacity}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td className="border border-gray-300 p-2 text-center" colSpan={4}>No rooms available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column (Spans 4/12) */}
          <div className="col-span-4 grid grid-cols-1 gap-6">
            {/* Doctor Info Section */}
            <div className="bg-white p-4 shadow rounded">
              <h2 className="text-black font-bold mb-4">Doctor Info</h2>
              <div className="text-black space-y-2">
                <div>
                  <p><strong>First Name:</strong> {Doctordata.users.first_name}</p>
                  <p><strong>Last Name:</strong> {Doctordata.users.last_name}</p>
                  <p><strong>Gender:</strong> {Doctordata.users.gender}</p>
                  <p><strong>Date of Birth:</strong> {Doctordata.users.date_of_birth}</p>
                  <p><strong>National ID:</strong> {Doctordata.users.national_id}</p>
                  <p><strong>Phone Number:</strong> {Doctordata.users.phone_number}</p>
                </div>
                <div className="pt-2 border-t border-gray-200 mt-2">
                  <p><strong>Staff ID:</strong> {Doctordata.staff_id}</p>
                  <p><strong>License Number:</strong> {Doctordata.license_number}</p>
                  <p><strong>Staff Type:</strong> {Doctordata.staff_type}</p>
                  <p><strong>Employment Status:</strong> {Doctordata.employment_status}</p>
                  <p><strong>Date Hired:</strong> {Doctordata.date_hired}</p>
                  <p><strong>Department:</strong> {Doctordata.departments.name}</p>
                </div>
              </div>
            </div>

            {/* Calendar Section */}
            <div className="bg-white p-4 shadow rounded flex flex-col items-center">
              <h2 className="text-black font-bold mb-4">Calendar</h2>
              <Calendar className="rounded-md border mx-auto" />
            </div>


          </div>
        </div>
      </div>

      {/* Patient Details Dialog */}
      <PatientDetailsDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        patient={selectedPatient}
      />
    </div>
  );
};

export default DoctorDashboard;
