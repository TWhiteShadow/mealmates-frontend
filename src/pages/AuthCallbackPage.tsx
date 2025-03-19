import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router';

function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const oauthDataEncoded = searchParams.get('oauth_data');
    if (oauthDataEncoded) {
      try {
        const decodedData = atob(oauthDataEncoded);
        const oauthData = JSON.parse(decodedData);

        sessionStorage.setItem('oAuth_access_token', oauthData.access_token);
        sessionStorage.setItem('oAuth_refresh_token', oauthData.refresh_token);
        sessionStorage.setItem(
          'oAuth_expires_at',
          oauthData.expires_at.toString()
        );
        sessionStorage.setItem('oAuth_provider', oauthData.provider);

        navigate('/app/discover');
      } catch (error) {
        console.error('Error decoding OAuth data:', error);
      }
    }
  }, [searchParams, navigate]);

  return (
    <div>
      <h1>Authenticating...</h1>
    </div>
  );
}

export default AuthCallbackPage;
