'use client'
import React from 'react'
import { Line, Bar, Pie } from 'react-chartjs-2'
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js'

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Tooltip, Legend)

const AnalyticsDashboard = () => {
  const engagementData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Views',
        data: [120, 190, 300, 500, 200, 300, 400],
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.5)',
      },
    ],
  }

  const salesData = {
    labels: ['Q1', 'Q2', 'Q3', 'Q4'],
    datasets: [
      {
        label: 'Sales',
        data: [500, 700, 900, 1200],
        backgroundColor: 'rgba(250, 204, 21, 0.5)',
        borderColor: 'rgb(250, 204, 21)',
      },
    ],
  }

  const revenueData = {
    labels: ['Products', 'Subscriptions', 'Ads'],
    datasets: [
      {
        label: 'Revenue',
        data: [3000, 1500, 500],
        backgroundColor: ['#fde68a', '#fcd34d', '#fbbf24'],
      },
    ],
  }

  return (
    <div className='bg-black text-white min-h-screen p-6'>
      <h2 className='text-3xl font-bold mb-4 text-yellow-500'>Analytics</h2>
      <div className='grid gap-6 md:grid-cols-2'>
        <div className='bg-stone-900 p-4 rounded'>
          <h3 className='mb-2 font-semibold'>User Engagement</h3>
          <Line data={engagementData} />
        </div>
        <div className='bg-stone-900 p-4 rounded'>
          <h3 className='mb-2 font-semibold'>Product Sales</h3>
          <Bar data={salesData} />
        </div>
        <div className='bg-stone-900 p-4 rounded md:col-span-2'>
          <h3 className='mb-2 font-semibold'>Revenue Breakdown</h3>
          <Pie data={revenueData} />
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDashboard
