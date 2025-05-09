import React from "react";
import { Home, User, Calendar as LucideCalendar, CreditCard, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import { useState, useEffect  } from "react";


export default function PatientDashboard() {

  return (



    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content */}
      <main className="flex-1 p-10">
        <h1 className="text-3xl font-semibold mb-4">Welcome to your Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Personal Information Tile */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Name:</span> John Doe
              </div>
              <div>
                <span className="font-medium">Age/Gender:</span> 32 / Male
              </div>
              <div>
                <span className="font-medium">Patient ID:</span> P123456
              </div>
              <div>
                <span className="font-medium">Phone:</span> (555) 123-4567
              </div>
              <div>
                <span className="font-medium">Address:</span> 123 Main St, Springfield
              </div>
            </div>
          </section>

          {/* Appointment Tile */}
          <section className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5" /> Appointment
            </h2>
            <div className="overflow-hidden max-w-[300px] mx-auto">
              <Calendar />
            </div>
          </section>

          {/* Upcoming Appointments Tile */}
          <section className="bg-white rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Upcoming Appointments</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-medium">Date</th>
                    <th className="py-2 px-4 text-left font-medium">Time</th>
                    <th className="py-2 px-4 text-left font-medium">Doctor</th>
                    <th className="py-2 px-4 text-left font-medium">Payment Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">2025-05-15</td>
                    <td className="py-2 px-4">10:00 AM</td>
                    <td className="py-2 px-4">Dr. Smith</td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">2025-06-01</td>
                    <td className="py-2 px-4">2:30 PM</td>
                    <td className="py-2 px-4">Dr. Lee</td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        Pending
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Billing Tile */}
          <section className="bg-blue-50 rounded-lg shadow p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Billing</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left font-medium">Invoice ID</th>
                    <th className="py-2 px-4 text-left font-medium">Amount</th>
                    <th className="py-2 px-4 text-left font-medium">Status</th>
                    <th className="py-2 px-4 text-left font-medium">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">INV-001</td>
                    <td className="py-2 px-4">$120.00</td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                        Paid
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <Button size="sm" variant="outline">View Receipt</Button>
                    </td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4">INV-002</td>
                    <td className="py-2 px-4">$80.00</td>
                    <td className="py-2 px-4">
                      <span className="inline-block px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs">
                        Pending
                      </span>
                    </td>
                    <td className="py-2 px-4">
                      <Button size="sm" variant="outline">View Receipt</Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>
        <p className="text-muted-foreground">
          Here you can view your personal information, manage appointments, and check your billing details.
        </p>
      </main>
    </div>
  );
}