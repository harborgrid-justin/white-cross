'use client';

import { useState } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testRegistrationAPI = async () => {
    setLoading(true);
    setResult('');

    try {
      const testData = {
        email: 'apitest@test.com',
        password: 'TestPass123!',
        firstName: 'API',
        lastName: 'Test',
        role: 'ADMIN'
      };

      console.log('Making test registration request...');
      console.log('Test data:', testData);
      console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);
      
      const response = await fetch('http://localhost:3001/api/v1/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      const data = await response.json();
      console.log('Response data:', data);

      if (response.ok) {
        setResult(`✅ Success: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ Error: ${response.status} - ${JSON.stringify(data, null, 2)}`);
      }
    } catch (error) {
      console.error('Request failed:', error);
      setResult(`💥 Network Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithAPIClient = async () => {
    setLoading(true);
    setResult('');

    try {
      // Dynamic import to avoid SSR issues
      const { authApi } = await import('@/identity-access/services/authApi');
      
      const testData = {
        email: 'clienttest@test.com',
        password: 'TestPass123!',
        firstName: 'Client',
        lastName: 'Test',
        role: 'ADMIN' as const
      };

      console.log('Making test request with AuthApi...');
      console.log('Test data:', testData);

      const result = await authApi.register(testData);
      console.log('AuthApi result:', result);

      setResult(`✅ AuthApi Success: ${JSON.stringify(result, null, 2)}`);
    } catch (error) {
      console.error('AuthApi request failed:', error);
      setResult(`💥 AuthApi Error: ${error.message}\n\nFull error: ${JSON.stringify(error, null, 2)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
      
      <div className="space-y-4 mb-8">
        <button
          onClick={testRegistrationAPI}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700"
        >
          {loading ? 'Testing...' : 'Test Direct Fetch API'}
        </button>

        <button
          onClick={testWithAPIClient}
          disabled={loading}
          className="px-6 py-3 bg-green-600 text-white rounded-lg disabled:opacity-50 hover:bg-green-700 ml-4"
        >
          {loading ? 'Testing...' : 'Test with AuthApi Client'}
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Environment Info:</h2>
        <pre className="text-sm">
NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL || 'undefined'}
        </pre>
      </div>

      {result && (
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-black text-green-400 p-4 rounded-lg text-sm overflow-auto max-h-96 whitespace-pre-wrap">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
}