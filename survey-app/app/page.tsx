'use client'

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Example page components (you would implement these separately)
export default function Navigation() {
  return (
    <nav>
      <Link href="/">Home</Link>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link>
      <Link href="/surveys">Surveys</Link>
      <Link href="/dashboard">Dashboard</Link>
    </nav>
  )
}