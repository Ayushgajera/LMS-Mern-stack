import React from 'react';

function Homepage() {
  const topCourses = [
    {
      id: 1,
      title: 'Complete Web Development Bootcamp',
      instructor: 'John Doe',
      rating: 4.8,
      students: 15000,
      image: 'https://source.unsplash.com/random/400x300?coding',
      price: '$89.99'
    },
    {
      id: 2,
      title: 'Machine Learning A-Z',
      instructor: 'Jane Smith',
      rating: 4.9,
      students: 12000,
      image: 'https://source.unsplash.com/random/400x300?ai',
      price: '$94.99'
    },
    {
      id: 3,
      title: 'iOS App Development with Swift',
      instructor: 'Mike Johnson',
      rating: 4.7,
      students: 8000,
      image: 'https://source.unsplash.com/random/400x300?mobile',
      price: '$79.99'
    },
  ];

  const categories = [
    { id: 1, name: 'Web Development', count: 150, icon: '💻' },
    { id: 2, name: 'Mobile Development', count: 85, icon: '📱' },
    { id: 3, name: 'Data Science', count: 120, icon: '📊' },
    { id: 4, name: 'UI/UX Design', count: 90, icon: '🎨' },
    { id: 5, name: 'Business', count: 200, icon: '💼' },
    { id: 6, name: 'Marketing', count: 95, icon: '📈' },
  ];

  const testimonials = [
    {
      id: 1,
      name: 'Sarah Johnson',
      role: 'Frontend Developer',
      image: 'https://source.unsplash.com/random/100x100?portrait-woman-1',
      content: 'The courses here completely changed my career path. I went from knowing nothing about web development to landing my dream job in just 6 months.'
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Data Scientist',
      image: 'https://source.unsplash.com/random/100x100?portrait-man-1',
      content: 'The instructors are world-class and the course content is perfectly structured. I particularly enjoyed the hands-on projects.'
    },
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-400  text-white relative overflow-hidden">
       
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 14l9-5-9-5-9 5z"/>
                <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/>
              </svg>
              <h2 className="text-3xl font-bold">1000+</h2>
              <p>Courses</p>
            </div>
            <div className="bg-white bg-opacity-10 rounded-lg p-6 text-center">
              <svg className="w-12 h-12 mx-auto mb-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
              </svg>
              <h2 className="text-3xl font-bold">50,000+</h2>
              <p>Students</p>
            </div>
            
          </div>
        </div>
      </div>

      

      {/* Features Section */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">
            Why Choose Our Platform
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center p-6 animate-slide-up">
              <div className="bg-blue-100 rounded-full p-4 w-20 h-20 mx-auto mb-6 flex items-center justify-center">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-4">Expert-led Courses</h3>
              <p className="text-gray-600">Learn from industry experts who share their real-world experience and knowledge.</p>
            </div>
            {/* Add more feature items here */}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-16 text-center">
            What Our Students Say
          </h2>
          <div className="grid md:grid-cols-2 gap-12">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 rounded-xl p-8 shadow-lg animate-fade-in">
                <div className="flex items-center mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-bold">{testimonial.name}</h3>
                    <p className="text-gray-600">{testimonial.role}</p>
                  </div>
                </div>
                <p className="text-gray-700 italic">"{testimonial.content}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Rated Courses Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold mb-8">
          Top Rated Courses
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {topCourses.map((course) => (
            <div key={course.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <img
                className="w-full h-48 object-cover"
                src={course.image}
                alt={course.title}
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">
                  {course.title}
                </h3>
                <p className="text-gray-600 mb-2">
                  by {course.instructor}
                </p>
                <div className="flex items-center mb-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">({course.rating})</span>
                </div>
                <p className="text-gray-600 mb-4">
                  {course.students.toLocaleString()} students
                </p>
                <p className="text-2xl font-bold mb-4">
                  {course.price}
                </p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300">
                  Enroll Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-8 animate-fade-in">
            Ready to Start Your Learning Journey?
          </h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            Join our community of learners and start building your future today.
          </p>
          <button className="bg-white text-blue-600 font-bold py-4 px-8 rounded-lg transition duration-300 transform hover:scale-105 hover:shadow-lg">
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">About Us</h3>
              <p className="text-gray-400">
                We're on a mission to transform lives through education.
              </p>
            </div>
            {/* Add more footer columns here */}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Homepage;
