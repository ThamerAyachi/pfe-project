import { Helmet } from 'react-helmet-async';

import { SettingsView } from 'src/sections/settings/views';

export default function SettingsPage() {
  return (
    <>
      <Helmet>
        <title>Settings | Profi Link</title>
      </Helmet>

      <SettingsView />
    </>
  );
}
