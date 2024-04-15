import { Helmet } from 'react-helmet-async';

import { EmailRestPasswordView } from 'src/sections/rest_password/views';

export default function EmailRestPasswordPage() {
  return (
    <>
      <Helmet>
        <title>Reset password | Profi Link</title>
      </Helmet>

      <EmailRestPasswordView />
    </>
  );
}
