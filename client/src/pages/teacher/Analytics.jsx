import React, { useState } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { FiDownload, FiCalendar } from 'react-icons/fi';

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Analytics</h1>
          <p className="text-gray-600">Track your performance and growth</p>
        </div>
        <div className="flex space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <FiDownload className="mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <AnalyticsCard
          title="Revenue Overview"
          chart={<RevenueChart />}
        />
        <AnalyticsCard
          title="Student Enrollment"
          chart={<EnrollmentChart />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <AnalyticsCard
          title="Course Performance"
          chart={<CoursePerformance />}
        />
        <AnalyticsCard
          title="Student Demographics"
          chart={<Demographics />}
        />
        <AnalyticsCard
          title="Engagement Metrics"
          chart={<EngagementMetrics />}
        />
      </div>
    </div>
  );
};

const AnalyticsCard = ({ title, chart }) => (
  <div className="bg-white rounded-xl shadow-sm p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
    <div className="h-[300px]">
      {chart}
    </div>
  </div>
);

// Add your chart components here with appropriate data and styling
const RevenueChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Revenue',
      data: [3000, 4500, 3800, 5200, 4800, 6000],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
    }]
  };

  return <Line data={data} options={{ maintainAspectRatio: false }} />;
};

const EnrollmentChart = () => {
  const data = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Enrollments',
      data: [150, 220, 180, 260, 240, 300],
      backgroundColor: 'rgb(34, 197, 94)',
      borderColor: 'rgb(34, 197, 94)',
    }]
  };

  return <Bar data={data} options={{ maintainAspectRatio: false }} />;
};

const CoursePerformance = () => {
  const data = {
    labels: ['React Basics', 'JavaScript', 'Node.js', 'Python', 'Web Dev'],
    datasets: [{
      label: 'Course Rating',
      data: [4.8, 4.6, 4.9, 4.7, 4.5],
      backgroundColor: 'rgba(249, 115, 22, 0.2)',
      borderColor: 'rgb(249, 115, 22)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(249, 115, 22)',
    }]
  };

  const options = {
    ...defaultOptions,
    scales: {
      r: {
        min: 0,
        max: 5,
        beginAtZero: true
      }
    }
  };

  return <Line data={data} options={options} />;
};

const Demographics = () => {
  const data = {
    labels: ['18-24', '25-34', '35-44', '45+'],
    datasets: [{
      data: [30, 45, 15, 10],
      backgroundColor: [
        'rgb(59, 130, 246)', // blue
        'rgb(16, 185, 129)', // green
        'rgb(249, 115, 22)', // orange
        'rgb(168, 85, 247)'  // purple
      ],
      borderWidth: 1,
    }]
  };

  const options = {
    ...defaultOptions,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  return <Doughnut data={data} options={options} />;
};

const EngagementMetrics = () => {
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Hours Watched',
      data: [4.5, 5.2, 3.8, 4.9, 5.5, 3.2, 2.8],
      backgroundColor: 'rgba(168, 85, 247, 0.2)',
      borderColor: 'rgb(168, 85, 247)',
      tension: 0.4,
      fill: true,
    }]
  };

  return <Line data={data} options={{ maintainAspectRatio: false }} />;
};

// Add common chart options
const defaultOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      mode: 'index',
      intersect: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        drawBorder: false,
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
};

export default Analytics;