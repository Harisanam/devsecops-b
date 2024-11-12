import React from 'react';


function RegistrationSuccess() {
  return (
    <div className="bg-[#f1f6fa] min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
        <h2 className="text-3xl font-bold text-[#002b4e] mb-4">Welcome!</h2>
        <p className="text-lg text-[#607d94] mb-6">Your account has been successfully created.</p>
        <a href="/login" className="inline-block w-full bg-[#185cff] text-white py-3 rounded-md">Go to Login</a>
      </div>
    </div>
  );
}

export default RegistrationSuccess;
