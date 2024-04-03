import { Helmet } from 'react-helmet-async';

import { SetPasswordView } from 'src/sections/rest_password/views';

export default function SetPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Reset Password | Profi Link</title>
      </Helmet>

      <SetPasswordView />
    </>
  );
}
