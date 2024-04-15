import { Helmet } from 'react-helmet-async';

import { ProfileView } from 'src/sections/profile/views';

export default function ProfilePage() {
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <ProfileView />
    </>
  );
}
