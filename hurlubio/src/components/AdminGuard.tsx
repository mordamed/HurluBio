// src/components/AdminGuard.tsx
'use client';
import {useEffect} from 'react'; import {useRouter} from 'next/navigation';
import {useUser} from '@/store/user'; // mock context {role?: 'ADMIN'|'CUSTOMER'}
export default function AdminGuard({children}:{children:React.ReactNode}) {
  const {role}=useUser(); const r=useRouter();
  useEffect(()=>{ if(role!=='ADMIN') r.replace('/login?next=/admin'); },[role,r]);
  if(role!=='ADMIN') return null; // spinner…
  return <>{children}</>;
}
// Usage: app/[locale]/admin/layout.tsx -> wrap <AdminGuard>{children}</AdminGuard>
