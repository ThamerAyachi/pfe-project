import { Helmet } from 'react-helmet-async';

import { UpdateResumeView } from 'src/sections/settings/views';

export default function UpdateResumePage() {
  return (
    <>
      <Helmet>
        <title>Resume | Profi Link</title>
      </Helmet>

      <UpdateResumeView />
    </>
  );
}
