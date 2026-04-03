'use client';

import { useMemo, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaChartLine, FaKey, FaSignInAlt } from 'react-icons/fa';

type AdminPasskeyGateProps = {
  defaultNextPath?: string;
};

function getSafeNextPath(rawPath: string | null | undefined, fallback: string) {
  if (!rawPath) {
    return fallback;
  }

  if (rawPath.startsWith('/admin')) {
    return rawPath;
  }

  return fallback;
}

export default function AdminPasskeyGate({ defaultNextPath = '/admin/dashboard' }: AdminPasskeyGateProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [passkey, setPasskey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const nextPath = useMemo(
    () => getSafeNextPath(searchParams.get('next'), defaultNextPath),
    [defaultNextPath, searchParams],
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!passkey.trim()) {
      setError('Passkey is required.');
      setSuccess('');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passkey: passkey.trim() }),
      });

      if (!response.ok) {
        const data = (await response.json()) as { error?: string };
        setError(data.error ?? 'Invalid passkey.');
        return;
      }

      setSuccess('Access granted. Redirecting...');
      router.push(nextPath);
      router.refresh();
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Unable to complete login.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <form className="login-card" onSubmit={handleSubmit}>
          <div className="login-header">
            <div className="login-logo">
              <FaChartLine />
            </div>
            <h1 className="login-title">Admin Portal</h1>
            <p className="login-subtitle">Enter the passkey to access the admin panel.</p>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="admin-passkey">
              Admin Passkey
            </label>
            <div className="input-wrapper">
              <FaKey className="input-icon" />
              <input
                id="admin-passkey"
                type="password"
                autoComplete="current-password"
                value={passkey}
                onChange={(inputEvent) => setPasskey(inputEvent.target.value)}
                className="form-input"
                placeholder="Enter admin passkey"
              />
            </div>
          </div>

          <button type="submit" disabled={isLoading} className="login-btn">
            {isLoading ? (
              'Signing in...'
            ) : (
              <>
                <FaSignInAlt style={{ marginRight: '0.5rem' }} />
                Sign in
              </>
            )}
          </button>

          {success && <div className="success-message">{success}</div>}
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
}
