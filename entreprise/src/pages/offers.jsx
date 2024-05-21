import { Helmet } from 'react-helmet-async';

import { OffersView } from 'src/sections/offers/views';

export default function OffersPage() {
  return (
    <>
      <Helmet>
        <title> Offers | Profi Link</title>
      </Helmet>

      <OffersView />
    </>
  );
}
