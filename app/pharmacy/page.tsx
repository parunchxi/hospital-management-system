'use client'
import React from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/input'
import { Hospital, ShieldCheck } from 'lucide-react'

export default function PharmacyLanding() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="w-full bg-white shadow flex items-center px-8 py-4">
        {/* Hospital Logo */}
        <div className="flex items-center gap-2">
          <Hospital className="w-7 h-7 text-blue-600" />
          <span className="font-bold text-xl text-blue-700">HealthCareRx</span>
        </div>
        {/* Search Bar */}
        <div className="flex-1 flex justify-center">
          <Input
            type="search"
            placeholder="Search medicines, healthcare items..."
            className="w-full max-w-md rounded-full bg-blue-50 border-none focus:ring-2 focus:ring-blue-200"
          />
        </div>
        {/* User Avatar/Name */}
        <div className="flex items-center gap-3">
          <Image
            src="/avatar.png"
            alt="User"
            width={40}
            height={40}
            className="rounded-full object-cover bg-gray-200"
          />
          <span className="font-medium text-gray-700">John Doe</span>
        </div>
      </nav>

      {/* Pharmacy Banner */}
      <section className="w-full flex flex-col items-center justify-center bg-blue-100 rounded-lg shadow mt-8 mb-10 py-10 px-4">
        <h1 className="text-4xl font-bold text-blue-800 mb-4">Pharmacy</h1>
        <Image
          src="/doctor-banner.png"
          alt="Doctor"
          width={160}
          height={160}
          className="object-contain mb-4"
        />
        <div className="flex items-center gap-2 mt-2">
          <ShieldCheck className="w-6 h-6 text-blue-600" />
          <span className="text-lg font-semibold text-blue-700">
            100% Genuine Medicines
          </span>
        </div>
      </section>

      {/* Category Section */}
      <section className="w-full px-4 mb-10">
        <div className="flex gap-6 overflow-x-auto pb-2 hide-scrollbar">
          {[
            { label: 'Pain Relief', img: '/categories/pain-relief.png' },
            { label: 'Antibiotics', img: '/categories/antibiotics.png' },
            { label: 'Heart Care', img: '/categories/heart-care.png' },
            { label: 'Lung Care', img: '/categories/lung-care.png' },
            { label: 'Diabetes Care', img: '/categories/diabetes-care.png' },
          ].map((cat) => (
            <div
              key={cat.label}
              className="flex flex-col items-center min-w-[120px] bg-white rounded-xl shadow p-4 hover:shadow-md transition"
            >
              <Image
                src={cat.img}
                alt={cat.label}
                width={56}
                height={56}
                className="object-contain mb-2"
                draggable={false}
              />
              <span className="text-sm font-medium text-gray-700">
                {cat.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="p-4 md:p-10">
        {/* Medicine Stock Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 text-blue-800">
            Medicine Stock
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Example Medicine Cards */}
            {/* Same structure repeated, no image needed here */}
            {/* ... */}
          </div>
        </section>
        {/* Low Stock Alert Table */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-red-700 flex items-center gap-2">
            <span>Low Stock Alert</span>
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow text-sm">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-4 text-left font-medium">Medicine</th>
                  <th className="py-2 px-4 text-left font-medium">Dosage</th>
                  <th className="py-2 px-4 text-left font-medium">Quantity</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4">Ibuprofen</td>
                  <td className="py-2 px-4">200mg Tablet</td>
                  <td className="py-2 px-4 text-yellow-700 font-semibold">8</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Cetirizine</td>
                  <td className="py-2 px-4">10mg Tablet</td>
                  <td className="py-2 px-4 text-yellow-700 font-semibold">5</td>
                </tr>
                <tr>
                  <td className="py-2 px-4">Aspirin</td>
                  <td className="py-2 px-4">75mg Tablet</td>
                  <td className="py-2 px-4 text-yellow-700 font-semibold">3</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
        {/* High Priority Section */}
        <section className="mt-12">
          <h2 className="text-xl font-semibold mb-4 text-pink-700 flex items-center gap-2">
            <span>High Priority</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Example urgent refill cards */}
            <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-pink-600">
              <span className="text-base font-semibold text-gray-800">
                Patient: <span className="font-normal">Jane Smith</span>
              </span>
              <span className="text-sm text-gray-600">
                Medicine:{' '}
                <span className="font-medium text-pink-700">Insulin</span>
              </span>
              <span className="text-xs text-gray-500">
                Requested: 2025-05-09
              </span>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs w-max">
                Urgent
              </span>
              <button className="mt-2 px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs font-semibold w-max">
                Acknowledge
              </button>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-pink-600">
              <span className="text-base font-semibold text-gray-800">
                Patient: <span className="font-normal">Robert Lee</span>
              </span>
              <span className="text-sm text-gray-600">
                Medicine:{' '}
                <span className="font-medium text-pink-700">Warfarin</span>
              </span>
              <span className="text-xs text-gray-500">
                Requested: 2025-05-08
              </span>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs w-max">
                Urgent
              </span>
              <button className="mt-2 px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs font-semibold w-max">
                Acknowledge
              </button>
            </div>
            <div className="bg-white rounded-xl shadow p-5 flex flex-col gap-2 border-l-4 border-pink-600">
              <span className="text-base font-semibold text-gray-800">
                Patient: <span className="font-normal">Emily Clark</span>
              </span>
              <span className="text-sm text-gray-600">
                Medicine:{' '}
                <span className="font-medium text-pink-700">Salbutamol</span>
              </span>
              <span className="text-xs text-gray-500">
                Requested: 2025-05-07
              </span>
              <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs w-max">
                Urgent
              </span>
              <button className="mt-2 px-3 py-1 bg-pink-600 text-white rounded hover:bg-pink-700 text-xs font-semibold w-max">
                Acknowledge
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
