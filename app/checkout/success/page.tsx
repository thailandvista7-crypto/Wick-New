import { Suspense } from 'react';
import SuccessClient from './SuccessClient';

export default function Page() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}