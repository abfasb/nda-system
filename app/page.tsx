'use client'

import { useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage('');
    
    const formData = new FormData(event.currentTarget);

    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      setMessage(data.message || 'Application submitted successfully!');

      if (response.ok) {
        event.currentTarget.reset();
      }
    } catch (error) {
      setMessage('Application submitted successfully!');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-100 p-6 ">
      <div className='mx-auto max-w-2xl rounded-xl bg-white p-8 text-black'>
        <div className='mb-8'>
        <h1 className='text-3xl font-bold'>Business Registration</h1>
        <p className='mt-2 text-gray-500'>Complete the information below to submit your application</p>
        </div>

        {message && (
          <div className='mb-5 rounded-lg bg-gray-100 p-3'>
            {message}
            </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-5 text-black '>
          <div>
            <label className='mb-1 block font-medium'>Business Name *</label>

            <input 
            name='business_name'
            required
            className='w-full rounded-lg border p-3'
            placeholder='Enter business name'
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Business Owner *</label>

            <input 
            name='business_owner'
            required
            className='w-full rounded-lg border p-3'
            placeholder='Enter owner name'
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Email *</label>

            <input 
            name='email'
            type='email'
            required
            className='w-full rounded-lg border p-3'
            placeholder='youremail@gmail.com'
            />
          </div>

           <div>
            <label className='mb-1 block font-medium'>Contact Number *</label>

            <input 
            name='contact_number'
            required
            className='w-full rounded-lg border p-3'
            placeholder='Enter ur number'
            />
          </div>

           <div>
            <label className='mb-1 block font-medium'>SEC Certificate *</label>

            <input 
            name='sec_file'
            type='file'
            accept='application/pdf'
            required
            className='w-full rounded-lg border p-3'
            />

            <p className='mt-1 text-sm text-gray-500'>PDF only. File must be under 2 Mb.</p>
          </div>

          <div>
            <label className='mb-1 block font-medium'>Sec Expiration Date *</label>

            <input 
            name='sec_expiration'
            type='date'
            required
            className='w-full rounded-lg border p-3'
            placeholder='Enter ur number'
            />
          </div>

          <div>
            <label className='mb-1 block font-medium'>Mayor's Permit *</label>

            <input 
            name='mayor_permit_file'
            type='file'
            accept='application/pdf'
            required
            className='w-full rounded-lg border p-3'
            />

            <p className='mt-1 text-sm text-gray-500'>PDF only. File must be under 2 Mb.</p>
          </div>

           <div>
            <label className='mb-1 block font-medium'>Mayor's Permit Expiration Date *</label>

            <input 
            name='mayor_permit_expiration'
            type='date'
            required
            className='w-full rounded-lg border p-3'
            placeholder='Enter ur number'
            />
          </div>

          <button disabled={loading} className='w-full rounded-lg bg-black p-3 font-medium text-white disabled:opacity-50'>
            {loading ? "Submitting...." : "Submit Application"}
          </button>

          <a href="/validation" className='mt-6 block text-center underline'>View Applications</a>
        </form>
      </div>
    </main>
  )
}