"use client";
import React from "react";
import { Home, Users, Pill, CreditCard, FileText, Search } from "lucide-react";

export default function AdminDashboard() {
  const sidebarLinks = [
    { label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { label: "Medical Personnel", icon: <Users className="w-5 h-5" /> },
    { label: "Medication", icon: <Pill className="w-5 h-5" /> },
    { label: "Billing", icon: <CreditCard className="w-5 h-5" /> },     
    { label: "Report", icon: <FileText className="w-5 h-5" /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-6">
        <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
        <nav className="flex flex-col gap-4">
          {sidebarLinks.map((link) => (
            <a
              key={link.label}
              href="#"
              className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 p-2 rounded-md"
            >
              {link.icon}
              <span className="font-medium">{link.label}</span>
            </a>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="w-full bg-white shadow p-4 flex items-center justify-between">
          {/* Search Input */}
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full max-w-md px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          {/* User Profile */}
          <div className="flex items-center gap-3">
            <img
              src="/avatar.png"
              alt="Admin Avatar"
              className="w-10 h-10 rounded-full object-cover bg-gray-200"
            />
            <div>
              <p className="font-medium text-gray-700">John Doe</p>
              <p className="text-sm text-gray-500">Administrator</p>
            </div>
          </div>
        </header>

        <main className="flex-1 p-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Appointment Section */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Appointment</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-2 px-4 text-left font-medium">Patient Name</th>
                        <th className="py-2 px-4 text-left font-medium">Date</th>
                        <th className="py-2 px-4 text-left font-medium">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2 px-4">Jane Smith</td>
                        <td className="py-2 px-4">2025-05-15</td>
                        <td className="py-2 px-4">
                          <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                            Paid
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2 px-4">Robert Lee</td>
                        <td className="py-2 px-4">2025-05-16</td>
                        <td className="py-2 px-4">
                          <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                            Unpaid
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* Assign Nurses Section */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Assign Nurses</h2>
                <form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Nurse
                    </label>
                    <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>John Doe</option>
                      <option>Jane Smith</option>
                      <option>Emily Clark</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Patient/Room
                    </label>
                    <select className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>Room 101</option>
                      <option>Room 102</option>
                      <option>Room 103</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Assign
                  </button>
                </form>
              </section>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Doctor Status Card */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Doctor Status</h2>
                <div className="flex items-center gap-4">
                  <img
                    src="/doctor-avatar.png"
                    alt="Doctor Avatar"
                    className="w-16 h-16 rounded-full object-cover bg-gray-200"
                  />
                  <div>
                    <p className="font-medium text-gray-700">Dr. John Doe</p>
                    <p className="text-sm text-gray-500">Cardiologist</p>
                    <p className="text-sm text-green-600">Available</p>
                  </div>
                </div>
              </section>

              {/* Nurse Assignment Status */}
              <section className="bg-white rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold mb-4">Nurse Assignment Status</h2>
                <ul className="space-y-4">
                  <li className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Nurse Jane Smith</span>
                    <span className="text-sm text-gray-500">Assigned to Room 101</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Nurse Emily Clark</span>
                    <span className="text-sm text-gray-500">Available</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="font-medium text-gray-700">Nurse Robert Lee</span>
                    <span className="text-sm text-gray-500">Assigned to Room 102</span>
                  </li>
                </ul>
              </section>
            </div>
          </div>

          {/* Billings for the Patient Section */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Billings for the Patient</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-medium">Invoice ID</th>
                    <th className="py-2 px-4 text-left font-medium">Patient Name</th>
                    <th className="py-2 px-4 text-left font-medium">Amount</th>
                    <th className="py-2 px-4 text-left font-medium">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">INV-001</td>
                    <td className="py-2 px-4">Jane Smith</td>
                    <td className="py-2 px-4">$120.00</td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">INV-002</td>
                    <td className="py-2 px-4">Robert Lee</td>
                    <td className="py-2 px-4">$80.00</td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                        Unpaid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Reporting Section */}
          <section className="mt-10">
            <h2 className="text-2xl font-semibold mb-6">Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Admissions Report */}
              <a
                href="/reports/admissions"
                className="bg-white rounded-lg shadow p-6 flex flex-col items-start hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Admissions</h3>
                <p className="text-sm text-gray-500">Grouped by day, week, or month</p>
              </a>

              {/* Medicine Stock Status */}
              <a
                href="/reports/medicine-out-of-stock"
                className="bg-white rounded-lg shadow p-6 flex flex-col items-start hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Medicine Stock Status</h3>
                <p className="text-sm text-gray-500">Track out-of-stock medicines</p>
              </a>

              {/* Billing Status Summary */}
              <a
                href="/reports/billing-status-summary"
                className="bg-white rounded-lg shadow p-6 flex flex-col items-start hover:shadow-md transition"
              >
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Billing Status Summary</h3>
                <p className="text-sm text-gray-500">Overview of billing statuses</p>
              </a>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}