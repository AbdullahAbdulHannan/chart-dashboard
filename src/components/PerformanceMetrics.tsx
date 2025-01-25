import React from 'react'
import { PostTable } from './Table';

const PerformanceMetrics = () => {
    const sampleData = [
        {
          title: "Summer Vacation Photos",
          engagementScore: 4.5,
          datePosted: "2023-06-15",
          author: "Alice Johnson",
        },
        {
          title: "New Product Launch",
          engagementScore: 4.0,
          datePosted: "2023-07-01",
          author: "Bob Smith",
        },
        {
          title: "Weekly Updates",
          engagementScore: 5.0,
          datePosted: "2023-07-10",
          author: "Charlie Brown",
        },
      ];
  return (
    <>
    <h1>Performance Metrics</h1>
    <PostTable data={sampleData}/>
    </>
  )
}

export default PerformanceMetrics