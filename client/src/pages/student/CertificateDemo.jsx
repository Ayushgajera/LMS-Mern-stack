// CertificateDemo.jsx
import React from 'react';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: {
    backgroundColor: '#fff',
    padding: 40,
    fontFamily: 'Helvetica',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heading: {
    fontSize: 32,
    marginBottom: 24,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#1d4ed8',
  },
  content: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 12,
    color: '#000',
  },
  name: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#1d4ed8',
    marginVertical: 16,
    textAlign: 'center',
  },
  course: {
    fontSize: 22,
    fontWeight: 600,
    color: '#2563eb',
    marginVertical: 12,
    textAlign: 'center',
  },
  footer: {
    marginTop: 40,
    fontSize: 14,
    textAlign: 'center',
    color: 'gray',
  },
  box: {
    marginTop: 24,
    padding: 24,
    border: '2 solid #1d4ed8',
    borderRadius: 10,
    backgroundColor: '#f9fafb',
  },
});

// PDF Document Component
const MyCertificate = ({ name = 'John Doe', course = 'React Mastery Bootcamp', date = new Date().toLocaleDateString() }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.heading}>Certificate of Completion</Text>
      <View style={styles.box}>
        <Text style={styles.content}>This is to certify that</Text>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.content}>has successfully completed the course</Text>
        <Text style={styles.course}>{course}</Text>
      </View>
      <Text style={styles.footer}>Issued on: {date}</Text>
    </Page>
  </Document>
);

// Main Demo Component
const CertificateDemo = () => {
  // You can make these dynamic (e.g., from props or state)
  const name = 'John Doe';
  const course = 'React Mastery Bootcamp';
  const date = new Date().toLocaleDateString();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Download Your Certificate</h1>
      <PDFDownloadLink
        document={<MyCertificate name={name} course={course} date={date} />}
        fileName="certificate.pdf"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-8"
      >
        {({ loading }) => (loading ? 'Generating PDF...' : 'Download PDF')}
      </PDFDownloadLink>
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-xl text-center">
        <h2 className="text-2xl font-bold text-blue-800 mb-2">Certificate Preview</h2>
        <div className="border-2 border-blue-800 rounded-xl p-6 bg-gray-50">
          <div className="text-xl text-gray-700 mb-2">This is to certify that</div>
          <div className="text-2xl font-bold text-blue-700 mb-2">{name}</div>
          <div className="text-lg text-gray-700 mb-2">has successfully completed the course</div>
          <div className="text-lg font-semibold text-blue-600 mb-4">{course}</div>
          <div className="mt-4 text-gray-500">Issued on: {date}</div>
        </div>
      </div>
    </div>
  );
};

export default CertificateDemo;
